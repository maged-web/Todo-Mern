import { configureStore } from '@reduxjs/toolkit'
import tasksReducer from './slices/taskSlice'
import employeesReducer from './slices/employeeSlice'

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    employees: employeesReducer,

  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch