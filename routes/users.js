const express = require('express');
const router = express.Router();


const usersController = require('../controllers/users');

const { isAuthenticated } = require("../middleware/authenticate")

//Users Controller

router.get('/', usersController.getAllUsers);

router.get('/:id', usersController.getSingleUsers);

router.post('/', isAuthenticated, usersController.createUsers);

router.put('/:id', isAuthenticated, usersController.updateUsers);

router.delete('/:id', isAuthenticated, usersController.deleteUsers);




module.exports = router;
