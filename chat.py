import os
import openai
import tkinter as tk
from tkinter import ttk, scrolledtext
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Azure OpenAI configuration
AZURE_OPENAI_API_KEY = os.getenv("openAIkey")
AZURE_OPENAI_ENDPOINT = "https://e0957-m7dhe0bf-eastus2.cognitiveservices.azure.com/"
DEPLOYMENT_NAME = "gpt-4"  # Your deployment name
API_VERSION = "2024-08-01-preview"  # Update as needed

# Initialize the Azure OpenAI client
client = openai.AzureOpenAI(
    api_key=AZURE_OPENAI_API_KEY,
    api_version=API_VERSION,
    azure_endpoint=AZURE_OPENAI_ENDPOINT
)

# Define system prompts for each function
SYSTEM_PROMPTS = {
    "symptom_check": (
        "You are a helpful healthcare assistant. Ask the user detailed questions about their symptoms "
        "to gather more information and help narrow down possible causes."
    ),
    "condition_evaluation": (
        "You are a professional healthcare assistant. Based on the conversation so far, provide a preliminary "
        "evaluation of the user's condition and suggest next steps, such as seeking medical attention if needed."
    ),
    "general_advice": (
        "You are a friendly healthcare assistant. Answer general health-related questions clearly and compassionately, "
        "ensuring the user feels informed and supported."
    )
}

# Conversation history per function (list of messages)
conversation_history = {
    "symptom_check": [],
    "condition_evaluation": [],
    "general_advice": []
}

def chat_with_gpt(function: str, user_message: str, max_tokens: int = 150) -> str:
    """
    Sends a prompt to Azure OpenAI with function-specific context and returns the assistant's reply.
    """
    if function not in SYSTEM_PROMPTS:
        return "Error: Invalid function."
    
    # Build messages: system prompt, then conversation history, then the new user message.
    messages = [{"role": "system", "content": SYSTEM_PROMPTS[function]}]
    messages.extend(conversation_history[function])
    messages.append({"role": "user", "content": user_message})
    
    try:
        response = client.chat.completions.create(
            model=DEPLOYMENT_NAME,
            messages=messages,
            max_tokens=max_tokens,
            temperature=0.7
        )
        reply = response.choices[0].message.content
        # Update conversation history
        conversation_history[function].append({"role": "user", "content": user_message})
        conversation_history[function].append({"role": "assistant", "content": reply})
        return reply
    except Exception as e:
        return f"Error: {e}"


# ----------------------------
# Tkinter Chatbot UI
# ----------------------------
class ChatUI:
    def __init__(self, master):
        self.master = master
        master.title("Healthcare Assistant Chatbot")
        
        # Dropdown for selecting the conversation function
        self.function_var = tk.StringVar(value="symptom_check")
        self.function_menu = ttk.Combobox(master, textvariable=self.function_var, state="readonly")
        self.function_menu['values'] = list(SYSTEM_PROMPTS.keys())
        self.function_menu.grid(row=0, column=0, padx=5, pady=5, sticky="w")
        
        # Scrolled text widget for conversation history
        self.conversation_box = scrolledtext.ScrolledText(master, wrap=tk.WORD, width=80, height=20, state="disabled")
        self.conversation_box.grid(row=1, column=0, columnspan=2, padx=5, pady=5)
        
        # Entry widget for user input
        self.entry_var = tk.StringVar()
        self.entry = ttk.Entry(master, textvariable=self.entry_var, width=70)
        self.entry.grid(row=2, column=0, padx=5, pady=5, sticky="ew")
        self.entry.bind("<Return>", self.send_message)
        
        # Send button
        self.send_button = ttk.Button(master, text="Send", command=self.send_message)
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
        reply = chat_with_gpt(function, user_message, max_tokens=150)
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
    main()
