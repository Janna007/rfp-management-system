AI-Powered RFP Management System

Website Link:-https://rfp-management-mu.vercel.app/

## Features

- ** AI-Powered RFP Creation**: Convert natural language descriptions into structured RFPs using Google Gemini AI
- ** Vendor Management**: Maintain vendor master data with contact information
- ** Automated Email Integration**: Send RFPs and receive proposals via email (SMTP/IMAP)
- ** Intelligent Proposal Parsing**: AI automatically extracts pricing, terms, and specifications from vendor emails
- ** Smart Comparison**: AI-powered proposal evaluation with scoring, pros/cons analysis, and recommendations


## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher)
- **MongoDB** (v7.x or higher) 
- **Git**
- **Gmail Account** with App Password
  - You'll need a Gmail account for email integration
  - 2-Factor Authentication must be enabled
- **Google Gemini API Key**
  - Get free API key from: https://makersuite.google.com/app/apikey



## Installation & Setup

### **Step 1: Clone the Repository**

git clone https://github.com/Janna007/rfp-management-system.git
cd rfp-management-system


### **Step 2: Backend Setup**

# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
  .env.dev

# Edit .env with your actual credentials


### **Step 3: Frontend Setup**

cd ../frontend

# Install dependencies
npm install

# Create environment file
  .env

### **Step 4: Database Setup**


**Option B: MongoDB Atlas (Cloud) or Local MongoDB**
1. Create free account at https://www.mongodb.com/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGO_DB_URL` in backend `.env`

### **Step 5: Get Gmail App Password**

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not already enabled)
3. Go to https://myaccount.google.com/apppasswords
4. Select app: **Mail**
5. Select device: **Other** (enter "RFP System")
6. Click **Generate**
7. Copy the 16-character password
8. Add to backend `.env` as `EMAIL_APP_PASSWORD`


### **Step 6: Get Gemini API Key**

1. Go to https://makersuite.google.com/app/apikey
2. Click **"Get API Key"**
3. Create or select a project
4. Copy the API key
5. Add to backend `.env` as `GEMINI_API_KEY`



## ▶️ Running the Application

### **Start Backend Server**

# From backend directory
cd backend

# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start

### **Start Frontend Server**

# From frontend directory 
cd frontend

# Start React development server
npm run dev



## Tech Stack

### **Frontend**
- **React** - UI framework
- **React Router**  - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling

### **Backend**
- **Node.js** - Runtime
- **Express**  - Web framework
- **TypeScript** - Type safety
- **Mongoose**  - MongoDB ODM

### **Database**
- **MongoDB**  - NoSQL database

### **AI/ML**
- **Google Gemini 2.0 Flash** - Natural language processing


### **Email Integration**
- **Nodemailer** - SMTP email sending
- **imap** - IMAP email receiving
- **mailparser** - Email content parsing

### **Key Libraries**
- `dotenv` - Environment variables
- `cors` - Cross-origin resource sharing


## API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.


##  Design Decisions & Assumptions

### **Key Design Decisions**

1. **AI Provider Choice: Gemini over OpenAI**
   - **Reason**: Free tier, excellent JSON schema support, fast response times
   - **Trade-off**: Less mature than GPT-4 but sufficient for this use case

2. **Email Integration: Gmail SMTP/IMAP**
   - **Reason**: Universal availability, easy to set up for testing
   - **Trade-off**: App passwords required, rate limits exist
   - **Alternative considered**: SendGrid for production scale

3. **Database: MongoDB**
   - **Reason**: Flexible schema for varying proposal formats
   - **Trade-off**: No strong relationships enforcement
   - **Why not SQL**: Proposal data structure varies significantly by vendor

4. **Frontend: React without state management library**
   - **Reason**: Application state is simple enough for useState/useEffect
   - **Trade-off**: Might need Redux/Context for larger scale
   - **When to refactor**: If adding multi-user features


5. **Single-user System**
   - **Current**: No authentication required
   - **Reason**: Assignment scope, simplifies demo
   - **Production**: Would add JWT auth, role-based access

### **Assumptions Made**

1. **Email Assumptions**
   - Vendors reply to same thread (subject contains RFP ID)
   - Email body contains proposal text (not attachments)
   - One proposal per vendor per RFP
   - Emails are in English language

2. **Data Format Assumptions**
   - Dates in ISO format or common formats ("30 days", "May 20")
   - Quantities as numbers
   - Vendor responses reasonably structured

3. **Business Logic Assumptions**
   - Lower price is generally better (within budget)
   - Faster delivery is better
   - Longer warranty is better
   - All items in RFP must be addressed

4. **System Limitations (Known)**
   - English language only
   - Text-based proposals (limited attachment handling)
   - No real-time notifications
   - No vendor response tracking (read receipts)


## ⚠️ Known Limitations

1. **Email Parsing**
   - Cannot extract data from PDF attachments (future enhancement)
   - May struggle with heavily formatted/tabular emails
   - Requires vendor to include RFP reference ID

2. **AI Accuracy**
   - Gemini may occasionally misinterpret complex proposals
   - Scoring is subjective and based on prompt design
   - No learning from past decisions (stateless)

3. **Security**
   - No authentication system
   - API keys in environment variables
   - No rate limiting on API endpoints


4. **Email Constraints**
   - Gmail API rate limits (send: 100/day for free accounts)
   - IMAP can be slow for large mailboxes
   - No attachment handling

## Future Enhancements

**:**
-  PDF attachment parsing (extract tables, text)
-  Automated email polling (check every 5 minutes)
-  User authentication (JWT)
-  Multi-currency support
-  Real-time notifications (WebSockets)

## AI Tools Usage

### **Tools Used During Development**

1. **Claude AI (Anthropic)** - Primary development assistant
   - Used for: Specific technical questions, debugging
   - What it helped with:
     - AI integration patterns and prompts
     - Email parsing logic
     - Gemini API JSON schema syntax
     - IMAP email filtering queries

### **What I Learned from AI Tools**

 **Positive Impact:**
- Significantly faster development (50%+ time savings)
- AI is excellent for boilerplate and structure
- Better understanding of AI prompt engineering

 **Challenges:**
- Had to verify AI-generated code for correctness
- Sometimes AI suggested outdated libraries
- Needed to adapt generic solutions to specific requirements
- Still need human judgment for business logic

