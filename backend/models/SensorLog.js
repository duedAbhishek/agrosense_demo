const mongoose = require('mongoose');

const sensorLogSchema = new mongoose.Schema({
  fieldId: { type: String, required: true, default: 'ZONE-A1' },
  moisture: { type: Number, required: true },
  temperature: { type: Number, required: true },
  npk: { n: Number, p: Number, k: Number },
  valveStatus: { type: String, enum: ['ON', 'OFF'], default: 'OFF' },
  recommendedLiters: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SensorLog', sensorLogSchema);