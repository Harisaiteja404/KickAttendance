document.addEventListener('DOMContentLoaded', () => {
  const scanEnterButton = document.getElementById('scan-enter');
  const scanExitButton = document.getElementById('scan-exit');

  const toastContainer = document.getElementById('toast');

  function showToast(message) {
    // Create a toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    toastContainer.appendChild(toast);

    // Show the toast
    toast.style.display = 'block';

    // Hide the toast after 5 seconds
    setTimeout(() => {
      toast.style.display = 'none';
      toastContainer.removeChild(toast);
    }, 5000);
  }

  function sendData(action, qrCodeData) {
    const qrDetails = JSON.parse(qrCodeData); // Assume the QR code data is in JSON format

    fetch('https://script.google.com/macros/s/AKfycbx1Pfyjm5i08-YsgUh6ADN6GObpU18FUvWqcjfAZZDOHACnUpdpcvKSDsBd3GPmHQYgAg/exec', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: qrDetails.fullName,
        centerName: qrDetails.centerName,
        phoneNumber: qrDetails.phoneNumber,
        time: new Date().toISOString(),  // Record the current time
        action: action  // Send the action ("enter" or "exit")
      }),
    })
    .catch(error => {
      console.error('Error:', error);
      showToast('Failed to send data');
    });
  }

  function startScan(action) {
    // Check if Html5Qrcode is defined
    if (typeof Html5Qrcode === "undefined") {
      console.error("Html5Qrcode is not defined");
      return;
    }

    const qrReader = new Html5Qrcode("qr-reader");

    qrReader.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: 250
      },
      (decodedText, decodedResult) => {
        // Parse JSON and format message
        let message = "Scanned Data: " + decodedText;
        try {
          const qrDetails = JSON.parse(decodedText);
          message = `Name: ${qrDetails.fullName}, Center: ${qrDetails.centerName}, Phone: ${qrDetails.phoneNumber}`;
        } catch (e) {
          console.error("Failed to parse QR code data", e);
        }
        showToast(message);
        sendData(action, decodedText);  // Call sendData() here with the decoded QR code data
        
        // Stop the QR code reader and clear the scanning interface
        qrReader.stop().then(() => {
          console.log("QR Code scanning stopped.");
          // Clear the QR reader container
          document.getElementById('qr-reader').innerHTML = '';
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

  scanEnterButton.addEventListener('click', () => startScan('enter'));  // Trigger scan and send "enter" action
  scanExitButton.addEventListener('click', () => startScan('exit'));   // Trigger scan and send "exit" action
});