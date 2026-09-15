const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentLetter = 'A';
let strokeCount = 0;

function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "320px 'Comic Sans MS', Arial";
    ctx.fillStyle = "#e0e0e0";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(currentLetter, canvas.width / 2, canvas.height / 2 + 20);
}

function selectLetter(letter, btn) {
    currentLetter = letter;
    document.querySelectorAll('.letter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    strokeCount = 0;
    drawBackground();
}

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.strokeStyle = "#4ecdc4";
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastX = e.offsetX;
    lastY = e.offsetY;
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    strokeCount++;
});

canvas.addEventListener('mouseleave', () => {
    isDrawing = false;
});

function clearCanvas() {
    strokeCount = 0;
    drawBackground();
}

function checkDrawing() {
    if (strokeCount >= 1) {
        const messages = [
            "🌟 Shabash! Khub saru!",
            "🎉 Excellent! Tame kamaal karyu!",
            "👏 Very Good! Aagal vadho!",
            "⭐ Superb! Tame genius chho!"
        ];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        alert(randomMsg);
    } else {
        alert("😊 Pehla akshar trace karo, pachi Check dabavo!");
    }
}

drawBackground();