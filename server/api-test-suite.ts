import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
    console.log('--- STARTING COMPREHENSIVE API TEST SUITE ---');
    
    try {
        // 1. Categories
        console.log('[1/7] Testing Categories Tree...');
        const catRes = await axios.get(`${BASE_URL}/categories/tree`);
        if (catRes.data.success) {
            console.log('✅ Categories Tree loaded successfully');
        }

        // 2. Products
        console.log('[2/7] Testing Product Listing...');
        const prodRes = await axios.get(`${BASE_URL}/products?limit=1`);
        if (prodRes.data.success) {
            console.log('✅ Product Listing loaded successfully');
        }

        // 3. Search
        console.log('[3/7] Testing Product Search...');
        const searchRes = await axios.get(`${BASE_URL}/products?search=label`);
        if (searchRes.data.success) {
            console.log('✅ Product Search working');
        }

        // 4. Auth (Login with seeded admin)
        console.log('[4/7] Testing Admin Login...');
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'admin@printixlabels.com',
            password: 'password123'
        });
        const token = loginRes.data.token;
        if (token) {
            console.log('✅ Admin Login successful');
        }

        // 5. Auth (Get Me)
        console.log('[5/7] Testing Protected Profile Route...');
        const meRes = await axios.get(`${BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (meRes.data.success) {
            console.log('✅ Profile retrieval successful');
        }

        // 6. Cart (Get Cart)
        console.log('[6/7] Testing Cart Retrieval...');
        const cartRes = await axios.get(`${BASE_URL}/cart`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (cartRes.data.success) {
            console.log('✅ Cart retrieval successful');
        }

        // 7. Orders (Get My Orders)
        console.log('[7/7] Testing Orders Retrieval...');
        const orderRes = await axios.get(`${BASE_URL}/orders/myorders`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (orderRes.data.success) {
            console.log('✅ Orders retrieval successful');
        }

        console.log('--- ALL TESTS COMPLETED SUCCESSFULLY ---');
    } catch (error: any) {
        console.error('❌ TEST FAILED');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Message:', error.message);
        }
    }
}

runTests();
