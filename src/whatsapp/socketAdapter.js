import EventEmitter from 'events';
import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import pino from 'pino';
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState
} from '@whiskeysockets/baileys';
import { dataDir } from '../lib/store.js';

class WhatsAppSocketAdapter extends EventEmitter {
  constructor() {
    super();
    this.sessionFile = path.join(dataDir, 'whatsapp_session.json');
    this.logsFile = path.join(dataDir, 'whatsapp_logs.json');
    this.authDir = path.join(dataDir, 'baileys_auth');
    this.status = 'DISCONNECTED'; // 'DISCONNECTED' | 'QR_READY' | 'CONNECTING' | 'CONNECTED'
    this.phoneNumber = '';
    this.qrCode = null; // { raw: string, dataUrl: string }
    this.dispatches = [];
    this.sock = null;
    this.isInitializing = false;

    if (!fs.existsSync(this.authDir)) {
      try { fs.mkdirSync(this.authDir, { recursive: true }); } catch (e) {}
    }

    this._loadSession();
    this._loadLogs();

    // Auto-resume existing saved session on boot if credentials exist
    if (this._hasExistingSession()) {
      this._initBaileys().catch(() => {});
    }
  }

  _hasExistingSession() {
    try {
      const credsPath = path.join(this.authDir, 'creds.json');
      return fs.existsSync(credsPath);
    } catch (e) {
      return false;
    }
  }

  _loadSession() {
    try {
      if (fs.existsSync(this.sessionFile)) {
        const raw = fs.readFileSync(this.sessionFile, 'utf8');
        const data = JSON.parse(raw);
        // A saved "CONNECTED" status is not trusted: the socket must reconnect first.
        this.status = 'DISCONNECTED';
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
        updatedAt: new Date().toISOString(),
        totalDispatches: this.dispatches.length
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
      connected: this.status === 'CONNECTED',
      totalDispatches: this.dispatches.length,
      qrReady: this.status === 'QR_READY' && !!this.qrCode,
      qrDataUrl: this.qrCode ? this.qrCode.dataUrl : null,
      dataUrl: this.qrCode ? this.qrCode.dataUrl : null
    };
  }

  async _initBaileys() {
    if (this.sock && this.status === 'CONNECTED') {
      return this.sock;
    }
    if (this.isInitializing) {
      return this.sock;
    }
    this.isInitializing = true;

    try {
      if (!fs.existsSync(this.authDir)) {
        fs.mkdirSync(this.authDir, { recursive: true });
      }

      const { state, saveCreds } = await useMultiFileAuthState(this.authDir);

      const sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        browser: ['Reviewwo', 'Chrome', '124.0.0'],
        syncFullHistory: false,
        generateHighQualityLinkPreview: false,
        connectTimeoutMs: 30000,
        keepAliveIntervalMs: 25000
      });

      this.sock = sock;

      sock.ev.on('creds.update', saveCreds);

      sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          try {
            const dataUrl = await QRCode.toDataURL(qr, {
              width: 320,
              margin: 2,
              color: { dark: '#0B3D3B', light: '#FFFFFF' }
            });
            this.status = 'QR_READY';
            this.qrCode = { raw: qr, dataUrl };
            this._saveSession();
            this.emit('qr', this.qrCode);
          } catch (err) {
            console.error('Failed to generate QR data URL:', err);
          }
        }

        if (connection === 'open') {
          this.status = 'CONNECTED';
          const rawId = sock.user?.id || '';
          const phoneOnly = rawId.split(':')[0].split('@')[0];
          this.phoneNumber = phoneOnly ? `+${phoneOnly}` : '';
          this.qrCode = null;
          this._saveSession();
          this.emit('connected', { phoneNumber: this.phoneNumber });
        }

