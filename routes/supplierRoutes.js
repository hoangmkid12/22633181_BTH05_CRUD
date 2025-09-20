const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/supplierController');
const requireLogin = require('../middlewares/requireLogin');

/**
 * @openapi
 * /suppliers:
 *   get:
 *     summary: List suppliers (HTML page)
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', ctrl.index);

/**
 * @openapi
 * /api/suppliers:
 *   get:
 *     summary: Get all suppliers (JSON)
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/api/suppliers', async(req, res) => {
    const Supplier = require('../models/Supplier');
    const suppliers = await Supplier.find();
    res.json(suppliers);
});

// ==== CRUD Views (cần đăng nhập) ====
router.get('/new', requireLogin, ctrl.newForm);
router.post('/', requireLogin, ctrl.create);
router.get('/:id/edit', requireLogin, ctrl.editForm);
router.put('/:id', requireLogin, ctrl.update);
router.delete('/:id', requireLogin, ctrl.destroy);

module.exports = router;