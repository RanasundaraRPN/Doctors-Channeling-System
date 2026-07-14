const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function test() {
    const email = 'sandamini@medichannel.com';
    const password = 'doctor123';
    console.log(`Testing direct login for: ${email}`);
    try {
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        console.log('Users found:', users.length);
        if (users.length > 0) {
            const user = users[0];
            const isMatch = await bcrypt.compare(password, user.password);
            console.log('Password match:', isMatch);
        }
    } catch (e) {
        console.error('Captured Error:', e);
    }
}

test();
