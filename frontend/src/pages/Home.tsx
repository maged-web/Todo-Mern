import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchEmployees, selectEmployees, selectLoading, selectError } from '../redux/slices/employeeSlice';
import { useEffect } from 'react';
import TasksList from '../components/TasksList';
import { RootState } from '../redux/store'; 
import { Button } from '@/components/ui/button';
import Spinner from '@/components/Spinner';

export default function Home() {
  const dispatch = useDispatch();
  
  const employees = useSelector((state: RootState) => selectEmployees(state));
  const loading = useSelector((state: RootState) => selectLoading(state));
  const error = useSelector((state: RootState) => selectError(state));

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  if (loading) return <Spinner/>
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        Daily Tasks Report
      </h1>
      <div className="flex justify-center space-x-4 mb-6">
        <Link to="/newEmployee">
          <Button className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-500 transition duration-300">
            Add New Employee
          </Button>
        </Link>
        <Link to="/newTask">
          <Button className="bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-500 transition duration-300">
            Create New Task
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <ul className="space-y-4">
          {employees.map((employee) => (
            <li key={employee._id} className="border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                {employee.name}
              </h2>

              <TasksList employeeId={employee._id} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
