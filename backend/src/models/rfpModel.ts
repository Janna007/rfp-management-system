import mongoose, { Schema } from "mongoose";

const RFPSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    // Structured data extracted by AI

    items: [
      {
        name: String,
        quantity: Number,
        specifications: String,
      },
    ],

    budget: { type: Number, required: true },
    deliveryDeadline: { type: Date, required: true },
    paymentTerms: String,
    warrantyRequirement: String,

    // Vendors this RFP was sent to
    selectedVendors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
      },
    ],

    status: {
      type: String,
      enum: ["draft", "sent", "receiving_responses", "completed"],
      default: "draft",
    },
  },
  { timestamps: true }
);

export const RFP = mongoose.model("RFP", RFPSchema);
