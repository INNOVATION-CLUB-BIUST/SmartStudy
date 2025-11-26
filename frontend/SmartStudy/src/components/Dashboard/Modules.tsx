import { useState } from 'react';
import { BookOpen, Plus } from 'lucide-react';
import AddModuleModal from './AddModuleModal';
import ModuleTopBar from './modules/ModuleTopBar';
import ModuleInfo from './modules/ModuleInfo';
import ClassScheduleList from './modules/ClassScheduleList';
import AssessmentList from './modules/AssessmentList';
import GradeCalculator from './modules/GradeCalculator';

interface ClassSchedule {
  day: string;
  startTime: string;
  endTime: string;
  location: string;
  type: 'lecture' | 'tutorial' | 'lab';
}

interface AssessmentComponent {
  name: string;
  weight: number;
  score?: number;
  maxScore: number;
  dueDate?: string;
}

interface Module {
  id: string;
  code: string;
  name: string;
  credits: number;
  instructor: string;
  difficulty: 'easy' | 'medium' | 'hard';
  classSchedule: ClassSchedule[];
  assessments: {
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
  };
  targetGrade?: number;
  color: string;
}

// Mock data
const mockModules: Module[] = [
  {
    id: '1',
    code: 'CSI311',
    name: 'Data Structures & Algorithms',
    credits: 3,
    instructor: 'Dr. Sarah Johnson',
    difficulty: 'hard',
    color: 'from-orange-500 to-red-500',
    classSchedule: [
      { day: 'Monday', startTime: '09:00', endTime: '11:00', location: 'Lecture Hall A', type: 'lecture' },
      { day: 'Wednesday', startTime: '14:00', endTime: '16:00', location: 'Lab B', type: 'lab' }
    ],
    assessments: {
      ca: {
        weight: 40,
        components: [
          { name: 'Assignment 1', weight: 10, score: 8, maxScore: 10 },
          { name: 'Assignment 2', weight: 10, score: 6, maxScore: 10 },
          { name: 'CA Test 1', weight: 10, maxScore: 10, dueDate: '2025-11-30' },
          { name: 'CA Test 2', weight: 10, maxScore: 10, dueDate: '2025-12-10' }
        ]
      },
      finalExam: {
        weight: 60,
        date: '2025-12-15'
      },
      dpRequirement: 40,
      passingMark: 50
    },
    targetGrade: 75
  },
  {
    id: '2',
    code: 'MAT201',
    name: 'Calculus II',
    credits: 3,
    instructor: 'Prof. Michael Chen',
    difficulty: 'medium',
    color: 'from-blue-500 to-cyan-500',
    classSchedule: [
      { day: 'Tuesday', startTime: '10:00', endTime: '12:00', location: 'Math Building 201', type: 'lecture' },
      { day: 'Thursday', startTime: '10:00', endTime: '12:00', location: 'Math Building 201', type: 'tutorial' }
    ],
    assessments: {
      ca: {
        weight: 30,
        components: [
          { name: 'Quiz 1', weight: 10, score: 9, maxScore: 10 },
          { name: 'Quiz 2', weight: 10, score: 7, maxScore: 10 },
          { name: 'Midterm', weight: 10, maxScore: 10, dueDate: '2025-11-28' }
        ]
      },
      finalExam: {
        weight: 70,
        date: '2025-12-18'
      },
      dpRequirement: 40,
      passingMark: 50
    },
    targetGrade: 80
  },
  {
    id: '3',
    code: 'PHY101',
    name: 'Physics for Engineers',
    credits: 4,
    instructor: 'Dr. Emily Rodriguez',
    difficulty: 'medium',
    color: 'from-green-500 to-emerald-500',
    classSchedule: [
      { day: 'Monday', startTime: '14:00', endTime: '16:00', location: 'Science Block 3', type: 'lecture' },
      { day: 'Friday', startTime: '09:00', endTime: '11:00', location: 'Physics Lab', type: 'lab' }
    ],
    assessments: {
      ca: {
        weight: 40,
        components: [
          { name: 'Lab Report 1', weight: 10, score: 8.5, maxScore: 10 },
          { name: 'Lab Report 2', weight: 10, maxScore: 10, dueDate: '2025-12-01' },
          { name: 'CA Test', weight: 20, maxScore: 20, dueDate: '2025-12-08' }
        ]
      },
      finalExam: {
        weight: 60,
        date: '2025-12-20'
      },
      dpRequirement: 40,
      passingMark: 50
    },
    targetGrade: 70
  },
  {
    id: '4',
    code: 'ENG102',
    name: 'Technical Communication',
    credits: 2,
    instructor: 'Ms. Amanda Williams',
    difficulty: 'easy',
    color: 'from-purple-500 to-pink-500',
    classSchedule: [
      { day: 'Wednesday', startTime: '16:00', endTime: '18:00', location: 'Humanities 105', type: 'lecture' }
    ],
    assessments: {
      ca: {
        weight: 50,
        components: [
          { name: 'Essay 1', weight: 15, score: 13, maxScore: 15 },
          { name: 'Presentation', weight: 15, score: 12, maxScore: 15 },
          { name: 'Essay 2', weight: 20, maxScore: 20, dueDate: '2025-12-05' }
        ]
      },
      finalExam: {
        weight: 50,
        date: '2025-12-12'
      },
      dpRequirement: 40,
      passingMark: 50
    },
    targetGrade: 85
  }
];

