🖐️ Hand Gesture Network System
📌 Description

A real-time hand tracking system that detects fingertips from both hands and connects them to form a dynamic network. The system visualizes interactions between fingers using glowing nodes and animated connections, enabling touchless and gesture-based interaction.

✨ Features
🖐️ Dual Hand Detection (supports both hands simultaneously)
🔵 Fingertip Tracking (focus on key interaction points)
🌐 Dynamic Network Formation (cross-hand connections)
✨ Neon Glow Effects & Trail Animation
🔁 Auto Pattern Switching (Normal ↔ Pulse Mode)
⚡ Real-time Processing using Computer Vision
⚙️ Tech Stack



🧠 How It Works
Captures live video from webcam
Detects hand landmarks using MediaPipe
Extracts fingertip positions (5 per hand)
Treats them as nodes in a network
Connects nearby points with dynamic glowing edges
Applies animation effects (pulse + color shift)
📂 Project Structure
hand-network/
│── index.html
│── app.js
│── README.md
▶️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/anushka-goswami/hand-network.git
cd hand-network
2️⃣ Run the project

Just open the file in browser:

index.html

(No backend required — fully browser-based)

📸 Output
Detects both hands in real-time
Displays glowing fingertip nodes
Creates a responsive network between fingers
Changes patterns dynamically every few seconds
💡 Applications
✋ Touchless UI systems
🎮 Gesture-based gaming
🎨 Air drawing / virtual sketching
🧏 Sign language research
🧠 Human-computer interaction
🔮 Future Improvements
Gesture recognition using AI/ML
Finger-based controls (volume, brightness, cursor)
Multi-user interaction
Mobile optimization
👩‍💻 Author

Anushka Goswami
