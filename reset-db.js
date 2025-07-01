const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/reset',
    method: 'POST'
};

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const response = JSON.parse(data);
            console.log(response.message || response.error);
            process.exit(response.error ? 1 : 0);
        } catch (error) {
            console.error('Error parsing response:', error);
            process.exit(1);
        }
    });
});

req.on('error', (error) => {
    console.error('Error making request:', error);
    process.exit(1);
});

req.end(); 