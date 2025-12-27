const Discussion = require('../models/Discussion');

const discussionController = {
    
    createDiscussion: async (req, res) => {
        try {
            const { title, content, category } = req.body;
            
            const discussionId = await Discussion.create({
                user_id: req.user.id,
                title,
                content,
                category
            });

            res.status(201).json({
                message: 'Discussion created successfully',
                discussionId
            });
        } catch (error) {
            console.error('Create discussion error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },

    
    getAllDiscussions: async (req, res) => {
        try {
            const discussions = await Discussion.getAll();
            res.json(discussions);
        } catch (error) {
            console.error('Get discussions error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },

    
    getDiscussionById: async (req, res) => {
        try {
            const discussion = await Discussion.getById(req.params.id);
            if (!discussion) {
                return res.status(404).json({ error: 'Discussion not found' });
            }

            const comments = await Discussion.getComments(req.params.id);
            
            res.json({
                discussion,
                comments
            });
        } catch (error) {
            console.error('Get discussion error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },

    
    addComment: async (req, res) => {
        try {
            const { content } = req.body;
            const { id } = req.params; 
            
            
            const discussion = await Discussion.getById(id);
            if (!discussion) {
                return res.status(404).json({ error: 'Discussion not found' });
            }

            const commentId = await Discussion.addComment({
                discussion_id: id,
                user_id: req.user.id,
                content
            });

            res.status(201).json({
                message: 'Comment added successfully',
                commentId
            });
        } catch (error) {
            console.error('Add comment error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
};

module.exports = discussionController;