        if (connection === 'close') {
          const statusCode = (lastDisconnect?.error)?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

          if (shouldReconnect) {
            this.status = 'CONNECTING';
            this._saveSession();
            setTimeout(() => {
              this.isInitializing = false;
              this._initBaileys().catch(() => {});
            }, 5000);
          } else {
            // Explicitly logged out from WhatsApp mobile device
            this.status = 'DISCONNECTED';
            this.phoneNumber = '';
            this.qrCode = null;
            try { fs.rmSync(this.authDir, { recursive: true, force: true }); } catch (e) {}
            this._saveSession();
            this.emit('disconnected');
          }
        }
      });

      return sock;
    } catch (err) {
      console.error('Error starting Baileys socket:', err);
      throw err;
    } finally {
      this.isInitializing = false;
    }
  }

  async generatePairingQr() {
    if (this.status === 'CONNECTED') {
      return {
        success: true,
        connected: true,
        phoneNumber: this.phoneNumber,
        status: 'CONNECTED'
      };
    }

    if (this.qrCode && this.status === 'QR_READY') {
      return {
        success: true,
        raw: this.qrCode.raw,
        dataUrl: this.qrCode.dataUrl,
        qrDataUrl: this.qrCode.dataUrl
      };
    }

    // Initialize Baileys socket and wait for real QR from WhatsApp servers
    await this._initBaileys();

    return new Promise((resolve) => {
      let resolved = false;

      const timer = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          this.removeListener('qr', onQrReceived);
          if (this.qrCode) {
            resolve({
              success: true,
              raw: this.qrCode.raw,
              dataUrl: this.qrCode.dataUrl,
              qrDataUrl: this.qrCode.dataUrl
            });
          } else {
            resolve({
              success: false,
              error: 'WhatsApp socket connection timed out. Please try refreshing again.'
            });
          }
        }
      }, 9000);

      const onQrReceived = (qrObj) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          resolve({
            success: true,
            raw: qrObj.raw,
            dataUrl: qrObj.dataUrl,
            qrDataUrl: qrObj.dataUrl
          });
        }
      };

      this.once('qr', onQrReceived);
    });
  }

  async requestPairingCode(phone) {
    if (!phone) {
      throw new Error('Phone number is required for pairing code.');
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      throw new Error('Please enter a valid mobile number with country code (e.g. 919876543210)');
    }

    if (this.sock) {
      try {
        this.sock.end(undefined);
      } catch (e) {}
      this.sock = null;
    }

    await this._initBaileys();
    if (!this.sock) {
      throw new Error('Could not initialize socket.');
    }

    // Give Baileys 2.5s to establish handshake before requesting 8-digit code
    await new Promise(r => setTimeout(r, 2500));
    const code = await this.sock.requestPairingCode(cleanPhone);
    return {
      success: true,
      code: code ? code.match(/.{1,4}/g)?.join('-') || code : code
    };
  }

  async disconnect() {
    try {
      if (this.sock) {
        await this.sock.logout().catch(() => {});
        this.sock.end(undefined);
        this.sock = null;
      }
    } catch (e) {}

    this.status = 'DISCONNECTED';
    this.phoneNumber = '';
    this.qrCode = null;
    try { fs.rmSync(this.authDir, { recursive: true, force: true }); } catch (e) {}
    this._saveSession();
    this.emit('disconnected');
    return this.getStatus();
  }

  async sendMessage(mobile, text, messageType = 'general') {
    if (!mobile || !text) {
      throw new Error('Mobile number and text are required for WhatsApp dispatch.');
    }

    const cleanMobile = mobile.replace(/[^0-9]/g, '');
    const standardMobile = cleanMobile.startsWith('91') ? cleanMobile : `91${cleanMobile}`;
    const jid = `${standardMobile}@s.whatsapp.net`;
    let delivered = false;

    if (this.sock && this.status === 'CONNECTED') {
      try {
        await this.sock.sendMessage(jid, { text });
        delivered = true;
      } catch (err) {
        console.error('Baileys dispatch error:', err?.message || err);
      }
    }

    const logEntry = {
      id: `wamsg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      to: `+${standardMobile}`,
      type: messageType,
      text,
      status: delivered ? 'delivered' : (this.status === 'CONNECTED' ? 'failed' : 'not_connected'),
      timestamp: new Date().toISOString()
    };

    this.dispatches.unshift(logEntry);
    this._saveLogs();
    this._saveSession();

    return {
      success: true,
      delivered,
      logId: logEntry.id,
      recipient: logEntry.to,
      status: logEntry.status
    };
  }

  getLogs(limit = 50) {
    return this.dispatches.slice(0, limit);
  }
}

// One socket per server process, shared by every route bundle.
export const waSocket = globalThis.__rwWaSocket || (globalThis.__rwWaSocket = new WhatsAppSocketAdapter());
