import { NextFunction, Request, Response } from "express";
import { RfpService } from "../services/rfpServices";
import { AIService } from "../utils/aiService";
import createHttpError from "http-errors";
import { EmailService } from "../utils/emailService";
export class RfpController {
  constructor(
    private rfpService: RfpService,
    private aiService: AIService,
    private emailService: EmailService
  ) {}
  async parseRfpInput(req: Request, res: Response, next: NextFunction) {
    //  Use AI to parse natural language from body into structured data

    const { naturalLanguageText } = req.body;

    try {
      //call ai service  to parse natural language to structured json
      const parsedRFP = await this.aiService.parseRFPFromNaturalLanguage(
        naturalLanguageText
      );
      // console.log(parsedRFP)

      // const rfp=await this.rfpService.createRfp(parsedRFP)

      res.json({
        success: true,
        message: "RFP created successfully",
        data: parsedRFP,
      });
    } catch (error) {
      next(error);
      return;
    }
  }

  async createRpf(req: Request, res: Response, next: NextFunction) {
    try {
      const { parsedRFP } = req.body;

      const rfp = await this.rfpService.createRfp(parsedRFP);
      res.json({
        success: true,
        message: "RFP created successfully",
        data: rfp,
      });
    } catch (error) {
      next(error);
      return;
    }
  }

  async getAllRfps(req: Request, res: Response, next: NextFunction) {
    try {
      const rfps = await this.rfpService.getRfps(req.query);

      res.json({
        ...rfps,
        success: true,
        message: "RFP fetcheds successfully"
      });
    } catch (error) {
      next(error);
      return;
    }
  }

  async getRfp(req: Request, res: Response, next: NextFunction) {
    // const rfpId=req.params.id

    try {
      const rfp = await this.rfpService.getRfp(req.params.id);
      res.json({
        success: true,
        message: "RfFP fetched by ID successfully",
        data: rfp,
      });
    } catch (error) {
      next(error);
    }
  }

  //send rfp to selected vendors through mail

  async sendRfpsToVendors(req: Request, res: Response, next: NextFunction) {
    try {
      //fing rfp

      const rfp = await this.rfpService.getRfp(req.params.id);

      if (!rfp) {
        const error = createHttpError(404, "RFP NOT FOUND");
        next(error);
        return;
      }

      const { vendorIds } = req.body;

      if (!vendorIds || vendorIds.length === 0) {
        const error = createHttpError(400, "No ventors selected");
        next(error);
        return;
      }

      //get vendor details

      const vendors = await this.rfpService.getSelectedVendors(vendorIds);

      if (vendors.length === 0) {
        const error = createHttpError(404, "Venders Not found");
        next(error);
        return;
      }

      //send email to each vendor

     
        vendors.map(async (vendor) => {
          //create email body from rfp

          const emailBody = await this.aiService.generateRfpEmail(
            rfp,
            vendor.name
          );
          // console.log("emailBody",emailBody)
          // console.log("rfp",rfp)

          //send email using nodemailer

          await this.emailService.sendRFPEmail(vendor.email, rfp, emailBody);
        });
      


      //update status

      if(rfp.status === "draft"){
         await this.rfpService.updateStatus("sent",rfp._id)
      }
      //save vendor data to model
      await this.rfpService.updateSelectVendor(req.params.id, vendorIds);

      res.json({
        success: true,
        message: `RFP sent to ${vendors.length} vendors`,
        data: rfp,
      });
    } catch (error) {
      next(error);
      return;
    }
  }
}
