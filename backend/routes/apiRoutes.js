const express = require('express');
const router = express.Router();
const telemetryController = require('../controllers/telemetryController');

router.get('/telemetry/latest', telemetryController.getLatestTelemetry);
router.post('/telemetry', telemetryController.ingestSensorData);

module.exports = router;