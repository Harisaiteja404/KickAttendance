document.addEventListener('DOMContentLoaded', () => {
    const scanEnterButton = document.getElementById('scan-enter');
    const scanExitButton = document.getElementById('scan-exit');
  
    function sendData(action, qrCodeData) {
      fetch('YOUR_WEB_APP_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentName: 'Placeholder Name', // Replace with actual student name if needed
          qrCodeData: qrCodeData,
          action: action
        }),
      })
      .then(response => response.text())
      .then(result => alert('Data sent successfully'))
      .catch(error => console.error('Error:', error));
    }
  
    function startScan(action) {
      const qrReader = new Html5Qrcode("qr-reader");
  
      qrReader.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: 250
        },
        (decodedText, decodedResult) => {
          sendData(action, decodedText);
          qrReader.stop().then(ignore => {
            console.log("QR Code scanning stopped.");
          }).catch(err => {
            console.error("Error stopping QR Code scanning.", err);
          });
        },
        (errorMessage) => {
          console.log("QR Code scan error:", errorMessage);
        }
      ).catch(err => {
        console.error("Error starting QR Code scanning.", err);
      });
    }
  
    scanEnterButton.addEventListener('click', () => startScan('enter'));
    scanExitButton.addEventListener('click', () => startScan('exit'));
  });
  