const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get appointments (Generic for now, in real life use JWT to filter)
router.get('/', async (req, res) => {
    const { userId, role } = req.query; // Ideally from JWT
    try {
        let query = '';
        let params = [];

        if (role === 'patient') {
            query = `
                SELECT a.*, d.specialty, u.fullname as doctorName 
                FROM appointments a 
                JOIN doctors d ON a.doctor_id = d.id 
                JOIN users u ON d.user_id = u.id 
                WHERE a.patient_id = ?
            `;
            params = [userId];
        } else if (role === 'doctor') {
            query = `
                SELECT a.*, u.fullname as patientName 
                FROM appointments a 
                JOIN users u ON a.patient_id = u.id 
                JOIN doctors d ON a.doctor_id = d.id 
                WHERE d.user_id = ?
            `;
            params = [userId];
        } else {
            // Admin gets all
            query = `
                SELECT a.*, p.fullname as patientName, dr.fullname as doctorName 
                FROM appointments a 
                JOIN users p ON a.patient_id = p.id 
                JOIN doctors d ON a.doctor_id = d.id 
                JOIN users dr ON d.user_id = dr.id
            `;
        }

        const [appointments] = await db.execute(query, params);
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Book an appointment
router.post('/', async (req, res) => {
    const { patient_id, doctor_id, appointment_date, appointment_time } = req.body;

    console.log('Booking attempt:', { patient_id, doctor_id, appointment_date, appointment_time });

    if (!patient_id || !doctor_id || !appointment_date || appointment_time) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const [result] = await db.execute(
            'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, "confirmed")',
            [patient_id, doctor_id, appointment_date, appointment_time]
        );
        res.status(201).json({ message: 'Appointment booked successfully', appointmentId: result.insertId });
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Cancel appointment
router.put('/:id/cancel', async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('UPDATE appointments SET status = "cancelled" WHERE id = ?', [id]);
        res.json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single appointment details
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [appointment] = await db.execute(`
            SELECT a.*, d.specialty, d.price, u.fullname as doctorName, p.fullname as patientName, d.image_url
            FROM appointments a 
            JOIN doctors d ON a.doctor_id = d.id 
            JOIN users u ON d.user_id = u.id 
            JOIN users p ON a.patient_id = p.id
            WHERE a.id = ?
        `, [id]);

        if (appointment.length === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.json(appointment[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
