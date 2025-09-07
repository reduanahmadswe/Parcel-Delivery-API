const https = require('https');

function quickTest(url) {
    console.log(`Testing: ${url}`);
    
    const req = https.request(url, {
        method: 'GET',
        timeout: 10000,
    }, (res) => {
        console.log(`Status: ${res.statusCode}`);
        
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            if (data.includes('Authenticated') || data.includes('Authentication Required')) {
                console.log('❌ Still showing authentication page');
            } else {
                try {
                    const parsed = JSON.parse(data);
                    console.log('✅ API Response:', JSON.stringify(parsed, null, 2));
                } catch (e) {
                    console.log('Raw response:', data.substring(0, 300));
                }
            }
        });
    });

    req.on('error', (err) => {
        console.log(`❌ Error:`, err.message);
    });

    req.end();
}

// Test the new project URL
quickTest('https://parcel-api-backend.vercel.app/');
