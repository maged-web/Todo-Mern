import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AppLayout from "./components/AppLayout";
import AddNewTask from "./pages/AddNewTask";
import EditTask from "./pages/EditTask";
import AddNewEmployee from "./pages/AddNewEmployee";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element ={<AppLayout/>}>
        <Route index element={<Navigate replace to='/home'/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/newTask" element={<AddNewTask/>}/>
      <Route path="/editTask/:employeeId/:taskId" element={<EditTask />} />
      <Route path="/newEmployee" element={<AddNewEmployee/>}/>
      </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App
