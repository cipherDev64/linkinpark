import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";

import Sidebar from "./components/Sidebar";
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

function AnimatedRoutes({ user }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <PageWrapper><Login /></PageWrapper>} />

        <Route path="/dashboard" element={<ProtectedRoute user={user}><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>} />
        <Route path="/matches" element={<ProtectedRoute user={user}><PageWrapper><Matches /></PageWrapper></ProtectedRoute>} />
        <Route path="/team-builder" element={<ProtectedRoute user={user}><PageWrapper><TeamBuilder /></PageWrapper></ProtectedRoute>} />
        <Route path="/graph" element={<ProtectedRoute user={user}><PageWrapper><GraphView /></PageWrapper></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute user={user}><PageWrapper><Profile /></PageWrapper></ProtectedRoute>} />
        <Route path="/room/:id" element={<ProtectedRoute user={user}><PageWrapper><ProjectRoom /></PageWrapper></ProtectedRoute>} />

        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
}

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
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-bg gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-primary font-bold animate-pulse">Initializing Network...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex h-screen bg-bg text-body font-sans selection:bg-primary/20 selection:text-primary overflow-hidden">
        <Toaster position="top-right" toastOptions={{
          className: 'font-sans font-semibold rounded-2xl shadow-premium border-none',
          duration: 4000,
          style: {
            background: '#FFFFFF',
            color: '#0F172A',
          }
        }} />

        {/* Decorative Background Elements */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full animate-float" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[100px] rounded-full animate-float" style={{ animationDelay: '-3s' }} />
        </div>

        {user && <Sidebar handleLogout={handleLogout} />}

        <main className={`flex-1 overflow-y-auto custom-scrollbar relative ${user ? 'md:ml-0' : ''}`}>
          {user && <Navbar handleLogout={handleLogout} />}
          <div className="max-w-7xl mx-auto p-6 md:p-10">
            <AnimatedRoutes user={user} />
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
