import express from 'express';

import { signupExisting, signupNew, login, schemes, payment, isAuth, schemesAddition } from '../controllers/auth.js';

const router = express.Router();

router.post('/api/login', login);

router.post('/api/signup/existing', signupExisting);

router.post('/api/signup/new', signupNew);

router.get('/api/schemes', schemes);

router.post('/api/schemes', schemesAddition);

router.post('/api/payment', payment);

router.post('/api/sms', signupExisting);

router.get('/api/private', isAuth);

router.get('/public', (req, res, next) => {
    res.status(200).json({ message: "here is your public resource" });
});

// will match any other path
router.use('/', (req, res, next) => {
    res.status(404).json({ error: "page not found" });
});

export default router;