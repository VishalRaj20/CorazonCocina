import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, html) => {
    if (!process.env.SMTP_HOST) {
        console.log(`\n--- [DUMMY EMAIL] ---\nTo: ${to}\nSubject: ${subject}\nContent: (HTML Content length: ${html?.length})\n---------------------\n`);
        return;
    }
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        await transporter.sendMail({
            from: `"Corazon Cocina" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html
        });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error(`Nodemailer Error:`, error.message);
    }
};
