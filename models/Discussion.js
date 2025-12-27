const db = require('../config/db');

class Discussion {
    static async create({ user_id, title, content, category }) {
        const [result] = await db.execute(
            'INSERT INTO discussions (user_id, title, content, category) VALUES (?, ?, ?, ?)',
            [user_id, title, content, category]
        );
        return result.insertId;
    }

    static async getAll() {
        const [rows] = await db.execute(`
            SELECT d.*, u.full_name as author_name, u.user_type 
            FROM discussions d 
            JOIN users u ON d.user_id = u.id 
            ORDER BY d.created_at DESC
        `);
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.execute(
            'SELECT * FROM discussions WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async addComment({ discussion_id, user_id, content }) {
        const [result] = await db.execute(
            'INSERT INTO comments (discussion_id, user_id, content) VALUES (?, ?, ?)',
            [discussion_id, user_id, content]
        );
        return result.insertId;
    }

    static async getComments(discussion_id) {
        const [rows] = await db.execute(`
            SELECT c.*, u.full_name as author_name 
            FROM comments c 
            JOIN users u ON c.user_id = u.id 
            WHERE c.discussion_id = ? 
            ORDER BY c.created_at ASC
        `, [discussion_id]);
        return rows;
    }
}

module.exports = Discussion;









