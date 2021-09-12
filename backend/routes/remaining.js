var express = require('express');
const RemainingController = require('../controllers/RemainingController');

var router = express.Router();

router.get('/rem', RemainingController.getRemaining);

module.exports = router;
