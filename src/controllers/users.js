import bcrypt from 'bcrypt';
import { createUser, authenticateUser, getAllUsers } from '../models/users.js';

const saltRounds = 10;

// Show registration form
const showUserRegistrationForm = async (req, res) => {
    const title = 'Register';
    res.render('register', { title });
};

// Process registration form
const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const passwordHash = await bcrypt.hash(password, saltRounds);
        await createUser(name, email, passwordHash);
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/login');
    } catch (error) {
        console.error('Registration error:', error);
        req.flash('error', 'Registration failed. Email may already be in use.');
        res.redirect('/register');
    }
};

// Show login form
const showLoginForm = async (req, res) => {
    const title = 'Login';
    res.render('login', { title });
};

// Process login form
const processLoginForm = async (req, res) => {
    const { email, password } = req.body;
    const user = await authenticateUser(email, password);
    if (user) {
        req.session.user = user;
        req.flash('success', 'Login successful!');
        console.log('Logged in user:', user);
        res.redirect('/dashboard');
    } else {
        req.flash('error', 'Invalid email or password.');
        res.redirect('/login');
    }
};

// Process logout
const processLogout = (req, res) => {
    req.session.destroy();
    req.flash('success', 'You have been logged out.');
    res.redirect('/login');
};

// Show dashboard
const showDashboard = async (req, res) => {
    const title = 'Dashboard';
    const { name, email } = req.session.user;
    res.render('dashboard', { title, name, email });
};

// Show all users (admin only)
const showUsersPage = async (req, res) => {
    const users = await getAllUsers();
    const title = 'All Users';
    res.render('users', { title, users });
};

// Require login middleware
const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};

// Require role middleware factory
const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.session.user || req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access that page.');
            return res.redirect('/');
        }
        next();
    };
};

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    showDashboard,
    showUsersPage,
    requireLogin,
    requireRole
};