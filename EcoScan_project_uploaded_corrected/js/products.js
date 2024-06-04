document.addEventListener('DOMContentLoaded', () => {
    fetch('data/products.json')
        .then(response => response.json())
        .then(products => {
            const productList = document.getElementById('product-list');
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';

                const productImage = document.createElement('img');
                productImage.src = product.image;
                productImage.alt = product.name;
                productCard.appendChild(productImage);

                const productName = document.createElement('h2');
                productName.textContent = product.name;
                productCard.appendChild(productName);

                productList.appendChild(productCard);
            });
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
});
