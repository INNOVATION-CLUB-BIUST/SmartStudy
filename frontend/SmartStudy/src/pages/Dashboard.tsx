import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../components/Dashboard/Home';
import Schedule from '../components/Dashboard/Schedule';
import UpcomingTasks from '../components/Dashboard/UpcomingTasks';
import Goals from '../components/Dashboard/Goals';
import GroupStudy from '../components/Dashboard/GroupStudy';

const Dashboard = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/tasks" element={<UpcomingTasks />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/study-groups" element={<GroupStudy />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
};

export default Dashboard;
