import nodemailer from 'nodemailer';
import { type ContactInfo, type Contact } from './schema';

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured = false;
  private isTestAccount = false;

  constructor() {
    this.setupTransporter();
  }

  private setupTransporter() {
    try {
      // Check if production email credentials are available
      const emailUser = process.env.EMAIL_USER;
      const emailPass = process.env.EMAIL_PASS;
      const emailService = process.env.EMAIL_SERVICE || 'gmail';

      if (emailUser && emailPass) {
        // Production email configuration
        this.transporter = nodemailer.createTransport({
          service: emailService,
          auth: {
            user: emailUser,
            pass: emailPass
          }
        });

        this.isConfigured = true;
        this.isTestAccount = false;
        console.log(`✅ Email service configured with ${emailService}:`, emailUser);
      } else {
        // Fallback to test account for development
        console.log('⚠️  Production email not configured, using test account');
        this.createTestAccount();
      }
      
    } catch (error) {
      console.error('Failed to setup email transporter:', error);
      this.isConfigured = false;
    }
  }

  private async createTestAccount() {
    try {
      // Create a test account with Ethereal Email
      const testAccount = await nodemailer.createTestAccount();
      
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      this.isConfigured = true;
      this.isTestAccount = true;
      console.log('Email service configured with test account:', testAccount.user);
    } catch (error) {
      console.error('Failed to create test email account:', error);
      this.isConfigured = false;
    }
  }

  async sendContactNotification(contact: Contact, adminContactInfo: ContactInfo): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      console.log('Email service not configured, skipping email notification');
      return false;
    }

    try {
      const fromName = process.env.EMAIL_FROM_NAME || 'WeisCandle Website';
      const fromAddress = process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER || 'noreply@weiscandle.com';
      
      const mailOptions = {
        from: `"${fromName}" <${fromAddress}>`,
        to: adminContactInfo.email,
        subject: `Pesan Baru dari Website: ${contact.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50; border-bottom: 2px solid #e74c3c; padding-bottom: 10px;">
              Pesan Baru dari Website WeisCandle
            </h2>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #34495e; margin-top: 0;">Detail Pengirim:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #2c3e50; width: 120px;">Nama:</td>
                  <td style="padding: 8px 0; color: #34495e;">${contact.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #2c3e50;">Email:</td>
                  <td style="padding: 8px 0; color: #34495e;">
                    <a href="mailto:${contact.email}" style="color: #3498db; text-decoration: none;">
                      ${contact.email}
                    </a>
                  </td>
                </tr>
                ${contact.phone ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #2c3e50;">Telepon:</td>
                  <td style="padding: 8px 0; color: #34495e;">
                    <a href="tel:${contact.phone}" style="color: #3498db; text-decoration: none;">
                      ${contact.phone}
                    </a>
                  </td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #2c3e50;">Subjek:</td>
                  <td style="padding: 8px 0; color: #34495e;">${contact.subject}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #2c3e50;">Waktu:</td>
                  <td style="padding: 8px 0; color: #34495e;">
                    ${new Date(contact.createdAt).toLocaleString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                </tr>
              </table>
            </div>

            <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
              <h3 style="color: #34495e; margin-top: 0;">Pesan:</h3>
              <div style="color: #2c3e50; line-height: 1.6; white-space: pre-wrap;">${contact.message}</div>
            </div>

            <div style="margin-top: 30px; padding: 15px; background-color: #ecf0f1; border-radius: 5px; font-size: 12px; color: #7f8c8d;">
              <p style="margin: 0;"><strong>Catatan:</strong> Email ini dikirim otomatis dari website WeisCandle. 
              Silakan balas langsung ke email pengirim untuk merespons pesan ini.</p>
            </div>
          </div>
        `,
        text: `
Pesan Baru dari Website WeisCandle

Detail Pengirim:
- Nama: ${contact.name}
- Email: ${contact.email}
${contact.phone ? `- Telepon: ${contact.phone}` : ''}
- Subjek: ${contact.subject}
- Waktu: ${new Date(contact.createdAt).toLocaleString('id-ID')}

Pesan:
${contact.message}

---
Email ini dikirim otomatis dari website WeisCandle.
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      // Log the preview URL for test emails
      if (this.isTestAccount) {
        console.log('Email sent successfully!');
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      } else {
        console.log('Email sent successfully to:', adminContactInfo.email);
      }

      return true;
    } catch (error) {
      console.error('Failed to send email notification:', error);
      return false;
    }
  }

  async sendAutoReply(contact: Contact): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      console.log('Email service not configured, skipping auto-reply');
      return false;
    }

    try {
      const fromName = process.env.EMAIL_FROM_NAME || 'WeisCandle';
      const fromAddress = process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER || 'noreply@weiscandle.com';
      
      const mailOptions = {
        from: `"${fromName}" <${fromAddress}>`,
        to: contact.email,
        subject: 'Terima kasih atas pesan Anda - WeisCandle',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; padding: 20px; background-color: #f8f9fa;">
              <h1 style="color: #2c3e50; margin: 0;">WeisCandle</h1>
              <p style="color: #7f8c8d; margin: 5px 0 0 0;">Workshop Lilin Aromaterapi</p>
            </div>
            
            <div style="padding: 30px 20px;">
              <h2 style="color: #2c3e50;">Halo ${contact.name},</h2>
              
              <p style="color: #34495e; line-height: 1.6;">
                Terima kasih telah menghubungi WeisCandle! Kami telah menerima pesan Anda dengan subjek 
                "<strong>${contact.subject}</strong>" dan akan merespons dalam waktu 24 jam.
              </p>
              
              <div style="background-color: #e8f6f3; border-left: 4px solid #27ae60; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #27ae60;">
                  <strong>📱 Butuh respons lebih cepat?</strong><br>
                  Hubungi kami langsung via WhatsApp di +62 812-3456-7890
                </p>
              </div>
              
              <h3 style="color: #2c3e50;">Informasi Kontak Kami:</h3>
              <ul style="color: #34495e; line-height: 1.8;">
                <li><strong>Alamat:</strong> Jl. Raya No. 123, Kemang, Jakarta Selatan</li>
                <li><strong>Telepon:</strong> +62 812-3456-7890</li>
                <li><strong>Email:</strong> info@weiscandle.com</li>
                <li><strong>Jam Operasional:</strong> Senin - Sabtu, 09:00 - 18:00</li>
              </ul>
              
              <p style="color: #34495e; line-height: 1.6;">
                Salam hangat,<br>
                <strong>Tim WeisCandle</strong>
              </p>
            </div>
            
            <div style="background-color: #34495e; color: white; text-align: center; padding: 20px; font-size: 12px;">
              <p style="margin: 0;">© 2024 WeisCandle - Workshop Lilin Aromaterapi Terpercaya</p>
            </div>
          </div>
        `,
        text: `
Halo ${contact.name},

Terima kasih telah menghubungi WeisCandle! Kami telah menerima pesan Anda dengan subjek "${contact.subject}" dan akan merespons dalam waktu 24 jam.

Butuh respons lebih cepat? Hubungi kami langsung via WhatsApp di +62 812-3456-7890

Informasi Kontak Kami:
- Alamat: Jl. Raya No. 123, Kemang, Jakarta Selatan
- Telepon: +62 812-3456-7890
- Email: info@weiscandle.com
- Jam Operasional: Senin - Sabtu, 09:00 - 18:00

Salam hangat,
Tim WeisCandle

© 2024 WeisCandle - Workshop Lilin Aromaterapi Terpercaya
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      if (this.isTestAccount) {
        console.log('Auto-reply sent successfully!');
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      } else {
        console.log('Auto-reply sent successfully to:', contact.email);
      }

      return true;
    } catch (error) {
      console.error('Failed to send auto-reply:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
