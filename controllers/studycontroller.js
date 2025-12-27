const Study = require('../models/Study');

const studyController = {
    
    createStudy: async (req, res) => {
        try {
            if (req.user.user_type !== 'doctor') {
                return res.status(403).json({ error: 'Only doctors can create studies' });
            }

            const { title, description, disease_category, file_url } = req.body;
            
            const studyId = await Study.create({
                doctor_id: req.user.id,
                title,
                description,
                disease_category,
                file_url
            });

            res.status(201).json({
                message: 'Study created successfully',
                studyId
            });
        } catch (error) {
            console.error('Create study error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },

  
    getAllStudies: async (req, res) => {
        try {
            const studies = await Study.getAll();
            res.json(studies);
        } catch (error) {
            console.error('Get studies error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },

  
    getStudyById: async (req, res) => {
        try {
            const study = await Study.getById(req.params.id);
            if (!study) {
                return res.status(404).json({ error: 'Study not found' });
            }
            res.json(study);
        } catch (error) {
            console.error('Get study error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },

    
    updateStudy: async (req, res) => {
        try {
            if (req.user.user_type !== 'doctor') {
                return res.status(403).json({ error: 'Only doctors can update studies' });
            }

            const study = await Study.getById(req.params.id);
            if (!study) {
                return res.status(404).json({ error: 'Study not found' });
            }

            
            if (study.doctor_id !== req.user.id) {
                return res.status(403).json({ error: 'You can only update your own studies' });
            }

            await Study.update(req.params.id, req.body);
            res.json({ message: 'Study updated successfully' });
        } catch (error) {
            console.error('Update study error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },

    deleteStudy: async (req, res) => {
        try {
            if (req.user.user_type !== 'doctor') {
                return res.status(403).json({ error: 'Only doctors can delete studies' });
            }

            const study = await Study.getById(req.params.id);
            if (!study) {
                return res.status(404).json({ error: 'Study not found' });
            }

            
            if (study.doctor_id !== req.user.id) {
                return res.status(403).json({ error: 'You can only delete your own studies' });
            }

            await Study.delete(req.params.id);
            res.json({ message: 'Study deleted successfully' });
        } catch (error) {
            console.error('Delete study error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },

    getMyStudies: async (req, res) => {
        try {
            if (req.user.user_type !== 'doctor') {
                return res.status(403).json({ error: 'Only doctors have studies' });
            }

            const studies = await Study.getByDoctorId(req.user.id);
            res.json(studies);
        } catch (error) {
            console.error('Get my studies error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
};

module.exports = studyController;








