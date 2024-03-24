const express = require('express');
const router = express.Router();

const expensesController = require('../controllers/expenses');

const { isAuthenticated } = require("../middleware/authenticate")


//Expenses Controller

router.get('/', expensesController.getAllExpenses);

router.get('/:id', expensesController.getSingleExpenses);

router.post('/', isAuthenticated, expensesController.createExpenses);

router.put('/:id', isAuthenticated, expensesController.updateExpenses);

router.delete('/:id', isAuthenticated, expensesController.deleteExpenses);

module.exports = router;
