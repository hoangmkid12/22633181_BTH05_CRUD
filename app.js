require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const morgan = require('morgan');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');

const requireLogin = require('./middlewares/requireLogin');
const userRoutes = require('./routes/userRoutes'); // /users
const authViewRoutes = require('./routes/authViewRoutes'); // /login, /register, /forgot (render form)
const supplierRoutes = require('./routes/supplierRoutes'); // /suppliers
const productRoutes = require('./routes/productRoutes'); // /products

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

/* ---------- DB ---------- */
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB error:', err.message));

/* ---------- View Engine ---------- */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* ---------- Middlewares ---------- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(methodOverride('_method'));
app.use(cookieParser());

// Session MUST come before flash
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false
}));

// Flash MUST come right after session
app.use(flash());

// Locals for all EJS views
app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    // two keys for convenience
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    // if you used success_msg / error_msg in some views, keep them too
    res.locals.success_msg = res.locals.success;
    res.locals.error_msg = res.locals.error;
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

/* ---------- Swagger ---------- */
const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: { title: 'Supplier & Product API', version: '1.0.0' }
    },
    apis: [path.join(__dirname, 'routes', '*.js')],
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ---------- Home (filter + search) ---------- */
const Supplier = require('./models/Supplier');
const Product = require('./models/Product');

app.get('/', async(req, res) => {
    const suppliers = await Supplier.find();
    const { supplier, q } = req.query;

    const filter = {};
    if (supplier) filter.supplierId = supplier;
    if (q) filter.name = { $regex: q, $options: 'i' };

    const products = await Product.find(filter).populate('supplierId');
    res.render('index', {
        suppliers,
        products,
        selectedSupplier: supplier || '',
        q: q || ''
    });
});

/* ---------- Routes ---------- */
// Render forms: /login, /register, /forgot
app.use('/', authViewRoutes);

// User APIs: /users/register, /users/login, /users/logout, /users/me, /users/forgot, /users/reset
app.use('/users', userRoutes);

// CRUD (các route create/update/delete đã được bọc requireLogin trong file routes tương ứng)
app.use('/suppliers', supplierRoutes);
app.use('/products', productRoutes);

// Example protected JSON endpoint (test)
app.get('/api/protected', requireLogin, (req, res) => {
    res.json({ ok: true, user: req.session.user });
});

/* ---------- 404 ---------- */
app.use((req, res) => {
    res.status(404).send('Not Found');
});

/* ---------- Start ---------- */
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));