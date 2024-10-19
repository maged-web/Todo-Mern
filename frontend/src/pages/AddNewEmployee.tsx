import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewEmployee } from '../redux/slices/employeeSlice';
import { selectLoading, selectError } from '../redux/slices/employeeSlice';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../redux/store'; 
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
export default function AddEmployeeForm() {
  const [name, setName] = useState<string>('');
  const dispatch = useDispatch();
  
  const loading = useSelector((state: RootState) => selectLoading(state));
  const error = useSelector((state: RootState) => selectError(state));
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name) {
      await dispatch(addNewEmployee({ name }));
      setName('');
      navigate('/home'); 
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Add New Employee</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Enter employee name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Button
          type="submit"
          disabled={loading}
          className={`w-full p-2 text-white rounded ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Adding...' : 'Add Employee'}
        </Button>
      </form>
      {error && <p className="text-red-500 mt-2 text-center">Error: {error}</p>}
    </div>
  );
}
