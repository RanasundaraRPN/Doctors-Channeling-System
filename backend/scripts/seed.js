const db = require('../config/db');
const bcrypt = require('bcryptjs');

async function seed() {
    try {
        console.log('Starting seeding (SQLite)...');

        // Drop Tables
        await db.execute('DROP TABLE IF EXISTS appointments');
        await db.execute('DROP TABLE IF EXISTS schedules');
        await db.execute('DROP TABLE IF EXISTS doctors');
        await db.execute('DROP TABLE IF EXISTS users');

        // Create Tables
        await db.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fullname TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'patient',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await db.execute(`
            CREATE TABLE IF NOT EXISTS doctors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                specialty TEXT,
                hospital TEXT,
                rating REAL,
                reviews INTEGER,
                experience INTEGER,
                price INTEGER DEFAULT 2500,
                available INTEGER DEFAULT 1,
                image_url TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        await db.execute(`
            CREATE TABLE IF NOT EXISTS schedules (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                doctor_id INTEGER,
                day_of_week TEXT,
                start_time TEXT,
                end_time TEXT,
                FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
            )
        `);

        await db.execute(`
            CREATE TABLE IF NOT EXISTS appointments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patient_id INTEGER,
                doctor_id INTEGER,
                appointment_date TEXT,
                appointment_time TEXT,
                status TEXT DEFAULT 'confirmed',
                price INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
            )
        `);

        // 2. Add Admin
        const adminPassword = await bcrypt.hash('Am456', 10);
        await db.execute(
            'INSERT OR IGNORE INTO users (fullname, email, password, role) VALUES (?, ?, ?, ?)',
            ['Admin', 'Admin@123', adminPassword, 'admin']
        );

        // 3. Add Doctors (Users first)
        const doctorData = [
            { name: 'Dr. Sandamini Jayasiri', email: 'sandamini@medichannel.com', specialty: 'Neurologist', hospital: 'Asiri Health' },
            { name: 'Dr. Akindu Thisen', email: 'akindu@medichannel.com', specialty: 'Cardiologist', hospital: 'Nawaloka Hospital' },
            { name: 'Dr. Sapna Diwyanjalee', email: 'sapna@medichannel.com', specialty: 'Dermatologist', hospital: 'Lanka Hospitals' }
        ];

        for (const doc of doctorData) {
            const pwd = await bcrypt.hash('doctor123', 10);
            const [uResult] = await db.execute(
                'INSERT OR IGNORE INTO users (fullname, email, password, role) VALUES (?, ?, ?, ?)',
                [doc.name, doc.email, pwd, 'doctor']
            );

            let userId = uResult.insertId;
            if (!userId) {
                const [users] = await db.execute('SELECT id FROM users WHERE email = ?', [doc.email]);
                if (users.length > 0) userId = users[0].id;
            }

            if (userId) {
                const price = doc.specialty === 'Neurologist' ? 3500 : (doc.specialty === 'Cardiologist' ? 4500 : 2500);
                const [dResult] = await db.execute(
                    'INSERT OR IGNORE INTO doctors (user_id, specialty, hospital, rating, reviews, experience, price, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [userId, doc.specialty, doc.hospital, 4.9, 100, 10, price, `https://ui-avatars.com/api/?name=${doc.name.replace(' ', '+')}&background=random`]
                );

                let doctorId = dResult.insertId;
                if (!doctorId) {
                    const [docs] = await db.execute('SELECT id FROM doctors WHERE user_id = ?', [userId]);
                    if (docs.length > 0) doctorId = docs[0].id;
                }

                if (doctorId) {
                    // Add some sample schedules
                    const days = ['Monday', 'Wednesday', 'Friday'];
                    for (const day of days) {
                        await db.execute(
                            'INSERT INTO schedules (doctor_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)',
                            [doctorId, day, '09:00:00', '17:00:00']
                        );
                    }
                }
            }
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