const Modules = () => {
  const [modules, setModules] = useState<Module[]>(mockModules);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(modules[0]?.id || null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const selectedModule = modules.find(m => m.id === selectedModuleId) || null;

  const handleAddModule = (moduleData: Module) => {
    setModules([...modules, moduleData]);
    setSelectedModuleId(moduleData.id);
    setShowAddModal(false);
  };

  const handleUpdateModule = (moduleData: Module) => {
    setModules(modules.map(m => m.id === moduleData.id ? moduleData : m));
    setEditingModule(null);
  };

  const handleDeleteModule = (moduleId: string) => {
    const updatedModules = modules.filter(m => m.id !== moduleId);
    setModules(updatedModules);
    if (selectedModuleId === moduleId) {
      setSelectedModuleId(updatedModules[0]?.id || null);
    }
    setDeleteConfirm(null);
  };

  // Inline update handlers for sub-components
  const handleUpdateSchedule = (newSchedule: ClassSchedule[]) => {
    if (!selectedModule) return;
    const updatedModule = { ...selectedModule, classSchedule: newSchedule };
    setModules(modules.map(m => m.id === selectedModule.id ? updatedModule : m));
  };

  const handleUpdateScore = (componentIndex: number, newScore: number) => {
    if (!selectedModule) return;
    const updatedComponents = [...selectedModule.assessments.ca.components];
    updatedComponents[componentIndex] = { ...updatedComponents[componentIndex], score: newScore };
    
    const updatedModule = {
      ...selectedModule,
      assessments: {
        ...selectedModule.assessments,
        ca: {
          ...selectedModule.assessments.ca,
          components: updatedComponents
        }
      }
    };
    setModules(modules.map(m => m.id === selectedModule.id ? updatedModule : m));
  };

  const handleUpdateFinalScore = (newScore: number) => {
    if (!selectedModule) return;
    const updatedModule = {
      ...selectedModule,
      assessments: {
        ...selectedModule.assessments,
        finalExam: {
          ...selectedModule.assessments.finalExam,
          score: newScore
        }
      }
    };
    setModules(modules.map(m => m.id === selectedModule.id ? updatedModule : m));
  };

  /**
   * Calculate the CA percentage earned for a module.
   * Returns a percentage (0-100%) representing how much of the available CA marks were earned.
   * Example: If student earned 14/20 marks and max possible is 20/20, this returns 70%.
   */
  const calculateCAPercentage = (module: Module) => {
    const components = module.assessments.ca.components;
    
    // Calculate total earned percentage across all completed assessments
    let totalEarnedPercentage = 0;
    let totalWeightCompleted = 0;
    
    components.forEach(comp => {
      if (comp.score !== undefined) {
        // Calculate percentage for this component and weight it
        const componentPercentage = (comp.score / comp.maxScore) * 100;
        totalEarnedPercentage += (componentPercentage * comp.weight) / 100;
        totalWeightCompleted += comp.weight;
      }
    });
    
    // Return the percentage of CA marks earned relative to completed assessments
    // If no assessments completed, return 0
    if (totalWeightCompleted === 0) return 0;
    
    // Calculate overall CA percentage: (earned weighted % / total weight) * 100
    return (totalEarnedPercentage / totalWeightCompleted) * 100;
  };

  /**
   * Calculate the CA points earned for a module (for display purposes).
   * Returns weighted points earned (e.g., 14 out of 40 total CA weight).
   */
  const calculateCAProgress = (module: Module) => {
    const earnedPoints = module.assessments.ca.components.reduce((sum, comp) => {
      if (comp.score !== undefined) {
        return sum + (comp.score / comp.maxScore) * comp.weight;
      }
      return sum;
    }, 0);
    return earnedPoints;
  };

  return (
    <div className="relative min-h-screen pb-20 flex flex-col">
      {/* Top Bar Navigation */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-4">My Modules</h1>
        <ModuleTopBar 
          modules={modules}
          selectedModuleId={selectedModuleId}
          onSelectModule={(m) => setSelectedModuleId(m.id)}
          onAddModule={() => setShowAddModal(true)}
        />
      </div>

      {/* Main Content Area */}
      {selectedModule ? (
        <div className="flex-1 space-y-6 animate-in fade-in duration-500">
          {/* Module Info Header */}
          <ModuleInfo 
            module={selectedModule}
            onEdit={() => setEditingModule(selectedModule)}
            onDelete={() => setDeleteConfirm(selectedModule.id)}
          />

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Schedule */}
            <div className="lg:col-span-1">
              <ClassScheduleList 
                schedule={selectedModule.classSchedule}
                onUpdate={handleUpdateSchedule}
              />
            </div>

            {/* Column 2: Assessments */}
            <div className="lg:col-span-1">
              <AssessmentList 
                assessments={selectedModule.assessments}
                onUpdateScore={handleUpdateScore}
                onUpdateFinalScore={handleUpdateFinalScore}
              />
            </div>

            {/* Column 3: Grade Calculator */}
            <div className="lg:col-span-1">
              <GradeCalculator 
                currentCAPercentage={calculateCAPercentage(selectedModule)}
                caWeight={selectedModule.assessments.ca.weight}
                finalWeight={selectedModule.assessments.finalExam.weight}
                passingMark={selectedModule.assessments.passingMark}
                targetGrade={selectedModule.targetGrade}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-slate-800/30 rounded-3xl border border-dashed border-slate-700">
          <BookOpen className="h-16 w-16 text-slate-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Module Selected</h3>
          <p className="text-slate-400 max-w-md">
            Select a module from the top bar to view details, or add a new one to get started.
          </p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-medium rounded-xl transition-colors flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add First Module
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingModule) && (
        <AddModuleModal 
          onClose={() => {
            setShowAddModal(false);
            setEditingModule(null);
          }}
          onSave={editingModule ? handleUpdateModule : handleAddModule}
          existingModule={editingModule}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-2">Delete Module?</h3>
            <p className="text-slate-400 mb-6">
              Are you sure you want to delete this module? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDeleteModule(deleteConfirm)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Delete Module
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modules;
