import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL; 

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (employeeId: string) => {
    const response = await axios.get(`${API_URL}/tasks/employee/${employeeId}`);
    return { employeeId, tasks: response.data };
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: string) => {
    await axios.delete(`${API_URL}/tasks/${taskId}`);
    return taskId;
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ taskId, updatedTask }: { taskId: string; updatedTask: Task }) => {
    const response = await axios.put(`${API_URL}/tasks/${taskId}`, updatedTask);
    return response.data;
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (newTask: Task) => {
    const response = await axios.post(`${API_URL}/tasks`, newTask);
    return response.data;
  }
);

interface Task {
  _id: string;
  employeeId: string;
  description: string;
  from: string;
  to: string;
}

interface TasksState {
  tasksByEmployee: { [employeeId: string]: Task[] };
  loadingByEmployee: { [employeeId: string]: boolean };
  errorByEmployee: { [employeeId: string]: string | null };
}

const initialState: TasksState = {
  tasksByEmployee: {},
  loadingByEmployee: {},
  errorByEmployee: {},
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state, action) => {
        state.loadingByEmployee[action.meta.arg] = true;
        state.errorByEmployee[action.meta.arg] = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<{ employeeId: string; tasks: Task[] }>) => {
        const { employeeId, tasks } = action.payload;
        state.loadingByEmployee[employeeId] = false;
        state.tasksByEmployee[employeeId] = tasks;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        const employeeId = action.meta.arg;
        state.loadingByEmployee[employeeId] = false;
        state.errorByEmployee[employeeId] = action.error.message || "Failed to fetch tasks";
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        const taskId = action.payload;
        for (const employeeId in state.tasksByEmployee) {
          state.tasksByEmployee[employeeId] = state.tasksByEmployee[employeeId].filter(
            (task) => task._id !== taskId
          );
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.errorByEmployee = action.error.message || "Failed to delete task";
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const updatedTask = action.payload;
        for (const employeeId in state.tasksByEmployee) {
          const taskIndex = state.tasksByEmployee[employeeId].findIndex((task) => task._id === updatedTask._id);
          if (taskIndex !== -1) {
            state.tasksByEmployee[employeeId][taskIndex] = updatedTask;
          }
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.errorByEmployee = action.error.message || "Failed to update task";
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const task = action.payload;
        if (!state.tasksByEmployee[task.employeeId]) {
          state.tasksByEmployee[task.employeeId] = [];
        }
        state.tasksByEmployee[task.employeeId].push(task);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.errorByEmployee = action.error.message || "Failed to create task";
      });
  },
});

export const selectTasksByEmployee = (state: { tasks: TasksState }, employeeId: string) =>
  state.tasks.tasksByEmployee[employeeId] || [];

export const selectLoadingByEmployee = (state: { tasks: TasksState }, employeeId: string) =>
  state.tasks.loadingByEmployee[employeeId] || false;

export const selectErrorByEmployee = (state: { tasks: TasksState }, employeeId: string) =>
  state.tasks.errorByEmployee[employeeId] || null;

export default tasksSlice.reducer;
