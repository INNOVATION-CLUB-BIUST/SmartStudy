import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { getCurrentUser } from '../services/auth';

interface Subject {
	name: string;
	code: string;
	credits: number;
	instructor?: string;
}

interface Preferences {
	studyTimePreference: string;
	weeklyStudyHours: number;
	preferredStudyMethods?: string[];
	breakPreference?: string;
}

interface UserProfile {
	uid: string;
	email: string;
	firstName?: string;
	lastName?: string;
	onboardingCompleted?: boolean;
	university?: string;
	major?: string;
	yearOfStudy?: string;
	studentId?: string;
	dateOfBirth?: string;
	subjects?: Subject[];
	preferences?: Preferences;
}

export const useUser = () => {
	const [user, setUser] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const currentUser = getCurrentUser();
        
				if (!currentUser) {
					setUser(null);
					setLoading(false);
					return;
				}

				// Fetch user profile from Firestore
				const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        
				if (userDoc.exists()) {
					setUser({
						uid: currentUser.uid,
						email: currentUser.email || '',
						...userDoc.data()
					} as UserProfile);
				} else {
					// User authenticated but no profile yet
					setUser({
						uid: currentUser.uid,
						email: currentUser.email || '',
						onboardingCompleted: false
					});
				}
			} catch (err) {
				console.error('Error fetching user:', err);
				setError(err instanceof Error ? err.message : 'Failed to fetch user');
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	return { user, loading, error };
};
