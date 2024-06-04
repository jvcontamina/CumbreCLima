document.addEventListener('DOMContentLoaded', () => {
    const startScanButton = document.getElementById('start-scan');
    const stopScanButton = document.getElementById('stop-scan');
    let isScanning = false;

    startScanButton.addEventListener('click', () => {
        if (!isScanning) {
            isScanning = true;
            Quagga.init({
                inputStream: {
                    type: "LiveStream",
                    constraints: {
                        width: 640,
                        height: 480,
                        facingMode: "environment" // Use the rear camera
                    },
                    target: document.querySelector('#interactive') // Or '#yourElement' (optional)
                },
                locator: {
                    patchSize: "large", // "x-small", "small", "medium", "large", "x-large"
                    halfSample: false,
                    frequency: 10, // Increase the frequency of image processing
                },
                numOfWorkers: 4, // Number of workers (threads) to process images
                decoder: {
                    readers: ["ean_reader"], // Only EAN reader for EAN-13
                    multiple: false,
                    debug: {
                        drawBoundingBox: true,
                        showFrequency: true,
                        drawScanline: true,
                        showPattern: true
                    }
                },
                locate: true, // Enable locating the barcode in the image
                frequency: 10 // Increase the frequency of decoding
            }, (err) => {
                if (err) {
                    console.log(err);
                    return;
                }
                Quagga.start();
            });
        }
    });

    stopScanButton.addEventListener('click', () => {
        if (isScanning) {
            Quagga.stop();
            isScanning = false;
        }
    });

    Quagga.onDetected((data) => {
        const code = data.codeResult.code;
        document.getElementById('barcode-result').textContent = code;
        saveBarcodeToJson(code);
        Quagga.stop();
        isScanning = false;
    });
});

function saveBarcodeToJson(barcode) {
    fetch('data/products.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.barcode === barcode);
            const resultBox = document.getElementById('scan-result');
            if (product) {
                resultBox.innerHTML = `<h1>Producto Comercio Justo</h1><p>${product.name}</p>`;
            } else {
                resultBox.innerHTML = `<h1>Uppsss, producto no comercio justo</h1>`;
            }
        })
        .catch(error => console.error('Error al leer el archivo JSON:', error));
}
