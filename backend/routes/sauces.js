const express = require('express');
const router = express.Router();

const auth = require('../config/auth');
const multer = require('../config/multer_config');

const saucesCtrl = require('../controllers/sauces');

router.post('/', auth, multer, saucesCtrl.createSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.get('/', auth, saucesCtrl.getAllSauce);
router.post('/:id/like', auth, saucesCtrl.likeSauce);

module.exports = router;