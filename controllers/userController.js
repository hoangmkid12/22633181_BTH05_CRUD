const User = require('../models/User');

// Đăng ký
exports.register = async(req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Đăng nhập
exports.login = async(req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // Lưu user vào session
        req.session.user = { id: user._id, username: user.username };
        res.json({ message: 'Logged in', user: req.session.user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Đăng xuất
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.json({ message: 'Logged out' });
    });
};

// Lấy thông tin user hiện tại
exports.me = (req, res) => {
    res.json({ user: req.session.user || null });
};