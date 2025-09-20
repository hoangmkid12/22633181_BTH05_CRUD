require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const morgan = require('morgan');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const supplierRoutes = require('./routes/supplierRoutes');
const productRoutes = require('./routes/productRoutes');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

// DB connect
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB error:', err.message);
});

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));

// ===== Session & Cookie demo endpoints (Phần 2) =====
const requireLogin = (req, res, next) => {
    if (!req.session.user) return res.status(401).json({ message: 'Unauthenticated' });
    next();
};

// Đăng nhập giả -> lưu user vào session
app.post('/auth/login', (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: 'username is required' });
    req.session.user = { username };
    res.json({ message: 'logged in', user: req.session.user });
});

// Kiểm tra thông tin user trong session
app.get('/auth/me', (req, res) => {
    res.json({ user: req.session.user || null });
});

// Đăng xuất -> xoá session
app.post('/auth/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ message: 'logged out' });
    });
});

// Counter tăng theo session
app.get('/counter', (req, res) => {
    req.session.count = (req.session.count || 0) + 1;
    res.json({ count: req.session.count });
});

// Endpoint chỉ cho phép khi đã login
app.get('/api/protected', requireLogin, (req, res) => {
    res.json({ ok: true, user: req.session.user });
});

// Swagger config
const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: { title: 'Supplier & Product API', version: '1.0.0' }
    },
    apis: [path.join(__dirname, 'routes', '*.js')],
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Home
const Supplier = require('./models/Supplier');
const Product = require('./models/Product');
app.get('/', async(req, res) => {
    const suppliers = await Supplier.find();
    const { supplier, q } = req.query;
    const filter = {};
    if (supplier) filter.supplierId = supplier;
    if (q) filter.name = { $regex: q, $options: 'i' };
    const products = await Product.find(filter).populate('supplierId');
    res.render('index', { suppliers, products, selectedSupplier: supplier || '', q: q || '' });
});

// Routes
app.use('/suppliers', supplierRoutes);
app.use('/products', productRoutes);

// 404
app.use((req, res) => {
    res.status(404).send('Not Found');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));