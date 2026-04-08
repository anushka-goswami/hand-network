const video  = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx    = canvas.getContext('2d');

// Create model
const hands = new Hands({
  locateFile: (file) =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

// ✅ Proper settings (improved accuracy)
hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.85,
  minTrackingConfidence: 0.85
});

// Process frames
hands.onResults((results) => {

  // ✅ Draw camera video first
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

  // safety check
  if (!results.multiHandLandmarks || results.multiHandLandmarks.length < 2) {
    return;
  }

  const tips = [4, 8, 12, 16, 20];

  let leftHand = null;
  let rightHand = null;

  // detect left & right hand
  for (let i = 0; i < results.multiHandLandmarks.length; i++) {
    const label = results.multiHandedness[i].label;

    if (label === "Left") leftHand = results.multiHandLandmarks[i];
    else rightHand = results.multiHandLandmarks[i];
  }

  if (leftHand && rightHand) {

    for (let i = 0; i < tips.length; i++) {

      const idx = tips[i];

      const x1 = leftHand[idx].x * canvas.width;
      const y1 = leftHand[idx].y * canvas.height;

      const x2 = rightHand[idx].x * canvas.width;
      const y2 = rightHand[idx].y * canvas.height;

      // 🔥 draw points (more visible)
      ctx.beginPath();
      ctx.arc(x1, y1, 8, 0, 2 * Math.PI);
      ctx.fillStyle = "yellow";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x2, y2, 8, 0, 2 * Math.PI);
      ctx.fillStyle = "yellow";
      ctx.fill();

      // 🔥 draw line
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);

      ctx.strokeStyle = "cyan";
      ctx.lineWidth = 4;
      ctx.stroke();
    }
  }
});

// Camera
const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 640,
  height: 480
});

camera.start();