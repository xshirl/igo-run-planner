var express = require('express');
const LanesController = require('../controllers/LanesController');
const PooledController = require('../controllers/PooledController');

var router = express.Router();

// router.get('/runs', RunsController.getRuns);
// router.get('/pools', PooledController.getPooledRuns);
router.get('/lanes', LanesController.getLanes);

module.exports = router;
