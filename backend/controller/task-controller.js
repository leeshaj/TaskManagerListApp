const Task = require('../model/Task');



const createTask = async (req, res) => {
    const {list, status} = req.body;
    console.log(list, status, req.body);
    

    if(list == undefined || status == undefined){
      return res.status(402).json({ error: 'Both Name and Status must be provided' });
    }

    if(list ==="" || status === ""){
      return res.status(402).json({ error: 'Both Name and Status must be provided ' });
    }
  
    

    const existingTask = await Task.findOne({list});

    if (existingTask){
        return res.status(400).json({ error: 'Task already exist' });
    }

    try {
    const task = new Task({list, status});
    await task.save();
    res.json(task);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating task' }); 
    }
};
const deleteTask = async (req, res) => {
    const taskId = req.params.id;
    console.log(taskId);
  if(taskId == '' || taskId == null){
    return res.status(403).json({ error: 'Task Id required' });
  }
  else{
    try {
      
      const task = await Task.findById(taskId);
  
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
     
      if (task.status) {
        return res.status(403).json({ error: 'Task is disabled, cannot delete' });
      }
  
      
      await Task.findByIdAndDelete(taskId);
      return res.json({ message: 'Deleted Successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting task' });
    }
  }
    
  };

const updateTaskStatus = async (req, res) => {
    const taskId = req.params.id;
    if(taskId == '' || taskId == null){
      return res.status(403).json({ error: 'Task Id required' });
    }
    try {
      const task = await Task.findById(taskId);
  
      if (!task) {
        return res.status(404).json({ error: 'Task not Found' });
      }
  
      task.status = !task.status; // Toggle the status
      await task.save();
  
      return res.json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error Updating task' });
    }
  };

exports.createTask = createTask;
exports.deleteTask = deleteTask;
exports.updateTaskStatus = updateTaskStatus;

