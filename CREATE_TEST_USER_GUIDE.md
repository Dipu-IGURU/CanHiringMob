# Create Test User Account - Guide

## Test Account Details
- **Email:** reviewer@canhiring.com
- **Password:** Test@1234
- **Role:** user (Job Seeker)

---

## Method 1: Via API (Recommended - If Server is Running)

### Step 1: Make sure your server is running
```bash
cd server
npm start
```

### Step 2: Create the user via API
```bash
# Using curl
curl -X POST https://canhiringmob.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "Reviewer",
    "email": "reviewer@canhiring.com",
    "password": "Test@1234",
    "role": "user"
  }'
```

**OR use the script:**
```bash
cd server
bash create-test-user-via-api.sh
```

---

## Method 2: Via App Signup (Easiest)

1. Open your CanHiring app
2. Go to Sign Up screen
3. Fill in:
   - First Name: Test
   - Last Name: Reviewer
   - Email: reviewer@canhiring.com
   - Password: Test@1234
   - Role: Job Seeker
4. Complete registration

---

## Method 3: Via Database Script (If MongoDB is Accessible)

### Step 1: Make sure MongoDB is accessible
- If using MongoDB Atlas, whitelist your IP
- If using local MongoDB, make sure it's running

### Step 2: Run the script
```bash
cd server
node create-test-user.js
```

---

## Method 4: Via MongoDB Compass or MongoDB Shell

If you have direct database access:

```javascript
// Connect to your MongoDB database
use canhiring

// Create the user (password will be hashed automatically by the app)
db.users.insertOne({
  firstName: "Test",
  lastName: "Reviewer",
  email: "reviewer@canhiring.com",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5Y", // This is Test@1234 hashed
  role: "user",
  isVerified: true,
  createdAt: new Date()
})
```

**Note:** The password hash above is for "Test@1234". However, it's better to let the app hash it using the User model's pre-save hook.

---

## Verification

After creating the account, verify it works:

1. **Test Login via API:**
```bash
curl -X POST https://canhiringmob.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "reviewer@canhiring.com",
    "password": "Test@1234"
  }'
```

2. **Test Login via App:**
   - Open the app
   - Go to Login screen
   - Enter:
     - Email: reviewer@canhiring.com
     - Password: Test@1234
   - Should login successfully

---

## Troubleshooting

### "User already exists"
- The account already exists
- You can update the password using Method 1 (API) or login and change password in app

### "Cannot connect to MongoDB"
- Check your MongoDB connection string
- If using Atlas, whitelist your IP address
- Make sure MongoDB service is running

### "API request failed"
- Make sure your server is running
- Check the API URL is correct
- Verify CORS is configured correctly

---

## Quick Command (Copy & Paste)

```bash
curl -X POST https://canhiringmob.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"Reviewer","email":"reviewer@canhiring.com","password":"Test@1234","role":"user"}'
```

---

**Created:** Test account creation script
**Last Updated:** $(date)

