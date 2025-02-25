const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
dotenv.config();

const User = require('./models/User');

const app = express();
const port = process.env.PORT || 3001;

// Database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected to:', process.env.MONGO_URI))
    .catch(err => console.log('MongoDB connection error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3001/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    console.log('User not authenticated. Redirecting to login.');
    res.redirect('/login.html');
};

app.use('/api', require('./routes/api')); // Ensure this line is present

app.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login.html' }),
    (req, res) => {
        res.redirect('/');
    });

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            console.log('Invalid username or password');
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid username or password');
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        req.login(user, err => {
            if (err) {
                console.log('Login failed:', err);
                return res.status(500).json({ error: 'Login failed' });
            }
            console.log('User logged in:', user);
            return res.redirect('/');
        });
    } catch (error) {
        console.log('An error occurred during login:', error);
        return res.status(500).json({ error: 'An error occurred during login' });
    }
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        console.log('User registered:', newUser);
        return res.redirect('/login.html');
    } catch (error) {
        console.log('Failed to register user:', error);
        return res.status(500).json({ error: 'Failed to register user' });
    }
});

app.get('/', ensureAuthenticated, (req, res) => {
    console.log('User authenticated, serving application');
    res.send('Welcome to the A4 Application');
});

app.post('/logout', ensureAuthenticated, (req, res, next) => {
    console.log('Logout route called');
    req.logout(err => {
        if (err) {
            console.log('Logout failed:', err);
            return next(err);
        }
        req.session.destroy(err => {
            if (err) {
                console.log('Session destruction failed:', err);
                return next(err);
            }
            res.clearCookie('connect.sid');
            console.log('User logged out, redirecting to login');
            res.redirect('/login.html');
        });
    });
});

app.use((req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('/login.html');
    } else {
        next();
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
