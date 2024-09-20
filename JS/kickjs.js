function scanTrigger(attendanceType) {
    const qrDataDiv = document.getElementById('qr-data');
    const responseMessage = document.getElementById('qr-data');
    const scannerContainer = document.getElementById('scanner-container');
    
    const qrCodeScanner = new Html5Qrcode("scanner-box");

    scannerContainer.style.display = 'block';
  
    qrCodeScanner.start(
        { facingMode: "environment" }, // Use the rear camera
        {
            fps: 10,       // Frame rate
            qrbox: { width: 250, height: 250 } // Size of the scanning box
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
            
  
// ====================================
            const form=document.getElementById('hiddenForm');
            const action=form.action;


            const formData= new FormData(form);

            const xhr=new XMLHttpRequest();
            xhr.open("POST",action,true);
            xhr.onload=function(){
                if(xhr.status===200){

                    document.querySelectorAll('body > *:not(#responseMessage)').forEach(el => el.style.display = 'none');
                    responseMessage.textContent=xhr.responseText;
                    responseMessage.style.color="Black";
                    responseMessage.style.fontSize="50px";
                    responseMessage.style.display="block";
                }else{
                    responseMessage.textContent=xhr.responseText;
                    responseMessage.style.color="red";
                }
                responseMessage.style.display="block";
            };
            xhr.send(formData);
            qrCodeScanner.stop().then(()=>{
                console.log("QR code scanning stopped.");
            }).catch((err)=>{
                console.error("Error stopping QR Code Scanning:",err);
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