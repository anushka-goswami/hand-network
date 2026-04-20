// app.js — Hand Tracking Network (UPDATED)

const video  = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx    = canvas.getContext('2d');

let mode = "Normal";
let time = 0;

// 🔥 Mode auto change every 3 sec
setInterval(() => {
  mode = (mode === "Normal") ? "Pulse" : "Normal";
  const modeText = document.getElementById("modeText");
  if (modeText) modeText.innerText = mode;
}, 3000);

// 1. Create Hands model
const hands = new Hands({
  locateFile: (file) =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

// 2. Config
hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.5
});

// 3. Frame processing
hands.onResults((results) => {

  time += 0.05;

  // 🔥 Smooth trail fade
  ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ❗ SAFE CHECK
  if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
    return;
  }

  const tips = [4, 8, 12, 16, 20];
  let allPoints = [];

  // ✅ Collect fingertip points from ALL hands
  for (const landmarks of results.multiHandLandmarks) {
    for (let i of tips) {
      allPoints.push({
        x: landmarks[i].x * canvas.width,
        y: landmarks[i].y * canvas.height
      });
    }
  }

  // ✨ Draw glowing points
  for (let p of allPoints) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 6, 0, 2 * Math.PI);

    // 🔥 dynamic glow color
    const hue = (time * 50) % 360;
    ctx.fillStyle = `hsl(${hue}, 100%, 60%)`;

    ctx.shadowBlur = 15;
    ctx.shadowColor = ctx.fillStyle;
    ctx.fill();

    ctx.shadowBlur = 0;
  }

  // 🔗 Connect network
  for (let i = 0; i < allPoints.length; i++) {
    for (let j = i + 1; j < allPoints.length; j++) {

      const dx = allPoints[i].x - allPoints[j].x;
      const dy = allPoints[i].y - allPoints[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 200) {

        ctx.beginPath();
        ctx.moveTo(allPoints[i].x, allPoints[i].y);
        ctx.lineTo(allPoints[j].x, allPoints[j].y);

        let opacity = 1 - dist / 200;

        // 🔥 Mode-based color
        if (mode === "Pulse") {
          const pulse = (Math.sin(time * 3) + 1) / 2;
          ctx.strokeStyle = `rgba(0,255,255,${opacity * pulse})`;
        } else {
          ctx.strokeStyle = `rgba(124,58,237,${opacity})`;
        }

        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  }
});

// 4. Camera
const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 640,
  height: 480
});

camera.start();
