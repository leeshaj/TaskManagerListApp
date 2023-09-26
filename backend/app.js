const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const taskController = require('./controller/task-controller');

const app = express();

const url = 'mongodb+srv://task-list:Tasklist123@cluster0.hkszzdx.mongodb.net/tasklist?retryWrites=true&w=majority';


app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
  next();
});


app.post('/api/tasks', taskController.createTask);
app.delete('/api/tasks/:id?', taskController.deleteTask);
app.put('/api/tasks/:id?', taskController.updateTaskStatus);


mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(5000, () => {
      console.log('Server is running on port 5000');
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));


