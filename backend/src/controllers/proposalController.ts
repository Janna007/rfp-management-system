import { Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";
import { RfpService } from "../services/rfpServices";
import { AIService } from "../utils/aiService";
import { EmailService } from "../utils/emailService";
import createHttpError from "http-errors";
import { ProposalService } from "../services/proposalService";
import { Proposal } from "../models/proposalModel";

export class ProposalController {
  constructor(
    private rfpService: RfpService,
    private aiService: AIService,
    private emailService: EmailService,
    private proposalService: ProposalService
  ) {}

  async checkForProposal(req: Request, res: Response, next: NextFunction) {
    const { id: rfpId } = req.params;

    try {
      const rfp = await this.rfpService.getRfp(rfpId);

      if (!rfp) {
        const error = createHttpError(404, "RFP NOT FOUND");
        next(error);
        return;
      }

      //check inbox for new  emails with this id as refernce id

      const emailResponses = await this.emailService.checkForResponses(rfpId);
      console.log("emailResponse", emailResponses);

      if (emailResponses.length === 0) {
        return res.json({
          success: true,
          message: "No new proposals found!!",
        });
      }

      //adde that to proposal db

      let newFound = false;

      for (const email of emailResponses) {
        //find vendor
        const exists = await Proposal.findOne({ messageId: email.messageId });

        if (exists) {
          console.log("Skipping duplicate email");
          continue;
        }

        newFound = true;

        let vendor = await rfp.vendors.find((vendor: any) => {
          return email.from.includes(vendor.email);
        });

        //parse response email to structured data

        const parsedData = await this.aiService.parseVendorProposal(
          email.text,
          rfp
        );

        console.log("parsed Email", parsedData);

        //create proposal document

        const proposal = await this.proposalService.createProposal(
          rfpId,
          vendor._id,
          email.text,
          parsedData,
          email.messageId
        );
        console.log(proposal);
      }

      if (!newFound) {
        return res.json({
          success: true,
          message: "No new proposals found!!",
        });
      }

      if (rfp.status === "sent") {
        await this.rfpService.updateStatus("receiving_responses", rfp._id);
      }

      res.json({
        success: true,
        message: "Proposals checked successfully",
      });
    } catch (error) {
      next(error);
      return;
    }
  }

  async getAllProposals(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("Getting all proposals by params ID");
      const proposals = await this.proposalService.getProposals(req.params.id);

      res.json({
        success: true,
        message: "proposals fetched successfully",
        data: proposals,
      });
    } catch (error) {
      next(error);
      return;
    }
  }

  async getProposal(req: Request, res: Response, next: NextFunction) {
    try {
      const proposals = await this.proposalService.getAll();

      res.json({
        success: true,
        message: "proposals fetched successfully",
        data: proposals,
      });
    } catch (error) {
      next(error);
      return;
    }
  }

  async compareProposals(req: Request, res: Response, next: NextFunction) {
    try {
      const rfp = await this.rfpService.getRfp(req.params.id);

      const proposals = await this.proposalService.getProposals(req.params.id);

      //compare prposals useing rfp and proposals

      const comparison = await this.aiService.compareProposals(rfp, proposals);

      //store ai score

      console.log("comparison",comparison)

      for (const vendorScore of comparison.vendorScores) {
        // Find the matching proposal by vendorId

        if (vendorScore?.proposalId) {
          // Update the proposal with AI score and evaluation details
          await this.proposalService.updateProposal(vendorScore?.proposalId, {
            aiScore: vendorScore.score,
            aiPros: vendorScore.pros,
            aiCons: vendorScore.pros,
            aiSummary: vendorScore.summary, // Optional: store pros     // Optional: store cons
            status: "evaluated", // Update status
            isBest:
              comparison.recommendation?.proposalId === vendorScore?.proposalId,
          });
        }
      }

      const proposal = await this.proposalService.getProposal(
        comparison.recommendation?.proposalId
      );

      const response = {
        proposal: proposal,
        ...comparison.recommendation,
        summary: comparison.summary,
      };

      res.json({ success: true, data: response });
    } catch (error) {
      next(error);
      return;
    }
  }
}
