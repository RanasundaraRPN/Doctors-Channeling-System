const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all doctors
router.get('/', async (req, res) => {
    try {
        const [doctors] = await db.execute(`
            SELECT d.*, u.fullname 
            FROM doctors d 
            JOIN users u ON d.user_id = u.id
        `);
        // Attach schedules to each doctor
        for (let doc of doctors) {
            const [schedules] = await db.execute('SELECT * FROM schedules WHERE doctor_id = ?', [doc.id]);
            doc.schedules = schedules;
        }
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a doctor (Admin only)
router.post('/', async (req, res) => {
    const { fullname, email, password, specialty, hospital, rating, reviews, experience, price, image_url } = req.body;
    try {
        const [userResult] = await db.execute(
            'INSERT INTO users (fullname, email, password, role) VALUES (?, ?, ?, "doctor")',
            [fullname, email, password]
        );
        const userId = userResult.insertId;

        const [doctorResult] = await db.execute(
            'INSERT INTO doctors (user_id, specialty, hospital, rating, reviews, experience, price, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, specialty, hospital, rating || 0, reviews || 0, experience || 0, price || 2500, image_url]
        );
        res.status(201).json({ message: 'Doctor added successfully', doctorId: doctorResult.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update doctor information (Admin only)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { specialty, hospital, rating, reviews, experience, price, image_url, available } = req.body;
    try {
        await db.execute(
            'UPDATE doctors SET specialty = ?, hospital = ?, rating = ?, reviews = ?, experience = ?, price = ?, image_url = ?, available = ? WHERE id = ?',
            [specialty, hospital, rating, reviews, experience, price, image_url, available, id]
        );
        res.json({ message: 'Doctor updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a doctor
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Find corresponding user first
        const [doctor] = await db.execute('SELECT user_id FROM doctors WHERE id = ?', [id]);
        if (doctor.length > 0) {
            const userId = doctor[0].user_id;
            await db.execute('DELETE FROM users WHERE id = ?', [userId]);
            // cascade delete will handle doctors table
        }
        res.json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Manage Schedules
router.post('/:id/schedules', async (req, res) => {
    const { id } = req.params;
    const { day_of_week, start_time, end_time } = req.body;
    try {
        await db.execute(
            'INSERT INTO schedules (doctor_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)',
            [id, day_of_week, start_time, end_time]
        );
        res.status(201).json({ message: 'Schedule added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/schedules/:scheduleId', async (req, res) => {
    const { scheduleId } = req.params;
    try {
        await db.execute('DELETE FROM schedules WHERE id = ?', [scheduleId]);
        res.json({ message: 'Schedule removed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
