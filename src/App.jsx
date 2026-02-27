import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Matches from "./pages/Matches";
import TeamBuilder from "./pages/TeamBuilder";
import GraphView from "./pages/GraphView";
import Profile from "./pages/Profile";
import ProjectRoom from "./pages/ProjectRoom";
import ProtectedRoute from "./components/ProtectedRoute";
import { logout } from "./services/authService";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-[#f7f7f7] text-slate-500 font-bold text-xl">Loading System...</div>;
  }

  return (
    <Router>
      <div className="flex flex-col h-screen bg-[#f7f7f7] text-slate-900 font-sans selection:bg-pink-300 selection:text-slate-900 overflow-hidden">
        {user && <Navbar handleLogout={handleLogout} />}

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent">
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />

            <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
            <Route path="/matches" element={<ProtectedRoute user={user}><Matches /></ProtectedRoute>} />
            <Route path="/team-builder" element={<ProtectedRoute user={user}><TeamBuilder /></ProtectedRoute>} />
            <Route path="/graph" element={<ProtectedRoute user={user}><GraphView /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute user={user}><Profile /></ProtectedRoute>} />
            <Route path="/room/:id" element={<ProtectedRoute user={user}><ProjectRoom /></ProtectedRoute>} />

            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
