# JWT AUTHENTICATION

## TECH STACK:

• Backend: Node.js + TypeScript

• Framework: Express (i am using express because of its simplicity and having enough practice with it )

• Authentication: JWT (Access Token + Refresh Token)

• Storage: MongoDB

## Folder Structure

```
└── 📁JWT_AUTH
    └── 📁auth
        ├── auth.controller.ts
        ├── auth.middleware.ts
        ├── auth.model.ts
        ├── auth.routes.ts
        ├── auth.services.ts
        ├── auth.validator.ts
    └── 📁utils
        ├── acyncHandler.ts
        ├── ApiError.ts
        ├── ApiResponse.ts
        ├── rateLimiter.ts
        ├── types.ts
        ├── validator.ts
    ├── .env
    ├── .gitignore
    ├── app.ts
    ├── db.ts
    ├── package-lock.json
    ├── package.json
    ├── README.md
    ├── server.ts
    └── tsconfig.json
```

## Dependencies

    "bcrypt": "^6.0.0",
    "cookie-parser": "^1.4.7",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "express-rate-limit": "^8.5.2",
    "helmet": "^8.2.0",
    "jsonwebtoken": "^9.0.3",
    "zod": "^4.4.3"

Bcrypt: for password hashing and storing it in the database.

Cookie-Parser: epress middleware for parsing cookie headers and populating req.cookies.

DotEnv: to access environment variables.

express: nodejs framework , used for its simplicity to code.

express-rate-limit: to set rate limits to prevent from spamming.

helmet: for protection from common web vulnerabilities,It acts as a defense-in-depth tool to mitigate attacks like Cross-Site Scripting (XSS), clickjacking, and data sniffing.

jsonwebtoken: to store cookies as tokens.

zod: validator to prevent faulty input

## .env Example

PORT=8080

MONGO_URL=URL

JWT_SECRET=**\*\*\*\*\***

ACCESS_TOKEN_EXPIRY=15m

REFRESH_TOKEN_EXPIRY=7d

## Features

### AUTH REGISTER

Route: http://localhost:8080/api/v1/auth/register

Method: POST

Accepts email and password from the user and first checks whether there is any existing user with that email , if yes then returns an error of status code 400.

Password is hashed using the prehook in mongoose model and stored in the database.

Access and Refresh Tokens are generated using the payload and refreshtoken,email and hashed password are stored in the database , both the tokens are stored in the cookies .

An access token is not stored in the database to keep verification fast and stateless, while a refresh token is stored to maintain long-term control, tracking, and revocation over a user's session

Response :

    "statusCode": 201,
    "data": {
        "createdUser": {
            "createdUser": {
                "_id": "6a4cc131467b3e025223dc3b",
                "email": "user1@example.com",
                "__v": 0
            }
        },
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2YTRjYzEzMTQ2N2IzZTAyNTIyM2RjM2IiLCJlbWFpbCI6InVzZXIxQGV4YW1wbGUuY29tIiwiaXNzdWVkQXQiOjE3ODM0MTUwODkzMTksImV4cGlyZXNBdCI6MTc4MzQxNTk4OTMxOSwiaWF0IjoxNzgzNDE1MDg5LCJleHAiOjE3ODM0MTU5ODl9.t93n4vme7mQKnj3Xr6X-LE1Uw0jfpclO6t71zDQhuSE",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2YTRjYzEzMTQ2N2IzZTAyNTIyM2RjM2IiLCJpc3N1ZWRBdCI6MTc4MzQxNTA4OTMyMiwiZXhwaXJlc0F0IjoxNzg0MDE5ODg5MzIyLCJpYXQiOjE3ODM0MTUwODksImV4cCI6MTc4NDAxOTg4OX0.O4NevdVbrZw5IigzQ80tl5-tnMXCQa4DE8tZkajJNCo"
    },
    "message": "User Created",
    "success": true

### AUTH LOGIN

Route: http://localhost:8080/api/v1/auth/login

Method: POST

Accepts email and password from the user and first checks whether there is any existing user with that email , if not then returns error with status 404 as user not found.

Password is checked using the schema method of isPassCorrect() and validated.

Access and Refresh Tokens are generated using the payload and refreshtoken,email and hashed password are stored in the database , both the tokens are stored in the cookies .

