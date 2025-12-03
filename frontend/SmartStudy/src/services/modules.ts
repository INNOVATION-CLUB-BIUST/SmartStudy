import { get, post, put, del } from './api';
import { auth } from './firebase';

// Type definitions matching the backend schema
export interface ClassSchedule {
    day: string;
    startTime: string;
    endTime: string;
    location: string;
    type: 'lecture' | 'tutorial' | 'lab';
}

export interface AssessmentComponent {
    name: string;
    weight: number;
    score?: number;
    maxScore: number;
    dueDate?: string;
}

export interface Assessments {
    ca: {
        weight: number;
        components: AssessmentComponent[];
    };
    finalExam: {
        weight: number;
        date: string;
        score?: number;
    };
    dpRequirement: number;
    passingMark: number;
}

export interface Module {
    id: string;
    userId: string;
    code: string;
    name: string;
    credits: number;
    instructor: string;
    difficulty: 'easy' | 'medium' | 'hard';
    color: string;
    classSchedule: ClassSchedule[];
    assessments: Assessments;
    targetGrade?: number;
    createdAt: string;
    updatedAt: string;
}

export type CreateModuleData = Omit<Module, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
export type UpdateModuleData = Partial<Omit<Module, 'id' | 'userId' | 'createdAt'>>;

/**
 * Get authentication headers for API requests
 */
async function getAuthHeader(): Promise<{ Authorization: string }> {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('Not authenticated');
    }
    const token = await user.getIdToken();
    return { Authorization: `Bearer ${token}` };
}

/**
 * Fetch all modules for the authenticated user
 */
export async function fetchModules(): Promise<Module[]> {
    const headers = await getAuthHeader();
    return get<Module[]>('/modules', { headers });
}

/**
 * Fetch a single module by ID
 */
export async function fetchModule(id: string): Promise<Module> {
    const headers = await getAuthHeader();
    return get<Module>(`/modules/${id}`, { headers });
}

/**
 * Create a new module
 */
export async function createModule(data: CreateModuleData): Promise<Module> {
    const headers = await getAuthHeader();
    return post<Module>('/modules', data, { headers });
}

/**
 * Update an existing module
 */
export async function updateModule(id: string, data: UpdateModuleData): Promise<Module> {
    const headers = await getAuthHeader();
    return put<Module>(`/modules/${id}`, data, { headers });
}

/**
 * Delete a module
 */
export async function deleteModule(id: string): Promise<{ success: boolean; message: string; id: string }> {
    const headers = await getAuthHeader();
    return del<{ success: boolean; message: string; id: string }>(`/modules/${id}`, { headers });
}
