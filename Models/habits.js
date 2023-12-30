const mongoose = require('mongoose');
// The Schema
const habitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

// the Habit model
const Habit = mongoose.model('Habit', habitSchema);

module.exports = Habit;
