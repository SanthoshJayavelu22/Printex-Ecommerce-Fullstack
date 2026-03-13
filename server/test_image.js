const http = require('http');
http.get('http://127.0.0.1:5000/public/uploads/products/mainImage-1772116844340-118480596.png', (res) => {
  console.log('Status:', res.statusCode);
  process.exit();
}).on('error', (e) => {
  console.error('Error:', e.message);
});
