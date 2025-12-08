# API Documentation

Base URL: `http://localhost:3000/api`

## RFP Endpoints

### Parse RFP from Natural Language

**POST** `/rfp/`

Converts natural language description into structured RFP.

**Request Body:**

```json
{
  "naturalLanguageText": "I need 20 laptops with 16GB RAM. Budget is $50,000. Delivery in 30 days."
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "RFP created successfully",
  "data": {
    "title": "Laptop Procurement",
    "description": "Procurement of 20 laptops with 16GB RAM",
    "items": [
      {
        "name": "Laptop",
        "quantity": 20,
        "specifications": "16GB RAM"
      }
    ],
    "budget": 50000,
    "deliveryDeadline": "2025-01-05T00:00:00.000Z",
    "paymentTerms": "To be determined",
    "warrantyRequirement": "Standard warranty",
    "status": "draft",
    "createdAt": "2024-12-06T10:30:00.000Z"
  }
}
```

**Error Response (err.statusCode):**

```json
{
  "success": false,
  "errors": [
    {
      "message": "error message"
    }
  ]
}
```

---

### Create RFP from Natural Language

**POST** `/rfp/create`

Store structured RFP to database.

**Request Body:**

```json
{
  "parsedRFP": {
    "_id": "674ab123c456789def012345",
    "title": "Laptop Procurement",
    "description": "Procurement of 20 laptops with 16GB RAM",
    "items": [
      {
        "name": "Laptop",
        "quantity": 20,
        "specifications": "16GB RAM"
      }
    ],
    "budget": 50000,
    "deliveryDeadline": "2025-01-05T00:00:00.000Z",
    "paymentTerms": "To be determined",
    "warrantyRequirement": "Standard warranty",
    "status": "draft",
    "createdAt": "2024-12-06T10:30:00.000Z"
  }
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "RFP created successfully",
  "data": {
    "_id": "674ab123c456789def012345",
    "title": "Laptop Procurement",
    "description": "Procurement of 20 laptops with 16GB RAM",
    "items": [
      {
        "name": "Laptop",
        "quantity": 20,
        "specifications": "16GB RAM"
      }
    ],
    "budget": 50000,
    "deliveryDeadline": "2025-01-05T00:00:00.000Z",
    "paymentTerms": "To be determined",
    "warrantyRequirement": "Standard warranty",
    "status": "draft",
    "createdAt": "2024-12-06T10:30:00.000Z"
  }
}
```

**Error Response (err.statusCode):**

```json
{
  "success": false,
  "errors": [
    {
      "message": "error message"
    }
  ]
}
```

---

### Get All RFPs

**GET** `/rfp`

**Success Response (200):**

```json
{
  "success": true,
  "rfps": [
    {
      "_id": "674ab123c456789def012345",
      "title": "Laptop Procurement",
      "description": "Procurement of 20 laptops with 16GB RAM",
      "items": [
        {
          "name": "Laptop",
          "quantity": 20,
          "specifications": "16GB RAM"
        }
      ],
      "selectedVendors": [
        {
          "_id": "vendor_id_1",
          "name": "Dell",
          "email": "dell@example.com"
        }
      ],
      "budget": 50000,
      "deliveryDeadline": "2025-01-05T00:00:00.000Z",
      "paymentTerms": "To be determined",
      "warrantyRequirement": "Standard warranty",
      "status": "draft",
      "createdAt": "2024-12-06T10:30:00.000Z"
    }
  ]
}
```

**Error Response (err.statusCode):**

```json
{
  "success": false,
  "errors": [
    {
      "message": "error message"
    }
  ]
}
```

---

### Get Single RFP

**GET** `/rfps/:id`

**Parameters:**

- `id` (string, required) - RFP MongoDB ObjectId

**Success Response (200):**

```json
{
  "success": true,
  "rfp": {
    "_id": "674ab123...",
    "title": "Laptop Procurement",
    "description": "...",
    "items": [...],
    "budget": 50000,
    "selectedVendors": [...]
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "error": "RFP not found"
}
```

---

### Send RFP to Vendors

**POST** `/rfp/:id`

**Request Body:**

```json
{
  "vendorIds": ["vendor_id_1", "vendor_id_2"]
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "RFP sent to 2 vendors",
  "rfp": {
    "_id": "674ab123...",
    "status": "sent",
    "selectedVendors": ["vendor_id_1", "vendor_id_2"]
  }
}
```

---

## Vendor Endpoints

### Create Vendor

**POST** `/vendor`

