import express from 'express';
import { login, refresh, logout } from '../controllers/authController';

const router = express.Router();

router.post('/auth/login', login);
router.post('/auth/refresh', refresh);
router.post('/auth/logout', logout);

module.exports = router;