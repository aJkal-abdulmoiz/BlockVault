// routes/files.js
const express = require('express');
const router = express.Router();
const { uploadFile , getFiles} = require('../controllers/fileController');
const auth = require('../middlewares/auth');

router.post('/upload',auth,uploadFile);
router.get('/getfiles', auth,getFiles);

module.exports = router;
