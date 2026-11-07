import fs from 'fs';
import path from 'path';
import { waSocket } from './socketAdapter.js';

class WhatsAppTransport {
  constructor() {
    this.adapter = waSocket;
    this.templatesFile = path.resolve('data/templates.json');
  }

  getTemplates() {
    try {
      if (fs.existsSync(this.templatesFile)) {
        return JSON.parse(fs.readFileSync(this.templatesFile, 'utf8'));
      }
    } catch (e) {}
    return {
      otp: "Your Reviewwo QR verification code is *{{otp}}*.",
      grievance_alert: "⚠️ Private Shield Alert: {{feedback}}",
      review_invite: "Hi {{customer_name}}, thank you for dining with us!"
    };
  }

  saveTemplates(newTemplates) {
    fs.writeFileSync(this.templatesFile, JSON.stringify(newTemplates, null, 2), 'utf8');
    return newTemplates;
  }

  async sendOtp(mobile, rawOtp) {
    const templates = this.getTemplates();
    const text = templates.otp.replace('{{otp}}', rawOtp);
    return await this.adapter.sendMessage(mobile, text, 'otp_verification');
  }

  async sendGrievanceAlert(managerMobile, { stars, tableNo, customerName, customerPhone, feedback }) {
    const templates = this.getTemplates();
    const cleanPhone = (customerPhone || '').replace(/[^0-9]/g, '');
    let text = templates.grievance_alert
      .replace('{{stars}}', stars)
      .replace('{{table_no}}', tableNo || 'Counter')
      .replace('{{customer_name}}', customerName || 'Guest')
      .replace('{{customer_phone}}', customerPhone || 'Not provided')
      .replace('{{feedback}}', feedback || 'No written comment')
      .replace('{{clean_phone}}', cleanPhone);

    return await this.adapter.sendMessage(managerMobile, text, 'grievance_alert');
  }
}

export const waTransport = new WhatsAppTransport();
