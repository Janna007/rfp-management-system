import { NextFunction, Request, Response } from "express";
import { VendorService } from "../services/vendorServices";

export class VendorController {
  constructor(private vendorService: VendorService) {}
  async createVendor(req: Request, res: Response, next: NextFunction) {
    // console.log("called")
    try {
      const vendor = await this.vendorService.createVendor(req.body);
      // console.log(vendor)

      res.json({
        success: true,
        message: "Vendor created successfully",
        data: vendor,
      });
    } catch (error) {
      next(error);
      return;
    }
  }
  async getAllVendors(req: Request, res: Response, next: NextFunction) {
    try {
      const vendors = await this.vendorService.getVendors(req.query);



      res.json({
        ...vendors,
        success: true,
        message: "Vendors fetched successfully",
      });
    } catch (error) {
      next(error);
      return;
    }
  }
  async getVendorById(req: Request, res: Response, next: NextFunction) {
    try {
      const vendor = await this.vendorService.getVendorById(req.params.id);

      res.json({
        success: true,
        message: "Vendor fetched by ID successfully",
        data: vendor,
      });
    } catch (error) {
      next(error);
      return;
    }
  }
  async udpateVendorById(req: Request, res: Response, next: NextFunction) {
    try {
      const vendor = await this.vendorService.updateVendorById({
        _id: req.params.id,
        ...req.body,
      });

      res.json({
        success: true,
        message: "Vendor updated successfully",
        data: vendor,
      });
    } catch (error) {
      next(error);
      return;
    }
  }
  async deleteVendorById(req: Request, res: Response, next: NextFunction) {
    try {
      await this.vendorService.deleteVendorById(req.params.id);
      res.json({
        success: true,
        message: "Vendor deleted successfully"
      });
    } catch (error) {
      next(error);
      return;
    }
  }
}
