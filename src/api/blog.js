const express = require('express');
const router = express.Router();
const dataPool = require('../DB/DBconn');

function isAuthenticated(req, res, next) {
	if (req.session && req.session.loggedin) {
		return next();
	} else {
		return res.status(401).json({ success: false, error: 'Not authenticated' });
	}
}

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
	if (!postId) {
		return res.json({ success: false, error: 'Missing fields.' });
	}
	try {
		const userId = req.session.username; 
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
		return res.json({ success: false, error: 'Server error.' });
	}		
});

router.get('/user-vote/:id', isAuthenticated, async (req, res) => {
	const postId = req.params.id;	
	if (!postId) {
		return res.json({ success: false, error: 'Missing post ID.' });
	}	
	const userId = req.session.username;
	try {
		const userVote = await dataPool.getUserVotes(postId, userId);			
		if (userVote) {
			return res.json({ success: true, userVote });
		} else {
			return res.json({ success: false, error: 'User has not voted on this post.' });
		}
	} catch (err) {
		return res.json({ success: false, error: 'Server error.' });
	}
});

router.post('/comment', isAuthenticated, async (req, res) => {
	const { postId, content } = req.body;
	const author = req.session.username;
	if (!postId || !content || !author) {
		return res.json({ success: false, error: 'Missing fields or not logged in.' });
	}
	try {
		const createdOn = new Date();
		await dataPool.addComment(postId, author, content, createdOn);
		return res.json({ success: true });
	} catch (err) {
		console.error('Add comment error:', err);
		return res.json({ success: false, error: 'Server error.' });
	}
});
router.get('/comment/:postId', async (req, res) => {
	const postId = req.params.postId;
	if (!postId) {
		return res.json({ success: false, error: 'Missing post ID.' });
	}
	try {
		const comments = await dataPool.getComments(postId);
		return res.json({ success: true, comments });
	} catch (err) {
		console.error('Get comments error:', err);
		return res.json({ success: false, error: 'Server error.' });
	}
});

router.delete('/:id', isAuthenticated, async (req, res) => {
	const postId = req.params.id;
	if (!req.session || !('admin' === req.session.role)) {
		return res.status(403).json({ success: false, error: 'Forbidden' });
	}
	if (!postId) {
		return res.json({ success: false, error: 'Missing post ID.' });
	}
	try {
		await dataPool.deletePost(postId);
		return res.json({ success: true });
	} catch (err) {
		console.error('Delete post error:', err);
		return res.json({ success: false, error: 'Server error.' });
	}
});

router.delete('/comment/:commentId', isAuthenticated, async (req, res) => {
	const commentId = req.params.commentId;
	if (!req.session || !('admin' === (req.session.role))) {
		return res.status(403).json({ success: false, error: 'Forbidden' });
	}
	if (!commentId) {
		return res.json({ success: false, error: 'Missing comment ID.' });
	}
	try {
		
		await dataPool.deleteComment(commentId);
		return res.json({ success: true });
	} catch (err) {
		console.error('Delete comment error:', err);
		return res.json({ success: false, error: 'Server error.' });
	}
});
module.exports = router;
