import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";

admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));

app.get("/hello", (req, res) => {
  res.send("Hello from Firebase!");
});

app.post("/onboarding", (req, res) => {
  // TODO: Implement onboarding logic
  res.status(200).send({ message: "Onboarding started successfully!" });
});

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);
