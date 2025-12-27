// backend/controllers/authController.js

// ============= REGISTER - ALWAYS SUCCESS =============
exports.register = (req, res) => {
    console.log('📝 Register attempt (auto-success)');
    
    res.json({
        success: true,
        message: 'Registration successful!',
        user: {
            id: Math.floor(Math.random() * 1000),
            email: req.body.email || 'student@project.com',
            full_name: req.body.full_name || 'Project User',
            user_type: req.body.user_type || 'patient'
        },
        token: 'project-token-' + Date.now()
    });
};

// ============= LOGIN - ALWAYS SUCCESS =============
exports.login = (req, res) => {
    console.log('🔐 Login attempt (auto-success)');
    
    res.json({
        success: true,
        message: 'Login successful!',
        user: {
            id: 1,
            email: req.body.email || 'test@project.com',
            full_name: 'Demo User',
            user_type: 'doctor'
        },
        token: 'project-token-123'
    });
};

// ============= GET DOCTORS - DUMMY DATA =============
exports.getAllDoctors = (req, res) => {
    res.json({
        success: true,
        doctors: [
            { id: 1, email: 'dr.smith@hospital.com', full_name: 'Dr. John Smith', specification: 'Cardiology' },
            { id: 2, email: 'dr.jones@clinic.com', full_name: 'Dr. Sarah Jones', specification: 'Neurology' },
            { id: 3, email: 'dr.williams@medical.com', full_name: 'Dr. Robert Williams', specification: 'Orthopedics' }
        ]
    });
};

// ============= GET PROFILE - DUMMY DATA =============
exports.getProfile = (req, res) => {
    res.json({
        success: true,
        user: {
            id: 1,
            email: 'student@project.com',
            full_name: 'Project Demo User',
            user_type: 'student',
            specification: 'Computer Science'
        }
    });
};


