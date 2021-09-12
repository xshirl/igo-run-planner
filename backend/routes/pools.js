var express = require('express');
const PooledController = require('../controllers/PooledController');

var router = express.Router();

router.get('/pools', PooledController.getPooledRuns);

module.exports = router;
