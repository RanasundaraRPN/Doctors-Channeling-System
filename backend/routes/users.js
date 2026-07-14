const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all patients
router.get('/patients', async (req, res) => {
    try {
        const [patients] = await db.execute('SELECT id, fullname, email, created_at FROM users WHERE role = "patient"');
        res.json(patients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a patient
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a patient (Admin)
router.post('/patients', async (req, res) => {
    const { fullname, email, password } = req.body;
    try {
        await db.execute(
            'INSERT INTO users (fullname, email, password, role) VALUES (?, ?, ?, "patient")',
            [fullname, email, password]
        );
        res.status(201).json({ message: 'Patient added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
