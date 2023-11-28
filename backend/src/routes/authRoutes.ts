
const express = require('express');
const router = express.Router();
import { login, refresh, logout } from '../controllers/authController';

router.post('/auth/login', login);
router.post('/auth/refresh', refresh);
router.post('/auth/logout', logout);

module.exports = router;