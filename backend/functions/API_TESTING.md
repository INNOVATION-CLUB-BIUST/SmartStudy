# Modules API Testing Guide

**For:** Backend Dev 1 (Newbie-Friendly Guide)  
**Goal:** Test the modules CRUD API to verify it works correctly

---

## 📋 Prerequisites

You need these running before testing:

1. **Backend Emulator**
   ```bash
   cd backend/functions
   npm run serve
   ```
   
   ✅ You should see: `✔ functions[us-central1-api]: http function initialized`

2. **Frontend Dev Server** (to get auth tokens)
   ```bash
   # In a new terminal
   cd frontend/SmartStudy
   npm run dev
   ```
   
   ✅ You should see: `Local: http://localhost:5173/`

---

## 🔑 Step 1: Get Your Authentication Token

**Why?** The API requires authentication. You need a valid Firebase token to test.

### How to Get Token:

1. Make sure frontend is running (`npm run dev`)
2. Open browser and go to: **http://localhost:5173/get-token.html**
3. If you see "You are not logged in":
   - Go to **http://localhost:5173**
   - Login or create account
   - Go back to **http://localhost:5173/get-token.html**
4. You should now see your token displayed
5. Click the **"📋 Copy Token"** button
6. Your token is now copied to clipboard!

**IMPORTANT:** Keep this token handy - you'll use it in every test below.

---

## 🧪 Step 2: Test the API Endpoints

Use the `curl` commands below. **Replace `YOUR_TOKEN` with the actual token you copied.**

### ⚠️ Critical: Header Format

```bash
# ✅ CORRECT - must include space after : and "Bearer " prefix
-H "Authorization: Bearer YOUR_TOKEN"

# ❌ WRONG - will get "Unauthorized" error
-H "Authorization:YOUR_TOKEN"
```

---

### Test 1: List All Modules (GET)

**What it does:** Gets all modules for the logged-in user

```bash
curl http://127.0.0.1:5001/smartstudy-26356/us-central1/api/modules \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Result:**
```json
[]
```
(Empty array because you haven't created any modules yet)

---

### Test 2: Create a Module (POST)

**What it does:** Creates a new module

```bash
curl -X POST http://127.0.0.1:5001/smartstudy-26356/us-central1/api/modules \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "CSI311",
    "name": "Data Structures & Algorithms",
    "credits": 3,
    "instructor": "Dr. Sarah Johnson",
    "difficulty": "hard",
    "color": "from-orange-500 to-red-500",
    "classSchedule": [
      {
        "day": "Monday",
        "startTime": "09:00",
        "endTime": "11:00",
        "location": "Lecture Hall A",
        "type": "lecture"
      }
    ],
    "assessments": {
      "ca": {
        "weight": 40,
        "components": []
      },
      "finalExam": {
        "weight": 60,
        "date": "2025-12-20"
      },
      "dpRequirement": 40,
      "passingMark": 50
    },
    "targetGrade": 75
  }'
```

**Expected Result:**
```json
{
  "id": "xyz123abc...",
  "userId": "your_user_id",
  "code": "CSI311",
  "name": "Data Structures & Algorithms",
  ...rest of the data...
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**❗ IMPORTANT:** Copy the `id` value from the response! You'll need it for the next tests.

---

### Test 3: Get Single Module (GET)

**What it does:** Gets one specific module by ID

```bash
# Replace MODULE_ID with the ID from Test 2
curl http://127.0.0.1:5001/smartstudy-26356/us-central1/api/modules/MODULE_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Result:**
```json
{
  "id": "MODULE_ID",
  "code": "CSI311",
  "name": "Data Structures & Algorithms",
  ...
}
```

---

### Test 4: Update Module (PUT)

**What it does:** Updates an existing module

```bash
# Replace MODULE_ID with the ID from Test 2
curl -X PUT http://127.0.0.1:5001/smartstudy-26356/us-central1/api/modules/MODULE_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Advanced Data Structures & Algorithms",
    "instructor": "Dr. Sarah Johnson PhD"
  }'
```

**Expected Result:**
```json
{
  "id": "MODULE_ID",
  "name": "Advanced Data Structures & Algorithms",
  "instructor": "Dr. Sarah Johnson PhD",
  ...
  "updatedAt": "new_timestamp"
}
```

Note: `updatedAt` should be newer than `createdAt`

---

### Test 5: Delete Module (DELETE)

**What it does:** Deletes a module

```bash
# Replace MODULE_ID with the ID from Test 2
curl -X DELETE http://127.0.0.1:5001/smartstudy-26356/us-central1/api/modules/MODULE_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Result:**
```json
{
  "success": true,
  "message": "Module deleted successfully",
  "id": "MODULE_ID"
}
```

