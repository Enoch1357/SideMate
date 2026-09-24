import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw, 
  ShieldCheck, 
  Zap, 
  Unlink, 
  Terminal, 
  Server, 
  Eye, 
  EyeOff, 
  DollarSign, 
  Radio
} from 'lucide-react';

interface IntegrationStatus {
  whop: {
    connected: boolean;
    companyId: string;
    apiKeyMasked: string;
    webhookSecretConfigured: boolean;
    lastTested: string | null;
    companyName?: string;
    mode: 'live' | 'sandbox';
  };
  supabase: {
    connected: boolean;
    urlConfigured: boolean;
    projectRef?: string;
    hasServiceRoleKey: boolean;
    postgresStatus: 'connected' | 'unconfigured' | 'error';
    dbType: string;
  };
}

interface WhopSupabaseIntegrationViewProps {
  onBack?: () => void;
}

export const WhopSupabaseIntegrationView: React.FC<WhopSupabaseIntegrationViewProps> = ({
  onBack,
}) => {
  // Integration Status
  const [status, setStatus] = useState<IntegrationStatus | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Whop Form State
  const [whopApiKey, setWhopApiKey] = useState<string>('');
  const [whopCompanyId, setWhopCompanyId] = useState<string>('');
  const [whopWebhookSecret, setWhopWebhookSecret] = useState<string>('');
  const [showWhopKey, setShowWhopKey] = useState<boolean>(false);
  const [isSavingWhop, setIsSavingWhop] = useState<boolean>(false);
  const [whopMessage, setWhopMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Supabase Form State
  const [supabaseUrl, setSupabaseUrl] = useState<string>('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState<string>('');
  const [supabaseServiceRoleKey, setSupabaseServiceRoleKey] = useState<string>('');
  const [databaseUrl, setDatabaseUrl] = useState<string>('');
  const [showSupabaseKey, setShowSupabaseKey] = useState<boolean>(false);
  const [isSavingSupabase, setIsSavingSupabase] = useState<boolean>(false);
  const [supabaseMessage, setSupabaseMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Migration SQL State
  const [migrationSql, setMigrationSql] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'whop' | 'supabase' | 'schema' | 'webhook'>('whop');

  useEffect(() => {
    fetchStatus();
    fetchMigrationSql();
  }, []);

  const fetchStatus = async () => {
    setIsLoadingStatus(true);
    try {
      const res = await fetch('/api/integrations/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
        if (data.whop.companyId && !whopCompanyId) {
          setWhopCompanyId(data.whop.companyId);
        }
      }
    } catch (err) {
      console.error('Error fetching integration status:', err);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const fetchMigrationSql = async () => {
    try {
      const res = await fetch('/api/integrations/supabase/migration-sql');
      if (res.ok) {
        const data = await res.json();
        setMigrationSql(data.sql);
      }
    } catch (err) {
      console.error('Error fetching migration SQL:', err);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveWhop = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingWhop(true);
    setWhopMessage(null);

    try {
      const res = await fetch('/api/integrations/whop/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: whopApiKey,
          companyId: whopCompanyId,
          webhookSecret: whopWebhookSecret,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setWhopMessage({
          type: 'success',
          text: data.message || 'Whop credentials saved & verified successfully!',
        });
        setWhopApiKey('');
        fetchStatus();
      } else {
        setWhopMessage({
          type: 'error',
          text: data.error || 'Failed to verify Whop credentials. Please check your API key and Company ID.',
        });
      }
    } catch (err: any) {
      setWhopMessage({
        type: 'error',
        text: err.message || 'Connection error contacting server',
      });
    } finally {
      setIsSavingWhop(false);
    }
  };

  const handleDisconnectWhop = async () => {
    if (!confirm('Are you sure you want to disconnect your Whop credentials? The app will return to autonomous sandbox mode.')) {
      return;
    }
    try {
      const res = await fetch('/api/integrations/whop/disconnect', { method: 'POST' });
      if (res.ok) {
        setWhopMessage({ type: 'success', text: 'Whop account disconnected. Returned to sandbox mode.' });
        fetchStatus();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSupabase(true);
    setSupabaseMessage(null);

    try {
      const res = await fetch('/api/integrations/supabase/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supabaseUrl,
          supabaseAnonKey,
          supabaseServiceRoleKey,
          databaseUrl,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSupabaseMessage({
          type: 'success',
          text: data.message || 'Supabase / PostgreSQL connection established!',
        });
        fetchStatus();
      } else {
        setSupabaseMessage({
          type: 'error',
          text: data.error || 'Could not verify Supabase connection. Check your URL and service key.',
        });
      }
    } catch (err: any) {
      setSupabaseMessage({
        type: 'error',
        text: err.message || 'Server error saving Supabase connection',
      });
    } finally {
      setIsSavingSupabase(false);
    }
  };

  const handleDisconnectSupabase = async () => {
    if (!confirm('Disconnect Supabase / PostgreSQL? The app will fall back to local in-memory storage.')) {
      return;
    }
    try {
      const res = await fetch('/api/integrations/supabase/disconnect', { method: 'POST' });
      if (res.ok) {
        setSupabaseMessage({ type: 'success', text: 'Supabase disconnected. Using local persistent adapter.' });
        fetchStatus();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const webhookListenerUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/api/whop/webhook` 
    : 'https://your-domain.com/api/whop/webhook';

  return (
    <div className="space-y-8 pb-20">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-slate-800 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-0"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5"><Key className="w-4 h-4 text-amber-400" /> Platform Connections &amp; Persistence</span>
              {onBack && (
                <button
                  onClick={onBack}
                  className="text-xs font-semibold lowercase text-slate-400 hover:text-white px-2 py-0.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  ← Return to Workflow
                </button>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Whop &amp; Supabase (PostgreSQL) Integration Hub
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Connect your official <strong>Whop Account</strong> for automated live product publishing and 50/50 payouts, and connect <strong>Supabase (PostgreSQL)</strong> to store operators, creators, digital blueprints, and transaction ledgers.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={fetchStatus}
              disabled={isLoadingStatus}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStatus ? 'animate-spin' : ''}`} />
              Refresh Status
            </button>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Whop Status Pill */}
          <div className="flex items-center justify-between bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-black text-indigo-400 text-sm">
                W
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Whop Account Link</span>
                <span className="text-[11px] text-slate-400">
                  {status?.whop.connected ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Live Synced: {status.whop.companyName || status.whop.companyId}
                    </span>
                  ) : (
                    <span className="text-amber-400 font-medium">
                      Sandbox / Autonomous Mode (Credentials Pending)
                    </span>
                  )}
                </span>
              </div>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
              status?.whop.connected 
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                : 'bg-amber-950/80 text-amber-300 border border-amber-800'
            }`}>
              {status?.whop.connected ? 'LIVE API' : 'SANDBOX'}
            </span>
          </div>

          {/* Supabase Status Pill */}
          <div className="flex items-center justify-between bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center font-black text-emerald-400 text-sm">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">PostgreSQL / Supabase Server</span>
                <span className="text-[11px] text-slate-400">
                  {status?.supabase.connected ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      PostgreSQL Connected ({status.supabase.projectRef || 'Supabase'})
                    </span>
                  ) : (
                    <span className="text-slate-400">
                      Local In-Memory Engine (Ready to link Supabase)
                    </span>
                  )}
                </span>
              </div>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
              status?.supabase.connected 
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              {status?.supabase.connected ? 'POSTGRES LIVE' : 'LOCAL ADAPTER'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('whop')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'whop'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Key className="w-4 h-4" />
          1. Whop Credentials &amp; Account
        </button>
        <button
          onClick={() => setActiveTab('supabase')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'supabase'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Database className="w-4 h-4" />
          2. Supabase / PostgreSQL Setup
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'schema'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Terminal className="w-4 h-4" />
          3. Supabase SQL Migration
        </button>
        <button
          onClick={() => setActiveTab('webhook')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'webhook'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Radio className="w-4 h-4" />
          4. Webhook Listener
        </button>
      </div>

      {/* Tab 1: Whop Configuration */}
      {activeTab === 'whop' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">Step-by-Step Link</span>
              <h2 className="text-xl font-bold text-white mt-1">Link Your Whop Company</h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Enter your Whop Developer credentials below. Once linked, the platform will automatically publish real products and plans to your Whop dashboard.
              </p>
            </div>

            {whopMessage && (
              <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
                whopMessage.type === 'success' 
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200' 
                  : 'bg-red-950/40 border-red-800 text-red-200'
              }`}>
                {whopMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <span>{whopMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveWhop} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Whop Developer API Key (Bearer Token)
                </label>
                <div className="relative">
                  <input
                    type={showWhopKey ? 'text' : 'password'}
                    value={whopApiKey}
                    onChange={(e) => setWhopApiKey(e.target.value)}
                    placeholder={status?.whop.apiKeyMasked || 'whop_live_xxxxxxxxxxxxxxxxxxxxxxxx'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowWhopKey(!showWhopKey)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showWhopKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Find this under <a href="https://whop.com/dashboard/developer" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Whop Dashboard &gt; Developer &gt; API Keys</a>.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Whop Company ID
                </label>
                <input
                  type="text"
                  value={whopCompanyId}
                  onChange={(e) => setWhopCompanyId(e.target.value)}
                  placeholder="biz_xxxxxxxxxxxxxx"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Your business ID visible in the URL or Settings (e.g., biz_abc123).
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Whop Webhook Endpoint URL (Enter this in Whop Dashboard)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={typeof window !== 'undefined' ? `${window.location.origin}/api/whop/webhook` : 'https://ais-pre-xosvijswnl2bxy3r4ybq4e-409871152040.europe-west3.run.app/api/whop/webhook'}
                    className="w-full bg-slate-950 border border-indigo-900/60 rounded-xl px-4 py-2.5 text-xs text-indigo-300 font-mono select-all focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const url = typeof window !== 'undefined' ? `${window.location.origin}/api/whop/webhook` : 'https://ais-pre-xosvijswnl2bxy3r4ybq4e-409871152040.europe-west3.run.app/api/whop/webhook';
                      navigator.clipboard.writeText(url);
                      alert('Webhook URL copied to clipboard: ' + url);
                    }}
                    className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </button>
                </div>
                <span className="text-[11px] text-slate-400 mt-1.5 block">
                  In Whop Dashboard &gt; <strong>Developer</strong> &gt; <strong>Webhooks</strong> &gt; <strong>Add Webhook</strong>, paste this URL. Listen for <code className="text-amber-400">payment.succeeded</code> and <code className="text-amber-400">membership.went_valid</code>.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Whop Webhook Secret (whsec_...)
                </label>
                <input
                  type="password"
                  value={whopWebhookSecret}
                  onChange={(e) => setWhopWebhookSecret(e.target.value)}
                  placeholder="whsec_xxxxxxxxxxxxxx"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Provided by Whop after creating the webhook. Used to verify cryptographic signatures of incoming payment webhooks.
                </span>
              </div>

              <div className="pt-3 flex items-center justify-between gap-3">
                <button
                  type="submit"
                  disabled={isSavingWhop || (!whopApiKey && !whopCompanyId)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  {isSavingWhop ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                  {isSavingWhop ? 'Verifying with Whop...' : 'Test & Save Whop Credentials'}
                </button>

                {status?.whop.connected && (
                  <button
                    type="button"
                    onClick={handleDisconnectWhop}
                    className="px-4 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Unlink className="w-3.5 h-3.5" /> Disconnect
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Quick Guide Card */}
          <div className="lg:col-span-5 rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              How to Get Whop Developer Keys
            </h3>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold shrink-0">
                  1
                </div>
                <div>
                  <strong className="text-white block">Log in to Whop</strong>
                  Navigate to <a href="https://whop.com/dashboard" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">whop.com/dashboard</a> and select your business.
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold shrink-0">
                  2
                </div>
                <div>
                  <strong className="text-white block">Go to Developer Settings</strong>
                  Click <strong>Developer</strong> in the left sidebar, then click <strong>API Keys</strong>.
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold shrink-0">
                  3
                </div>
                <div>
                  <strong className="text-white block">Generate API Key</strong>
                  Create a new key with permissions for <code>products:write</code>, <code>affiliates:write</code>, and <code>payments:read</code>.
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold shrink-0">
                  4
                </div>
                <div>
                  <strong className="text-white block">Automated 50/50 Revenue Routing</strong>
                  Whop automatically provisions products into your company and attaches creator affiliate codes for effortless splits.
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold shrink-0">
                  5
                </div>
                <div>
                  <strong className="text-white block">Create Webhook</strong>
                  Go to <strong>Developer &gt; Webhooks &gt; Add Webhook</strong>. Paste your project's URL ending in <code>/api/whop/webhook</code>. Select <code>payment.succeeded</code>, copy the <strong>Webhook Secret</strong> (<code>whsec_...</code>), and paste it into the field on the left.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Supabase / PostgreSQL Setup */}
      {activeTab === 'supabase' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">Database Persistence</span>
              <h2 className="text-xl font-bold text-white mt-1">Connect Supabase (PostgreSQL)</h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Link your Supabase instance to store creators, blueprints, customers, and payment records permanently in PostgreSQL.
              </p>
            </div>

            {supabaseMessage && (
              <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
                supabaseMessage.type === 'success' 
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200' 
                  : 'bg-red-950/40 border-red-800 text-red-200'
              }`}>
                {supabaseMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <span>{supabaseMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveSupabase} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Supabase Service Role Key (Recommended for Server Writes)
                </label>
                <div className="relative">
                  <input
                    type={showSupabaseKey ? 'text' : 'password'}
                    value={supabaseServiceRoleKey}
                    onChange={(e) => setSupabaseServiceRoleKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSupabaseKey(!showSupabaseKey)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showSupabaseKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Find this in your Supabase dashboard under <strong>Settings &gt; API &gt; Project API Keys</strong>.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Direct PostgreSQL Connection String (DATABASE_URL)
                </label>
                <input
                  type="password"
                  value={databaseUrl}
                  onChange={(e) => setDatabaseUrl(e.target.value)}
                  placeholder="postgresql://postgres:password@db.xyzcompany.supabase.co:5432/postgres"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div className="pt-3 flex items-center justify-between gap-3">
                <button
                  type="submit"
                  disabled={isSavingSupabase || (!supabaseUrl && !databaseUrl)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  {isSavingSupabase ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
                  {isSavingSupabase ? 'Verifying Database...' : 'Connect Supabase (PostgreSQL)'}
                </button>

                {status?.supabase.connected && (
                  <button
                    type="button"
                    onClick={handleDisconnectSupabase}
                    className="px-4 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Unlink className="w-3.5 h-3.5" /> Disconnect
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="lg:col-span-5 rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              Supabase Architecture
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              When connected, your server automatically persists:
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>operators:</strong> Your shadow agency account info</span>
              </li>
              <li className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>creators:</strong> Scraped handles, follower counts, Whop affiliate tags</span>
              </li>
              <li className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>digital_products:</strong> Gemini AI 4-pillar curricula, prices, Whop product IDs</span>
              </li>
              <li className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>orders:</strong> Whop payments, fees, and 50/50 wallet ledgers</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 3: Supabase SQL Migration */}
      {activeTab === 'schema' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">PostgreSQL DDL</span>
              <h2 className="text-xl font-bold text-white mt-1">Supabase SQL Migration Script</h2>
              <p className="text-xs text-slate-300 mt-1">
                Copy and run this script in your Supabase <strong>SQL Editor</strong> to bootstrap the relational tables and RLS policies in 10 seconds.
              </p>
            </div>
            <button
              onClick={() => handleCopy(migrationSql, 'sql')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer self-start sm:self-auto"
            >
              {copiedKey === 'sql' ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
              {copiedKey === 'sql' ? 'Copied to Clipboard!' : '1-Click Copy SQL'}
            </button>
          </div>

          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[500px] leading-relaxed">
            <pre>{migrationSql || '-- Loading Supabase PostgreSQL Schema...'}</pre>
          </div>
        </div>
      )}

      {/* Tab 4: Webhook Listener */}
      {activeTab === 'webhook' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">Real-Time Events</span>
              <h2 className="text-xl font-bold text-white mt-1">Whop Webhook Endpoint</h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Register this webhook endpoint inside your Whop Developer Dashboard to automatically receive live purchase events.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-300">
                Your Live Webhook URL
              </label>
              <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <code className="text-xs text-indigo-300 font-mono flex-1 overflow-x-auto">
                  {webhookListenerUrl}
                </code>
                <button
                  onClick={() => handleCopy(webhookListenerUrl, 'webhook-url')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedKey === 'webhook-url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'webhook-url' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
                Events Handled by Server
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                  <span className="font-mono text-emerald-400 font-bold">payment.succeeded</span>
                  <p className="text-slate-400 text-[11px]">
                    Computes 3% fee, credits 50/50 splits, and grants instant access.
                  </p>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                  <span className="font-mono text-indigo-400 font-bold">membership.went_valid</span>
                  <p className="text-slate-400 text-[11px]">
                    Unlocks Whop Customer Hub digital portal with Notion &amp; PDF files.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-400" />
              Webhook Setup Instructions
            </h3>
            <ol className="space-y-3 text-xs text-slate-300 list-decimal pl-4">
              <li>Open your <strong>Whop Dashboard &gt; Developer &gt; Webhooks</strong>.</li>
              <li>Click <strong>Add Endpoint</strong>.</li>
              <li>Paste the URL: <code>{webhookListenerUrl}</code></li>
              <li>Select events: <code>payment.succeeded</code> and <code>membership.went_valid</code>.</li>
              <li>Copy the Webhook Secret (<code>whsec_...</code>) and paste it into the Whop tab here.</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};
