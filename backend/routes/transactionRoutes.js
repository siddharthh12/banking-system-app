const express = require('express');
const router = express.Router();
const {
  getTransactions,
  deposit,
  withdraw,
} = require('../controllers/transactionController');

router.get('/', getTransactions);
router.post('/deposit', deposit);
router.post('/withdraw', withdraw);

module.exports = router;
