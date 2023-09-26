import React, { useState, useEffect } from "react";
import "./TaskList.css";
import { AiFillCheckSquare, AiFillDelete } from "react-icons/ai";

const TaskList = () => {
  const [task, setTask] = useState("");
  const [taskList, setTaskList] = useState([
    { _id: 1, list: "Task 1", status: false },
    { _id: 2, list: "Task 2", status: false },
    { _id: 3, list: "Task 3", status: false },
  ]);

  const [validationMessage, setValidationMessage] = useState("");
  const [validateMsgDelete, setValidateMsgDelete] = useState("");

  useEffect(() => {
    console.log("TaskList state has changed:", taskList);
  }, [taskList]);

  // Adding Task
  const addTask = async (event) => {
    event.preventDefault();

    const taskExists = taskList.some((item) => item.list === task);

    if (taskExists) {
      setValidationMessage("Task Already Exists! Please enter a valid Task.");
    } else if (task === "") {
      setValidationMessage("Can't add blank fields");
    } else {
      setValidationMessage("");
      try {
        const response = await fetch("http://localhost:5000/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ list: task, status: false }),
        });

        if (response.ok) {
          const responseJson = await response.json();
          setTaskList([...taskList, responseJson]);
          setTask("");
        } else {
          const errorResponse = await response.json();
          if (
            response.status === 400 &&
            errorResponse.error === "Task already exist"
          ) {
            setValidationMessage(
              "Task Already Exists in database! Please enter a valid Task."
            );
          } else if (
            response.status === 500 &&
            errorResponse.error === "Error creating task"
          ) {
            setValidationMessage("Something went wrong, can't add task");
          } else {
            setValidationMessage("An unknown error occurred");
          }
        }
      } catch (error) {
        console.error("Error adding task:", error);
        setValidationMessage("An unknown error occurred");
      }
    }
  };

  // Deleting Task
  const OnDelete = async (id, status) => {
    // Check if the task is disabled
    if (status) {
      setValidateMsgDelete("Cannot delete a disabled task.");
      return;
    }

    try {
      setValidateMsgDelete("")
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
      });

      setTaskList(taskList.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Completing Task
  
  // Completing Task
const OnComplete = async (id, status) => {
  try {
    const url = `http://localhost:5000/api/tasks/${id}`;
    const method = "PUT"; 
    
    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: !status }),
    });

    
    setTaskList((prevTaskList) => {
      return prevTaskList.map((task) => {
        if (task._id === id) {
          return { ...task, status: !status };
        }
        return task;
      });
    });
  } catch (error) {
    console.error("Error Updating task:", error);
  }
};

  
  return (
    <div className="container">
      <h1>Task Manager List</h1>
      <form className="form-group" onSubmit={addTask}>
        <input
          type="text"
          value={task}
          placeholder="Enter your Task"
          className="form-control"
          onChange={(event) => setTask(event.target.value)}
        />
        <button>ADD</button>
      </form>
      <div className="validation-message">{validationMessage}</div>
      <div className="list">
        <ul>
          {taskList.map((task) => (
            <li className="list-items" key={task._id}>
              <div
                className={`list-item-list ${task.status ? "completed" : ""}`}
              >
                {task.list}
                <span>
                  <AiFillCheckSquare
                    className="list-item-icon"
                    title="Complete"
                    id="complete"
                    onClick={() => OnComplete(task._id, task.status)}
                  />
                  <AiFillDelete
                    className="list-item-icon"
                    title="Delete"
                    id="delete"
                    onClick={() => OnDelete(task._id, task.status)}
                  />
                </span>
              </div>
              {task.status && (
              <div className="validate-del-msg">{validateMsgDelete}</div>
            )}
            </li>
            
          ))}
          
        </ul>
      </div>
    </div>
  );
};

export default TaskList;
