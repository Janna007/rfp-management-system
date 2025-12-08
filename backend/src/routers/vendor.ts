import express, { NextFunction, Request, Response } from "express";
import { VendorService } from "../services/vendorServices";
import { VendorController } from "../controllers/vendorController";

const router = express.Router();

const vendorService = new VendorService();
const vendorController = new VendorController(vendorService);

router.post("/", (req: Request, res: Response, next: NextFunction) =>
  vendorController.createVendor(req, res, next)
);
router.get("/", (req: Request, res: Response, next: NextFunction) =>
  vendorController.getAllVendors(req, res, next)
);
router.get("/:id", (req: Request, res: Response, next: NextFunction) =>
  vendorController.getVendorById(req, res, next)
);
router.patch("/:id", (req: Request, res: Response, next: NextFunction) =>
  vendorController.udpateVendorById(req, res, next)
);
router.delete("/:id", (req: Request, res: Response, next: NextFunction) =>
  vendorController.deleteVendorById(req, res, next)
);

export default router;
