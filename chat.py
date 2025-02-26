import os
import openai
import tkinter as tk
from tkinter import ttk, scrolledtext, messagebox
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
import iris
from database import *

# Load environment variables from .env (ensure you have one with your Azure key)
load_dotenv()

# Create database
createDatabase()
createTable()

# Azure OpenAI configuration
AZURE_OPENAI_API_KEY = os.getenv("openAIkey")
AZURE_OPENAI_ENDPOINT = "https://e0957-m7dhe0bf-eastus2.cognitiveservices.azure.com/"
DEPLOYMENT_NAME = "gpt-4"  # Change to your deployment name
API_VERSION = "2024-08-01-preview"  # Update as needed

# Initialize Azure OpenAI client
client = openai.AzureOpenAI(
    api_key=AZURE_OPENAI_API_KEY,
    api_version=API_VERSION,
    azure_endpoint=AZURE_OPENAI_ENDPOINT
)

# Define system prompts for different conversation functions
SYSTEM_PROMPTS = {
    "Symptom Checker": (
        "You are a compassionate healthcare assistant specializing in symptom analysis. "
        "Ask clarifying questions and help the user narrow down potential causes based on their symptoms."
    ),
    "Condition Evaluation": (
        "You are a professional healthcare assistant. Evaluate the user's condition based on the conversation and suggest next steps, "
        "such as whether to seek medical attention."
    ),
    "General Advice": (
        "You are a friendly healthcare assistant offering general health and wellness advice. "
        "Answer questions clearly and empathetically."
    )
}

# Maintain separate conversation histories for each function
conversation_histories = {
    "Symptom Checker": [],
    "Condition Evaluation": [],
    "General Advice": []
}


