const express = require('express');
const router = express.Router();
const Sauce = require('../models/Sauce');
const sauceCtrl = require('../controllers/sauce.js')
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id',auth, multer, sauceCtrl.modifySauce);
router.get('/:id', sauceCtrl.findOneSauce);
router.delete('/:id',auth, sauceCtrl.deleteSauce);
router.get('/' , sauceCtrl.findAllSauces);

module.exports = router;
