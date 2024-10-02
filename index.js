document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  const asciiOutput = document.getElementById('asciiOutput');

  // 设置视频源
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
    })
    .catch((error) => console.error('Error accessing camera:', error));

  // ASCII字符集
  const asciiChars = '@%#*+=-:. ';

  function getAsciiCharacter(gray) {
    const index = Math.floor((gray / 255) * (asciiChars.length - 1));
    return asciiChars[index];
  }

  function processFrame() {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const asciiText = [];
    for (let y = 0; y < imageData.height; y++) {
      let line = '';
      for (let x = 0; x < imageData.width; x++) {
        const pixelIndex = (y * imageData.width + x) * 4;
        const gray =
          (imageData.data[pixelIndex] +
            imageData.data[pixelIndex + 1] +
            imageData.data[pixelIndex + 2]) /
          3;
        line += getAsciiCharacter(gray);
      }
      asciiText.push(line);
    }

    asciiOutput.textContent = asciiText.join('\n');
    requestAnimationFrame(processFrame);
  }

  video.addEventListener('play', () => {
    canvas.width = 220;
    canvas.height = 60;
    processFrame();
  });
});
