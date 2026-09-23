import React, { useState } from 'react';
import { 
  BarChart3, 
  DollarSign, 
  Users, 
  TrendingUp, 
  CreditCard, 
  CheckCircle2, 
  ArrowUpRight, 
  RefreshCw, 
  ShieldCheck, 
  ExternalLink,
  Flame,
  Zap
} from 'lucide-react';

export const PartnerDeliveryView: React.FC = () => {
  const [salesEvents, setSalesEvents] = useState([
    {
      id: 'whop_evt_9281',
      timestamp: '10:14 AM',
      customerEmail: 'sarah.miller@gmail.com',
      productTitle: 'The 7-Night Sleep Reset Protocol',
      creatorHandle: '@dr.toddler_wellness',
      grossAmount: 44.00,
      orderBump: true,
      whopFee: 1.32,
      creatorPayout: 21.34,
      operatorPayout: 21.34,
      deliveryStatus: 'Whop Hub Unlocked',
    },
    {
      id: 'whop_evt_8832',
      timestamp: '09:42 AM',
      customerEmail: 'joshua.k@outlook.com',
      productTitle: 'The 10-Minute Desk Posture System',
      creatorHandle: '@deskbound_rehab',
      grossAmount: 29.00,
      orderBump: false,
      whopFee: 0.87,
      creatorPayout: 14.06,
      operatorPayout: 14.06,
      deliveryStatus: 'Whop Hub Unlocked',
    },
    {
      id: 'whop_evt_7914',
      timestamp: 'Yesterday',
      customerEmail: 'claire.w@icloud.com',
      productTitle: 'The 7-Night Sleep Reset Protocol',
      creatorHandle: '@dr.toddler_wellness',
      grossAmount: 27.00,
      orderBump: false,
      whopFee: 0.81,
      creatorPayout: 13.09,
      operatorPayout: 13.09,
      deliveryStatus: 'Whop Hub Unlocked',
    },
  ]);

  const [simulating, setSimulating] = useState(false);
  const [partnerCount, setPartnerCount] = useState<number>(3);
  const [dailySalesPerPartner, setDailySalesPerPartner] = useState<number>(2);
  const avgOrderValue = 34; // with ~35% order bump uptake
  const netPerSale = avgOrderValue * 0.97 * 0.5; // ~16.49 per sale to you

  const projectedMonthlyNet = Math.round(partnerCount * dailySalesPerPartner * netPerSale * 30);
  const projectedMonthlyGross = Math.round(partnerCount * dailySalesPerPartner * avgOrderValue * 30);

  const totalGross = salesEvents.reduce((acc, s) => acc + s.grossAmount, 0);
  const totalYourShare = salesEvents.reduce((acc, s) => acc + s.operatorPayout, 0);
  const totalCreatorShare = salesEvents.reduce((acc, s) => acc + s.creatorPayout, 0);

  const handleSimulateSale = async () => {
    setSimulating(true);
    try {
      const res = await fetch('/api/whop/simulate-sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productTitle: 'The 7-Night Sleep Reset Protocol',
          price: 27,
          includeOrderBump: true,
          orderBumpPrice: 17,
          creatorName: 'Dr. Elena Miller, MD',
        }),
      });

      const data = await res.json();
      if (data.saleEvent) {
        const newEvt = {
          id: data.saleEvent.id,
          timestamp: 'Just now',
          customerEmail: data.saleEvent.customerEmail,
          productTitle: data.saleEvent.productTitle,
          creatorHandle: '@dr.toddler_wellness',
          grossAmount: data.saleEvent.grossAmount,
          orderBump: data.saleEvent.orderBumpIncluded,
          whopFee: data.saleEvent.whopFee,
          creatorPayout: data.saleEvent.creatorPayout,
          operatorPayout: data.saleEvent.operatorPayout,
          deliveryStatus: 'Whop Hub Unlocked',
        };
        setSalesEvents([newEvt, ...salesEvents]);
      }
    } catch (err) {
      console.error('Failed to simulate sale:', err);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/30 border border-slate-800 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-2.5">
              <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
              <span>Step 6: Partner Distribution, Delivery &amp; Scaling Hub</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Monitor Whop Delivery &amp; Scale Partners
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Every customer transaction is verified by Whop, automatically split 50/50, and digital files are unlocked instantly in the customer hub.
            </p>
          </div>

          <button
            onClick={handleSimulateSale}
            disabled={simulating}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto cursor-pointer shadow-md shadow-indigo-600/30 disabled:opacity-50"
          >
            {simulating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-amber-300" />}
            <span>Test Customer Purchase Event</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">Total Orders Fulfilled</span>
          <div className="text-xl font-bold text-white font-mono">{salesEvents.length}</div>
          <span className="text-[10px] text-emerald-400 font-mono">100% automated delivery</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">Gross Whop Volume</span>
          <div className="text-xl font-bold text-white font-mono">${totalGross.toFixed(2)}</div>
          <span className="text-[10px] text-slate-500">Processed by Whop</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-[11px] text-teal-400 font-medium">Creator Share Paid (50%)</span>
          <div className="text-xl font-bold text-teal-300 font-mono">${totalCreatorShare.toFixed(2)}</div>
          <span className="text-[10px] text-teal-500">Auto-routed to creators</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-[11px] text-indigo-400 font-medium">Your Net Profit (50%)</span>
          <div className="text-xl font-bold text-indigo-200 font-mono">${totalYourShare.toFixed(2)}</div>
          <span className="text-[10px] text-indigo-400">Direct operator balance</span>
        </div>
      </div>

      {/* Compounding Scale Modeler */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Compounding Partner Scaling Calculator
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            Projected: ${projectedMonthlyNet.toLocaleString()} / mo Net Profit to You
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-semibold">Active Partner Creators:</span>
                <span className="font-mono font-bold text-indigo-400">{partnerCount} Creators</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={partnerCount}
                onChange={(e) => setPartnerCount(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 Creator</span>
                <span>5 Creators</span>
                <span>15 Creators</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-semibold">Average Sales Per Day / Creator:</span>
                <span className="font-mono font-bold text-teal-400">{dailySalesPerPartner} Sales / day</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={dailySalesPerPartner}
                onChange={(e) => setDailySalesPerPartner(Number(e.target.value))}
                className="w-full accent-teal-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 Sale/day</span>
                <span>5 Sales/day</span>
                <span>10 Sales/day</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Gross Monthly Revenue:</span>
              <span className="font-mono font-bold text-white">${projectedMonthlyGross.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-teal-400">
              <span>Creator Payouts (50%):</span>
              <span className="font-mono font-bold">${projectedMonthlyNet.toLocaleString()}</span>
            </div>
            <div className="h-px bg-slate-800" />
            <div className="flex justify-between text-indigo-300 font-bold text-sm">
              <span>Your Monthly Profit (50%):</span>
              <span className="font-mono text-emerald-400">${projectedMonthlyNet.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              With 3 to 5 microcreator partners doing just 2 sales per day through their bio links, the asset compounds to <strong>${projectedMonthlyNet.toLocaleString()}/month</strong> with zero ad spend.
            </p>
          </div>
        </div>
      </div>

      {/* Orders & Delivery Activity Log */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            Live Customer Orders &amp; Delivery Ledger
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">Auto-refreshed via Whop Webhook</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold text-[11px]">
                <th className="pb-2.5">Time</th>
                <th className="pb-2.5">Customer Email</th>
                <th className="pb-2.5">Product</th>
                <th className="pb-2.5">Partner Creator</th>
                <th className="pb-2.5 text-right">Gross Total</th>
                <th className="pb-2.5 text-right">50% Creator</th>
                <th className="pb-2.5 text-right">50% You</th>
                <th className="pb-2.5 text-center">Delivery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {salesEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 text-slate-400 font-mono text-[11px]">{evt.timestamp}</td>
                  <td className="py-3 text-white font-medium">{evt.customerEmail}</td>
                  <td className="py-3 text-slate-300">
                    <span className="line-clamp-1">{evt.productTitle}</span>
                    {evt.orderBump && (
                      <span className="text-[10px] text-amber-400 block font-semibold">+ Order Bump</span>
                    )}
                  </td>
                  <td className="py-3 font-mono text-teal-400">{evt.creatorHandle}</td>
                  <td className="py-3 text-right font-mono font-bold text-white">${evt.grossAmount.toFixed(2)}</td>
                  <td className="py-3 text-right font-mono text-teal-400">${evt.creatorPayout.toFixed(2)}</td>
                  <td className="py-3 text-right font-mono text-indigo-300">${evt.operatorPayout.toFixed(2)}</td>
                  <td className="py-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-800 text-[10px] font-semibold text-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Unlocked</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
