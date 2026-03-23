const http = require('http');

http.get('http://localhost:5000/api/categories/tree', (res) => {
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
        try {
            const data = JSON.parse(rawData);
            require('fs').writeFileSync('api-tree.json', JSON.stringify(data, null, 2));
            console.log('TREE FETCHED');
        } catch (e) {
            console.error(e.message);
        }
    });
}).on('error', (e) => {
    console.error(`GOT ERROR: ${e.message}`);
});
