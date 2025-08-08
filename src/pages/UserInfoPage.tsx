import { useEffect, useState } from 'react';
import { retrieveLaunchParams } from '@telegram-apps/sdk';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  is_premium?: boolean;
  is_bot?: boolean;
  language_code?: string;
  allows_write_to_pm?: boolean;
}

interface TelegramLaunchParams {
  user?: TelegramUser;
  start_param?: string;
  query_id?: string;
  auth_date?: number;
  hash?: string; // ← теперь необязательное
  [key: string]: any;
}

export default function UserInfoPage() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [rawInitData, setRawInitData] = useState<string>('');
  const [initDataUnsafe, setInitDataUnsafe] = useState<TelegramLaunchParams | null>(null);

  useEffect(() => {
    const WebApp = window.Telegram?.WebApp;

    console.log('🟢 Telegram WebApp:', WebApp);

    const params = retrieveLaunchParams() as TelegramLaunchParams;
    console.log('📦 launchParams:', params);

    setRawInitData(WebApp?.initData || '(empty)');
    setInitDataUnsafe(params);

    if (params.user?.id) {
      setUser(params.user);
      WebApp?.ready?.();
      WebApp?.expand?.();
    } else {
      setUser({
        id: 0,
        first_name: 'Local',
        last_name: 'User',
        username: 'dev',
        language_code: 'en',
        allows_write_to_pm: true,
        is_bot: false,
        is_premium: false,
      });
    }
  }, []);

  if (!user) return <p>Loading user info...</p>;

  return (
    <section>
      <h2>User Info</h2>
      <p><strong>First name:</strong> {user.first_name}</p>
      <p><strong>Last name:</strong> {user.last_name}</p>
      <p><strong>Username:</strong> @{user.username}</p>
      <p><strong>User ID:</strong> {user.id}</p>

      <hr />

      <h3>Debug Info</h3>
      <pre><strong>initData:</strong> {rawInitData}</pre>
      <pre><strong>launchParams:</strong> {JSON.stringify(initDataUnsafe, null, 2)}</pre>
    </section>
  );
}
