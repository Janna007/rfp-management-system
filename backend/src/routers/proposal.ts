import express, { NextFunction, Request, Response } from "express";
import { ProposalController } from "../controllers/proposalController";
import { RfpService } from "../services/rfpServices";
import { AIService } from "../utils/aiService";
import { EmailService } from "../utils/emailService";
import { ProposalService } from "../services/proposalService";

const router = express.Router();

const rfpService = new RfpService();
const aiService = new AIService();
const emailService = new EmailService();
const proposalService = new ProposalService();
const proposalController = new ProposalController(
  rfpService,
  aiService,
  emailService,
  proposalService
);

router.get("/", (req: Request, res: Response, next: NextFunction) =>
  proposalController.getProposal(req, res, next)
);

router.post("/:id", (req: Request, res: Response, next: NextFunction) =>
  proposalController.checkForProposal(req, res, next)
);

router.get("/:id", (req: Request, res: Response, next: NextFunction) =>
  proposalController.getAllProposals(req, res, next)
);

router.post("/compare/:id", (req: Request, res: Response, next: NextFunction) =>
  proposalController.compareProposals(req, res, next)
);

export default router;
