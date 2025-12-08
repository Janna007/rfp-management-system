import createHttpError from "http-errors";
import { Proposal } from "../models/proposalModel";
import mongoose from "mongoose";

export class ProposalService {
  async createProposal(
    rfpId: string,
    vendorId: string,
    rawEmail: string,
    parsedData: any,
    messageId: string
  ) {
    try {
      return await Proposal.create({
        rfpId,
        vendorId,
        rawEmail,
        status: "parsed",
        messageId,
        ...parsedData,
      });
    } catch (err) {
      console.log(err);
      const error = createHttpError(500, "Error while saving  Proposal data");
      throw error;
    }
  }

  async getProposals(rfpID: string) {
    try {
      const res = await Proposal.aggregate([
        {
          $match: {
            rfpId: new mongoose.Types.ObjectId(rfpID),
          },
        },
        {
          $lookup: {
            from: "vendors",
            localField: "vendorId",
            foreignField: "_id",
            as: "vendor",
          },
        },
        {
          $lookup: {
            from: "rfps",
            localField: "rfpId",
            foreignField: "_id",
            as: "rfp",
          },
        },
      ]);
      return res;
    } catch (err) {
      console.log(err);
      const error = createHttpError(500, "Error while fetching proposals");
      throw error;
    }
  }

  async getProposal(proposalId: string) {
    try {
      const res = await Proposal.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(proposalId),
          },
        },
        {
          $lookup: {
            from: "vendors",
            localField: "vendorId",
            foreignField: "_id",
            as: "vendor",
          },
        },
        {
          $lookup: {
            from: "rfps",
            localField: "rfpId",
            foreignField: "_id",
            as: "rfp",
          },
        },
      ]);
      return res?.length ? res[0] :null
    } catch (err) {
      console.log(err);
      const error = createHttpError(500, "Error while fetching proposals");
      throw error;
    }
  }

  async updateProposal(proposalId: string, updateData: any) {
    try {
      const proposal = await Proposal.findByIdAndUpdate(
        proposalId,
        { $set: updateData },
        { new: true } // Return updated document
      );

      if (!proposal) {
        throw new Error("Proposal not found");
      }

      return proposal;
    } catch (err) {
      console.log(err);
      const error = createHttpError(500, "Error updating proposals");
      throw error;
    }
  }

  async getAll(){
    try {
      return await Proposal.find()
    } catch (err) {
      console.log(err);
      const error = createHttpError(500, "Error while fetching proposals");
      throw error;
    }
  }
}
