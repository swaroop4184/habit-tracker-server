const mongoose = require('mongoose');

const habitRecordSchema = new mongoose.Schema({
  habitId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming you have a separate Habit model
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['done', 'notDone', 'pending'],
    required: true,
  },
});

const HabitRecord = mongoose.model('HabitRecord', habitRecordSchema);

module.exports = HabitRecord;
