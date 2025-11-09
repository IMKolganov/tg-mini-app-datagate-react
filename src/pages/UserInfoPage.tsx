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
  photo_url?: string;
}

interface TelegramLaunchParams {
  user?: TelegramUser;
  tgWebAppData?: { user?: TelegramUser };
  [key: string]: any;
}

export default function UserInfoPage() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [launchParams, setLaunchParams] = useState<TelegramLaunchParams | null>(null);

  useEffect(() => {
    const WebApp = typeof window !== 'undefined' ? (window as any).Telegram?.WebApp : undefined;

    let params: TelegramLaunchParams | null = null;
    try {
      params = retrieveLaunchParams() as TelegramLaunchParams;
    } catch {
      params = {
        user: {
          id: 0,
          first_name: 'Local',
          last_name: 'User',
          username: 'dev',
          language_code: 'en',
          allows_write_to_pm: true,
          is_bot: false,
          is_premium: false,
          photo_url: undefined,
        },
      };
    }

    setLaunchParams(params);

    const effectiveUser =
      params?.user ??
      params?.tgWebAppData?.user ?? {
        id: 0,
        first_name: 'Local',
        last_name: 'User',
        username: 'dev',
        language_code: 'en',
        allows_write_to_pm: true,
        is_bot: false,
        is_premium: false,
      };

    setUser(effectiveUser);

    if (WebApp && (effectiveUser?.id ?? 0) !== 0) {
      try {
        WebApp.ready?.();
        WebApp.expand?.();
      } catch {
        /* noop */
      }
    }
  }, []);

  if (!user) return null;

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
  const premium = user.is_premium ? '✔' : '—';
  const username = user.username ? `@${user.username}` : '—';
  const lang = user.language_code ?? '—';
  const allowsPm = user.allows_write_to_pm ? '✔' : '—';

  return (
    <section style={{ maxWidth: 560, margin: '0 auto', padding: '16px 12px' }}>
      <h2 style={{ margin: '0 0 12px 0' }}>User Info</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '72px 1fr',
          gap: 12,
          alignItems: 'center',
        }}
      >
        <div style={{ width: 72, height: 72, borderRadius: 8, overflow: 'hidden', background: '#222' }}>
          {user.photo_url ? (
            <img src={user.photo_url} alt="avatar" width={72} height={72} style={{ objectFit: 'cover' }} />
          ) : null}
        </div>

        <div style={{ display: 'grid', gap: 6 }}>
          <div style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.2 }}>{fullName || '—'}</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 14, opacity: 0.9 }}>
            <span>Username: {username}</span>
            <span>User ID: {user.id}</span>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 14, opacity: 0.9 }}>
            <span>Language: {lang}</span>
            <span>Premium: {premium}</span>
            <span>Allows PM: {allowsPm}</span>
          </div>
        </div>
      </div>

      <hr style={{ margin: '16px 0' }} />

      {/* <h3>All launchParams</h3>
      <pre style={{ fontSize: 12, whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(launchParams, null, 2)}
      </pre> */}
    </section>
  );
}
