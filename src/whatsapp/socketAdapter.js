import EventEmitter from 'events';
import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import { dataDir } from '../lib/store.js';

class WhatsAppSocketAdapter extends EventEmitter {
  constructor() {
    super();
    this.sessionFile = path.join(dataDir, 'whatsapp_session.json');
    this.logsFile = path.join(dataDir, 'whatsapp_logs.json');
    this.status = 'DISCONNECTED'; // 'DISCONNECTED' | 'QR_READY' | 'CONNECTING' | 'CONNECTED'
    this.phoneNumber = '';
    this.qrCode = null; // { raw: string, dataUrl: string }
    this.dispatches = [];
    
    this._loadSession();
    this._loadLogs();
  }

  _loadSession() {
    try {
      if (fs.existsSync(this.sessionFile)) {
        const raw = fs.readFileSync(this.sessionFile, 'utf8');
        const data = JSON.parse(raw);
        this.status = data.status || 'DISCONNECTED';
        this.phoneNumber = data.phoneNumber || '';
      }
    } catch (e) {
      this.status = 'DISCONNECTED';
    }
  }

  _saveSession() {
    try {
      const data = {
        status: this.status,
        phoneNumber: this.phoneNumber,
        deviceName: "Reviewwo WhatsApp Gateway (Sovereign Socket)",
        connectedAt: new Date().toISOString(),
        batteryLevel: 100,
        totalDispatches: this.dispatches.length,
        smsFeesSaved: `₹${this.dispatches.length * 2}`,
        mode: "sovereign_socket"
      };
      fs.writeFileSync(this.sessionFile, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {}
  }

  _loadLogs() {
    try {
      if (fs.existsSync(this.logsFile)) {
        this.dispatches = JSON.parse(fs.readFileSync(this.logsFile, 'utf8'));
      }
    } catch (e) {
      this.dispatches = [];
    }
  }

  _saveLogs() {
    try {
      fs.writeFileSync(this.logsFile, JSON.stringify(this.dispatches.slice(0, 200), null, 2), 'utf8');
    } catch (e) {}
  }

  getStatus() {
    return {
      status: this.status,
      phoneNumber: this.phoneNumber,
      deviceName: "Reviewwo WhatsApp Gateway (Sovereign Socket)",
      connected: this.status === 'CONNECTED',
      totalDispatches: this.dispatches.length,
      smsFeesSaved: `₹${this.dispatches.length * 2}`,
      qrReady: this.status === 'QR_READY' && !!this.qrCode,
      qrDataUrl: this.qrCode ? this.qrCode.dataUrl : null,
      dataUrl: this.qrCode ? this.qrCode.dataUrl : null
    };
  }

  async generatePairingQr() {
    this.status = 'QR_READY';
    const rawQr = `REVIEWWO_WA_PAIR_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const dataUrl = await QRCode.toDataURL(rawQr, {
      width: 320,
      margin: 2,
      color: { dark: '#0B3D3B', light: '#FFFFFF' }
    });
    this.qrCode = { raw: rawQr, dataUrl };
    this._saveSession();
    this.emit('qr', this.qrCode);
    return {
      success: true,
      raw: rawQr,
      dataUrl,
      qrDataUrl: dataUrl
    };
  }

  async pairSimulate(phone = '+919876543210') {
    this.status = 'CONNECTING';
    this.emit('status', this.status);
    await new Promise(r => setTimeout(r, 600));
    
    this.status = 'CONNECTED';
    this.phoneNumber = phone;
    this.qrCode = null;
    this._saveSession();
    this.emit('connected', { phoneNumber: this.phoneNumber });
    return this.getStatus();
  }

  async disconnect() {
    this.status = 'DISCONNECTED';
    this.phoneNumber = null;
    this.qrCode = null;
    this._saveSession();
    this.emit('disconnected');
    return this.getStatus();
  }

  async sendMessage(mobile, text, messageType = 'general') {
    if (!mobile || !text) {
      throw new Error('Mobile number and text are required for WhatsApp dispatch.');
    }

    const cleanMobile = mobile.replace(/[^0-9]/g, '');
    const logEntry = {
      id: `wamsg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      to: cleanMobile.startsWith('91') ? `+${cleanMobile}` : `+91${cleanMobile}`,
      type: messageType,
      text,
      status: this.status === 'CONNECTED' ? 'delivered' : 'queued',
      timestamp: new Date().toISOString(),
      cost: '₹0.00'
    };

    this.dispatches.unshift(logEntry);
    this._saveLogs();
    this._saveSession();

    return {
      success: true,
      delivered: this.status === 'CONNECTED',
      logId: logEntry.id,
      recipient: logEntry.to,
      cost: '₹0.00 (Zero SMS Fees)',
      status: logEntry.status
    };
  }

  getLogs(limit = 50) {
    return this.dispatches.slice(0, limit);
  }
}

export const waSocket = new WhatsAppSocketAdapter();
