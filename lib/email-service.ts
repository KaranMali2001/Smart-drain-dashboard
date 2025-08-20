import nodemailer from "nodemailer";

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface MotorStatusEmailData {
  motorStatus: "ON" | "OFF";
  distance: number;
  timestamp: number;
  reason?: string;
}

// Hardcoded email address for motor notifications
const NOTIFICATION_EMAIL = "admin@smartdrain.com";

// Email configuration - you should set these as environment variables
const getEmailConfig = (): EmailConfig => ({
  host: process.env.SMTP_HOST || "localhost",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

// Create email transporter
const createTransporter = () => {
  const config = getEmailConfig();

  if (!config.auth.user || !config.auth.pass) {
    console.warn("Email service not configured - missing SMTP credentials");
    return null;
  }

  return nodemailer.createTransport(config);
};

// Generate professional email template
const generateMotorStatusEmail = (
  data: MotorStatusEmailData
): { subject: string; html: string; text: string } => {
  const statusColor = data.motorStatus === "ON" ? "#dc2626" : "#16a34a";
  const statusIcon = data.motorStatus === "ON" ? "🔴" : "🟢";
  const urgencyLevel = data.motorStatus === "ON" ? "HIGH" : "NORMAL";
  const timestamp = new Date(data.timestamp).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });

  const subject = `🚨 Motor Alert: Drainage Pump is now ${data.motorStatus} - ${urgencyLevel} Priority`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Smart Drainage System - Motor Status Alert</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #2563eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #2563eb;
          margin: 0;
          font-size: 28px;
        }
        .status-badge {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 16px;
          margin: 15px 0;
          color: white;
          background-color: ${statusColor};
        }
        .alert-box {
          background: ${data.motorStatus === "ON" ? "#fef2f2" : "#f0fdf4"};
          border-left: 4px solid ${statusColor};
          padding: 20px;
          margin: 20px 0;
          border-radius: 0 8px 8px 0;
        }
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin: 25px 0;
        }
        .detail-item {
          background: #f8fafc;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        .detail-label {
          font-weight: 600;
          color: #475569;
          font-size: 14px;
          margin-bottom: 5px;
        }
        .detail-value {
          font-size: 18px;
          font-weight: bold;
          color: #1e293b;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          color: #64748b;
          font-size: 14px;
        }
        .priority-high {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
        }
        .priority-normal {
          background: linear-gradient(135deg, #16a34a, #15803d);
        }
        @media (max-width: 600px) {
          .detail-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${statusIcon} Smart Drainage System</h1>
          <p style="margin: 10px 0 0 0; color: #64748b;">Automated Motor Status Notification</p>
        </div>

        <div class="alert-box">
          <h2 style="margin: 0 0 10px 0; color: ${statusColor};">
            ${statusIcon} Motor Status Change Detected
          </h2>
          <p style="margin: 0; font-size: 16px;">
            The drainage pump motor has been turned <strong>${
              data.motorStatus
            }</strong> automatically based on water level readings.
          </p>
        </div>

        <div class="status-badge ${
          data.motorStatus === "ON" ? "priority-high" : "priority-normal"
        }">
          Priority: ${urgencyLevel} | Status: ${data.motorStatus}
        </div>

        <div class="detail-grid">
          <div class="detail-item">
            <div class="detail-label">Water Distance</div>
            <div class="detail-value">${data.distance.toFixed(1)} cm</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Motor Status</div>
            <div class="detail-value" style="color: ${statusColor};">${
    data.motorStatus
  }</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Timestamp</div>
            <div class="detail-value" style="font-size: 14px;">${timestamp}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Threshold Status</div>
            <div class="detail-value" style="font-size: 14px; color: ${
              data.distance < 200 ? "#dc2626" : "#16a34a"
            };">
              ${
                data.distance < 200
                  ? "Below 200cm (Critical)"
                  : "Above 200cm (Normal)"
              }
            </div>
          </div>
        </div>

        ${
          data.reason
            ? `
        <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <strong>Reason:</strong> ${data.reason}
        </div>
        `
            : ""
        }

        <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #dbeafe;">
          <h3 style="margin: 0 0 10px 0; color: #2563eb;">System Information</h3>
          <ul style="margin: 0; padding-left: 20px; color: #475569;">
            <li>Automatic threshold: Motor turns ON when distance < 200cm</li>
            <li>This is an automated notification from your Smart Drainage Dashboard</li>
            <li>Motor control is handled automatically based on sensor readings</li>
            ${
              data.motorStatus === "ON"
                ? "<li><strong>Action Required:</strong> Monitor system for proper drainage</li>"
                : "<li>System operating normally</li>"
            }
          </ul>
        </div>

        <div class="footer">
          <p><strong>Smart Drainage Management System</strong></p>
          <p>This is an automated notification. Please do not reply to this email.</p>
          <p>For technical support, contact your system administrator.</p>
          <p style="margin-top: 15px; font-size: 12px;">
            Generated at ${timestamp} | Smart Drain Dashboard v1.0
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    SMART DRAINAGE SYSTEM - MOTOR STATUS ALERT
    
    ${statusIcon} Motor Status: ${data.motorStatus}
    Priority Level: ${urgencyLevel}
    
    DETAILS:
    - Water Distance: ${data.distance.toFixed(1)} cm
    - Motor Status: ${data.motorStatus}
    - Timestamp: ${timestamp}
    - Threshold Status: ${
      data.distance < 200 ? "Below 200cm (Critical)" : "Above 200cm (Normal)"
    }
    ${data.reason ? `- Reason: ${data.reason}` : ""}
    
    SYSTEM INFORMATION:
    - Automatic threshold: Motor turns ON when distance < 200cm
    - This is an automated notification from your Smart Drainage Dashboard
    - Motor control is handled automatically based on sensor readings
    ${
      data.motorStatus === "ON"
        ? "- Action Required: Monitor system for proper drainage"
        : "- System operating normally"
    }
    
    This is an automated notification. Please do not reply to this email.
    For technical support, contact your system administrator.
    
    Generated by Smart Drain Dashboard v1.0
  `;

  return { subject, html, text };
};

// Send motor status email
export const sendMotorStatusEmail = async (
  data: MotorStatusEmailData
): Promise<boolean> => {
  try {
    const transporter = createTransporter();

    if (!transporter) {
      console.log("Email service not configured - skipping email notification");
      return false;
    }

    const { subject, html, text } = generateMotorStatusEmail(data);

    const mailOptions = {
      from: getEmailConfig().auth.user,
      to: NOTIFICATION_EMAIL,
      subject,
      html,
      text,
      priority: data.motorStatus === "ON" ? "high" : "normal" as "high" | "normal",
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Motor status email sent successfully:", result.messageId);
    return true;
  } catch (error) {
    console.error("Failed to send motor status email:", error);
    return false;
  }
};

// Test email configuration
export const testEmailConfig = async (): Promise<boolean> => {
  try {
    const transporter = createTransporter();

    if (!transporter) {
      return false;
    }

    await transporter.verify();
    console.log("Email configuration is valid");
    return true;
  } catch (error) {
    console.error("Email configuration test failed:", error);
    return false;
  }
};
