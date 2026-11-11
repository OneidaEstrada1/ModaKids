// ============================================================
// MODAKIDS - INTEGRACIÓN CON TEACHABLE MACHINE
// ============================================================
//
// Este archivo ya está preparado para conectar un modelo de
// Teachable Machine Image Project.
//
// PASOS:
// 1. Abre js/config.js
// 2. Pega la URL de tu modelo en TEACHABLE_MODEL_URL.
// 3. Guarda los archivos.
// 4. Abre la página desde un servidor local (Live Server,
//    XAMPP, etc.). La cámara puede no funcionar correctamente
//    si abres index.html directamente con doble clic.
//
// ============================================================

let model = null;
let webcam = null;
let maxPredictions = 0;
let cameraRunning = false;
let animationId = null;

const startCameraButton = document.getElementById("startCamera");
const stopCameraButton = document.getElementById("stopCamera");
const webcamContainer = document.getElementById("webcam-container");
const cameraPlaceholder = document.getElementById("cameraPlaceholder");
const predictionLabel = document.getElementById("predictionLabel");
const confidenceText = document.getElementById("confidenceText");
const confidenceBar = document.getElementById("confidenceBar");
const modelStatus = document.getElementById("modelStatus");
const predictionTitle = document.getElementById("predictionTitle");
const predictionText = document.getElementById("predictionText");

function setPrediction(label, confidence) {
  const percent = Math.round(confidence * 100);

  predictionLabel.textContent = label;
  confidenceText.textContent = `${percent}%`;
  confidenceBar.style.width = `${percent}%`;

  predictionTitle.textContent = `¡Parece que es ${label}! 🎉`;
  predictionText.textContent =
    percent >= 70
      ? "¡La IA está bastante segura de su respuesta!"
      : "La IA todavía no está totalmente segura. Intenta mostrar mejor la prenda.";
}

async function loadTeachableModel() {
  if (!TEACHABLE_MODEL_URL) {
    modelStatus.innerHTML =
      "⚙️ <strong>Modelo pendiente de conectar.</strong> Abre <code>js/config.js</code> y pega la URL de tu modelo.";
    return false;
  }

  try {
    const modelURL = TEACHABLE_MODEL_URL + "model.json";
    const metadataURL = TEACHABLE_MODEL_URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    modelStatus.textContent = `✅ Modelo conectado. ${maxPredictions} clases disponibles.`;
    return true;
  } catch (error) {
    console.error(error);
    modelStatus.textContent =
      "❌ No se pudo cargar el modelo. Revisa la URL de js/config.js.";
    return false;
  }
}

async function startCamera() {
  if (cameraRunning) return;

  const loaded = await loadTeachableModel();

  if (!loaded) {
    alert("Primero conecta el modelo de Teachable Machine en js/config.js 💗");
    return;
  }

  try {
    webcam = new tmImage.Webcam(420, 320, true);
    await webcam.setup();
    await webcam.play();

    cameraRunning = true;
    startCameraButton.disabled = true;
    stopCameraButton.disabled = false;

    cameraPlaceholder.style.display = "none";
    webcamContainer.innerHTML = "";
    webcamContainer.appendChild(webcam.canvas);

    predictLoop();
  } catch (error) {
    console.error(error);
    alert("No pudimos acceder a la cámara. Revisa los permisos del navegador.");
  }
}

async function predictLoop() {
  if (!cameraRunning) return;

  webcam.update();
  await predict();
  animationId = window.requestAnimationFrame(predictLoop);
}

async function predict() {
  if (!model || !webcam) return;

  const predictions = await model.predict(webcam.canvas);

  predictions.sort((a, b) => b.probability - a.probability);

  const best = predictions[0];

  setPrediction(best.className, best.probability);
}

function stopCamera() {
  cameraRunning = false;

  if (animationId) {
    window.cancelAnimationFrame(animationId);
    animationId = null;
  }

  if (webcam) {
    webcam.stop();
    webcam = null;
  }

  webcamContainer.innerHTML = `
    <div class="camera-placeholder" id="cameraPlaceholder">
      <span>📷</span>
      <strong>Tu cámara aparecerá aquí</strong>
      <small>Presiona "Activar cámara" para comenzar.</small>
    </div>
  `;

  startCameraButton.disabled = false;
  stopCameraButton.disabled = true;

  predictionTitle.textContent = "¡Enséñame una prenda!";
  predictionText.textContent =
    "Cuando conectemos el modelo, aquí aparecerá el nombre de la prenda que la cámara reconoce.";
  predictionLabel.textContent = "Esperando...";
  confidenceText.textContent = "0%";
  confidenceBar.style.width = "0%";
}

startCameraButton.addEventListener("click", startCamera);
stopCameraButton.addEventListener("click", stopCamera);
