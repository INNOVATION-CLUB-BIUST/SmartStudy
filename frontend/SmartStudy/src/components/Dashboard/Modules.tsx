import { useState, useEffect } from 'react';
import { BookOpen, Plus } from 'lucide-react';
import AddModuleModal from './AddModuleModal';
import ModuleTopBar from './modules/ModuleTopBar';
import ModuleInfo from './modules/ModuleInfo';
import ClassScheduleList from './modules/ClassScheduleList';
import AssessmentList from './modules/AssessmentList';
import GradeCalculator from './modules/GradeCalculator';
import { fetchModules, createModule, updateModule, deleteModule } from '../../services/modules';
type CreateModuleData = Omit<Module, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;



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

const Modules = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(modules[0]?.id || null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const selectedModule = modules.find(m => m.id === selectedModuleId) || null;

  useEffect(() => {
  const loadModules = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchModules();
      setModules(data);
      
      // Select first module if none selected
      if (data.length > 0 && !selectedModuleId) {
        setSelectedModuleId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load modules:', err);
      setError('Failed to load modules. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  loadModules();
}, [selectedModuleId]); // Empty array means this runs once on mount

const handleAddModule = async (moduleData: CreateModuleData) => {
  try {
    setError(null);
    
    // Remove the id field - backend will generate it
    const { id, ...dataWithoutId } = moduleData;
    
    // Call API to create module
    const newModule = await createModule(dataWithoutId);
    
    // Add to local state
    setModules([...modules, newModule]);
    setSelectedModuleId(newModule.id);
    setShowAddModal(false);
  } catch (err) {
    console.error('Failed to create module:', err);
    setError('Failed to create module. Please try again.');
  }
};

const handleUpdateModule = async (moduleData: Module) => {
  try {
    setError(null);
    
    // Extract only the fields that may have changed
    const { id, userId, createdAt, updatedAt, ...updateData } = moduleData;
    
    // Call API to update module
    const updatedModule = await updateModule(moduleData.id, updateData);
    
    // Update local state
    setModules(modules.map(m => m.id === updatedModule.id ? updatedModule : m));
    setEditingModule(null);
  } catch (err) {
    console.error('Failed to update module:', err);
    setError('Failed to update module. Please try again.');
  }
};

const handleDeleteModule = async (moduleId: string) => {
  try {
    setError(null);
    
    // Call API to delete module
    await deleteModule(moduleId);
    
    // Update local state
    const updatedModules = modules.filter(m => m.id !== moduleId);
    setModules(updatedModules);
    
    // Select another module if needed
    if (selectedModuleId === moduleId) {
      setSelectedModuleId(updatedModules[0]?.id || null);
    }
    
    setDeleteConfirm(null);
  } catch (err) {
    console.error('Failed to delete module:', err);
    setError('Failed to delete module. Please try again.');
  }
};

  // Inline update handlers for sub-components
const handleUpdateSchedule = async (newSchedule: ClassSchedule[]) => {
  if (!selectedModule) return;
  
  try {
    setError(null);
    const updatedModule = await updateModule(selectedModule.id, {
      classSchedule: newSchedule
    });
    setModules(modules.map(m => m.id === selectedModule.id ? updatedModule : m));
  } catch (err) {
    console.error('Failed to update schedule:', err);
    setError('Failed to update schedule. Please try again.');
  }
};

const handleUpdateScore = async (componentIndex: number, newScore: number) => {
  if (!selectedModule) return;
  
  try {
    setError(null);
    const updatedComponents = [...selectedModule.assessments.ca.components];
    updatedComponents[componentIndex] = { 
      ...updatedComponents[componentIndex], 
      score: newScore 
    };
    
    const updatedModule = await updateModule(selectedModule.id, {
      assessments: {
        ...selectedModule.assessments,
        ca: {
          ...selectedModule.assessments.ca,
          components: updatedComponents
        }
      }
    });
    
    setModules(modules.map(m => m.id === selectedModule.id ? updatedModule : m));
  } catch (err) {
    console.error('Failed to update score:', err);
    setError('Failed to update score. Please try again.');
  }
};

const handleUpdateFinalScore = async (newScore: number) => {
  if (!selectedModule) return;
  
  try {
    setError(null);
    const updatedModule = await updateModule(selectedModule.id, {
      assessments: {
        ...selectedModule.assessments,
        finalExam: {
          ...selectedModule.assessments.finalExam,
          score: newScore
        }
      }
    });
    
    setModules(modules.map(m => m.id === selectedModule.id ? updatedModule : m));
  } catch (err) {
    console.error('Failed to update final score:', err);
    setError('Failed to update final score. Please try again.');
  }
};

  /**
   * Calculate the CA percentage earned for a module based on completed assessments only.
   * Returns a percentage (0-100%) representing performance quality on completed work.
   * 
   * Note: This calculates against only the assessments that have been completed,
   * not the total possible CA. This shows how well the student is performing
   * on what they've done so far. The conversion to points (via caWeight) then
   * reflects actual points contributed to the final grade.
   * 
   * Example: If 2 of 4 assessments are complete with scores of 8/10 and 6/10,
   * the percentage is (8+6)/(10+10) * 100 = 70% (performance on completed work).
   * This 70% is then converted to actual points: 70% * 40 total CA = 28 points.
   */
  const calculateCAPercentage = (module: Module) => {
    const components = module.assessments.ca.components;
    
    // Calculate points earned from completed assessments
    let pointsEarned = 0;
    let maxPointsAvailable = 0;
    
    components.forEach(comp => {
      if (comp.score !== undefined) {
        // Calculate points for this component
        // E.g., score=8 out of maxScore=10 for weight=10% → earns 8 points out of 10 possible
        pointsEarned += (comp.score / comp.maxScore) * comp.weight;
        maxPointsAvailable += comp.weight;
      }
    });
    
    // Return the percentage of CA marks earned relative to completed assessments
    // If no assessments completed, return 0
    if (maxPointsAvailable === 0) return 0;
    
    // Calculate overall CA percentage: (points earned / max points available) * 100
    return (pointsEarned / maxPointsAvailable) * 100;
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
      
      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-slate-400">Loading modules...</span>
        </div>
      ) : (
        <ModuleTopBar 
          modules={modules}
          selectedModuleId={selectedModuleId}
          onSelectModule={(m) => setSelectedModuleId(m.id)}
          onAddModule={() => setShowAddModal(true)}
        />
      )}
    </div>

    {/* Error Display */}
    {error && (
      <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
        <p className="text-red-400 text-sm">{error}</p>
        <button
          onClick={() => setError(null)}
          className="mt-2 text-xs text-red-300 hover:text-red-200 underline"
        >
          Dismiss
        </button>
      </div>
    )}
    
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
        !isLoading && !selectedModule && modules.length === 0 && (
  <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-slate-800/30 rounded-3xl border border-dashed border-slate-700">
    <BookOpen className="h-16 w-16 text-slate-600 mb-4" />
    <h3 className="text-xl font-bold text-white mb-2">No Modules Yet</h3>
    <p className="text-slate-400 max-w-md mb-6">
      Get started by adding your first module. Track classes, assignments, and grades all in one place.
    </p>
    <button 
      onClick={() => setShowAddModal(true)}
      className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-medium rounded-xl transition-colors flex items-center gap-2"
    >
      <Plus className="h-5 w-5" />
      Add First Module
    </button>
  </div>
)
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
