const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

async function test() {
    console.log('Testing sqlite3...');
    try {
        const dbPath = path.resolve(__dirname, 'database.sqlite');
        const db = new sqlite3.Database(dbPath);
        db.all('SELECT 1', [], (err, rows) => {
            if (err) console.error('SQLite Error:', err);
            else console.log('SQLite OK:', rows);
        });
    } catch (e) {
        console.error('SQLite Catch:', e);
    }

    console.log('Testing bcryptjs...');
    try {
        const hash = await bcrypt.hash('test', 10);
        console.log('Bcrypt Hash:', hash);
        const match = await bcrypt.compare('test', hash);
        console.log('Bcrypt Match:', match);
    } catch (e) {
        console.error('Bcrypt Catch:', e);
    }
}

test();
