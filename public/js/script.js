const video = document.getElementById('video');
let i = 0;
let j = 0;

let Neutral = 0;
let Feliz = 0;
let Triste = 0;
let Enojado = 0;
let Disgustado = 0;
let Sorprendido = 0;
let emociones = 0;
let Neutral1 =0
let Feliz1 = 0;
let Triste1 = 0;
let Enojado1 = 0;
let Disgustado1 = 0;
let Sorprendido1 = 0;
let emociones1 = 0;

async function startVideo() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;
  } catch (error) {
    console.error(error);
  }
}

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./resources/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./resources/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./resources/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./resources/models'),
  // carga el modelo de detección de edad
  faceapi.nets.ageGenderNet.loadFromUri('./resources/models'),
]).then(startVideo);

video.addEventListener('play', async () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    i++;

    try {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks().withFaceExpressions().withAgeAndGender();
      
      if (detections.length > 0) {
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
   
        Neutral1 += resizedDetections[0].expressions.neutral;
        Neutral = Neutral1/i

        Feliz1 += resizedDetections[0].expressions.happy;
        Feliz = Feliz1/i

        Triste1 += resizedDetections[0].expressions.sad;
        Triste = Triste1/i

        Enojado1 += resizedDetections[0].expressions.angry;
        Enojado = Enojado1/i


        Disgustado1 += resizedDetections[0].expressions.disgusted;
        Disgustado = Disgustado1/i

        Sorprendido1 += resizedDetections[0].expressions.surprised;
        Sorprendido = Sorprendido1/i




        emociones = {
          Neutral,
          Feliz,
          Triste,
          Enojado,
          Disgustado,
          Sorprendido
        };

        console.log(' neutral:' + Neutral);
        console.log('feliz :' + Feliz);

        console.log('triste :' + Triste);
        console.log(' enojado :' + Enojado);
        console.log(' disgustado :' + Disgustado);
        console.log(' sorprendido :' + Sorprendido);


      } else {
        // No se detectó ningún rostro
        console.log('No se detectó ningún rostro');
      }
    } catch (error) {
      console.error(error);
      // Manejar el error de detección de rostro
    }
  }, 1000);

  setInterval(async () => {
    j++;
 //   console.log('Neutral '+  Neutral/i)

    try {
      const response = await fetch("http://localhost:3000/camara", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emociones }),
      });
    } catch (error) {
      console.error(error);
    }
  }, 10000);
});
