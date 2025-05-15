import streamlit as st
from groq import Groq
import speech_recognition as sr
import pyttsx3
import webbrowser
import tempfile
import os
import requests

# ========== SETUP ==========
client = Groq(api_key="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")

st.set_page_config(page_title="Jarvis Voice Assistant", layout="centered")
st.title("🧠 Jarvis – AI Voice Assistant")

# Text-to-speech
engine = pyttsx3.init()

def speak(text):
    engine.say(text)
    engine.runAndWait()

# ========== VOICE RECOGNITION ==========
def recognize_speech():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        st.info("🎙️ Listening...")
        audio = recognizer.listen(source, timeout=5, phrase_time_limit=5)

    try:
        text = recognizer.recognize_google(audio)
        return text
    except sr.UnknownValueError:
        return "Sorry, I could not understand that."
    except sr.RequestError as e:
        return f"Error: {e}"

# ========== AI PROCESSING ==========
def aiProcess(command):
    try:
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {"role": "system", "content": "You are Jarvis, an intelligent assistant."},
                {"role": "user", "content": command}
            ]
        )
        reply = response.choices[0].message.content
        speak(reply)
        return reply
    except Exception as e:
        error_message = f"Sorry, there was an error: {str(e)}"
        speak(error_message)
        return error_message

# ========== CUSTOM COMMANDS ==========
def processCommand(command):
    command = command.lower()

    if "open google" in command:
        webbrowser.open("https://google.com")
        speak("Opening Google")
        return "Opening Google..."

    elif "open youtube" in command:
        webbrowser.open("https://youtube.com")
        speak("Opening YouTube")
        return "Opening YouTube..."

    elif "open linkedin" in command:
        webbrowser.open("https://linkedin.com")
        speak("Opening LinkedIn")
        return "Opening LinkedIn..."

    elif "news" in command:
        r = requests.get("https://newsapi.org/v2/top-headlines?country=in&apiKey=YOUR_NEWS_API_KEY")
        if r.status_code == 200:
            data = r.json()
            headlines = [article["title"] for article in data["articles"][:5]]
            for h in headlines:
                speak(h)
            return "\n".join(headlines)
        else:
            return "Couldn't fetch news."

    elif "who made you" in command:
        msg = "I was built by Mr. Hiren Kodwani, a brilliant coder."
        speak(msg)
        return msg

    else:
        return aiProcess(command)

# ========== STREAMLIT UI ==========
input_method = st.radio("Choose input method:", ["📝 Text", "🎤 Voice"])

if input_method == "📝 Text":
    user_input = st.text_input("Type your question to Jarvis")

    if st.button("Ask"):
        if user_input:
            response = processCommand(user_input)
            st.success(response)

elif input_method == "🎤 Voice":
    if st.button("🎙️ Speak Now"):
        result = recognize_speech()
        st.write("You said:", result)
        if result != "":
            response = processCommand(result)
            st.success(response)

st.markdown("---")
st.caption("Made with ❤️ by Hiren Kodwani")
