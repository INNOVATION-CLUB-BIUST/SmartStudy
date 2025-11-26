import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../components/Dashboard/Home';
import Schedule from '../components/Dashboard/Schedule';
import UpcomingTasks from '../components/Dashboard/UpcomingTasks';
import Goals from '../components/Dashboard/Goals';
import Modules from '../components/Dashboard/Modules';
import Analytics from './Analytics';

import StudyTime from '../components/Dashboard/StudyTime';
import AIAssistant from '../components/AI/AIAssistant';

const Dashboard = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/tasks" element={<UpcomingTasks />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/modules" element={<Modules />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/study-time" element={<StudyTime />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
};

export default Dashboard;
