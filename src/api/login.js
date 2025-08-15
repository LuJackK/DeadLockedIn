const express = require('express');
const router = express.Router();
const dataPool = require('../DB/DBconn');

// Login endpoint
router.post('/', async (req, res) => {
	const { username, password } = req.body;
	try {
		// Find user by username
		const users = await dataPool.getUsersDetails(username);
		const user = users && users.length > 0 ? users[0] : null;
		if (user && user.password_hash === password) {
			req.session.loggedin = true;
			req.session.username = user.username;
			req.session.role = user.role;
            console.log(req.session.loggedin);
			return res.json({ success: true, username: user.username });
		} else {
			return res.json({ success: false, error: 'Invalid credentials' });
		}
	} catch (err) {
		return res.json({ success: false, error: 'Server error' });
	}
});

module.exports = router;
