const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const Habit = require("./Models/habits");
const HabitRecord = require("./Models/habitRecord");

require('dotenv').config();

const mongoDBConnectionString = process.env.CONNECTION_STRING;

mongoose.connect(mongoDBConnectionString);

app.use(cors());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

app.post("/habits/add", (req, res)=> {
    const habit = new Habit({
        name: req.body.habit
    });
    habit.save()
    .then(savedHabit => {
        console.log('Habit saved successfully:', savedHabit);
    })
    .catch(error => {
        console.error('Error saving habit:', error);
    })

    res.json({"message": "Habit Added"});

})

app.get('/habits/all', async (req, res) => {
    try {
      // Retrieve all habits from the database
      const habits = await Habit.find();
      
      // Send the habits as a JSON response
      res.status(200).json(habits);
    } catch (error) {
      console.error('Error retrieving habits:', error);
      res.status(500).send('Internal Server Error');
    }
  });


  app.post('/habits/delete', async (req, res) => {
    try {
      const habitId = req.body.habitId;
  
      // Check if habitId is provided in the request body
      if (!habitId) {
        return res.status(400).json({ message: 'Habit ID is required in the request body' });
      }
  
      // Call the custom deleteById method on the Habit model
      const deletionResult = await Habit.deleteOne({_id: habitId});
  
      // Check if the habit was found and deleted
      if (deletionResult.deletedCount === 1) {
        res.status(200).json({ message: 'Habit deleted successfully' });
      } else {
        res.status(404).json({ message: 'Habit not found' });
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
      res.status(500).send('Internal Server Error');
    }
  });


  app.get('/habits/records/:habitId', async (req, res) => {
    try {
      const habitId = req.params.habitId;
  
      // Use the find method to get all records with the specified habitId
      const records = await HabitRecord.find({ habitId });
  
      res.status(200).json(records);
    } catch (error) {
      console.error('Error fetching records:', error);
      res.status(500).send('Internal Server Error');
    }
  });


  app.post('/habits/record/add', async (req, res) => {
    try {
      const { habitId, date, status } = req.body;
  
      // Check if habitId is valid by searching for the habit
      const habitExists = await Habit.findById(habitId);
      if (!habitExists) {
        return res.status(404).json({ message: 'Habit not found' });
      }
  
      // Check if a record with the same habitId and date already exists
      const existingRecord = await HabitRecord.findOne({ habitId, date });
      console.log(existingRecord);
      if (existingRecord) {
        // Update the status if the record already exists
        existingRecord.status = status;
        const updatedRecord = await HabitRecord.updateOne({habitId: habitId, date: date}, {status: status});
        res.status(200).json(updatedRecord);
      } else {
        // Create a new record if it doesn't exist
        const newRecord = new HabitRecord({
          habitId,
          date,
          status,
        });
        const savedRecord = await newRecord.save();
        res.status(201).json(savedRecord);
      }
    } catch (error) {
      console.error('Error adding or updating habit record:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  


app.get("/", (req, res)=>{
    res.send("Hello World");
});

app.listen(5000, ()=>{
    console.log("app listening on port 5000");
});


