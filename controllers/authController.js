const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.getLogin = (req, res) => {
    if (req.session.user) return res.redirect('/dashboard');
    res.render('login', { error: null });
};

exports.postLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findByUsername(username);
        if (!user) {
            return res.render('login', { error: 'Invalid username or password' });
        }
        
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            req.session.user = { id: user.id, username: user.username, role: user.role };
            res.redirect('/dashboard');
        } else {
            res.render('login', { error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error(error);
        res.render('login', { error: 'An error occurred. Please try again later.' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};
