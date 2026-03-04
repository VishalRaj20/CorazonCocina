import twilio from 'twilio';

export const sendSMS = async (to, message) => {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_PHONE_NUMBER) {
        console.log(`\n--- [DUMMY SMS] ---\nTo: ${to}\nMessage:\n${message}\n-------------------\n`);
        return;
    }
    try {
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to
        });
        console.log(`SMS sent to ${to}`);
    } catch (error) {
        console.error(`Twilio SMS Error:`, error.message);
    }
};

export const sendWhatsApp = async (to, message) => {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_WHATSAPP_NUMBER) {
        console.log(`\n--- [DUMMY WHATSAPP] ---\nTo: ${to}\nMessage:\n${message}\n------------------------\n`);
        return;
    }
    try {
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create({
            body: message,
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${to}`
        });
        console.log(`WhatsApp sent to ${to}`);
    } catch (error) {
        console.error(`Twilio WhatsApp Error:`, error.message);
    }
};
