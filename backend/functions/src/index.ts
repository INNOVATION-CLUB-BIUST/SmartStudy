import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";
import { modulesRouter } from "./modules";

// Initialize Firebase Admin
admin.initializeApp();

// Get Firestore instance
const db = admin.firestore();

// Connect to emulator when running locally
if (process.env.FUNCTIONS_EMULATOR === 'true') {
  console.log('🔧 Connecting to Firestore emulator at localhost:8080');
  db.settings({
    host: 'localhost:8080',
    ssl: false,
  });
}

const app = express();

// Simple CORS - allow all origins in development
app.use(cors({ origin: true }));
app.use(express.json());

// Test endpoint
app.get("/hello", (req, res) => {
  res.json({ message: "Hello from Firebase!" });
});

// Simple onboarding endpoint - no auth for now
app.post("/onboarding", async (req, res): Promise<void> => {
  try {
    console.log("Received onboarding request:", JSON.stringify(req.body, null, 2));

    const { userId, email, profile, course, goals, preferences } = req.body;

    // Basic validation
    if (!userId || !email) {
      res.status(400).json({
        error: "Missing required fields: userId and email"
      });
      return;
    }

    // Save user profile to Firestore
    const userRef = db.collection("users").doc(userId);
    const now = new Date().toISOString();
    const userData = {
      uid: userId,
      email,
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      university: profile?.university || "",
      major: profile?.major || "",
      yearOfStudy: profile?.yearOfStudy || "",
      studentId: profile?.studentId || "",
      dateOfBirth: profile?.dateOfBirth || "",
      course: course || "",
      preferences: preferences || {},
      onboardingCompleted: true,
      createdAt: now,
      updatedAt: now,
    };

    await userRef.set(userData);
    console.log("User data saved successfully for:", userId);

    // Save goals if provided
    if (goals && Array.isArray(goals) && goals.length > 0) {
      const batch = db.batch();

      goals.forEach((goal: any) => {
        const goalRef = db.collection("goals").doc();
        batch.set(goalRef, {
          userId,
          title: goal.title || "",
          targetDate: goal.targetDate || "",
          priority: goal.priority || "medium",
          createdAt: now,
        });
      });

      await batch.commit();
      console.log(`Saved ${goals.length} goals for user:`, userId);
    }

    res.status(201).json({
      success: true,
      message: "Onboarding completed successfully!",
      userId
    });

  } catch (error) {
    console.error("Error during onboarding:", error);
    res.status(500).json({
      error: "Failed to complete onboarding",
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Modules API routes
app.use("/modules", modulesRouter);

// Export the Express app as a Cloud Function
exports.api = functions.https.onRequest(app);
