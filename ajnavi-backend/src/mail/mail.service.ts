import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly config: ConfigService) {
    this.initTransporter();
  }

  private initTransporter() {
    const host = this.config.get<string>("SMTP_HOST", "smtp.gmail.com");
    const port = Number(this.config.get<number>("SMTP_PORT", 465));
    const user = this.config.get<string>("SMTP_USER", "ajnavi.live@gmail.com");
    const pass = this.config.get<string>("SMTP_PASS");
    const secure = this.config.get<string>("SMTP_SECURE") === "true" || port === 465;

    if (user && pass) {
      if (host.includes("gmail") || user.endsWith("@gmail.com")) {
        this.transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user,
            pass: pass.replace(/\s+/g, ""), // Remove any spaces from app password
          },
        });
        this.logger.log(`Gmail SMTP configured for sender: ${user}`);
      } else {
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure,
          auth: { user, pass: pass.replace(/\s+/g, "") },
        });
        this.logger.log(`SMTP configured with host: ${host}:${port} (user: ${user})`);
      }
    } else {
      this.logger.warn(`SMTP credentials not fully provided (user: ${user}, pass: ${pass ? "present" : "missing"}). Emails will be logged to console.`);
    }
  }

  async sendLoginAlert(toEmail: string, clientIp?: string, isNewSignup: boolean = false): Promise<{ sent: boolean; message: string }> {
    const sender = this.config.get<string>("SMTP_USER", "ajnavi.live@gmail.com");
    const fromAddress = this.config.get<string>("SMTP_FROM") || `"Ajnavi" <${sender}>`;
    const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata", dateStyle: "full", timeStyle: "medium" });

    const title = isNewSignup ? "Welcome to Ajnavi! Your account is active" : "You just logged in to Ajnavi";
    const badge = isNewSignup ? "Account Created & Logged In" : "Security Notification";
    const subject = isNewSignup ? "✨ Welcome to Ajnavi - Account Created & Login Alert" : "✨ New Login to Ajnavi";

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f6f8; margin: 0; padding: 30px; color: #19171c; }
            .card { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 24px; padding: 36px; border: 1px solid #e7e2e8; box-shadow: 0 10px 30px rgba(0,0,0,0.04); }
            .logo { font-size: 22px; font-weight: 800; color: #4a4252; margin-bottom: 24px; display: flex; align-items: center; gap: 8px; }
            .badge { display: inline-block; background: #eee9ed; color: #715b61; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 12px; margin-bottom: 12px; }
            h1 { font-size: 24px; font-weight: 800; color: #19171c; margin: 0 0 12px 0; }
            p { font-size: 15px; line-height: 24px; color: #605763; margin: 0 0 16px 0; }
            .box { background: #fdfafc; border: 1px solid #eee9ed; border-radius: 16px; padding: 18px; margin: 20px 0; font-size: 14px; }
            .box-row { display: flex; justify-content: space-between; margin-bottom: 8px; color: #715b61; }
            .box-row strong { color: #19171c; }
            .footer { margin-top: 32px; font-size: 12px; color: #a497a1; text-align: center; border-top: 1px solid #eee9ed; padding-top: 18px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="logo">✨ Ajnavi</div>
            <span class="badge">${badge}</span>
            <h1>${title}</h1>
            <p>Hello,</p>
            <p>Your email <strong>${toEmail}</strong> was recently used to ${isNewSignup ? "create a new account and log into" : "log into"} your Ajnavi account.</p>
            
            <div class="box">
              <div class="box-row"><span>Time:</span> <strong>${now}</strong></div>
              ${clientIp ? `<div class="box-row"><span>IP Address:</span> <strong>${clientIp}</strong></div>` : ""}
              <div class="box-row" style="margin-bottom: 0;"><span>Status:</span> <strong style="color: #10b981;">Successful ${isNewSignup ? "Signup & Login" : "Login"}</strong></div>
            </div>

            <p>You're all set! Start meeting interesting people through private text or video chat right now.</p>
            
            <p style="font-size: 13px; color: #9c8e9b; margin-top: 24px;">If you did not initiate this action, someone may have entered your email address by mistake.</p>
            
            <div class="footer">
              © 2026 Ajnavi (अजनबी). Private, spontaneous conversations.
            </div>
          </div>
        </body>
      </html>
    `;

    if (!this.transporter) {
      this.logger.log(`[SIMULATED EMAIL] To: ${toEmail} | Subject: ${subject} | Time: ${now}`);
      return { sent: false, message: "SMTP not configured. Email logged to console." };
    }

    try {
      const info = await this.transporter.sendMail({
        from: fromAddress,
        to: toEmail,
        subject,
        text: `You have successfully logged in to Ajnavi at ${now}. Welcome to Ajnavi!`,
        html,
      });

      this.logger.log(`Notification email sent to ${toEmail}. Message ID: ${info.messageId}`);
      return { sent: true, message: `Email sent successfully (ID: ${info.messageId})` };
    } catch (err: any) {
      this.logger.error(`Failed to send email to ${toEmail}: ${err.message}`);
      return { sent: false, message: `Failed to send email: ${err.message}` };
    }
  }
}
