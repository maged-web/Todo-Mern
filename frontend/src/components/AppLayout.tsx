import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white text-center py-6 shadow-md">
        <h1 className="text-3xl font-bold">Welcome to the To-Do App</h1>
      </header>

      <main className="flex-grow container mx-auto p-6">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white text-center py-4">
        <p className="text-sm">&copy; {new Date().getFullYear()} All Rights Reserved</p>
      </footer>
    </div>
  );
}
