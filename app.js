// app.js — Hand Tracking Network (FINAL)

const video  = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx    = canvas.getContext('2d');

// 1. Create the Hands model
const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }
});

// 2. Configure detection options
hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.5
});

// 3. Process each frame
hands.onResults((results) => {

  // 🔥 Trail effect (smooth fade)
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (results.multiHandLandmarks.length > 0) {

    const tips = [4, 8, 12, 16, 20];
    let allPoints = [];

    // ✅ Collect fingertips from ALL hands
    for (const landmarks of results.multiHandLandmarks) {
      for (let i of tips) {
        allPoints.push({
          x: landmarks[i].x * canvas.width,
          y: landmarks[i].y * canvas.height
        });
      }
    }

    // ✅ Draw glowing points (fingertips)
    for (let p of allPoints) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = "cyan";
      ctx.fill();
    }

    // ✅ Connect ALL points (cross-hand network)
    for (let i = 0; i < allPoints.length; i++) {
      for (let j = i + 1; j < allPoints.length; j++) {

        const dx = allPoints[i].x - allPoints[j].x;
        const dy = allPoints[i].y - allPoints[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // 🔥 only connect if close (adjust 200 → more/less lines)
        if (dist < 200) {

          ctx.beginPath();
          ctx.moveTo(allPoints[i].x, allPoints[i].y);
          ctx.lineTo(allPoints[j].x, allPoints[j].y);

          // distance-based glow
          ctx.strokeStyle = `rgba(0,255,255,${1 - dist/200})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    }
  }
});

// 4. Camera setup
const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 640,
  height: 480
});

camera.start();