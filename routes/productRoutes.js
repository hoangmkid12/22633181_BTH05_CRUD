const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productController');

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
 *         schema: { type: string }
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/api/list', async (req, res) => {
  const Product = require('../models/Product');
  const filter = {};
  const { supplierId, q } = req.query;
  if (supplierId) filter.supplierId = supplierId;
  if (q) filter.name = { $regex: q, $options: 'i' };
  const items = await Product.find(filter).populate('supplierId');
  res.json(items);
});

router.get('/new', ctrl.newForm);
router.post('/', ctrl.create);
router.get('/:id/edit', ctrl.editForm);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.destroy);

module.exports = router;
