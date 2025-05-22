import { Resend } from 'resend';
import dotenv from 'dotenv'
dotenv.config()

if(!process.env.RESEND_API){
    throw new Error("RESEND_API is missing! Hãy kiểm tra lại file .env và khởi động lại server.");
}

const resend = new Resend(process.env.RESEND_API);


const sendEmail = async({sendTo, subject, html })=>{
    try {
        const { data, error } = await resend.emails.send({
            from: 'Binkeyit <noreply@smartwatchultra.online>',
            to: sendTo,
            subject: subject,
            html: html,
        });

        if (error) {
            return console.error({ error });
        }

        return data
    } catch (error) {
        console.log(error)
    }
}

export default sendEmail

