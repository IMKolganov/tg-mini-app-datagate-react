// Project: vpn-miniapp-telegram
// Purpose: Mini App for Telegram Bot (DataGateVPNBot)

// ...[unchanged sections]...

// 7. src/pages/StatisticsPage.tsx

export default function StatisticsPage() {
  const statistics = [
    {
      totalSessions: 53121,
      totalBytesIn: 126003777844,
      totalBytesOut: 7514751870652
    },
    {
      totalSessions: 21900,
      totalBytesIn: 86000000000,
      totalBytesOut: 125000000000
    },
    {
      totalSessions: 78350,
      totalBytesIn: 64000000000,
      totalBytesOut: 92000000000
    }
  ];

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalSessions = statistics.reduce((sum, s) => sum + s.totalSessions, 0);
  const totalTrafficIn = statistics.reduce((sum, s) => sum + s.totalBytesIn, 0);
  const totalTrafficOut = statistics.reduce((sum, s) => sum + s.totalBytesOut, 0);
  const totalServersUsed = statistics.length;

  return (
    <section>
      <h2>Statistics</h2>

      <div style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '2px solid #000' }}>
        <p><strong>Total servers used:</strong> {totalServersUsed}</p>
        <p><strong>Total sessions:</strong> {totalSessions.toLocaleString()}</p>
        <p><strong>Total traffic in:</strong> {formatBytes(totalTrafficIn)}</p>
        <p><strong>Total traffic out:</strong> {formatBytes(totalTrafficOut)}</p>
      </div>
    </section>
  );
}

// ...[rest unchanged]...
