'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from '../../../components/DashboardHeader';

export default function StandeesPage() {
  const [standees, setStandees] = useState([]);
  const [name, setName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [format, setFormat] = useState('acrylic_7x5');
  const [creating, setCreating] = useState(false);
  const [selectedStandee, setSelectedStandee] = useState(null);

  const fetchStandees = async () => {
    try {
      const res = await fetch('/api/standees/list');
      const data = await res.json();
      setStandees(Array.isArray(data) ? data : []);
      if (Array.isArray(data) && data.length > 0 && !selectedStandee) {
        setSelectedStandee(data[0]);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchStandees();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name) return;
    setCreating(true);
    try {
      const res = await fetch('/api/standees/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, tableNumber, format })
      });
      const data = await res.json();
      if (data.success) {
        setName('');
        setTableNumber('');
        await fetchStandees();
        setSelectedStandee(data.standee);
      }
    } catch (err) {
      alert('Error creating standee: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDownloadPng = () => {
    if (!selectedStandee?.qrDataUrl) return;
    const a = document.createElement('a');
    a.href = selectedStandee.qrDataUrl;
    a.download = `reviewwo-${selectedStandee.shortCode || 'standee'}-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadSvg = () => {
    if (!selectedStandee?.qrSvg) {
      handleDownloadPng();
      return;
    }
    const blob = new Blob([selectedStandee.qrSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reviewwo-${selectedStandee.shortCode || 'standee'}-vector.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <DashboardHeader
        title="Smart Standees &amp; Hardware Studio"
        subtitle="Manage dual-frequency NFC + QR laser-engraved counter standees. Track scan velocity and download print-ready production files."
      />

      <div className="p-8 max-w-7xl space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create New Standee Form */}
          <div className="p-6 rounded-2xl bg-white border border-[#0B3D3B]/10 shadow-sm space-y-4">
            <h3 className="font-display font-extrabold text-base text-[#0B3D3B]">Generate New Standee</h3>
            <p className="text-xs text-[#4A706E]">
              Create a custom shortcode and vector QR code linked to your Google Business Profile.
            </p>

            <form onSubmit={handleCreate} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#0B3D3B] mb-1">
                  Standee Label / Location Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Main Cashier Counter"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#0B3D3B]/20 bg-[#F8FFFE] focus:outline-none focus:border-[#14B8A6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B3D3B] mb-1">
                  Table / Zone Identifier (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Table 04, VIP Lounge"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#0B3D3B]/20 bg-[#F8FFFE] focus:outline-none focus:border-[#14B8A6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B3D3B] mb-1">
                  Physical Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#0B3D3B]/20 bg-[#F8FFFE] focus:outline-none focus:border-[#14B8A6]"
                >
                  <option value="acrylic_7x5">7" × 5" Frosted Glass Acrylic Standee</option>
                  <option value="acrylic_5x4">5" × 4" Compact Tabletop Wedge</option>
                  <option value="nfc_puck">3.5" Dual-Tap NFC Wood/Polymer Puck</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full py-3 px-4 bg-[#0B3D3B] hover:bg-[#14B8A6] text-white text-xs font-display font-bold rounded-xl transition-all shadow"
              >
                {creating ? 'Generating Vector QR...' : '+ Generate Standee'}
              </button>
            </form>
          </div>

          {/* Standee Physical Visualizer Preview */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-[#0B3D3B]/10 shadow-sm flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="space-y-4 max-w-sm">
              <span className="text-[10px] font-display font-bold px-2 py-0.5 rounded bg-[#E6FFFB] text-[#14B8A6] uppercase tracking-wider">
                Production Preview
              </span>
              <h3 className="text-xl font-display font-extrabold text-[#0B3D3B]">
                {selectedStandee?.name || 'Main Cashier Standee'}
              </h3>
              <p className="text-xs text-[#4A706E] leading-relaxed">
                Laser-engraved acrylic block with embedded NTAG213 NFC microchip and high-contrast error-corrected QR matrix.
              </p>
              <div className="space-y-1 text-xs">
                <p><strong>1-Tap Deep Link:</strong> <code className="text-[#14B8A6]">{selectedStandee?.qrUrl ? `https://reviewwo.divergit.com${selectedStandee.qrUrl}` : 'https://reviewwo.divergit.com/r/RW101'}</code></p>
                <p><strong>Scans Captured:</strong> {selectedStandee?.scans || 0} customer taps</p>
              </div>

              <div className="pt-2 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  disabled={!selectedStandee?.qrDataUrl}
                  className="px-4 py-2 bg-[#0B3D3B] hover:bg-[#14B8A6] text-white text-xs font-display font-bold rounded-xl transition-all shadow flex items-center gap-1.5"
                >
                  <span>📥</span> Download QR (PNG)
                </button>
                <button
                  type="button"
                  onClick={handleDownloadSvg}
                  disabled={!selectedStandee}
                  className="px-4 py-2 bg-[#14B8A6] hover:bg-[#0B3D3B] text-white text-xs font-display font-bold rounded-xl transition-all shadow flex items-center gap-1.5"
                >
                  <span>📐</span> Download Vector SVG
                </button>
              </div>
            </div>

            {/* Visualizer Mock */}
            <div className="w-56 h-80 rounded-2xl bg-gradient-to-b from-[#F8FFFE] to-[#E6FFFB] border-4 border-[#0B3D3B] p-4 flex flex-col items-center justify-between shadow-2xl relative">
              <div className="text-center flex flex-col items-center">
                <img
                  src="/assets/img/logos/combo-dark.png"
                  alt="Reviewwo Standee"
                  className="h-7 w-auto object-contain mb-1"
                />
                <p className="text-[9px] text-[#4A706E]">Tap phone or scan code</p>
              </div>

              {/* QR Matrix Representation */}
              <div className="w-32 h-32 bg-white border-2 border-[#0B3D3B] p-2 rounded-2xl flex items-center justify-center shadow-inner">
                {selectedStandee?.qrDataUrl ? (
                  <img
                    src={selectedStandee.qrDataUrl}
                    alt={`QR Code for ${selectedStandee.name}`}
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-[#0B3D3B] rounded-xl flex flex-col items-center justify-center text-white text-[10px] font-bold p-1 text-center">
                    <span>VECTOR QR</span>
                    <span className="text-[8px] text-[#99F6E4] mt-1">{selectedStandee?.shortCode || 'RW101'}</span>
                  </div>
                )}
              </div>

              <div className="text-center">
                <span className="text-[9px] font-display font-bold text-[#14B8A6] uppercase tracking-wider">
                  NFC Dual-Tap Ready
                </span>
                <p className="text-[8px] text-[#4A706E]">1-Tap Google Review in 12s</p>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Standees List */}
        <div className="p-6 rounded-2xl bg-white border border-[#0B3D3B]/10 shadow-sm">
          <h3 className="font-display font-extrabold text-base text-[#0B3D3B] mb-4">Active Physical Deployments</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#E6FFFB] text-[#0B3D3B] uppercase font-display font-bold">
                <tr>
                  <th className="py-2.5 px-3 rounded-l">Standee Name</th>
                  <th className="py-2.5 px-3">Table / Zone</th>
                  <th className="py-2.5 px-3">Format</th>
                  <th className="py-2.5 px-3">Shortcode</th>
                  <th className="py-2.5 px-3">Taps / Scans</th>
                  <th className="py-2.5 px-3 rounded-r">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B3D3B]/10">
                {standees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-[#4A706E]">
                      No standees created yet. Use the form above to generate your first physical counter standee.
                    </td>
                  </tr>
                ) : (
                  standees.map((std) => (
                    <tr
                      key={std.id}
                      onClick={() => setSelectedStandee(std)}
                      className={`cursor-pointer hover:bg-[#F8FFFE] transition-colors ${selectedStandee?.id === std.id ? 'bg-[#E6FFFB]/50' : ''}`}
                    >
                      <td className="py-3 px-3 font-bold text-[#0B3D3B] flex items-center gap-2.5">
                        {std.qrDataUrl ? (
                          <img
                            src={std.qrDataUrl}
                            alt="QR thumbnail"
                            className="w-7 h-7 rounded border border-[#0B3D3B]/20 bg-white p-0.5 shrink-0"
                          />
                        ) : (
                          <span className="w-7 h-7 rounded bg-[#0B3D3B] text-[8px] text-white flex items-center justify-center font-bold shrink-0">QR</span>
                        )}
                        <span>{std.name}</span>
                      </td>
                      <td className="py-3 px-3 text-[#4A706E]">{std.tableNumber || '—'}</td>
                      <td className="py-3 px-3 text-[#234745] capitalize">{std.format?.replace('_', ' ') || 'Acrylic 7x5'}</td>
                      <td className="py-3 px-3">
                        <code className="text-[#14B8A6] font-bold">{std.shortCode}</code>
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#0B3D3B]">{std.scans || 0}</td>
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStandee(std);
                          }}
                          className="text-xs font-bold text-[#14B8A6] hover:underline"
                        >
                          Preview →
                        </button>
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
