import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { createAccount, deleteAccount, updateAccount, associateUser, dissociateUser, getAccountsByUser, getUsersByAccount, getAccountTypes, getAccountCategories } from '../controllers/accountController';

const router = express.Router();

router.post('/account', authenticateToken, createAccount
    // #swagger.security = [{'Bearer': []}]
);

router.delete('/account', authenticateToken, deleteAccount
    // #swagger.security = [{'Bearer': []}]
);

router.put('/account', authenticateToken, updateAccount
    // #swagger.security = [{'Bearer': []}]
);

router.get('/user/:user_id/accounts', authenticateToken, getAccountsByUser
    // #swagger.security = [{'Bearer': []}]
);

router.get('/account/:account_id/users', authenticateToken, getUsersByAccount
    // #swagger.security = [{'Bearer': []}]
);

router.post('/account/user', authenticateToken, associateUser
    // #swagger.security = [{'Bearer': []}]
);

router.delete('/account/user', authenticateToken, dissociateUser
    // #swagger.security = [{'Bearer': []}]
);

router.get('/account/types', authenticateToken, getAccountTypes
    // #swagger.security = [{'Bearer': []}]
);

router.get('/account/categories', authenticateToken, getAccountCategories
    // #swagger.security = [{'Bearer': []}]
);

module.exports = router;