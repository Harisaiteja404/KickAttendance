document.addEventListener('DOMContentLoaded', () => {
  const scanEnterButton = document.getElementById('scan-enter');
  const scanExitButton = document.getElementById('scan-exit');

  function sendData(action, qrCodeData) {
    const qrDetails = JSON.parse(qrCodeData); // Assume the QR code data is in JSON format

    fetch('https://script.google.com/macros/s/AKfycbzawQOJp3Sqbbrwm5BouBaCA3MhK-zavo8Tm3opzoe_u-uCUevszPcauyg0XxoOQ6oV_w/exec', {
      method: 'POST',
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
      .then(response => response.text())
      .then(result => alert('Data sent successfully'))
      .catch(error => console.error('Error:', error));
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
        sendData(action, decodedText);  // Call sendData() here with the decoded QR code data
        qrReader.stop().then(() => {
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

  scanEnterButton.addEventListener('click', () => startScan('enter'));  // Trigger scan and send "enter" action
  scanExitButton.addEventListener('click', () => startScan('exit'));   // Trigger scan and send "exit" action
});