**Request Body:**

```json
{
  "name": "Dell Technologies",
  "email": "sales@dell.com",
  "phone": "+1-555-123-4567",
  "notes": "Preferred vendor for laptops"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Vendor created successfully",
  "vendor": {
    "_id": "vendor_id_123",
    "name": "Dell Technologies",
    "email": "sales@dell.com",
    ...
  }
}
```

---

### Get All Vendors

**GET** `/vendor`

**Success Response (200):**

```json
{
  "success": true,
  "message": "Vendors fetched successfully",
  "data": [
    {
      "_id": "vendor_id_1",
      "name": "Dell",
      "email": "dell@example.com",
      "category": "IT Equipment"
    }
  ]
}
```

---

### Get Vendor BY ID

**GET** `/vendor/:id`

**Success Response (200):**

```json
{
  "success": true,
  "message": "Vendors fetched successfully",
  "data": {
    "_id": "vendor_id_1",
    "name": "Dell",
    "email": "dell@example.com",
    "category": "IT Equipment"
  }
}
```

---

### Update Vendor

**PATCH** `/vendor/:id`

**Request Body:** (any fields to update)

```json
{
  "phone": "+1-555-999-8888",
  "notes": "Updated contact information"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Vendor updated successfully",
  "data": {
    "_id": "vendor_id_1",
    "phone": "+1-555-999-8888",
    ...
  }
}
```

---

### Delete Vendor

**DELETE** `/vendor/:id`

**Success Response (200):**

```json
{
  "success": true,
  "message": "Vendor deleted successfully"
}
```

---

## Proposal Endpoints

### Check for New Email Responses

**POST** `/proposal/:id`

**Parameters:**

- `rfpId` (string, required) - RFP MongoDB ObjectId

**Success Response (200):**

```json
{
  "success": true,
  "message": "Proposals checked successfully"
}
```

---

### Get Proposals for RFP

**GET** `/proposal/:id/`

**Success Response (200):**

```json
{
  "success": true,
  "proposals": [
    {
      "_id": "proposal_id_1",
      "vendorId": {
        "_id": "vendor_id_1",
        "name": "Dell",
        "email": "dell@example.com"
      },
      "items": [
        {
          "name": "Dell Laptop",
          "unitPrice": 1800,
          "quantity": 20,
          "totalPrice": 36000
        }
      ],
      "totalPrice": 42000,
      "deliveryTime": " ",
      "paymentTerms": "",
      "warranty": "",
      "additionalTerms": "",
      "isBest": false,
      "aiScore": 20, // 0-100
      "aiPros": "",
      "aiCons": "",
      "aiSummary": "",
      "completeness": 30
    }
  ]
}
```

---

### Get All Proposals

**GET** `/proposal/`

**Success Response (200):**

```json
{
  "success": true,
  "messgage": "proposals fetched successfully",
  "proposals": [
    {
      "_id": "proposal_id_1",
      "vendorId": {
        "_id": "vendor_id_1",
        "name": "Dell",
        "email": "dell@example.com"
      },
      "items": [
        {
          "name": "Dell Laptop",
          "unitPrice": 1800,
          "quantity": 20,
          "totalPrice": 36000
        }
      ],
      "totalPrice": 42000,
      "deliveryTime": " ",
      "paymentTerms": "",
      "warranty": "",
      "additionalTerms": "",
      "isBest": false,
      "aiScore": 20, // 0-100
      "aiPros": "",
      "aiCons": "",
      "aiSummary": "",
      "completeness": 30
    }
  ]
}
```

---

### compare Proposals

**POST** `/proposal/compare/:id`

**Success Response (200):**

```json
{
  "success": true,
  "data":
   "proposal": [
    {
      "_id": "proposal_id_1",
      "vendorId": {
        "_id": "vendor_id_1",
        "name": "Dell",
        "email": "dell@example.com"
      },
      "items": [
        {
          "name": "Dell Laptop",
          "unitPrice": 1800,
          "quantity": 20,
          "totalPrice": 36000
        }
      ],
      "totalPrice": 42000,
         "deliveryTime":" ",
    "paymentTerms": "",
    "warranty": "",
    "additionalTerms": "",
     "isBest": false,
    "aiScore": 20, // 0-100
    "aiPros":"",
    "aiCons":"",
    "aiSummary": "",
    "completeness": 30,
}],
"summary":"",
 "rfpTitle": "",
"proposalId": "",
"bestVendor": "",
"reasoning": "",
}

```

---
