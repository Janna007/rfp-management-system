   import mongoose, {Schema } from "mongoose";

   const VendorSchema=new Schema({
      name:{
         type:String,
         required:true
      },
      email:{
         type:String,
         required:true,
         unique:true,
         lowercase:true,
         trim:true,
      },
      phone: String,
      notes: String,   
   },{timestamps:true})

   export const Vendor=mongoose.model("Vendor",VendorSchema)