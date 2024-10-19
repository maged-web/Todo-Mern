import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createTask } from '../redux/slices/taskSlice';
import { fetchEmployees, selectEmployees } from '../redux/slices/employeeSlice';
import { RootState } from '../redux/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { validateDates, calculateDuration, fetchTotalHours } from '../utils/taskUtils';

interface NewTask {
    employeeId: string;
    description: string;
    from: string;
    to: string;
}

export default function AddNewTask() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const employees = useSelector((state: RootState) => selectEmployees(state));

    const [description, setDescription] = useState<string>('');
    const [from, setFrom] = useState<string>('');
    const [to, setTo] = useState<string>('');
    const [employeeId, setEmployeeId] = useState<string>('');
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [alertVisible, setAlertVisible] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');

    useEffect(() => {
        dispatch(fetchEmployees());
    }, [dispatch]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newTask: NewTask = {
            employeeId,
            description,
            from: new Date(from).toISOString(),
            to: new Date(to).toISOString(),
        };

        const validationError = validateDates(newTask.from, newTask.to);
        if (validationError) {
            setAlertMessage(validationError);
            setAlertVisible(true);
            return;
        }

        try {
            const totalHours = await fetchTotalHours(employeeId, date);
            const taskDuration = calculateDuration(newTask.from, newTask.to);

            if (totalHours + taskDuration > 8) {
                setAlertMessage('Total hours for the day exceed 8 hours.');
                setAlertVisible(true);
                return;
            }

            await dispatch(createTask(newTask));
            navigate('/'); // Navigate after successful task creation
        } catch (error) {
            console.error("Failed to create task:", error);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Add New Task</h2>

            {alertVisible && (
                <Alert className='mb-4'>
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Heads up!</AlertTitle>
                    <AlertDescription>{alertMessage}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-lg font-medium mb-1">Employee:</label>
                    <select
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                        required
                    >
                        <option value="" disabled>Select an employee</option>
                        {employees.map((employee) => (
                            <option key={employee._id} value={employee._id}>
                                {employee.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-lg font-medium mb-1">Description:</label>
                    <Input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                        required
                    />
                </div>

                <div>
                    <label className="block text-lg font-medium mb-1">From:</label>
                    <Input
                        type="datetime-local"
                        value={from}
                        onChange={(e) => {
                            setFrom(e.target.value);
                            setDate(e.target.value);
                        }}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                        required
                    />
                </div>

                <div>
                    <label className="block text-lg font-medium mb-1">To:</label>
                    <Input
                        type="datetime-local"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                        required
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                >
                    Create Task
                </Button>
            </form>
        </div>
    );
}
