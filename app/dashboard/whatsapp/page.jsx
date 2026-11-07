'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from '../../../components/DashboardHeader';

export default function WhatsAppGatewayPage() {
  const [status, setStatus] = useState({ connected: false, phoneNumber: null, state: 'idle' });
  const [qrCodeData, setQrCodeData] = useState(null);
  const [loadingQr, setLoadingQr] = useState(false);
  const [logs, setLogs] = useState([]);
  const [testNumber, setTestNumber] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [pairingMethod, setPairingMethod] = useState('qr'); // 'qr' or 'code'
  const [pairingPhone, setPairingPhone] = useState('');
  const [pairingCode, setPairingCode] = useState(null);
  const [loadingCode, setLoadingCode] = useState(false);

  // Fetch status and logs
  const refreshStatus = async () => {
    try {
      const res = await fetch('/api/whatsapp/status');
      const data = await res.json();
      setStatus(data);
      if (data.connected) {
        setQrCodeData(null);
        setPairingCode(null);
      } else if (data.qrDataUrl || data.dataUrl) {
        setQrCodeData(prev => prev || data.qrDataUrl || data.dataUrl);
      }

      const logsRes = await fetch('/api/whatsapp/logs');
      const logsData = await logsRes.json();
      setLogs(Array.isArray(logsData) ? logsData : []);
    } catch (e) {}
  };

  useEffect(() => {
    refreshStatus();
    const interval = setInterval(refreshStatus, 8000);
    return () => clearInterval(interval);
  }, []);

  // Request new official WhatsApp Web QR pairing string
  const handleGenerateQr = async () => {
    setLoadingQr(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/whatsapp/qr');
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate QR code');
      }
      const qrImage = data.qrDataUrl || data.dataUrl || data.qr;
      if (qrImage) {
        setQrCodeData(qrImage);
      }
      refreshStatus();
    } catch (e) {
      alert('Error generating pairing QR: ' + e.message);
    } finally {
      setLoadingQr(false);
    }
  };

  // Request official WhatsApp 8-digit pairing code
  const handleRequestPairingCode = async (e) => {
    e.preventDefault();
    if (!pairingPhone) {
      alert('Please enter your WhatsApp mobile number.');
      return;
    }
    setLoadingCode(true);
    setPairingCode(null);
    try {
      const res = await fetch('/api/whatsapp/pairing-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: pairingPhone })
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate pairing code');
      }
      setPairingCode(data.code);
      refreshStatus();
    } catch (e) {
      alert('Error generating pairing code: ' + e.message);
    } finally {
      setLoadingCode(false);
    }
  };

  // Simulate instant device pairing
  const handleSimulatePair = async () => {
    setLoadingQr(true);
    try {
      const res = await fetch('/api/whatsapp/pair', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setQrCodeData(null);
        refreshStatus();
      } else {
        alert('Pairing error: ' + (data.error || 'Unknown error'));
      }
    } catch (e) {
      alert('Pairing error: ' + e.message);
    } finally {
      setLoadingQr(false);
    }
  };

  // Disconnect socket
  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect this WhatsApp session?')) return;
    try {
      await fetch('/api/whatsapp/disconnect', { method: 'POST' });
      setQrCodeData(null);
      refreshStatus();
    } catch (e) {
      alert('Error disconnecting session');
    }
  };

  // Send Test Grievance Alert to Store Manager
  const handleSendTestGrievanceAlert = async (e) => {
    e.preventDefault();
    if (!testNumber) {
      alert('Please enter your manager phone number with country code (e.g. +91 9876543210)');
      return;
    }
    setSendingTest(true);
    setTestResult(null);
    try {
      const alertMessage = "⚠️ [TEST ALERT] Reviewwo Shield: Guest at Table 3 rated 2 stars. Feedback: 'Order took 25 minutes'. Tap to resolve privately before guest leaves.";
      const res = await fetch('/api/whatsapp/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: testNumber, message: alertMessage })
      });
      const data = await res.json();
      setTestResult(data);
      refreshStatus();
    } catch (err) {
      setTestResult({ error: err.message });
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div>
      <DashboardHeader
        title="Manager WhatsApp Rail &amp; Auth Gateway"
        subtitle="Dedicated sovereign socket connection for instant Negative Review Shield manager alerts (1–3★) and zero-cost merchant WhatsApp OTP login."
      />

      <div className="p-8 max-w-7xl space-y-8">
        {/* Architecture Value Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0B3D3B] to-[#14B8A6] text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping"></span>
              <span className="text-xs font-display font-bold uppercase tracking-wider text-[#99F6E4]">Private Rail</span>
            </div>
            <h2 className="text-xl font-display font-black tracking-tight">Dedicated Store Manager &amp; Authentication Rail</h2>
            <p className="text-xs text-[#C5EBE8] max-w-2xl leading-relaxed">
              We do not blast cold WhatsApp messages to customers. This multi-device socket connection is used exclusively to dispatch instant 1–3★ grievance alerts to the store manager's phone and issue secure merchant login OTPs with ₹0 SMS fees.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-[#051C1B]/60 p-4 rounded-xl border border-white/10 shrink-0">
            <div className="text-center">
              <span className="block text-2xl font-display font-black text-[#99F6E4]">0s</span>
              <span className="text-[10px] text-[#C5EBE8] uppercase font-bold">Alert Latency</span>
            </div>
            <div className="h-8 w-px bg-white/20"></div>
            <div className="text-center">
              <span className="block text-2xl font-display font-black text-white">₹0.00</span>
              <span className="text-[10px] text-[#C5EBE8] uppercase font-bold">SMS Fees</span>
            </div>
          </div>
        </div>

        {/* Pairing Status & Test Alert Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Pairing QR Terminal */}
          <div className="p-6 rounded-2xl bg-white border border-[#0B3D3B]/10 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#0B3D3B]/10">
                <h3 className="font-display font-extrabold text-base text-[#0B3D3B]">Pair Manager WhatsApp Account</h3>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  status.connected ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                }`}>
                  {status.connected ? '● Socket Linked' : '○ Awaiting Scan'}
                </span>
              </div>

              {status.connected ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-[#10B981]/10 text-[#10B981] rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-base text-[#0B3D3B]">Manager Phone Successfully Linked</h4>
                    <p className="text-xs text-[#4A706E] mt-1">
                      Connected Number: <strong className="text-[#0B3D3B]">{status.phoneNumber || 'Store Manager Phone'}</strong>
                    </p>
                    <p className="text-xs text-[#4A706E]">
                      Rail: <code className="bg-[#E6FFFB] px-1.5 py-0.5 rounded text-[#0B3D3B]">Grievance Alerts &amp; Merchant Auth</code>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="inline-flex items-center px-4 py-2 border border-[#EF4444] text-xs font-bold text-[#EF4444] hover:bg-[#EF4444] hover:text-white rounded-xl transition-colors"
                  >
                    Disconnect Phone
                  </button>
                </div>
              ) : (
                <div className="space-y-4 py-2">
                  {/* Method Switcher Tabs */}
                  <div className="grid grid-cols-2 p-1 bg-[#E6FFFB] rounded-xl border border-[#14B8A6]/20">
                    <button
                      type="button"
                      onClick={() => setPairingMethod('qr')}
                      className={`py-2 text-xs font-display font-bold text-center rounded-lg transition-all ${
                        pairingMethod === 'qr'
                          ? 'bg-[#0B3D3B] text-white shadow-sm'
                          : 'text-[#4A706E] hover:text-[#0B3D3B]'
                      }`}
                    >
                      📷 Official WhatsApp QR
                    </button>
                    <button
                      type="button"
                      onClick={() => setPairingMethod('code')}
                      className={`py-2 text-xs font-display font-bold text-center rounded-lg transition-all ${
                        pairingMethod === 'code'
                          ? 'bg-[#0B3D3B] text-white shadow-sm'
                          : 'text-[#4A706E] hover:text-[#0B3D3B]'
                      }`}
                    >
                      🔢 8-Digit Pairing Code
                    </button>
                  </div>

                  {pairingMethod === 'qr' ? (
                    <div className="space-y-4 text-center">
                      <div className="max-w-xs mx-auto border border-[#0B3D3B]/10 rounded-2xl p-4 bg-[#F8FFFE] flex flex-col items-center justify-center min-h-[230px]">
                        {qrCodeData ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="p-2.5 bg-white rounded-2xl border-2 border-[#0B3D3B] shadow-md">
                              <img
                                src={qrCodeData}
                                alt="Official WhatsApp Web Pairing QR Code"
                                className="w-52 h-52 object-contain rounded-lg"
                              />
                            </div>
                            <span className="text-[10px] font-bold text-[#14B8A6] flex items-center gap-1.5 mt-1">
                              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping"></span>
                              Official WhatsApp Multi-Device Handshake • Awaiting Scan
                            </span>
                          </div>
                        ) : (
                          <div className="text-xs text-[#4A706E] space-y-2 py-6">
                            <div className="text-4xl text-[#14B8A6]">📱</div>
                            <p className="font-display font-bold text-[#0B3D3B]">Ready to link manager phone</p>
                            <p className="text-[11px]">Click below to generate the official WhatsApp Web pairing QR.</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={handleGenerateQr}
                          disabled={loadingQr}
                          className="inline-flex items-center justify-center px-6 py-2.5 bg-[#0B3D3B] hover:bg-[#14B8A6] text-white text-xs font-display font-bold rounded-xl transition-all shadow"
                        >
                          {loadingQr ? 'Connecting to WhatsApp Servers...' : (qrCodeData ? '🔄 Refresh QR Code' : '⚡ Generate Official WhatsApp QR')}
                        </button>
                      </div>

                      <div className="text-left text-xs text-[#4A706E] bg-[#E6FFFB] p-4 rounded-xl border border-[#14B8A6]/30 space-y-1">
                        <p className="font-bold text-[#0B3D3B]">Official WhatsApp Pairing Instructions:</p>
                        <p>1. Open <strong>WhatsApp</strong> on your manager/store phone</p>
                        <p>2. Tap <strong>Settings</strong> (or 3-dots) &rarr; <strong>Linked Devices</strong> &rarr; <strong>Link a Device</strong></p>
                        <p>3. Point your camera at this QR code to authenticate instantly</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="border border-[#0B3D3B]/10 rounded-2xl p-5 bg-[#F8FFFE] text-center space-y-3">
                        <p className="text-xs text-[#4A706E]">
                          No camera needed. Enter your WhatsApp number to receive an 8-digit code you can enter directly inside your WhatsApp app.
                        </p>

                        {pairingCode ? (
                          <div className="p-4 bg-white rounded-xl border-2 border-[#10B981] space-y-1 shadow-sm">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#14B8A6]">Enter This Code on Your Phone:</span>
                            <div className="text-3xl font-display font-black tracking-widest text-[#0B3D3B] py-1 select-all">
                              {pairingCode}
                            </div>
                            <p className="text-[10px] text-[#4A706E]">Valid for 60 seconds inside WhatsApp</p>
                          </div>
                        ) : (
                          <form onSubmit={handleRequestPairingCode} className="space-y-3">
                            <div className="h-11 flex items-stretch rounded-xl border border-[#0B3D3B]/20 bg-white focus-within:border-[#14B8A6] overflow-hidden">
                              <span className="inline-flex items-center px-3 bg-[#E6FFFB] border-r border-[#0B3D3B]/10 text-xs font-bold text-[#0B3D3B]">
                                🇮🇳 +91
                              </span>
                              <input
                                type="tel"
                                required
                                value={pairingPhone}
                                onChange={(e) => setPairingPhone(e.target.value)}
                                placeholder="9876543210"
                                className="w-full text-xs px-3 focus:outline-none text-[#0B3D3B]"
                              />
                            </div>
                            <button
                              type="submit"
                              disabled={loadingCode}
                              className="w-full py-2.5 bg-[#0B3D3B] hover:bg-[#14B8A6] text-white text-xs font-display font-bold rounded-xl transition-all shadow"
                            >
                              {loadingCode ? 'Requesting Code from WhatsApp...' : 'Get 8-Digit Pairing Code →'}
                            </button>
                          </form>
                        )}
                      </div>

                      <div className="text-left text-xs text-[#4A706E] bg-[#E6FFFB] p-4 rounded-xl border border-[#14B8A6]/30 space-y-1">
                        <p className="font-bold text-[#0B3D3B]">Phone Number Pairing Steps:</p>
                        <p>1. Open <strong>WhatsApp</strong> &rarr; <strong>Linked Devices</strong> &rarr; <strong>Link a Device</strong></p>
                        <p>2. Tap <strong>"Link with phone number instead"</strong> at the bottom</p>
                        <p>3. Enter the 8-digit code shown above</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Test Manager Alert Dispatch */}
          <div className="p-6 rounded-2xl bg-white border border-[#0B3D3B]/10 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#0B3D3B]/10">
                <h3 className="font-display font-extrabold text-base text-[#0B3D3B]">Test Manager Grievance Alert</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E6FFFB] text-[#14B8A6]">
                  Simulation
                </span>
              </div>
              <p className="text-xs text-[#4A706E] mb-4">
                Verify that your manager phone instantly receives WhatsApp notifications when a customer submits 1–3 star feedback on a standee.
              </p>

              <form onSubmit={handleSendTestGrievanceAlert} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0B3D3B] mb-1">
                    Manager WhatsApp Phone Number (with Country Code)
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    value={testNumber}
                    onChange={(e) => setTestNumber(e.target.value)}
                    required
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#0B3D3B]/20 bg-[#F8FFFE] focus:outline-none focus:border-[#14B8A6]"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FFFE] border border-[#0B3D3B]/10 text-xs">
                  <p className="font-bold text-[#0B3D3B] mb-1">Alert Payload Dispatched:</p>
                  <p className="italic text-[#4A706E]">
                    "⚠️ Reviewwo Alert: Guest at Table 3 rated 2 stars. Feedback: 'Order took 25 minutes'. Tap to resolve privately before guest leaves."
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={sendingTest}
                  className="w-full py-3 px-4 bg-[#14B8A6] hover:bg-[#0B3D3B] text-white text-xs font-display font-bold rounded-xl transition-all shadow"
                >
                  {sendingTest ? 'Transmitting Alert...' : 'Dispatch Test Manager Alert (₹0 SMS)'}
                </button>
              </form>

              {testResult && (
                <div className={`mt-4 p-3 rounded-xl text-xs ${
                  testResult.delivered || testResult.success ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20' : 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20'
                }`}>
                  {testResult.error ? (
                    <p><strong>Error:</strong> {testResult.error}</p>
                  ) : (
                    <p><strong>Success:</strong> Manager alert dispatched to WhatsApp via sovereign socket with ₹0 SMS surcharge.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rail Logs Table */}
        <div className="p-6 rounded-2xl bg-white border border-[#0B3D3B]/10 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#0B3D3B]/10">
            <div>
              <h3 className="font-display font-extrabold text-base text-[#0B3D3B]">Manager Alert &amp; Auth Logs</h3>
              <p className="text-xs text-[#4A706E]">Audit trail of private manager alerts and login OTPs dispatched via sovereign socket.</p>
            </div>
            <button
              onClick={refreshStatus}
              className="text-xs font-bold text-[#14B8A6] hover:underline"
            >
              Refresh Logs
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#E6FFFB] text-[#0B3D3B] uppercase font-display font-bold">
                <tr>
                  <th className="py-2.5 px-3 rounded-l">Time</th>
                  <th className="py-2.5 px-3">Recipient</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Payload Preview</th>
                  <th className="py-2.5 px-3">Cost</th>
                  <th className="py-2.5 px-3 rounded-r">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B3D3B]/10">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-[#4A706E]">
                      No alert transmissions logged yet. Run a test alert above to verify delivery.
                    </td>
                  </tr>
                ) : (
                  logs.slice(0, 10).map((log, idx) => (
                    <tr key={log.id || idx} className="hover:bg-[#F8FFFE]">
                      <td className="py-2.5 px-3 text-[#4A706E]">
                        {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Just now'}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-[#0B3D3B]">{log.to}</td>
                      <td className="py-2.5 px-3 uppercase text-[10px] font-display font-bold text-[#14B8A6]">{log.type}</td>
                      <td className="py-2.5 px-3 text-[#234745] max-w-xs truncate">{log.preview}</td>
                      <td className="py-2.5 px-3 font-bold text-[#10B981]">₹0.00</td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#10B981]/10 text-[#10B981]">
                          Delivered
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
