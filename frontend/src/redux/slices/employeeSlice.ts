import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_BASE_URL; 

interface Employee{
    _id:string,
    name:string
}

interface EmployeesState {
    employees: Employee[];
    loading: boolean;
    error: string | null;
}
const initialState : EmployeesState = {
    employees:[],
    loading: false,
    error: null,
}

export const fetchEmployees = createAsyncThunk(
    'employees/fetchEmployees',
    async () => {
    const response = await axios.get(`${API_URL}/employees/`);
    return response.data;
    }
);
export const addNewEmployee = createAsyncThunk(
    'employees/addNewEmployee',
    async (employeeData: { name: string }) => {
        const response = await axios.post(`${API_URL}/employees/`, employeeData);
        return response.data;
    }
    );


const employeesSlice=createSlice({
    name:'employees',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchEmployees.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchEmployees.fulfilled, (state, action) => {
            state.loading = false;
            state.employees = action.payload; 
        })
        .addCase(fetchEmployees.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch employees'; 
        })
        .addCase(addNewEmployee.pending, (state) => {
            state.loading = true;
            state.error = null;
            })
            .addCase(addNewEmployee.fulfilled, (state, action) => {
            state.loading = false;
            state.employees.push(action.payload); 
            })
            .addCase(addNewEmployee.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to add employee';
            });
        
    },  
})

export const selectEmployees = (state: { employees: EmployeesState }) => state.employees.employees;
export const selectLoading = (state: { employees: EmployeesState }) => state.employees.loading;
export const selectError = (state: { employees: EmployeesState }) => state.employees.error;

export default employeesSlice.reducer;