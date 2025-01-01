// routes/files.js
const express = require('express');
const router = express.Router();
const { uploadFile , getFiles} = require('../controllers/fileController');
const auth = require('../middlewares/auth');

router.post('/upload', uploadFile);
router.get('/getfiles', getFiles);

module.exports = router;
