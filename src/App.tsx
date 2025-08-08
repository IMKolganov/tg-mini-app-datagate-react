import { useEffect, useState } from 'react';
import UserInfoPage from './pages/UserInfoPage';
import ServerListPage from './pages/ServerListPage';
import StatisticsPage from './pages/StatisticsPage';
import ActiveConnectionsPage from './pages/ActiveConnectionsPage';

export default function App() {
  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <UserInfoPage />
      <ServerListPage />
      <StatisticsPage />
      <ActiveConnectionsPage />
    </div>
  );
}