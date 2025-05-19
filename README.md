Jarvis – AI Voice Assistant (Beta)

Jarvis (a.k.a. Jarviz) is a smart, voice-controlled AI assistant with a graphical interface. It helps you interact using natural voice commands and provides a clean, modern UI — including dark mode, voice waveform graphics, and integration with simple automation tasks like launching apps (in local mode).

⚠️ Note: This is an early prototype (Beta version). There are multiple known bugs and features under development. Community feedback and contributions are welcome!

🌐 Try Live Demo → https://majestic-pie-66c8e8.netlify.app/

How to Use
Visit 👉 https://majestic-pie-66c8e8.netlify.app/

Click the 🎙️ mic or say "Jarvis"

Speak commands like:

“What’s the time?”

“Open YouTube”

“Search for Python tutorials”

“Open VS Code” (Only on local setup)

Jarvis will respond with voice + text in the GUI

| Feature              | Description                                |
| -------------------- | ------------------------------------------ |
| 🎤 Voice Recognition | Say **"Jarvis"** or tap mic to activate    |
| 🤖 Chat Interface    | Conversational AI assistant                |
| 🌙 Dark Mode         | Light/dark theme toggle                    |
| 📊 Voice Graphics    | Mic animation on speech detection          |
| 🧩 Commands          | Open VS Code, check time, browse web       |
| 🔊 Text-to-Speech    | Reads out responses                        |
| ⚙️ Clean GUI         | Minimalist, responsive UI (built in React) |

Known Issues & Limitations
❗ Sometimes fails to recognize or execute voice commands

❗ Not all browsers support the full voice API (Chrome preferred)

❗ Desktop automation (like launching VS Code) only works in local Python mode

❗ Wake-word detection is unreliable in some environments

🧪 Backend integration and command error handling are incomplete

This is a work-in-progress project, so expect minor to moderate bugs.

📦 Tech Stack
Frontend: React + TypeScript

Voice: Web Speech API

Styling: TailwindCSS / DaisyUI

Optional Backend: Python (for system-level commands)


| Command            | Action                             |
| ------------------ | ---------------------------------- |
| “What’s the time?” | Speaks system time                 |
| “Open Google”      | Opens Google in new tab            |
| “Search Python AI” | Performs Google search             |
| “Open VS Code”     | Launches VS Code (local mode only) |


License
MIT © 2025 [Hiren Kodwani]
