import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TopicDetailsPage from './pages/TopicDetailsPage';
import { logoutUser } from './services/api'; // Import logout function

// Simple check for authentication token
const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

// Wrapper for protected routes
const ProtectedRoute = () => {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them back after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />; // Render child route component (Dashboard, TopicDetails)
};

// Simple layout component for authenticated areas
const AppLayout = () => {
  const handleLogout = () => {
      logoutUser();
      // Force redirect/reload to ensure state is cleared and user goes to login
      window.location.href = '/login';
  };

  return (
      <div className="min-h-screen flex flex-col">
          <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
              <h1 className="text-xl font-bold">Nirpeksh</h1>
              <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                  Logout
              </button>
          </header>
          <main className="flex-grow container mx-auto p-4">
              <Outlet /> {/* Nested routes render here */}
          </main>
          <footer className="bg-gray-200 text-center p-2 text-sm text-gray-600">
              Nirpeksh Hackathon Project
          </footer>
      </div>
  );
};


function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}> {/* Wrap protected pages in layout */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/topic/:topicId" element={<TopicDetailsPage />} />
            {/* Redirect root path to dashboard if authenticated */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>

      {/* Fallback for unknown routes - redirect to login or dashboard based on auth */}
      <Route path="*" element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;