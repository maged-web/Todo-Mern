import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTask, selectTasksByEmployee, fetchTasks } from '../redux/slices/taskSlice';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
const API_URL = import.meta.env.VITE_API_BASE_URL; 


interface Task {
  _id: string;
  employeeId: string;
  description: string;
  from: string;
  to: string;
}

const EditTask: React.FC = () => {
  const { employeeId, taskId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task>({ _id: '', employeeId: '', description: '', from: '', to: '' });
  const [alertVisible, setAlertVisible] = useState<boolean>(false); 
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [alertMessage, setAlertMessage] = useState<string>(''); 

  useEffect(() => {
    if (employeeId) {
      dispatch(fetchTasks(employeeId));
    }
  }, [dispatch, employeeId]);

  const tasks = useSelector((state: { tasks: { tasksByEmployee: { [key: string]: Task[] } } }) =>
    selectTasksByEmployee(state, employeeId)
  );

  useEffect(() => {
    const foundTask = tasks?.find(t => t._id === taskId);
    if (foundTask) {
      const fromDate = new Date(foundTask.from);
      setTask({
        ...foundTask,
        from: format(new Date(foundTask.from), 'yyyy-MM-dd\'T\'HH:mm'),
        to: format(new Date(foundTask.to), 'yyyy-MM-dd\'T\'HH:mm'),
      });
      setDate(fromDate.toISOString().split('T')[0]);
    }
  }, [taskId, tasks]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const updatedTask = {
      description: task.description,
      from: new Date(task.from).toISOString(),
      to: new Date(task.to).toISOString(),
    };
  
    try {
      const currentDate = new Date().getTime();
      if (new Date(updatedTask.from).getTime() < currentDate || new Date(updatedTask.to).getTime() < currentDate) {
        setAlertMessage('The "from" or "to" date cannot be in the past.');
        setAlertVisible(true);
        return;
      }
      if (new Date(updatedTask.from).getTime() > new Date(updatedTask.to).getTime()) {
        setAlertMessage('The "from" date cannot be later than the "to" date.');
        setAlertVisible(true);
        return;
      }
  
      const oldTask = tasks?.find(t => t._id === taskId);
      const oldTaskDuration = oldTask ? (new Date(oldTask.to).getTime() - new Date(oldTask.from).getTime()) / (1000 * 60 * 60) : 0;
      
      const updatedTaskDate = new Date(updatedTask.from).toISOString().split('T')[0];
      const updatedTaskDuration = (new Date(updatedTask.to).getTime() - new Date(updatedTask.from).getTime()) / (1000 * 60 * 60);
  
      if (updatedTaskDate !== date) {
        const newDaySummaryResponse = await axios.get(`${API_URL}/daily-summary/${employeeId}/${updatedTaskDate}`);
        const remainingHours: number = newDaySummaryResponse.data.remainingHours;
        console.log(remainingHours)

        if (remainingHours < updatedTaskDuration) {
          setAlertMessage(`Not enough hours remaining for the selected day. Remaining: ${remainingHours} hours.`);
          setAlertVisible(true);
          return;
        }
        
        await dispatch(updateTask({ taskId, updatedTask }));
        console.log("Task updated successfully:", { taskId, updatedTask });
        navigate('/');
        return;
      }
  
      const summaryResponse = await axios.get(`${API_URL}/daily-summary/${employeeId}/${date}`);
      let remainingHours: number = summaryResponse.data.remainingHours;
      console.log(remainingHours)
      remainingHours += oldTaskDuration; 
      console.log(remainingHours)

      if (remainingHours < updatedTaskDuration) {
        setAlertMessage(`Not enough hours remaining for today. Remaining: ${remainingHours} hours.`);
        setAlertVisible(true);
        return;
      }
  
      await dispatch(updateTask({ taskId, updatedTask }));
      console.log("Task updated successfully:", { taskId, updatedTask });
      navigate('/');
  
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };
  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-semibold text-center mb-6">Edit Task</h1>

      {alertVisible && (
        <Alert className='mb-4'>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label htmlFor="description" className="block font-medium">Task Description</label>
          <textarea
            className="border border-gray-300 rounded-md p-2 w-full h-24 focus:outline-none focus:ring focus:ring-blue-300"
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="from" className="block font-medium">From</label>
          <input
            type="datetime-local"
            id="from"
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring focus:ring-blue-300"
            value={task.from}
            onChange={(e) => {
              setTask({ ...task, from: e.target.value });
              /* setDate(e.target.value.split('T')[0]); */
            }}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="to" className="block font-medium">To</label>
          <input
            type="datetime-local"
            id="to"
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring focus:ring-blue-300"
            value={task.to}
            onChange={(e) => setTask({ ...task, to: e.target.value })}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
        >
          Update Task
        </button>
      </form>
    </div>
  );
};

export default EditTask;
