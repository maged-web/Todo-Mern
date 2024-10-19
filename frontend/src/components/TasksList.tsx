import { format } from 'date-fns';
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, deleteTask, selectTasksByEmployee, selectLoadingByEmployee, selectErrorByEmployee } from "../redux/slices/taskSlice";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { Button } from '@/components/ui/button';
const API_URL = import.meta.env.VITE_API_BASE_URL; 

interface Task {
  _id: string;
  employeeId: string;
  description: string;
  from: string;
  to: string;
}

interface Employee {
  id: string;
  name: string;
}

interface TasksListProps {
  employeeId: string;
}

export default function TasksList({ employeeId }: TasksListProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [summary, setSummary] = useState<{ totalHours: number; remainingHours: number } | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); 

  const tasks = useSelector((state) => selectTasksByEmployee(state, employeeId));
  const loading = useSelector((state) => selectLoadingByEmployee(state, employeeId));
  const error = useSelector((state) => selectErrorByEmployee(state, employeeId));

  useEffect(() => {
    dispatch(fetchTasks(employeeId));
    const fetchEmployeeDetails = async () => {
      const response = await axios.get(`${API_URL}/employees/${employeeId}`);
      setEmployee(response.data);
    };

    const fetchDailySummary = async () => {
      try {
        const response = await axios.get(`${API_URL}/daily-summary/${employeeId}/${date}`);
        console.log(response)
        setSummary({
          totalHours: response.data.totalHours,
          remainingHours: response.data.remainingHours,
        });
      } catch (error) {
        console.error(`Failed to fetch daily summary for employee ${employeeId}:`, error);
      }
    };

    fetchEmployeeDetails();
    fetchDailySummary();
  }, [dispatch, employeeId, date]);

  const handleDelete = async (taskId: string) => {
    try {
      await dispatch(deleteTask(taskId));
      const response = await axios.get(`${API_URL}/daily-summary/${employeeId}/${date}`);
      setSummary({
        totalHours: response.data.totalHours,
        remainingHours: response.data.remainingHours,
      });
    } catch (error) {
      console.error(`Failed to delete task ${taskId}:`, error);
    }
  };

  const handleNavigate = (taskId: string) => {
    navigate(`/editTask/${employeeId}/${taskId}`);
  };

  if (loading) return <p className="text-center text-gray-500">Loading ...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Tasks List for {employee?.name}</h1>

      <div className="mb-6">
        <label htmlFor="date" className="block font-semibold text-gray-700 mb-2">Select Date:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {summary && (
  <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm">
    <p className="font-semibold text-gray-700">
      Total Hours: {(summary.totalHours || 0).toFixed(1)}
    </p>
    <p className="font-semibold text-gray-700">
      Remaining Hours: {(summary.remainingHours || 0).toFixed(1)}
    </p>
  </div>
)}

      <ul className="space-y-4 ">
        {tasks.map((task) => (
          <li key={task._id} className="border border-gray-200 p-4 rounded-lg shadow-md bg-white">
            <div className="mb-2">
              <strong className="block text-gray-700">Description:</strong> {task.description}
            </div>
            <div className="mb-2">
              <strong className="block text-gray-700">From:</strong> {format(new Date(task.from), 'PPpp')}
            </div>
            <div className="mb-4">
              <strong className="block text-gray-700">To:</strong> {format(new Date(task.to), 'PPpp')}
            </div>
            <div className="flex space-x-2 flex justify-center ">
              <Button
                onClick={() => handleNavigate(task._id)}
                className="bg-blue-500 text-white py-1 px-3  rounded-lg hover:bg-blue-400 transition duration-300"
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(task._id)}
                className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-400 transition duration-300"
              >
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
