const express = require('express');
const router = express.Router();
const dataPool = require('../DB/DBconn');

// Create account endpoint
router.post('/create-account', async (req, res) => {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
        return res.json({ success: false, error: 'Missing fields.' });
    }
    try {
        // Check if user already exists
        const existing = await new Promise((resolve, reject) => {
            dataPool.getUsersDetails(username)
                .then(result => resolve(result.length > 0 ? result[0] : null))
                .catch(reject);
        });
        if (existing) {
            return res.json({ success: false, error: 'Username already exists.' });
        }
        // Insert new user using promise-based method
        const created_on = new Date();
        const role = 'player';
        try {
            await dataPool.createUser(username, email, password, role, created_on);
            return res.json({ success: true });
        } catch (err) {
            return res.json({ success: false, error: err.message });
        }
    } catch (err) {
    console.error('Server error:', err);
    return res.json({ success: false, error: 'Server error.' });
    }
});




// Get current logged-in user info
router.get('/info', async (req, res) => {
    if (!req.session || !req.session.loggedin || !req.session.username) {
        return res.json({ success: false, error: 'Not logged in.' });
    }
    try {
        const userArr = await dataPool.getUsersDetails(req.session.username);
        if (userArr && userArr.length > 0) {
            const user = userArr[0];
            return res.json({ success: true, user });
        } else {
            return res.json({ success: false, error: 'User not found.' });
        }
    } catch (err) {
        return res.json({ success: false, error: 'Server error.' });
    }
});
router.post('/link-account', async (req, res) => {
    const playerId = req.session.username;
    const steamId = req.body.steamId;
    if (!playerId || !steamId) {
        return res.json({ success: false, error: 'Missing fields.' });
    }
    try {
        const result = await dataPool.linkSteamAccount(playerId, steamId);
        if (result.affectedRows > 0) {
            return res.json({ success: true });
        }
        return res.json({ success: false, error: 'Failed to link account.' });
    } catch (err) {
        console.error('Error linking account:', err);
        return res.json({ success: false, error: 'Server error.' });
    }
});

module.exports = router;