class HealthcareChatbotUI(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Healthcare Assistant Chatbot")
        self.geometry("900x700")
        self.configure(bg="#F7F7F7")
        self.create_widgets()

    def create_widgets(self):
        # Create a Notebook (tabbed interface)
        self.notebook = ttk.Notebook(self)
        self.notebook.pack(fill="both", expand=True, padx=10, pady=10)

        # Create tabs for each function
        self.tabs = {}
        for func in SYSTEM_PROMPTS.keys():
            tab = ttk.Frame(self.notebook)
            self.notebook.add(tab, text=func)
            self.tabs[func] = tab

        # Create chat components for each tab
        self.chat_components = {}
        for func, tab in self.tabs.items():
            # Create a scrolled text widget for the conversation
            chat_display = scrolledtext.ScrolledText(tab, wrap=tk.WORD, font=("Arial", 12), state="disabled", bg="#FFFFFF")
            chat_display.pack(fill="both", expand=True, padx=10, pady=10)

            # Create a frame for input field and send button
            input_frame = ttk.Frame(tab)
            input_frame.pack(fill="x", padx=10, pady=5)

            # Input field for user message
            user_input = ttk.Entry(input_frame, font=("Arial", 12))
            user_input.pack(side="left", fill="x", expand=True, padx=(0, 10))
            user_input.bind("<Return>", lambda event, f=func: self.send_message(f))

            # Send button
            send_btn = ttk.Button(input_frame, text="Send", command=lambda f=func: self.send_message(f))
            send_btn.pack(side="right")

            self.chat_components[func] = {
                "chat_display": chat_display,
                "user_input": user_input
            }

        # Menu Bar for additional functions
        menubar = tk.Menu(self)
        self.config(menu=menubar)
        file_menu = tk.Menu(menubar, tearoff=0)
        file_menu.add_command(label="Clear Conversation", command=self.clear_current_conversation)
        file_menu.add_command(label="Exit", command=self.destroy)
        menubar.add_cascade(label="File", menu=file_menu)

    def clear_current_conversation(self):
        # Clear conversation history and text for the currently selected tab
        current_tab = self.notebook.tab(self.notebook.select(), "text")
        conversation_histories[current_tab] = []
        chat_display = self.chat_components[current_tab]["chat_display"]
        chat_display.configure(state="normal")
        chat_display.delete("1.0", tk.END)
        chat_display.configure(state="disabled")

    def send_message(self, function):
        user_message = self.chat_components[function]["user_input"].get().strip()
        if not user_message:
            return
        self.chat_components[function]["user_input"].delete(0, tk.END)
        self.append_message(function, f"You: {user_message}\n")
        reply = self.chat_with_gpt(function, user_message)
        self.append_message(function, f"Assistant: {reply}\n\n")

    def append_message(self, function, message):
        chat_display = self.chat_components[function]["chat_display"]
        chat_display.configure(state="normal")
        chat_display.insert(tk.END, message)
        chat_display.configure(state="disabled")
        chat_display.see(tk.END)

    def chat_with_gpt(self, function, user_message, max_tokens=150):
        # Build conversation messages using the system prompt and conversation history
        system_prompt = SYSTEM_PROMPTS[function]
        history = conversation_histories[function]
        messages = [{"role": "system", "content": system_prompt}]
        messages.extend(history)
        messages.append({"role": "user", "content": user_message})
        try:
            response = client.chat.completions.create(
                model=DEPLOYMENT_NAME,
                messages=messages,
                max_tokens=max_tokens,
                temperature=0.7
            )
            reply = response.choices[0].message.content.strip()
            # Update conversation history
            conversation_histories[function].append({"role": "user", "content": user_message})
            conversation_histories[function].append({"role": "assistant", "content": reply})
            return reply
        except Exception as e:
            messagebox.showerror("Error", f"An error occurred: {e}")
            return "Sorry, I encountered an error."
        



def insert_data(table_name, table_definition, data):
    """
    table_name: SchemaName.TableName
    table_definition: (name VARCHAR(255), category VARCHAR(255),review_point INT, price DOUBLE, description VARCHAR(2000), description_vector VECTOR(DOUBLE, 384))
    data: array of values to insert
    """

    columns = ", ".join([i[0].strip()
                        for i in table_definition.split(',')]) + ")"
    placeholder_values = ['?' for _ in table_definition.split(',')]
    placeholder_values[-1] = 'TO_VECTOR(?)'
    placeholder_values = f'({",".join(placeholder_values)})'
    sql = f"""
        INSERT INTO {table_name}
        {columns}
        VALUES {placeholder_values}
    """
    cursor.execute(sql, data)


# ----------------------------
# Tkinter Chatbot UI
# ----------------------------

class ChatUI:
    def __init__(self, master):
        self.master = master
        master.title("Healthcare Assistant Chatbot")

        # Dropdown for selecting the conversation function
        self.function_var = tk.StringVar(value="symptom_check")
        self.function_menu = ttk.Combobox(
            master, textvariable=self.function_var, state="readonly")
        self.function_menu['values'] = list(SYSTEM_PROMPTS.keys())
        self.function_menu.grid(row=0, column=0, padx=5, pady=5, sticky="w")

        # Scrolled text widget for conversation history
        self.conversation_box = scrolledtext.ScrolledText(
            master, wrap=tk.WORD, width=80, height=20, state="disabled")
        self.conversation_box.grid(
            row=1, column=0, columnspan=2, padx=5, pady=5)

        # Entry widget for user input
        self.entry_var = tk.StringVar()
        self.entry = ttk.Entry(master, textvariable=self.entry_var, width=70)
        self.entry.grid(row=2, column=0, padx=5, pady=5, sticky="ew")
        self.entry.bind("<Return>", self.send_message)

        # Send button
        self.send_button = ttk.Button(
            master, text="Send", command=self.send_message)
        self.send_button.grid(row=2, column=1, padx=5, pady=5)

    def send_message(self, event=None):
        user_message = self.entry_var.get().strip()
        if not user_message:
            return
        function = self.function_var.get()
        # Append user's message to conversation history widget
        self._append_text(f"You ({function}): {user_message}\n")
        self.entry_var.set("")
        # Call the chat function to get a reply
        reply = HealthcareChatbotUI.chat_with_gpt(function, user_message, max_tokens=150)
        self._append_text(f"Assistant: {reply}\n\n")

    def _append_text(self, text):
        self.conversation_box.configure(state="normal")
        self.conversation_box.insert(tk.END, text)
        self.conversation_box.configure(state="disabled")
        self.conversation_box.see(tk.END)


def main():
    root = tk.Tk()
    app = ChatUI(root)
    root.mainloop()


if __name__ == "__main__":
    app = HealthcareChatbotUI()
    app.mainloop()
