import { waSocket } from './socketAdapter.js';
import { loadData, saveData } from '../lib/store.js';

const DEFAULT_TEMPLATES = {
  otp: 'Your Reviewwo sign-in code is {{otp}}.\n\nIt expires in 5 minutes. Do not share it with anyone.',
  feedback_alert:
    'New feedback for {{business_name}}\n\nRating: {{stars}} of 5\nWhere: {{where}}\nFrom: {{customer_name}}\nContact: {{customer_contact}}\n\n"{{feedback}}"\n\nOpen your Reviewwo dashboard to mark it resolved.',
  test_alert:
    'This is a test message from Reviewwo for {{business_name}}.\n\nFeedback alerts from your NFC cards will arrive on this number.',
};

function fill(template, values) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => (values[key] ?? '').toString());
}

class WhatsAppTransport {
  constructor() {
    this.adapter = waSocket;
  }

  getTemplates() {
    const stored = loadData('templates.json', {});
    return { ...DEFAULT_TEMPLATES, ...(stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {}) };
  }

  saveTemplates(next) {
    const allowed = {};
    for (const key of Object.keys(DEFAULT_TEMPLATES)) {
      if (typeof next?.[key] === 'string' && next[key].trim()) allowed[key] = next[key].slice(0, 2000);
    }
    const merged = { ...this.getTemplates(), ...allowed };
    saveData('templates.json', merged);
    return merged;
  }

  async sendOtp(mobile, otp) {
    const text = fill(this.getTemplates().otp, { otp });
    return this.adapter.sendMessage(mobile, text, 'otp');
  }

  async sendFeedbackAlert(mobile, { businessName, stars, where, customerName, customerContact, feedback }) {
    const text = fill(this.getTemplates().feedback_alert, {
      business_name: businessName || 'your business',
      stars,
      where: where || 'Not specified',
      customer_name: customerName || 'Not given',
      customer_contact: customerContact || 'Not given',
      feedback: feedback || '',
    });
    return this.adapter.sendMessage(mobile, text, 'feedback_alert');
  }

  async sendTestAlert(mobile, { businessName }) {
    const text = fill(this.getTemplates().test_alert, { business_name: businessName || 'your business' });
    return this.adapter.sendMessage(mobile, text, 'test_alert');
  }
}

export const waTransport = new WhatsAppTransport();
