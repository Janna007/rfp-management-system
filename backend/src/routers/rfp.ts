import express, { NextFunction, Request, Response } from 'express'
import { RfpController } from '../controllers/rfpController'
import { RfpService } from '../services/rfpServices'
import { AIService } from '../utils/aiService'
import { EmailService } from '../utils/emailService'

const router=express.Router()

const rfpService=new RfpService()
const aiService=new AIService()
const emailService=new EmailService()
const rfpController=new RfpController(rfpService,aiService,emailService)

router.post(
    '/',
    (req: Request, res: Response, next: NextFunction) =>
        rfpController.parseRfpInput(req, res, next),
)

router.post(
    '/create',
    (req: Request, res: Response, next: NextFunction) =>
        rfpController.createRpf(req, res, next),
)

router.get(
    '/',
    (req: Request, res: Response, next: NextFunction) =>
        rfpController.getAllRfps(req, res, next),
)
router.get(
    '/:id',
    (req: Request, res: Response, next: NextFunction) =>
        rfpController.getRfp(req, res, next),
)

router.post(
    '/:id',
    (req: Request, res: Response, next: NextFunction) =>
        rfpController.sendRfpsToVendors(req, res, next),
)




export default router