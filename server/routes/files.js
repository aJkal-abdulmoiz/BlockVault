const express = require('express');
const { uploadFile } = require('../controllers/fileController');
const auth = require('../middlewares/auth');
const router = express.Router();

router.post('/upload', auth, uploadFile);

module.exports = router;
