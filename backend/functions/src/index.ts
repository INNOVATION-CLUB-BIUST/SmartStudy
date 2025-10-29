import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/hello", (req, res) => {
  res.send("Hello from Firebase!");
});

/**
 * Onboarding endpoint - Creates user profile and stores initial data
 * Expected body: {
 *   uid: string,
 *   email: string,
 *   profile: {
 *     firstName: string,
 *     lastName: string,
 *     institution?: string,
 *     program?: string,
 *     year?: string
 *   },
 *   subjects: string[],
 *   goals: Array<{
 *     title: string,
 *     description?: string,
 *     targetDate?: string,
 *     category?: string
 *   }>,
 *   preferences: {
 *     studyTimePerDay?: number,
 *     preferredStudyTimes?: string[],
 *     breakDuration?: number,
 *     notifications?: boolean
 *   }
 * }
 */
app.post("/onboarding", async (req, res) => {
  try {
    const { uid, email, profile, subjects, goals, preferences } = req.body;

    // Validate required fields
    if (!uid || !email) {
      return res.status(400).send({ 
        error: "Missing required fields: uid and email are required" 
      });
    }

    if (!profile || !profile.firstName || !profile.lastName) {
      return res.status(400).send({ 
        error: "Missing required profile fields: firstName and lastName are required" 
      });
    }

    // Create user document in Firestore
    const userRef = db.collection("users").doc(uid);
    
    const userData = {
      uid,
      email,
      profile: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        institution: profile.institution || "",
        program: profile.program || "",
        year: profile.year || "",
      },
      subjects: subjects || [],
      preferences: {
        studyTimePerDay: preferences?.studyTimePerDay || 120, // default 2 hours in minutes
        preferredStudyTimes: preferences?.preferredStudyTimes || [],
        breakDuration: preferences?.breakDuration || 15,
        notifications: preferences?.notifications !== false, // default true
      },
      onboardingCompleted: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await userRef.set(userData);

    // If goals are provided, create them in the goals collection
    if (goals && Array.isArray(goals) && goals.length > 0) {
      const batch = db.batch();
      
      goals.forEach((goal) => {
        const goalRef = db.collection("goals").doc();
        batch.set(goalRef, {
          userId: uid,
          title: goal.title,
          description: goal.description || "",
          targetDate: goal.targetDate || null,
          category: goal.category || "academic",
          status: "active",
          progress: 0,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      });

      await batch.commit();
    }

    res.status(201).send({ 
      message: "Onboarding completed successfully!",
      userId: uid,
      data: userData
    });

  } catch (error) {
    console.error("Error during onboarding:", error);
    res.status(500).send({ 
      error: "Failed to complete onboarding",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);
