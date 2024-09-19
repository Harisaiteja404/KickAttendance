function scanTrigger(attendanceType) {
    const qrDataDiv = document.getElementById('qr-data');
    const scannerContainer = document.getElementById('scanner-container');
    
    const qrCodeScanner = new Html5Qrcode("scanner-container");
  
    qrCodeScanner.start(
        { facingMode: "environment" }, // Use the rear camera
        {
            fps: 10,       // Frame rate
            qrbox: { width: 400, height: 400 } // Size of the scanning box
        },
        (decodedText, decodedResult) => {
            // Parse the JSON data
            let qrData;
            try {
                qrData = JSON.parse(decodedText);
            } catch (error) {
                qrDataDiv.textContent = 'Invalid QR code data.';
                return;
            }
  
            // Get the current time
            const scanTime = new Date().toLocaleTimeString();
            console.log(scanTime);
  
            // Fill the hidden form with data
            document.getElementById('formName').value = qrData.name || '';
            document.getElementById('formCenter').value = qrData.center || '';
            document.getElementById('formContact').value = qrData.contact || '';
            document.getElementById('formScanTime').value = scanTime;
            document.getElementById('formAttandanceType').value=attendanceType;
            
  
            // Submit the form
            document.getElementById('hiddenForm').submit();
  
            // Display scanned data
            qrDataDiv.textContent = `QR Code Data: ${decodedText}`;
  
            // Stop scanning
            qrCodeScanner.stop().then(() => {
                console.log("QR Code scanning stopped.");
            }).catch((err) => {
                console.error("Error stopping QR Code scanning:", err);
            });
        },
        (error) => {
            // Handle scanning errors
            console.warn("QR Code scan error:", error);
        }
    ).catch((err) => {
        console.error("Error starting QR Code scanning:", err);
    });
  }

document.getElementById('scanButton').addEventListener('click', function(){
    scanTrigger("IN");
});
document.getElementById('scanButtonOut').addEventListener('click',  function(){
    scanTrigger("OUT");
});