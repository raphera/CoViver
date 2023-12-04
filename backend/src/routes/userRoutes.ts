import express from 'express';
import { createUser, deleteUser, getUser, getUsers } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/users', createUser
);

router.get('/users/:id', authenticateToken, getUser
    // #swagger.security = [{'Bearer': []}]
);

router.get('/users', authenticateToken, getUsers
    // #swagger.security = [{'Bearer': []}]
);

router.delete('/users/:id', authenticateToken, deleteUser
    // #swagger.security = [{'Bearer': []}]
);

module.exports = router;