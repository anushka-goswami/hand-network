const video  = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx    = canvas.getContext('2d');

let strokes = [];
let drawColor = "#00ffff"; // default neon blue

// MediaPipe
const hands = new Hands({
  locateFile: (file) =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.8,
  minTrackingConfidence: 0.8
});

// 🤏 pinch detection (stable)
function isPinching(hand) {
  const dx = hand[4].x - hand[8].x;
  const dy = hand[4].y - hand[8].y;
  return Math.sqrt(dx*dx + dy*dy) < 0.04;
}

// ✊ fist = clear
function isFist(hand) {
  return (
    hand[8].y > hand[6].y &&
    hand[12].y > hand[10].y &&
    hand[16].y > hand[14].y &&
    hand[20].y > hand[18].y
  );
}

hands.onResults((results) => {

  // camera
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

  if (!results.multiHandLandmarks?.length) return;

  const hand = results.multiHandLandmarks[0];

  const x = hand[8].x * canvas.width;
  const y = hand[8].y * canvas.height;

  // clear
  if (isFist(hand)) {
    strokes = [];
    return;
  }

  // draw
  if (isPinching(hand)) {
    strokes.push({ x, y, color: drawColor });
  }

  // ✨ SMOOTH DRAWING (rounded + glow)
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  for (let i = 1; i < strokes.length; i++) {
    const p1 = strokes[i - 1];
    const p2 = strokes[i];

    // glow
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = p2.color;
    ctx.lineWidth = 10;
    ctx.globalAlpha = 0.2;
    ctx.stroke();

    // main line
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = p2.color;
    ctx.lineWidth = 4;
    ctx.globalAlpha = 1;
    ctx.stroke();
  }

  // pointer
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, 2*Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
});

// camera
const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 640,
  height: 480
});
camera.start();

// 🎨 color
function setColor(color) {
  drawColor = color;
}

// 💾 save
function saveImage() {
  const link = document.createElement('a');
  link.download = 'drawing.png';
  link.href = canvas.toDataURL();
  link.click();
}