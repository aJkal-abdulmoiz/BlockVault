// routes/files.js
const express = require('express');
const router = express.Router();
const { uploadFile , getFiles ,updateFileWithId ,deleteFileWithId } = require('../controllers/fileController');
const auth = require('../middlewares/auth');

router.post('/upload',auth,uploadFile);
router.get('/getfiles', auth,getFiles);
router.post('/savefileid',updateFileWithId);
router.post('/deletefile',deleteFileWithId);

module.exports = router;
