const SensorLog = require('../models/SensorLog');

exports.getLatestTelemetry = async (req, res) => {
  try {
    const latest = await SensorLog.findOne().sort({ timestamp: -1 });
    res.json(latest || { moisture: 42, temperature: 29, valveStatus: 'OFF' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.ingestSensorData = async (req, res) => {
  try {
    const { fieldId, moisture, temperature, npk, rainfall_forecast_mm = 0 } = req.body;

    let valveStatus = 'OFF';
    let recommendedLiters = 0;

    // Call Python FastAPI service on port 8000
    try {
      const aiRes = await fetch('http://127.0.0.1:8000/predict-irrigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moisture, temperature, rainfall_forecast_mm })
      });
      const aiData = await aiRes.json();

      valveStatus = aiData.irrigate ? 'ON' : 'OFF';
      recommendedLiters = aiData.recommended_liters || 0;
    } catch (aiErr) {
      console.error('AI service unreachable, using fallback rule:', aiErr.message);
      valveStatus = moisture < 30 ? 'ON' : 'OFF';
    }

    const log = await SensorLog.create({
      fieldId,
      moisture,
      temperature,
      npk,
      valveStatus,
      recommendedLiters
    });

    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};