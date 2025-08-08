import { useEffect, useState } from 'react';

type OpenVpnServerResponse = {
  id: number;
  serverName: string;
  isOnline: boolean;
  isDefault: boolean;
  apiUrl: string;
};

export default function ServerListPage() {
  const [servers, setServers] = useState<OpenVpnServerResponse[]>([
    {
      id: 1,
      serverName: 'Cyprus 🇨🇾',
      isOnline: true,
      isDefault: true,
      apiUrl: 'https://vpn1.example.com'
    },
    {
      id: 2,
      serverName: 'Helsinki 🇫🇮',
      isOnline: true,
      isDefault: false,
      apiUrl: 'https://vpn2.example.com'
    },
    {
      id: 3,
      serverName: 'Frankfurt 🇩🇪',
      isOnline: false,
      isDefault: false,
      apiUrl: 'https://vpn3.example.com'
    }
  ]);

  return (
    <section>
      <h2>Server List</h2>
      <ul>
        {servers.map((server) => (
          <li key={server.id} style={{ marginBottom: '0.5rem' }}>
            <strong>{server.serverName}</strong> — {server.isOnline ? 'Online' : 'Offline'}
            {server.isDefault && <span> (Default)</span>}
            <button style={{ marginLeft: '1rem' }}>Connect</button>
          </li>
        ))}
      </ul>
    </section>
  );
}