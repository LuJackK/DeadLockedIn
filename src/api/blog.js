const express = require('express');
const router = express.Router();
const dataPool = require('../DB/DBconn');

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
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

router.post('/vote', isAuthenticated, async (req, res) => {
	const { postId, voteType } = req.body;
	console.log("voteType: " + voteType);
	console.log("postId: " + postId);	
	console.log("session loggedin:" + req.session.loggedin);
	if (!postId) {
		return res.json({ success: false, error: 'Missing fields.' });
	}
	try {
		const userId = req.session.username; // Assuming userId is stored in session
		console.log("userId: " + userId);
		await dataPool.votePost(postId, userId, voteType);
		return res.json({ success: true });
	} catch (err) {
		console.error('Vote post error:', err);
		return res.json({ success: false, error: 'Server error.' });
	}
});

router.get('/vote/:id', async (req, res) => {
	const postId = req.params.id;
	if (!postId) {
		return res.json({ success: false, error: 'Missing post ID.' });
	}
	try {
		const votes = await dataPool.getPostVotes(postId);
		return res.json({ success: true, votes });
	}
	catch (err) {
		console.error('Get post votes error:', err);
		return res.json({ success: false, error: 'Server error.' });
	}		
});
router.get('/user-vote/:id', isAuthenticated, async (req, res) => {
	const postId = req.params.id;	
	if (!postId) {
		return res.json({ success: false, error: 'Missing post ID.' });
	}	
	const userId = req.session.username; // Assuming userId is stored in session
	try {
		const userVote = await dataPool.getUserVote(postId, userId);			
		if (userVote) {
			return res.json({ success: true, userVote });
		} else {
			return res.json({ success: false, error: 'User has not voted on this post.' });
		}
	} catch (err) {
		console.error('Get user vote error:', err);
		return res.json({ success: false, error: 'Server error.' });
	}
});




module.exports = router;
