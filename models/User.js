const db = require('../config/db');

class User {
    static async create({ email, password, full_name, user_type, specialization = null }) {
        const [result] = await db.execute(
            'INSERT INTO users (email, password, full_name, user_type, specialization) VALUES (?, ?, ?, ?, ?)',
            [email, password, full_name, user_type, specialization]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.execute(
            'SELECT id, email, full_name, user_type, specialization FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async getAllDoctors() {
        const [rows] = await db.execute(
            'SELECT id, full_name, specialization FROM users WHERE user_type = "doctor"'
        );
        return rows;
    }
}

module.exports = User;