Response :

    "statusCode": 201,
    "data": {
        "createdUser": {
            "createdUser": {
                "_id": "6a4cc131467b3e025223dc3b",
                "email": "user1@example.com",
                "__v": 0
            }
        },
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2YTRjYzEzMTQ2N2IzZTAyNTIyM2RjM2IiLCJlbWFpbCI6InVzZXIxQGV4YW1wbGUuY29tIiwiaXNzdWVkQXQiOjE3ODM0MTU2MDExNTMsImV4cGlyZXNBdCI6MTc4MzQxNjUwMTE1MywiaWF0IjoxNzgzNDE1NjAxLCJleHAiOjE3ODM0MTY1MDF9.MqD5pEtqIR2sDYYIx0fYP_JeNj-IbnPqPEQK1Hr8C_s",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2YTRjYzEzMTQ2N2IzZTAyNTIyM2RjM2IiLCJpc3N1ZWRBdCI6MTc4MzQxNTYwMTE1NCwiZXhwaXJlc0F0IjoxNzg0MDIwNDAxMTU0LCJpYXQiOjE3ODM0MTU2MDEsImV4cCI6MTc4NDAyMDQwMX0.QyNF1gC694l5cobI19amKcUdaNBnjFCjkC1CUgL7VzM"
    },
    "message": "User LoggedIn",
    "success": true

### AUTH PROFILE

Route: http://localhost:8080/api/v1/auth/profile

Method : GET

to fetch the user using user.\_id , if no userfound error is returned

Response:

    "statusCode": 200,

    "data": {
        "_id": "6a4cc131467b3e025223dc3b",
        "email": "user1@example.com",
        "__v": 0
    },
    "message": "User Fetched",
    "success": true

### AUTH REFRESH TOKENS

Route: http://localhost:8080/api/v1/auth/refresh

Method: PATCH (since partial update)

If the access token gets expired , using the refreshtoken both the tokens are again generated.

An access token is not stored in the database to keep verification fast and stateless, while a refresh token is stored to maintain long-term control, tracking, and revocation over a user's session.

Response:

    "statusCode": 201,

    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2YTRjYzEzMTQ2N2IzZTAyNTIyM2RjM2IiLCJlbWFpbCI6InVzZXIxQGV4YW1wbGUuY29tIiwiaXNzdWVkQXQiOjE3ODM0MTYxMjA3MjMsImV4cGlyZXNBdCI6MTc4MzQxNzAyMDcyMywiaWF0IjoxNzgzNDE2MTIwLCJleHAiOjE3ODM0MTcwMjB9.3y5qrA7fiB6vtfCpCdZ6BiUIMk_lAJLcNyAKLmnjVSY",
        "newRefreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2YTRjYzEzMTQ2N2IzZTAyNTIyM2RjM2IiLCJpc3N1ZWRBdCI6MTc4MzQxNjEyMDcyNCwiZXhwaXJlc0F0IjoxNzg0MDIwOTIwNzI0LCJpYXQiOjE3ODM0MTYxMjAsImV4cCI6MTc4NDAyMDkyMH0.BdHrOLhIV8Pihi21zYuXXlKJExFsH4QPvmNahIy2YEM"
    },
    "message": "Tokens Refreshed",
    "success": true

### AUTH LOGOUT

Route: http://localhost:8080/api/v1/auth/logout

Method: POST

User gets logged out, his refresh token in the databse gets emptied and all the tokens are cleared inside cookies.

Even if cookies stay active but only for access duration time.

Even that can be rectified using cache methods to get extreme security.

Response:

    "statusCode": 200,
    "data": "User Logged Out",
    "message": "Success",
    "success": true

### AUTH MODEL

Stores just email, password and refreshtoken in the database.

     email: string;

     password?: string;

     refreshToken: string;

     isPassCorrect(password: string): Promise<boolean>;

     generateRefreshToken(): Promise<string>;

     generateAccessToken(): Promise<string>;

### JWT PAYLOAD

Access Token :

      _id: this._id,
      email: this.email,
      issuedAt: now,
      expiresAt: now + 15 * 60 * 1000,

Refresh Token :

      _id: this._id,
      issuedAt: now,
      expiresAt: now + 7 * 24 * 60 * 60 * 1000,

### Rate Limiter

     windowMs: 15 * 60 * 1000,
     limit: 100,
     message: {
        status: 429,
        error: "Too many requests, please try again later.",
              },
     standardHeaders: "draft-8",
     legacyHeaders: false,

### Validator Schema

      emailSchema = z
      .string()
      .trim()
      .toLowerCase()
      .email({ message: "Invalid email address format" });

     passwordSchema = z
      .string()
      .min(6, "Password must contain a minimum fo 6     characters")
      .trim()
      .nonempty({ message: "Password must not be empty" });

     loginSchema = z.object({
           email: emailSchema,
           password: passwordSchema,
         });

### Error Handler

        statusCode: number,
        message = "Something went wrong",
        errors = [],
        stack = "",

### Response Handler

     statusCode: number;
     data: any;
     message: string;
     success: boolean;

All the testing are done in Postman Api
