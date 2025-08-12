const express = require('express');
const router = express.Router();
const dataPool = require('../DB/DBconn');

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    console.log(req.session.loggedin);
	if (req.session && req.session.loggedin) {
		return next();
	} else {
		return res.status(401).json({ success: false, error: 'Not authenticated' });
	}
}

// Create blog post endpoint (protected)
router.post('/create', isAuthenticated, async (req, res) => {
	const { title, content, tags, image_url } = req.body;
	const author = req.session.username;
	if (!title || !content || !author) {
		return res.json({ success: false, error: 'Missing fields or not logged in.' });
	}
	try {
		const published_on = new Date();
		await dataPool.createPost(title, content, published_on, tags ? tags.join(',') : '', image_url || null, author);
		return res.json({ success: true });
	} catch (err) {
		console.error('Blog post creation error:', err);
        return res.json({ success: false, error: 'Server error.' });
	}
});

// Get all blog posts endpoint
router.get('/all', async (req, res) => {
	try {
		const posts = await dataPool.getPosts();
		return res.json({ success: true, posts });
	} catch (err) {
		console.error('Get blog posts error:', err);
		return res.json({ success: false, error: 'Server error.' });
	}
});

module.exports = router;
