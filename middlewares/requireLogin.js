module.exports = function requireLogin(req, res, next) {
    if (!req.session.user) {
        // Nếu request HTML thì chuyển tới /login, nếu API thì trả 401
        if (req.accepts('html')) return res.redirect('/login');
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
};