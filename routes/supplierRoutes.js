const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/supplierController');

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
router.get('/api/list', async (req, res) => {
  const Supplier = require('../models/Supplier');
  const suppliers = await Supplier.find();
  res.json(suppliers);
});

router.get('/new', ctrl.newForm);
router.post('/', ctrl.create);
router.get('/:id/edit', ctrl.editForm);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.destroy);

module.exports = router;
