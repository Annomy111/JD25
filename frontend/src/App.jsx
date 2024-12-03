import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

// Importiere alle benötigten Komponenten
import AsanaIntegration from './components/AsanaIntegration';
import SocialMediaSharing from './components/SocialMediaSharing';
import Termine from './pages/Termine';
import Chat from './pages/Chat';
import TuerZuTuer from './pages/TuerZuTuer';
import MeineAktivitaeten from './pages/MeineAktivitaeten';
import Schulungen from './pages/Schulungen';
import Volunteers from './pages/Volunteers';
import Statistiken from './pages/Statistiken';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

// Layout component
const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Protected routes - Common */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/termine" element={
          <ProtectedRoute>
            <Layout>
              <Termine />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/chat" element={
          <ProtectedRoute>
            <Layout>
              <Chat />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/tuer-zu-tuer" element={
          <ProtectedRoute>
            <Layout>
              <TuerZuTuer />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/meine-aktivitaeten" element={
          <ProtectedRoute>
            <Layout>
              <MeineAktivitaeten />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/schulungen" element={
          <ProtectedRoute>
            <Layout>
              <Schulungen />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Protected routes - Admin Only */}
        <Route path="/volunteers" element={
          <ProtectedRoute adminOnly={true}>
            <Layout>
              <Volunteers />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/statistiken" element={
          <ProtectedRoute adminOnly={true}>
            <Layout>
              <Statistiken />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/asana" element={
          <ProtectedRoute adminOnly={true}>
            <Layout>
              <AsanaIntegration />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;