import createHttpError from "http-errors";
import { Vendor } from "../models/vendorModel";
import { PipelineStage } from "mongoose";

export class VendorService {
  async createVendor(vendor: any) {
    try {
      // const isExist=await Vendor.findOne({email:vendor.email})
      // if(isExist){
      //   const error = createHttpError(400, "Vendor With this email already exist");
      //  throw error;
      // }
      return await Vendor.create(vendor);
    } catch (err) {
      console.log(err);
      const error = createHttpError(500, "Error while creating vendor");
      throw error;
    }
  }

  async getVendors(query: any) {
    const { limit = 10, page = 1, search } = query;

    const skip = (page - 1) * limit;

    let matchObj: Record<string, any> = {};

    if (search) {
      matchObj.name = { $regex: search, $options: "i" };
    }

    const pipeline: PipelineStage[] = [
      { $match: matchObj },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: Number(limit) }],
          totalCount: [{ $count: "count" }],
        },
      },
      {
        $project: {
          data: 1,
          total: { $arrayElemAt: ["$totalCount.count", 0] },
        },
      },
    ];

    try {
      const result = await Vendor.aggregate(pipeline).exec();

      return {
        data: result[0]?.data,
        total: result[0]?.total || 0,
        page,
        limit,
      };
    } catch (err) {
      console.log(err);
      const error = createHttpError(500, "Error while getting vendors");
      throw error;
    }
  }

  async getVendorById(vendorId: string) {
    try {
      return await Vendor.findById(vendorId).lean().exec();
    } catch (err) {
      console.log(err);
      const error = createHttpError(500, "Error while getting vendor by ID");
      throw error;
    }
  }

  async updateVendorById(data: any) {
    try {
      return await Vendor.findByIdAndUpdate(data?._id, data, { new: true })
        .lean()
        .exec();
    } catch (err) {
      console.log(err);
      const error = createHttpError(500, "Error while updating vendor by ID");
      throw error;
    }
  }

  async deleteVendorById(vendorId: string) {
    try {
      return await Vendor.findByIdAndDelete(vendorId).lean().exec();
    } catch (err) {
      console.log(err);
      const error = createHttpError(500, "Error while deleting vendor by ID");
      throw error;
    }
  }
}
