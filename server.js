const express = require('express');
const cors = require('cors');
const session = require('express-session');
const accountRouter = require('./src/api/account');
const blogRouter = require('./src/api/blog');
const loginRouter = require('./src/api/login');
const heroRouter = require('./src/api/hero');
const itemRouter = require('./src/api/item');
const app = express();
app.use(cors({ origin: 'http://88.200.63.148:3003', credentials: true }));
app.use(express.json());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, 
    sameSite: 'lax' 
  }
}));
app.use('/api', accountRouter);
app.use('/api/blog', blogRouter);
app.use('/api/login', loginRouter);
app.use('/api/hero', heroRouter);
app.use('/api/item', itemRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
function isAuthenticated(req, res, next) {
  if (req.session && req.session.loggedin) {
    return next();
  } else {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }
}

