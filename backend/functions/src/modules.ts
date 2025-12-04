import * as express from 'express';
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const modulesRouter = express.Router();

// Get Firestore instance - must be called after admin.initializeApp()
const getDb = () => admin.firestore();

// Middleware to verify Firebase Auth token
const authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized - No token provided' });
        return;
    }

    try {
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        (req as any).user = decodedToken; // Add user to request
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ error: 'Invalid or expired token' });
        return;
    }
};

// Apply authentication to all routes
modulesRouter.use(authenticate);

// GET /modules - List all modules for authenticated user
modulesRouter.get('/', async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const userId = (req as any).user.uid;

        const snapshot = await getDb().collection('classes')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();

        const modules = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(modules);
    } catch (error) {
        console.error('Error fetching modules:', error);
        res.status(500).json({
            error: 'Failed to fetch modules',
            details: error instanceof Error ? error.message : String(error)
        });
    }
});

// GET /modules/:id - Get single module
modulesRouter.get('/:id', async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const userId = (req as any).user.uid;
        const { id } = req.params;

        const doc = await getDb().collection('classes').doc(id).get();

        if (!doc.exists) {
            res.status(404).json({ error: 'Module not found' });
            return;
        }

        const data = doc.data();

        // Verify ownership
        if (data?.userId !== userId) {
            res.status(403).json({ error: 'Forbidden - Not your module' });
            return;
        }

        res.json({ id: doc.id, ...data });
    } catch (error) {
        console.error('Error fetching module:', error);
        res.status(500).json({
            error: 'Failed to fetch module',
            details: error instanceof Error ? error.message : String(error)
        });
    }
});

// POST /modules - Create new module
modulesRouter.post('/', async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const userId = (req as any).user.uid;
        const moduleData = req.body;

        // Validate required fields
        if (!moduleData.code || !moduleData.name) {
            res.status(400).json({ error: 'Missing required fields: code and name' });
            return;
        }

        const now = FieldValue.serverTimestamp();

        const newModule = {
            userId,
            code: moduleData.code,
            name: moduleData.name,
            credits: moduleData.credits || 3,
            instructor: moduleData.instructor || '',
            difficulty: moduleData.difficulty || 'medium',
            color: moduleData.color || 'from-blue-500 to-cyan-500',
            classSchedule: moduleData.classSchedule || [],
            assessments: moduleData.assessments || {
                ca: {
                    weight: 40,
                    components: []
                },
                finalExam: {
                    weight: 60,
                    date: ''
                },
                dpRequirement: 40,
                passingMark: 50
            },
            targetGrade: moduleData.targetGrade || null,
            createdAt: now,
            updatedAt: now
        };

        const docRef = await getDb().collection('classes').add(newModule);
        const savedDoc = await docRef.get();

        res.status(201).json({
            id: docRef.id,
            ...savedDoc.data()
        });
    } catch (error) {
        console.error('Error creating module:', error);
        res.status(500).json({
            error: 'Failed to create module',
            details: error instanceof Error ? error.message : String(error)
        });
    }
});

// PUT /modules/:id - Update module
modulesRouter.put('/:id', async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const userId = (req as any).user.uid;
        const { id } = req.params;
        const updates = req.body;

        // First check if module exists and user owns it
        const docRef = getDb().collection('classes').doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            res.status(404).json({ error: 'Module not found' });
            return;
        }

        const data = doc.data();
        if (data?.userId !== userId) {
            res.status(403).json({ error: 'Forbidden - Not your module' });
            return;
        }

        // Don't allow changing userId or createdAt
        delete updates.userId;
        delete updates.createdAt;

        const updateData = {
            ...updates,
            updatedAt: FieldValue.serverTimestamp()
        };

        await docRef.update(updateData);
        const updatedDoc = await docRef.get();

        res.json({
            id: docRef.id,
            ...updatedDoc.data()
        });
    } catch (error) {
        console.error('Error updating module:', error);
        res.status(500).json({
            error: 'Failed to update module',
            details: error instanceof Error ? error.message : String(error)
        });
    }
});

// DELETE /modules/:id - Delete module
modulesRouter.delete('/:id', async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const userId = (req as any).user.uid;
        const { id } = req.params;

        // First check if module exists and user owns it
        const docRef = getDb().collection('classes').doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            res.status(404).json({ error: 'Module not found' });
            return;
        }

        const data = doc.data();
        if (data?.userId !== userId) {
            res.status(403).json({ error: 'Forbidden - Not your module' });
            return;
        }

        await docRef.delete();

        res.json({
            success: true,
            message: 'Module deleted successfully',
            id
        });
    } catch (error) {
        console.error('Error deleting module:', error);
        res.status(500).json({
            error: 'Failed to delete module',
            details: error instanceof Error ? error.message : String(error)
        });
    }
});
