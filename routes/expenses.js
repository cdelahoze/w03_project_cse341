const express = require('express');
const router = express.Router();

const expensesController = require('../controllers/expenses');

//Expenses Controller

router.get('/', expensesController.getAllExpenses);

router.get('/:id', expensesController.getSingleExpenses);

router.post('/', expensesController.createExpenses);

router.put('/:id', expensesController.updateExpenses);

router.delete('/:id', expensesController.deleteExpenses);

module.exports = router;
