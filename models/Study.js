const db = require('../config/db');

class Study {
    static async create({ doctor_id, title, description, disease_category, file_url = null }) {
        const [result] = await db.execute(
            'INSERT INTO medical_studies (doctor_id, title, description, disease_category, file_url) VALUES (?, ?, ?, ?, ?)',
            [doctor_id, title, description, disease_category, file_url]
        );
        return result.insertId;
    }

    static async getAll() {
        const [rows] = await db.execute(`
            SELECT s.*, u.full_name as doctor_name, u.specialization 
            FROM medical_studies s 
            JOIN users u ON s.doctor_id = u.id 
            ORDER BY s.created_at DESC
        `);
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.execute(
            'SELECT * FROM medical_studies WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async update(id, { title, description, disease_category, file_url }) {
        await db.execute(
            'UPDATE medical_studies SET title = ?, description = ?, disease_category = ?, file_url = ? WHERE id = ?',
            [title, description, disease_category, file_url, id]
        );
    }

    static async delete(id) {
        await db.execute(
            'DELETE FROM medical_studies WHERE id = ?',
            [id]
        );
    }

    static async getByDoctorId(doctor_id) {
        const [rows] = await db.execute(
            'SELECT * FROM medical_studies WHERE doctor_id = ? ORDER BY created_at DESC',
            [doctor_id]
        );
        return rows;
    }
}

module.exports = Study;



