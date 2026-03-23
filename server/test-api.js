const http = require('http');

http.get('http://localhost:5000/api/products', (res) => {
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
        try {
            console.log('PRODUCTS RESPONSE:', rawData);
            require('fs').writeFileSync('api-products.json', rawData);
        } catch (e) {
            console.error(e.message);
        }
    });
}).on('error', (e) => {
    console.error(`GOT ERROR: ${e.message}`);
});
