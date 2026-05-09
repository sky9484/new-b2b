/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { TransfersPage } from './components/TransfersPage';
import { RecipientsPage } from './components/RecipientsPage';
import { SettingsPage } from './components/SettingsPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<AuthPage mode="signin" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/forgot-password" element={<AuthPage mode="forgot" />} />
        <Route path="/dashboard" element={
          <Layout>
            <Dashboard />
          </Layout>
        } />
        <Route path="/transfers" element={
          <Layout>
            <TransfersPage />
          </Layout>
        } />
        <Route path="/recipients" element={
          <Layout>
            <RecipientsPage />
          </Layout>
        } />
        <Route path="/settings" element={
          <Layout>
            <SettingsPage />
          </Layout>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
