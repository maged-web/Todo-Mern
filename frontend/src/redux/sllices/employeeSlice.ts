import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchEmployees=createAsyncThunk('employees/fetchEmployees',async()=>
{
    const response =await axios.get('http://localhost:5000/employees/');
    console.log(response.data)
    return response.data
})
export const addNewEmployee=createAsyncThunk('employees/addNewEmployee',async(name:string)=>
    {
        try{
        const response =await axios.post('http://localhost:5000/employees/',{name});
        console.log(response.data)
        return response.data
        }catch(err)
        {
            console.log(err)
        }
    })
    export const addNewTask = createAsyncThunk(
        'employees/addNewTask',
        async ({ employeeId, description, from, to }: { employeeId: string; description: string; from: string; to: string; }) => {
            const response = await axios.post(`http://localhost:5000/tasks`, {
                employeeId,
                description,
                from,
                to
            });
            return response.data; // Assume the API returns the created task
        }
    );
    export const deleteTask = createAsyncThunk(
        'employees/tasks/deleteTask',
        async (id: string) => {
            await axios.delete(`http://localhost:5000/tasks/${id}`);
            return id; // Return the ID of the deleted task for further processing
        }
    );
    export const updateTask = createAsyncThunk(
        'employees/tasks/updateTask',
        async ({ id, employeeId, description, from, to }: { id: string; employeeId: string; description: string; from: string; to: string }) => {
          const response = await axios.put(`http://localhost:5000/tasks/${id}`, {
            employeeId,
            description,
            from,
            to
          });
          return response.data; // Assume API returns the updated task
        }
      );
      
interface Task {
    _id: string;
    description: string;
    from: string; 
    to: string;   
  }
interface Employee{
    _id:string,
    name:string,
    tasks:Task[]
}

interface EmployeesState {
employees:Employee[],
status: 'idle' | 'loading' | 'succeeded' | 'failed';
error:string|null
}

const initialState:EmployeesState ={
    employees:[],
    status:'idle',
    error:null
}

const employeesSlice=createSlice({
    name:'employees',
    initialState,
     reducers: {
    setError(state, action) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
    extraReducers:(builder)=>
    {
        builder.addCase(fetchEmployees.pending,(state)=>
        {
            state.status='loading'
        })
        .addCase(fetchEmployees.fulfilled,(state,action)=>
        {
            state.status='succeeded',
            state.employees=action.payload
        })
        .addCase(fetchEmployees.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message ?? 'Failed to load employees';
        })
        
        builder.addCase(addNewEmployee.fulfilled,(state,action)=>
        {
            state.employees.push(action.payload)
            state.status = 'succeeded'; 
            state.error = null;  
        })
        .addCase(addNewEmployee.rejected,(state,action)=>
        {
            state.status = 'failed';
            state.error = action.error.message ?? 'Failed to add employees';

        })
        .addCase(addNewTask.fulfilled, (state, action) => {
            const employee = state.employees.find(emp => emp._id === action.payload.employeeId);
            if (employee) {
                employee.tasks.push(action.payload); // Add the new task to the employee's tasks
            }
            state.status = 'succeeded'; 
            state.error = null;  
        })
        .addCase(addNewTask.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message ?? 'Failed to add task';
        });

        builder.addCase(deleteTask.fulfilled, (state, action) => {
            const employee = state.employees.find(emp => emp.tasks.some(task => task._id === action.payload)); // Changed to _id
            if (employee) {
                employee.tasks = employee.tasks.filter(task => task._id !== action.payload); // Changed to _id
            }
            state.status = 'succeeded';
            state.error = null;
        })
    .addCase(deleteTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to delete task';
    });
    builder.addCase(updateTask.fulfilled, (state, action) => {
        const employee = state.employees.find(emp => emp._id === action.payload.employeeId);
        if (employee) {
          const taskIndex = employee.tasks.findIndex(task => task._id === action.payload._id);
          if (taskIndex !== -1) {
            employee.tasks[taskIndex] = action.payload; // Update the task in the employee's task list
          }
        }
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to update task';
      });
    }
})
export const { setError, clearError } = employeesSlice.actions;

export default employeesSlice.reducer;