**Verify:** Run Test 1 again - should return empty array `[]`

---

## 🚨 Step 3: Test Error Cases

These tests should FAIL on purpose. We want to make sure errors are handled correctly.

### Error Test 1: No Auth Token (401 Unauthorized)

```bash
curl http://127.0.0.1:5001/smartstudy-26356/us-central1/api/modules
```

**Expected Result:**
```json
{
  "error": "Unauthorized - No token provided"
}
```

---

### Error Test 2: Invalid Token (401 Unauthorized)

```bash
curl http://127.0.0.1:5001/smartstudy-26356/us-central1/api/modules \
  -H "Authorization: Bearer fake_invalid_token_12345"
```

**Expected Result:**
```json
{
  "error": "Invalid or expired token"
}
```

---

### Error Test 3: Missing Required Fields (400 Bad Request)

```bash
curl -X POST http://127.0.0.1:5001/smartstudy-26356/us-central1/api/modules \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code": "TEST123"}'
```

**Expected Result:**
```json
{
  "error": "Missing required fields: code and name"
}
```

---

### Error Test 4: Module Not Found (404 Not Found)

```bash
curl http://127.0.0.1:5001/smartstudy-26356/us-central1/api/modules/nonexistent_id_123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Result:**
```json
{
  "error": "Module not found"
}
```

---

## 🔍 Step 4: Verify in Firestore UI

1. Open: **http://127.0.0.1:4000/firestore**
2. You should see the `classes` collection
3. Check that:
   - Created modules appear here
   - Data structure matches what you sent
   - Deleted modules are gone
   - `userId` field matches your user ID

---

## ✅ Testing Checklist

Mark these off as you complete them:

- [ ] Test 1: List modules (empty initially)
- [ ] Test 2: Create module (save the ID!)
- [ ] Test 3: Get single module
- [ ] Test 4: Update module
- [ ] Test 5: Delete module
- [ ] Verify Test 1 returns empty array after deletion
- [ ] Error Test 1: No auth token → 401
- [ ] Error Test 2: Invalid token → 401  
- [ ] Error Test 3: Missing fields → 400
- [ ] Error Test 4: Not found → 404
- [ ] Verified data in Firestore UI
- [ ] Tested with 2 different user accounts (ownership check)

---

## 🔐 Ownership Testing (Advanced)

To verify users can only access their own modules:

1. Get token for User A from get-token.html
2. Create a module with User A's token
3. Copy the module ID
4. Logout and login as User B
5. Get token for User B from get-token.html
6. Try to access User A's module with User B's token:
   ```bash
   curl http://127.0.0.1:5001/smartstudy-26356/us-central1/api/modules/USER_A_MODULE_ID \
     -H "Authorization: Bearer USER_B_TOKEN"
   ```

**Expected Result:**
```json
{
  "error": "Forbidden - Not your module"
}
```

---

## 🐛 Troubleshooting

### "Unauthorized - No token provided"
- Check your header format: must be `"Authorization: Bearer TOKEN"` with space after `:`
- Make sure you copied the full token from get-token.html

### "Invalid or expired token"
- Token expired (valid for 1 hour) - get a new one from get-token.html
- Wrong token - make sure you copied correctly

### "Connection refused" or "Could not resolve host"
- Emulator not running - run `npm run serve` in backend/functions
- Wrong URL - check it's `127.0.0.1:5001` not `localhost:5001`

### get-token.html says "Not logged in"
- Frontend not running - run `npm run dev` in frontend/SmartStudy
- Not logged in - go to http://localhost:5173 and login first

---

## 📝 Next Steps After Testing

Once all tests pass:

1. **Write Firestore Security Rules** (2-3 hours)
   - Edit `firestore.rules` in project root
   - Add rules for `classes` collection to enforce ownership

2. **Document the API** (1-2 hours)
   - Create `backend/functions/API.md`
   - Document all endpoints, request/response formats, error codes

3. **Help Frontend Dev** 
   - Share your experience with the API
   - Help them integrate with frontend

---

## 💡 Pro Tips

- **Use a REST client** like Postman or Thunder Client (VS Code extension) for easier testing
- **Save your token** in a text file so you don't have to keep copying it
- **Check terminal logs** - the emulator shows all API requests and any errors
- **Use `jq`** to format JSON: `curl ... | jq '.'`

Good luck! 🚀
