const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productController');
const requireLogin = require('../middlewares/requireLogin');

/**
 * @openapi
 * /products:
 *   get:
 *     summary: List products (HTML page)
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', ctrl.index);

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Get all products (JSON)
 *     parameters:
 *       - in: query
 *         name: supplierId
 *         schema:
 *           type: string
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/api/products', async(req, res) => {
    const Product = require('../models/Product');
    const filter = {};
    const { supplierId, q } = req.query;
    if (supplierId) filter.supplierId = supplierId;
    if (q) filter.name = { $regex: q, $options: 'i' };
    const items = await Product.find(filter).populate('supplierId');
    res.json(items);
});

// ==== CRUD Views (cần đăng nhập) ====
router.get('/new', requireLogin, ctrl.newForm);
router.post('/', requireLogin, ctrl.create);
router.get('/:id/edit', requireLogin, ctrl.editForm);
router.put('/:id', requireLogin, ctrl.update);
router.delete('/:id', requireLogin, ctrl.destroy);

module.exports = router;