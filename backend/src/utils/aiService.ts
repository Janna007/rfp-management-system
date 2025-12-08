import { GoogleGenAI } from "@google/genai";
import { Config } from "../config";
import createHttpError from "http-errors";

const ai = new GoogleGenAI({
  apiKey: Config.GEMINI_API_KEY,
});

export class AIService {
  async parseRFPFromNaturalLanguage(naturalLanguage: string) {
    try {
      const prompt = `
         You are an AI assistant that converts procurement requests into structured data.
         
         User's procurement request:
         "${naturalLanguage}"
         
         Extract and return a JSON object with the following structure:
         {
           "title": "Brief title for this RFP",
           "description": "Full description",
           "items": [
             {
               "name": "Item name",
               "quantity": number,
               "specifications": "Item specs"
             }
           ],
           "budget": number (total budget),
           "deliveryDeadline": "ISO date string",
           "paymentTerms": "Payment terms",
           "warrantyRequirement": "Warranty requirement"
         }
         
         Return ONLY valid JSON, no additional text.
         `;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    quantity: { type: "number" },
                    specifications: { type: "string" },
                  },
                },
              },
              budget: { type: "number" },
              deliveryDeadline: { type: "string", format: "date-time" },
              paymentTerms: { type: "string" },
              warrantyRequirement: { type: "string" },
            },
            required: ["title", "description", "budget", "deliveryDeadline"],
          },
        },
      });

      if (!response.text) {
        const error = createHttpError(500, "AI parsing error");
        throw error;
      }

      const parsed = JSON.parse(response.text);
      return parsed;
    } catch (err) {
      console.error("AI parsing error:", err);
      const error = createHttpError(500, "AI parsing error");
      throw error;
    }
  }

  async parseVendorProposal(email: string, rfp: any) {
    try {
      const prompt = `
       You are analyzing a vendor's response to an RFP.
       
       ORIGINAL RFP REQUIREMENTS:
       ${JSON.stringify(rfp)}
       
       VENDOR'S EMAIL RESPONSE:
       "${email}"
       
       Extract the following information and return as JSON:
       {
         "items": [
           {
             "name": "Item name",
             "unitPrice": number,
             "quantity": number,
             "totalPrice": number,
             "specifications": "What they're offering"
           }
         ],
         "totalPrice": number,
         "deliveryTime": "How long until delivery",
         "paymentTerms": "Their payment terms",
         "warranty": "Warranty offered",
         "additionalTerms": String,
        "completeness": number (0-100, how well they addressed the RFP)
       }
       `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: {
            type: "object",
            properties: {
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    unitPrice: { type: "number" },
                    quantity: { type: "number" },
                    totalPrice: { type: "number" },
                    specifications: { type: "string" },
                  },
                },
              },
              totalPrice: { type: "number" },
              deliveryTime: { type: "string", format: "date-time" },
              paymentTerms: { type: "string" },
              warranty: { type: "string" },
              additionalTerms: { type: "string" },
              completeness: { type: "number" },
            },
          },
        },
      });

      if (!response.text) {
        const error = createHttpError(500, "AI parsing error");
        throw error;
      }

      const parsed = JSON.parse(response.text);
      return parsed;
    } catch (err) {
      console.error("AI parsing error:", err);
      const error = createHttpError(500, "AI parsing error");
      throw error;
    }
  }

  async generateRfpEmail(rfp: any, vendor: any) {
    try {
      const prompt = `
        You are an expert B2B procurement communication writer.
        
        Write a **professional, concise, and vendor-friendly RFP invitation email**.
        
        Use ONLY the information from the RFP object and vendor name below.
        
        ------------------------
        RFP DATA (JSON):
        ${JSON.stringify(rfp, null, 2)}
        
        VENDOR NAME:
        ${vendor}


        SENDER NAME:
        "Janna Kondeth"

        SENDER COMPANY:
        "Stoilett PVT LTD"

        SUBMISSION DEADLINE
        "2 Days from the date of request"
        ------------------------

        
        ### Email Requirements
        - Write in a formal but friendly business tone.
        - Start with a clear greeting using the vendor name.
        - Write a short introduction describing why the vendor is being contacted.
        - Summarize the RFP project in 2–3 sentences using ONLY data from the RFP object.
        - List the requirements clearly (convert JSON fields into bullet points).
        - Clearly mention budget, delivery timeline, and any other constraints present in the RFP data.
        - Add a “What we need in your proposal” section (bullet points).
        - Add clear submission instructions (fallback text if not provided in RFP).
        - End with a professional closing.
        - **Do NOT create any extra fictional details**.
        - **Do NOT include a subject line.**
        - **Return only the email body text.**
        
        ### Format:
        - Use markdown for headings (**bold**) and bullet lists.
        - Ensure the output looks like a polished business email.
        
        Generate the final email now.
        `;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      if (!response.text) {
        const error = createHttpError(500, "Email generating error");
        throw error;
      }

      return response.text;
    } catch (err) {
      console.error("AI parsing error:", err);
      const error = createHttpError(500, "Failed to generate RFP email");
      throw error;
    }
  }

  async compareProposals(rfp: any, proposals: any) {
    console.log(proposals);

    // Format all proposals for AI
    const proposalsText = proposals
      .map(
        (p: any, idx: any) => `
  VENDOR ${idx + 1}: ${p.vendor[0].name} (ID: ${p.vendor[0]._id})
  - ProposalId:$${p._id}
  - Total Price: $${p.totalPrice}
  - Delivery: ${p.deliveryTime}
  - Payment Terms: ${p.paymentTerms}
  - Warranty: ${p.warranty}
  - Completeness: ${p.completeness}%
  - Items: ${JSON.stringify(p.items)}
        `
      )
      .join("\n---\n");

    console.log({ proposalsText });

    try {
      const prompt = `
          You are helping evaluate vendor proposals for an RFP.
          
          ORIGINAL REQUIREMENTS:
          Title:$${rfp.title}
          Budget: $${rfp.budget}
          Items: ${JSON.stringify(rfp.items)}
          Deadline: ${rfp.deliveryDeadline}
          
          VENDOR PROPOSALS:
          ${proposalsText}
          
          Provide a comprehensive analysis:
          1. Score each vendor (0-100) based on:
             - Price competitiveness (within budget)
             - How well they met requirements (completeness score)
             - Delivery time (faster is better)
             - Warranty terms (longer is better)
             - Payment terms (flexibility)
          
          2. For each vendor, list:
             - 3-5 specific pros (strengths)
             - 2-4 specific cons (weaknesses)
          
          3. Recommend the best vendor with detailed reasoning
          
          4. Identify any risk factors to consider
          
          5. Provide an executive summary
          
          IMPORTANT: In the vendorScores array, you MUST include the EXACT vendorId (the MongoDB ObjectId) 
          that appears after each vendor's name in the proposals above. Do NOT modify or generate new IDs.
          For example, if the proposal shows "VENDOR 1: Dell (ID: 674ab123c456789def012345)", 
          you must return "vendorId": "674ab123c456789def012345" in your response.

          In the recommendation section, you MUST include the EXACT ProposalId (the MongoDB ObjectId) 
          as proposalId Do NOT modify or generate new IDs.
           
          Be objective and data-driven in your analysis.
          `;

      console.log({ prompt });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              vendorScores: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    vendorName: { type: "string" },
                    vendorId: { type: "string" },
                    proposalId: { type: "string" },
                    score: { type: "number" },
                    pros: {
                      type: "string",
                    },
                    cons: {
                      type: "string",
                    },
                    summary:{
                      type:"string"
                    }
                  },
                  required: ["vendorName", "vendorId", "score", "pros", "cons","summary","proposalId"],
                },
              },
              recommendation: {
                type: "object",
                properties: {
                  rfpTitle: { type: "string" },
                  proposalId: { type: "string" },
                  bestVendor: { type: "string" },
                  reasoning: { type: "string" },
                  riskFactors: {
                    type: "array",
                    items: { type: "string" },
                  },
                },
                required: [
                  "rfpTitle",
                  "proposalId",
                  "bestVendor",
                  "reasoning",
                  "riskFactors",
                ],
              },
              summary: { type: "string" },
            },
            required: ["vendorScores", "recommendation", "summary"],
          },
        },
      });

      

      if (!response.text) {
        const error = createHttpError(500, "AI parsing error");
        throw error;
      }

      const parsed = JSON.parse(response.text);
      return parsed;
    } catch (err) {
      console.error("AI parsing error:", err);
      const error = createHttpError(500, "Failed to generate Result");
      throw error;
    }
  }
}
