document.addEventListener("DOMContentLoaded", function() {
    // Load products on the products page
    if (window.location.pathname.endsWith('products.html')) {
        fetch('data/products.json')
            .then(response => response.json())
            .then(data => {
                const productList = document.getElementById('product-list');
                data.products.forEach(product => {
                    const productDiv = document.createElement('div');
                    productDiv.innerHTML = `
                        <h2>${product.producto}</h2>
                        <p>Proveedor: ${product.proveedor}</p>
                        <p>País de Origen: ${product.pais_origen}</p>
                        <p>EAN: ${product.codigo_barras}</p>
                    `;
                    productList.appendChild(productDiv);
                });
            });
    }

    // Barcode scanning functionality
    if (window.location.pathname.endsWith('scan.html')) {
        let selectedDeviceId;
        const codeReader = new ZXing.BrowserBarcodeReader();
        const previewElem = document.getElementById('preview');

        document.getElementById('startButton').addEventListener('click', () => {
            codeReader
                .getVideoInputDevices()
                .then(videoInputDevices => {
                    selectedDeviceId = videoInputDevices[0].deviceId;
                    codeReader.decodeFromVideoDevice(selectedDeviceId, 'preview', (result, err) => {
                        if (result) {
                            handleBarcode(result.text);
                        }
                        if (err && !(err instanceof ZXing.NotFoundException)) {
                            console.error(err);
                        }
                    });
                })
                .catch(err => console.error(err));
        });

        document.getElementById('stopButton').addEventListener('click', () => {
            codeReader.reset();
            previewElem.srcObject = null;
        });

        function handleBarcode(ean) {
            fetch('data/products.json')
                .then(response => response.json())
                .then(data => {
                    const product = data.products.find(product => product.codigo_barras === ean);
                    const resultElem = document.getElementById('result');
                    if (product) {
                        resultElem.innerHTML = `<img src="images/${product.image}" alt="${product.producto}"><p>Producto de consumo sostenible</p>`;
                    } else {
                        resultElem.innerHTML = `<p>Ohhh, producto de origen no sostenible</p>`;
                    }
                });
        }
    }
});