import openai

# 🔹 Replace these with your Azure OpenAI details
AZURE_OPENAI_API_KEY = "FvC65KLeZ0QT9ZvEGDEagkBZN4WtWYE1SpdTJH4J6YooUkWq3gSLJQQJ99BBACHYHv6XJ3w3AAAAACOGCZgz"
AZURE_OPENAI_ENDPOINT = "https://e0957-m7dhe0bf-eastus2.cognitiveservices.azure.com/"
DEPLOYMENT_NAME = "gpt-4"  # Name of the GPT deployment
API_VERSION = "2024-08-01-preview"  # Latest API version

# # 🔹 Configure OpenAI API to use Azure
# openai.api_type = "azure"
# openai.api_base = AZURE_OPENAI_ENDPOINT
# openai.api_version = API_VERSION
# openai.api_key = AZURE_OPENAI_API_KEY

client = openai.AzureOpenAI(
    api_key=AZURE_OPENAI_API_KEY,
    api_version=API_VERSION,
    azure_endpoint=AZURE_OPENAI_ENDPOINT
)

def chat_with_gpt(prompt, max_tokens=100):
    """Sends a prompt to Azure OpenAI and returns the response."""
    try:
        response = client.chat.completions.create(
            model=DEPLOYMENT_NAME,  # Your GPT-4/GPT-3.5 deployment name
            messages=[
                {"role": "system", "content": "You are an AI assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=max_tokens,  # Limit response length
            temperature=0.7  # Adjust creativity (0 = strict, 1 = random)
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error: {e}"

# 🔹 Example: Send a prompt
user_input = input("Enter your prompt: ")
response = chat_with_gpt(user_input, max_tokens=150)  # Limit to 150 tokens
print("\n💬 AI Response:", response)