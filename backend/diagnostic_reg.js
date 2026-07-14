const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function test() {
    console.log('Testing direct registration via DB wrapper...');
    try {
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.execute(
            'INSERT INTO users (fullname, email, password, role) VALUES (?, ?, ?, "patient")',
            ['Test Flow', 'test_flow@example.com', hashedPassword]
        );
        console.log('Result:', result);
    } catch (e) {
        console.error('Captured Error:', e);
        console.error('Error Message:', e.message);
        console.error('Error Code:', e.code);
    }
}

test();
