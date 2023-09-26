const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  list: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model('Task', taskSchema);