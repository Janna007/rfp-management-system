import nodemailer from "nodemailer";
import { Config } from "../config";
import createHttpError from "http-errors";
import  Imap from 'imap'
import { simpleParser, ParsedMail } from "mailparser";


export class EmailService {
  private transporter: nodemailer.Transporter;
  private imapConfig: Imap.Config;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: Config.EMAIL_USER,
        pass: Config.EMAIL_APP_PASSWORD,
      },
    });

      // Configure email receiving (IMAP)
      this.imapConfig = {
        user: Config.EMAIL_USER!,
        password: Config.EMAIL_APP_PASSWORD!,
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false }
      };
    

    
  }
  async sendRFPEmail(
    vendorEmail: string,
    rfp: any,
    emailBody: any
  ) {
    try {

      // console.log(rfp)
      const mailOptions = {
        from: Config.EMAIL_USER,
        to: vendorEmail,
        subject: `RFP: ${rfp.title} - Reference #${rfp._id}`,
        text: emailBody,
        html: `
                  <div style="font-family: Arial, sans-serif;">
                    ${emailBody.replace(/\n/g, "<br>")}
                    <hr>
                    <p><strong>Reference ID:</strong> ${rfp._id}</p>
                    <p><em>Please include this reference ID in your response.</em></p>
                  </div>
                `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      // console.log("Email sent:", info);
      return info;
    } catch (err) {
        console.error('Email send ERROR:', err);
          const error = createHttpError(500, 'Failed to send email')
          throw error
    }
  }

  async checkForResponses(rfpId: string): Promise<any[]> {
    const imap = new Imap(this.imapConfig);
  
    return new Promise((resolve, reject) => {
  
      imap.once("ready", () => {
        imap.openBox("INBOX", true, (err) => { // OPEN IN READ-ONLY MODE
          if (err) return reject(err);
  
          const searchCriteria = [
            ["HEADER", "SUBJECT", rfpId.toString()] // more reliable than SUBJECT
          ];
  
          imap.search(searchCriteria, (err, results) => {
            if (err) return reject(err);
  
            if (!results || results.length === 0) {
              imap.end();
              return resolve([]);
            }
  
            const emails: any[] = [];
            let pending = results.length;
  
            const fetcher = imap.fetch(results, { bodies: "" });
  
            fetcher.on("message", (msg) => {
              msg.on("body", (stream) => {
                simpleParser(stream as any)
                  .then((parsed) => {
                    emails.push({
                      messageId: parsed.messageId,
                      from: parsed.from?.text || "",
                      subject: parsed.subject || "",
                      text: parsed.text || "",
                      date: parsed.date || new Date(),
                    });
                  })
                  .finally(() => {
                    pending--;
                    if (pending === 0) {
                      imap.end();
                      resolve(emails);
                    }
                  });
              });
            });
          });
        });
      });
  
      imap.once("error", (err:any) => reject(err));
  
      imap.connect();
    });
  }
  
}
