import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './layouts/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { WelcomePage } from './pages/WelcomePage';
import { MessagesPage } from './pages/MessagesPage';
import { ConnectionsPage } from './pages/ConnectionsPage';
import { ConnectionPage } from './pages/ConnectionPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AppLayout />}>
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/connections" element={<ConnectionsPage />} />
            <Route path="/connections/:id" element={<ConnectionPage />} />
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;