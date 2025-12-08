import createHttpError from "http-errors";
import { RFP } from "../models/rfpModel";
import { Vendor } from "../models/vendorModel";
import mongoose, { PipelineStage } from "mongoose";

export class RfpService {
  async createRfp(parsedRFP: any) {
    try {
      const res = await RFP.create(parsedRFP);
      return res;
    } catch (err) {
      console.log(err);
      const error = createHttpError(500, "Error while parsing data");
      throw error;
    }
  }

  async getRfps(query: any) {
    const { limit = 10, page = 1, search } = query;
    // console.log(search)

    const skip = (page - 1) * limit;

    let matchObj: Record<string, any> = {};

 
    
    if (search) {
      matchObj.title = { $regex: search, $options: "i" };
    }

    const pipeline: PipelineStage[] = [
      { $match: matchObj },
      {
        $lookup: {
          from: "vendors",
          localField: "selectedVendors",
          foreignField: "_id",
          as: "vendors",
        },
      },
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
      const result = await RFP.aggregate(pipeline).exec();


      // console.log(result[0])
      return {
        data: result[0]?.data,
        total: result[0]?.total || 0,
        page,
        limit,
      };


    } catch (err) {
      console.log(err);
      const error = createHttpError(500, "Error while ftching data");
      throw error;
    }
  }

  async getRfp(rfpId: string) {
    try {
      const res = await RFP.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(rfpId),
          },
        },
        {
          $lookup: {
            from: "vendors",
            localField: "selectedVendors",
            foreignField: "_id",
            as: "vendors",
          },
        },
      ]);
      return res?.length ? res[0] : null;
    } catch (err) {
      console.log(err);
      const error = createHttpError(500, "Error while getting rfp by ID");
      throw error;
    }
  }

  async getSelectedVendors(vendorIds: string[]) {
    try {
      const vendors = await Vendor.find({ _id: { $in: vendorIds } });
      return vendors;
    } catch (err) {
      console.log(err);
      const error = createHttpError(
        500,
        "Error while getting selected vendors"
      );
      throw error;
    }
  }

  async updateSelectVendor(rfpId: string, vendorIds: string[]) {
    try {
      return await RFP.findByIdAndUpdate(
        rfpId,
        { $addToSet: { selectedVendors: { $each: vendorIds } } },
        { new: true }
      )
        .lean()
        .exec();
    } catch (err) {
      console.log(err);
      const error = createHttpError(
        500,
        "Error while updating selected vendors"
      );
      throw error;
    }
  }

  async updateStatus(status:string,rfpId:string){
    try {
      return await RFP.findByIdAndUpdate(
        rfpId,
        {status},
        { new: true }
      )
        .lean()
        .exec();
    } catch (err) {
      console.log(err);
      const error = createHttpError(
        500,
        "Error while updating status "
      );
      throw error;
    }
  }
}
