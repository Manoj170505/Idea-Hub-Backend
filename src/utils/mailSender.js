const nodemailer = require('nodemailer');

const sendApprovalMail = async (userEmail, userName, role) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #000000; }
            .container { max-width: 600px; margin: 0 auto; background-color: #0a0a0a; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 32px; font-weight: bold; }
            .content { padding: 40px 30px; color: #e5e7eb; }
            .welcome-box { background-color: #1a1a1a; border: 2px solid #10b981; border-radius: 12px; padding: 30px; margin: 20px 0; text-align: center; }
            .role-badge { display: inline-block; background-color: #10b981; color: #000000; padding: 8px 20px; border-radius: 20px; font-weight: bold; font-size: 14px; margin: 10px 0; }
            .button { display: inline-block; background-color: #10b981; color: #000000; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .button:hover { background-color: #059669; }
            .footer { background-color: #0a0a0a; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #1f2937; }
            .features { margin: 30px 0; }
            .feature-item { background-color: #1a1a1a; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #10b981; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Welcome to Idea Hub!</h1>
            </div>
            <div class="content">
                <h2 style="color: #10b981; margin-top: 0;">Hello ${userName}!</h2>
                <p style="font-size: 16px; line-height: 1.6;">
                    Great news! Your account has been approved and you're now part of our innovative community.
                </p>
                
                <div class="welcome-box">
                    <h3 style="color: #10b981; margin-top: 0;">Account Status: Approved ✓</h3>
                    <p>You have been granted access as:</p>
                    <span class="role-badge">${role}</span>
                    <p style="margin-top: 20px; color: #9ca3af;">You can now login and start sharing your innovative ideas!</p>
                </div>

                <div class="features">
                    <h3 style="color: #10b981;">What you can do now:</h3>
                    <div class="feature-item">
                        <strong style="color: #10b981;">📝 Create Posts</strong>
                        <p style="margin: 5px 0 0 0; color: #9ca3af;">Share your innovative ideas with the community</p>
                    </div>
                    <div class="feature-item">
                        <strong style="color: #10b981;">💡 Engage</strong>
                        <p style="margin: 5px 0 0 0; color: #9ca3af;">Like, comment, and collaborate on projects</p>
                    </div>
                    <div class="feature-item">
                        <strong style="color: #10b981;">🌟 Discover</strong>
                        <p style="margin: 5px 0 0 0; color: #9ca3af;">Explore popular and trending innovations</p>
                    </div>
                </div>

                <div style="text-align: center;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" class="button">
                        Login to Your Account
                    </a>
                </div>
            </div>
            <div class="footer">
                <p>Idea Hub - Empowering Innovators Worldwide</p>
                <p style="margin: 10px 0;">If you have any questions, feel free to reach out to our support team.</p>
                <p style="color: #4b5563; margin-top: 20px;">© 2026 Idea Hub. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: `"Idea Hub" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: "🎉 Your Account Has Been Approved!",
        html: htmlTemplate
    };

    return await transporter.sendMail(mailOptions);
};

const sendRejectionMail = async (userEmail, userName) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #000000; }
            .container { max-width: 600px; margin: 0 auto; background-color: #0a0a0a; }
            .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 32px; font-weight: bold; }
            .content { padding: 40px 30px; color: #e5e7eb; }
            .info-box { background-color: #1a1a1a; border: 2px solid #ef4444; border-radius: 12px; padding: 30px; margin: 20px 0; }
            .button { display: inline-block; background-color: #10b981; color: #000000; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { background-color: #0a0a0a; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #1f2937; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Account Application Update</h1>
            </div>
            <div class="content">
                <h2 style="color: #ef4444; margin-top: 0;">Hello ${userName},</h2>
                <p style="font-size: 16px; line-height: 1.6;">
                    Thank you for your interest in joining Idea Hub.
                </p>
                
                <div class="info-box">
                    <p style="margin: 0; font-size: 16px;">
                        After careful review, we regret to inform you that we are unable to approve your account at this time.
                    </p>
                </div>

                <p style="font-size: 16px; line-height: 1.6;">
                    This decision may be due to various factors. If you believe this was made in error or would like to reapply, 
                    please feel free to contact our support team.
                </p>

                <div style="text-align: center;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/contact" class="button">
                        Contact Support
                    </a>
                </div>
            </div>
            <div class="footer">
                <p>Idea Hub - Empowering Innovators Worldwide</p>
                <p style="color: #4b5563; margin-top: 20px;">© 2026 Idea Hub. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: `"Idea Hub" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: "Account Application Update",
        html: htmlTemplate
    };

    return await transporter.sendMail(mailOptions);
};

module.exports = { sendApprovalMail, sendRejectionMail };