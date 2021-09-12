var express = require('express');
const RunsController = require('../controllers/RunsController');
const PooledController = require('../controllers/PooledController');

var router = express.Router();

router.get('/runs', RunsController.getRuns);
// router.get('/pools', PooledController.getPooledRuns);

module.exports = router;
