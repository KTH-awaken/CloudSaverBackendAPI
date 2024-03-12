const mongoose = require('mongoose');

// const systemInfoSchema = new mongoose.Schema({
//   timestamp: Number,
//   cpu_usage: Number,
//   gpu_usage: String,
//   gpu_energy: String,
//   memory_usage: Number,
//   disk_usage: Number,
//   network_usage_sent: Number,
//   network_usage_recv: Number
// }, { timestamps: true });



// // Explicitly setting the collection name to 'monitor-data'
// module.exports = mongoose.model('SystemInfo', systemInfoSchema, 'monitor-data');



const systemInfoSchema = new mongoose.Schema({
  _id: String,
  resource_name: String,
  pod_name: String,
  namespace: String,
  custom_name: String,
  usage: [{
    cpu_usage: String,
    memory_usage: String,
    timestamp: Number,
    cpu_percentage: Number,
    energy_consumption: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('SystemInfo', systemInfoSchema, 'pod-usage');
