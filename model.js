const mongoose = require('mongoose');

const systemInfoSchema = new mongoose.Schema({
  timestamp: Number,
  cpu_usage: Number,
  gpu_usage: String,
  gpu_energy: String,
  memory_usage: Number,
  disk_usage: Number,
  network_usage_sent: Number,
  network_usage_recv: Number
}, { timestamps: true });

// Explicitly setting the collection name to 'monitor-data'
module.exports = mongoose.model('SystemInfo', systemInfoSchema, 'monitor-data');
