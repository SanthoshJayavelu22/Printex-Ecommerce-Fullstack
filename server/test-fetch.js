const http = require('http');
http.get('http://localhost:5000/api/products/category/paper-bags-pouch', (res) => {
    let data = '';
    res.on('data', (d) => data += d);
    res.on('end', () => console.log('RESPONSE:', data));
});
