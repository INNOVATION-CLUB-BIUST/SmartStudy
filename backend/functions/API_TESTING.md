# Modules API Testing Guide

## Prerequisites

1. **Firebase Emulator Running**
   ```bash
   cd backend/functions
   npm run serve
   ```
   
   You should see:
   ```
   ✔  functions[us-central1-api]: http function initialized
   ✔  All emulators ready!
   ```

2. **Get Test Auth Token**
   
   For testing, you'll need a Firebase Auth token. Here are two ways to get one:
   
   **Method 1: From Browser Console (Frontend must be running)**
   - Open your app in browser and login
   - Open browser console (F12)
   - Run:
     ```javascript
     firebase.auth().currentUser.getIdToken().then(console.log)
     ```
   - Copy the token displayed in console
   
   **Method 2: Create Test User (Recommended for Backend Team)**
   - Start Firebase Auth emulator as well
   - Or use a real token from a test account

---

## API Base URL

```
http://127.0.0.1:5001/smartstudy-26356/us-central1/api
```

---

## Endpoints to Test

### 1. GET /modules - List All Modules

**Request:**
```bash
curl -X GET http://127.0.0.1:5001/smartstudy-26356/us-central1/api/modules \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response (empty initially):**
```json
[]
```

**Expected Response (with data):**
```json
[
  {
    "id": "abc123",
    "userId": "user_id",
    "code": "CSI311",
    "name": "Data Structures",
    "credits": 3,
    "instructor": "Dr. Smith",
    "difficulty": "hard",
    "color": "from-orange-500 to-red-500",
    "classSchedule": [],
    "assessments": {...},
    "createdAt": "2025-12-03T...",
    "updatedAt": "2025-12-03T..."
 }
]
```

---

### 2. POST /modules - Create New Module

**Request:**
```bash
curl -X POST http://127.0.0.1:5001/smartstudy-26356/us-central1/api/modules \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
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
        "components": [
          {
            "name": "Assignment 1",
            "weight": 10,
            "maxScore": 10,
            "dueDate": "2025-12-15"
          }
        ]
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

**Expected Response (201 Created):**
```json
{
  "id": "generated_id",
  "userId": "user_id",
  "code": "CSI311",
  "name": "Data Structures & Algorithms",
  ...
}
```

**Save the `id` from the response for the next tests!**

---

### 3. GET /modules/:id - Get Single Module

**Request:**
```bash
curl -X GET http://127.0.0.1:5001/smartstudy-26356/us-central1/api/modules/MODULE_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "id": "MODULE_ID",
  "userId": "user_id",
  "code": "CSI311",
  ...
}
```

---

### 4. PUT /modules/:id - Update Module

**Request:**
```bash
curl -X PUT http://127.0.0.1:5001/smartstudy-26356/us-central1/api/modules/MODULE_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Advanced Data Structures & Algorithms",
    "instructor": "Dr. Sarah Johnson PhD"
  }'
```

**Expected Response:**
```json
{
  "id": "MODULE_ID",
  "name": "Advanced Data Structures & Algorithms",
  "instructor": "Dr. Sarah Johnson PhD",
  ...
}
```

---

### 5. DELETE /modules/:id - Delete Module

**Request:**
```bash
curl -X DELETE http://127.0.0.1:5001/smartstudy-26356/us-central1/api/modules/MODULE_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Module deleted successfully",
  "id": "MODULE_ID"
}
```

---

## Error Cases to Test

### 1. No Authentication Token
```bash
curl -X GET http://127.0.0.1:5001/smartstudy-26356/us-central1/api/modules
```

**Expected Response (401):**
```json
{
  "error": "Unauthorized - No token provided"
}
```

### 2. Invalid Token
```bash
curl -X GET http://127.0.0.1:5001/smartstudy-26356/us-central1/api/modules \
  -H "Authorization: Bearer invalid_token_12345"
```

**Expected Response (401):**
```json
{
  "error": "Invalid or expired token"
}
```

### 3. Missing Required Fields (POST)
```bash
curl -X POST http://127.0.0.1:5001/smartstudy-26356/us-central1/api/modules \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "CSI311"
  }'
```

**Expected Response (400):**
```json
{
  "error": "Missing required fields: code and name"
}
```

### 4. Module Not Found
```bash
curl -X GET http://127.0.0.1:5001/smartstudy-26356/us-central1/api/modules/nonexistent_id \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response (404):**
```json
{
  "error": "Module not found"
}
```

### 5. Try to Access Another User's Module
*Create a module with User A's token, then try to access it with User B's token*

**Expected Response (403):**
```json
{
  "error": "Forbidden - Not your module"
}
```

---

## Testing Checklist

- [ ] Start emulator successfully
- [ ] Obtain test auth token
- [ ] **GET /modules** - returns empty array initially
- [ ] **POST /modules** - creates new module
  - [ ] Returns 201 status
  - [ ] Returns module with auto-generated ID
  - [ ] `createdAt` and `updatedAt` timestamps are set
- [ ] **GET /modules** - now returns the created module
- [ ] **GET /modules/:id** - returns single module
- [ ] **PUT /modules/:id** - updates module
  - [ ] Returns updated data
  - [ ] `updatedAt` timestamp changes
  - [ ] Cannot change `userId` or `createdAt`
- [ ] **DELETE /modules/:id** - deletes module
- [ ] **GET /modules/:id** - returns 404 after deletion
- [ ] **Error: No auth token** - returns 401
- [ ] **Error: Invalid token** - returns 401
- [ ] **Error: Missing fields** - returns 400
- [ ] **Error: Access other user's module** - returns 403

---

## Viewing Data in Firestore Emulator

1. Open Firestore Emulator UI: http://127.0.0.1:4000/firestore
2. Navigate to `classes` collection
3. View created modules
4. Verify data structure matches schema

---

## Tips for Backend Dev 1

1. **Use Postman or Thunder Client** (VS Code extension) instead of curl for easier testing
2. **Save your test token** in an environment variable for reuse
3. **Create multiple test modules** to ensure list endpoint works
4. **Test with 2 different user tokens** to verify ownership checks
5. **Check Firestore console** after each operation to see the actual data
6. **Look at the terminal logs** when emulator is running - you'll see your API calls and any errors

---

## Common Issues & Solutions

### Issue: "firebase: command not found"
**Solution:** We installed firebase-tools locally. Use `npm run serve` instead of `firebase emulators:start`

### Issue: "The default Firebase app does not exist"
**Solution:** Fixed! We moved `db` initialization to a function that's called after `admin.initializeApp()`

### Issue: Can't get auth token
**Solution:** 
- Run frontend: `cd frontend/SmartStudy && npm run dev`
- Login to the app
- Use browser console method above

### Issue: Port already in use
**Solution:** 
- Stop the emulator: `Ctrl+C`
- Or kill process: `lsof -ti:5001 | xargs kill`

---

## Next Steps After API Testing

1. Write Firestore security rules (`firestore.rules`)
2. Document API in `backend/functions/API.md`
3. Help frontend dev integrate the endpoints
4. Set up CI testing (optional)

Good luck! 🚀
