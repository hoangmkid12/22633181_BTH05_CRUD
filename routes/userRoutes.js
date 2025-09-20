// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');

/** Helper: trả JSON hay redirect tùy theo loại request */
function respond(req, res, { ok = true, message = '', redirectTo = '/', json = {} }) {
    if (req.accepts('html')) {
        if (ok && message) req.flash('success', message);
        if (!ok && message) req.flash('error', message);
        return res.redirect(redirectTo);
    }
    // JSON response
    const status = ok ? 200 : 400;
    return res.status(status).json({ message, ...json });
}

/** POST /users/register */
router.post('/register', async(req, res) => {
    try {
        const { username, password, email, phone } = req.body;
        if (!username || !password) {
            return respond(req, res, { ok: false, message: 'username & password required', redirectTo: '/register' });
        }

        const exists = await User.findOne({ username });
        if (exists) {
            return respond(req, res, { ok: false, message: 'Username already taken', redirectTo: '/register' });
        }

        const user = new User({ username, password, email, phone });
        await user.save();

        // Đăng nhập luôn sau khi đăng ký
        req.session.user = { id: user._id, username: user.username };
        return respond(req, res, { message: 'Đăng ký thành công!', redirectTo: '/' });
    } catch (err) {
        return respond(req, res, { ok: false, message: err.message, redirectTo: '/register' });
    }
});

/** POST /users/login */
router.post('/login', async(req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return respond(req, res, { ok: false, message: 'Sai username hoặc password', redirectTo: '/login' });
        }

        const ok = await user.comparePassword(password);
        if (!ok) {
            return respond(req, res, { ok: false, message: 'Sai username hoặc password', redirectTo: '/login' });
        }

        req.session.user = { id: user._id, username: user.username };
        return respond(req, res, { message: 'Đăng nhập thành công!', redirectTo: '/', json: { user: req.session.user } });
    } catch (err) {
        return respond(req, res, { ok: false, message: err.message, redirectTo: '/login' });
    }
});

/** POST /users/logout */
router.post('/logout', (req, res) => {
    // xoá thông tin đăng nhập nhưng GIỮ session để flash hoạt động
    req.session.user = null;
    req.flash('success', 'Bạn đã đăng xuất');
    res.redirect('/');
});

/** GET /users/me (JSON) */
router.get('/me', (req, res) => {
    res.json({ user: req.session.user || null });
});

/** POST /users/forgot  -> tạo token reset (demo: in ra console & trả về view) */
router.post('/forgot', async(req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return respond(req, res, { ok: false, message: 'User not found', redirectTo: '/forgot' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        user.resetToken = token;
        user.resetTokenExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 phút
        await user.save();

        console.log(`🔐 Reset token for ${username}: ${token}`); // demo thay cho gửi email

        if (req.accepts('html')) {
            req.flash('success', `Mã đặt lại mật khẩu (demo): ${token}`);
            return res.redirect('/forgot');
        }
        return res.json({ message: 'Token generated', token });
    } catch (err) {
        return respond(req, res, { ok: false, message: err.message, redirectTo: '/forgot' });
    }
});

/** POST /users/reset  -> đặt lại mật khẩu bằng token */
router.post('/reset', async(req, res) => {
    try {
        const { username, token, newPassword } = req.body;
        if (!username || !token || !newPassword) {
            return respond(req, res, { ok: false, message: 'Thiếu dữ liệu', redirectTo: '/forgot' });
        }

        const user = await User.findOne({
            username,
            resetToken: token,
            resetTokenExpire: { $gt: new Date() }
        });

        if (!user) {
            return respond(req, res, { ok: false, message: 'Token không hợp lệ hoặc đã hết hạn', redirectTo: '/forgot' });
        }

        user.password = newPassword; // sẽ được hash trong pre('save')
        user.resetToken = undefined;
        user.resetTokenExpire = undefined;
        await user.save();

        req.flash('success', 'Đổi mật khẩu thành công! Vui lòng đăng nhập.');
        return res.redirect('/login');
    } catch (err) {
        return respond(req, res, { ok: false, message: err.message, redirectTo: '/forgot' });
    }
});

module.exports = router;