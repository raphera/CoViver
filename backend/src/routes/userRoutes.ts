const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.post('/users', authenticateToken, userController.createUser
    // #swagger.security = [{'Bearer': []}]
);

router.get('/users/:id', authenticateToken, userController.getUser
    // #swagger.security = [{'Bearer': []}]
);

router.get('/users', authenticateToken, userController.getUsers
    // #swagger.security = [{'Bearer': []}]
);

router.delete('/users/:id', authenticateToken, userController.deleteUser
    // #swagger.security = [{'Bearer': []}]
);

module.exports = router;