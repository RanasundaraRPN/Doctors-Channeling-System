const API_BASE = 'http://127.0.0.1:5001/api';

async function testAuth() {
    const testEmail = `test_${Date.now()}@example.com`;
    console.log(`Testing with email: ${testEmail}`);

    // 1. Register
    try {
        console.log('--- Registering ---');
        const regRes = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullname: 'Test User',
                email: testEmail,
                password: 'password123'
            })
        });
        const regData = await regRes.json();
        console.log('Status:', regRes.status);
        console.log('Data:', regData);

        if (regRes.status !== 201) {
            console.error('Registration failed!');
            return;
        }

        // 2. Login
        console.log('\n--- Logging In ---');
        const loginRes = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testEmail,
                password: 'password123'
            })
        });
        const loginData = await loginRes.json();
        console.log('Status:', loginRes.status);
        console.log('Data:', loginData);

        if (loginRes.status !== 200) {
            console.error('Login failed!');
            return;
        }

        console.log('\nAuth test PASSED!');
    } catch (err) {
        console.error('Test error:', err);
    }
}

testAuth();
