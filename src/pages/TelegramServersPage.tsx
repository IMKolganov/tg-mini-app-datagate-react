import { useEffect, useState } from "react";
import { init, retrieveRawInitData } from "@telegram-apps/sdk";
import "../css/TelegramServersPage.css";

type ServerItem = {
  id: number;
  serverName: string;
  isOnline: boolean;
  isDefault: boolean;
  apiUrl: string;
  createDate?: string;
  lastUpdate?: string;
};

export default function TelegramServersPage() {
  const [raw, setRaw] = useState("");
  const [servers, setServers] = useState<ServerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Only English in comments
  const fmtDate = (iso?: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return isNaN(d.getTime()) ? iso : d.toLocaleString();
  };

  const timeAgo = (iso?: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "—";
    const diff = Math.max(0, Date.now() - d.getTime());
    const s = Math.floor(diff / 1000);
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  const onCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied");
    } catch {
      alert("Copy failed");
    }
  };

  const extractServers = (data: any): ServerItem[] => {
    if (Array.isArray(data)) {
      for (const x of data) {
        const arr = x?.data?.openVpnServers ?? x?.data?.OpenVpnServers ?? x?.openVpnServers;
        if (Array.isArray(arr)) return arr;
      }
      return data;
    }
    const arr = data?.data?.openVpnServers ?? data?.data?.OpenVpnServers ?? data?.openVpnServers;
    if (Array.isArray(arr)) return arr;
    return data ? [data] : [];
  };

  const fetchServers = async (initData: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://datagate.rackot.ru/api/VpnServer/GetAllVpnServers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Telegram-Init-Data": initData,
        },
      });

      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await res.json() : await res.text();

      if (!res.ok) {
        const text = typeof data === "string" ? data : JSON.stringify(data);
        throw new Error(`Error ${res.status}: ${text}`);
      }

      setServers(extractServers(data));
    } catch (e: any) {
      setError(e?.message ?? "Request failed");
      setServers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try { init(); } catch {}
    const sdkRaw = retrieveRawInitData?.() ?? "";
    const waRaw = (window as any)?.Telegram?.WebApp?.initData ?? "";
    const initData = sdkRaw || waRaw || "";
    setRaw(initData);

    if (initData) fetchServers(initData);
    else {
      setLoading(false);
      setError("No initDataRaw available");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reload = () => raw && fetchServers(raw);

  return (
    <div className="tg-wrap">
      <div className="tg-header">
        <div className="tg-title">
          <h2>OpenVPN Servers</h2>
          <div className="tg-sub">
            Authorized via Telegram Mini App — <code>Telegram-Init-Data</code> header
          </div>
        </div>
        <div className="tg-actions">
          <button className="tg-btn" onClick={reload} disabled={loading}>
            {loading ? "Loading..." : "Reload"}
          </button>
        </div>
      </div>

      {error && <div className="tg-error">{error}</div>}

      {loading && (
        <div className="tg-grid">
          <div className="tg-card skeleton sk-card" />
          <div className="tg-card skeleton sk-card" />
          <div className="tg-card skeleton sk-card" />
        </div>
      )}

      {!loading && !error && servers.length === 0 && (
        <div className="tg-card tg-empty">No servers found.</div>
      )}

      {!loading && servers.length > 0 && (
        <div className="tg-grid">
          {servers.map((s) => (
            <div key={s.id} className="tg-card">
              <div className="tg-card-head">
                <div className="tg-name">{s.serverName}</div>
                <span className={`tg-pill ${s.isOnline ? "tg-pill--ok" : "tg-pill--bad"}`}>
                  <span className="dot" />
                  {s.isOnline ? "Online" : "Offline"}
                </span>
              </div>

              {s.isDefault && <div className="tg-default">Default</div>}

              <div className="tg-fields">
                <div className="tg-field">
                  <div className="label">API URL</div>
                  <div className="tg-url">
                    <div className="value">{s.apiUrl || "—"}</div>
                    {s.apiUrl && (
                      <button className="tg-copy" onClick={() => onCopy(s.apiUrl)} title="Copy API URL">
                        Copy
                      </button>
                    )}
                  </div>
                </div>

                <div className="tg-row">
                  <div className="tg-field">
                    <div className="label">Last update</div>
                    <div className="value">{fmtDate(s.lastUpdate)}</div>
                    <div className="ago">{timeAgo(s.lastUpdate)}</div>
                  </div>
                  <div className="tg-field">
                    <div className="label">Created</div>
                    <div className="value">{fmtDate(s.createDate)}</div>
                  </div>
                </div>

                <div className="tg-field">
                  <div className="label">ID</div>
                  <div className="value">{s.id}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
