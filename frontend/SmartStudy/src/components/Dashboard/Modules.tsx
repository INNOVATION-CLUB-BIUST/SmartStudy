import { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Edit2, 
  Trash2, 
  Calendar,
  Clock,
  Award,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Target,
  Calculator,
  X,
  GraduationCap
} from 'lucide-react';
import AddModuleModal from './AddModuleModal';

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
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleAddModule = (moduleData: Module) => {
    setModules([...modules, moduleData]);
    setShowAddModal(false);
  };

  const handleUpdateModule = (moduleData: Module) => {
    setModules(modules.map(m => m.id === moduleData.id ? moduleData : m));
    if (selectedModule?.id === moduleData.id) {
      setSelectedModule(moduleData);
    }
    setEditingModule(null);
  };

  const handleDeleteModule = (moduleId: string) => {
    const updatedModules = modules.filter(m => m.id !== moduleId);
    setModules(updatedModules);
    if (selectedModule?.id === moduleId) {
      setSelectedModule(null);
    }
    setDeleteConfirm(null);
  };

  const calculateCAProgress = (module: Module) => {
    const totalWeight = module.assessments.ca.weight;
    const earnedPoints = module.assessments.ca.components.reduce((sum, comp) => {
      if (comp.score !== undefined) {
        return sum + (comp.score / comp.maxScore) * comp.weight;
      }
      return sum;
    }, 0);
    return { earned: earnedPoints, total: totalWeight, percentage: (earnedPoints / totalWeight) * 100 };
  };

  const calculateDPStatus = (module: Module) => {
    const caProgress = calculateCAProgress(module);
    const dpThreshold = (module.assessments.dpRequirement / 100) * module.assessments.ca.weight;
    return {
      achieved: caProgress.earned >= dpThreshold,
      current: caProgress.earned,
      required: dpThreshold
    };
  };

  const calculateGradeNeeded = (module: Module, targetGrade: number) => {
    const caProgress = calculateCAProgress(module);
    const currentTotal = caProgress.earned;
    const finalWeight = module.assessments.finalExam.weight;
    
    const neededFinalScore = ((targetGrade - currentTotal) / finalWeight) * 100;
    
    return {
      neededPercentage: Math.max(0, Math.min(100, neededFinalScore)),
      isPossible: neededFinalScore <= 100,
      currentTotal
    };
  };

  return (
    <div className="relative min-h-screen pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Modules</h1>
          <p className="text-slate-400">Manage your courses, track assessments, and monitor your progress</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-medium rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all shadow-lg shadow-orange-500/20"
        >
          <Plus className="h-5 w-5" />
          Add Module
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-orange-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <BookOpen className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <p className="text-slate-400 text-xs">Total Modules</p>
              <p className="text-xl font-bold text-white">{modules.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-green-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Award className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-slate-400 text-xs">Total Credits</p>
              <p className="text-xl font-bold text-white">{modules.reduce((sum, m) => sum + m.credits, 0)}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-xs">DP Achieved</p>
              <p className="text-xl font-bold text-white">
                {modules.filter(m => calculateDPStatus(m).achieved).length}/{modules.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-slate-400 text-xs">Avg Progress</p>
              <p className="text-xl font-bold text-white">
                {modules.length > 0 
                  ? Math.round(modules.reduce((sum, m) => sum + calculateCAProgress(m).percentage, 0) / modules.length) 
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {modules.map((module) => {
          const caProgress = calculateCAProgress(module);
          const dpStatus = calculateDPStatus(module);

          return (
            <div
              key={module.id}
              onClick={() => setSelectedModule(module)}
              className="group bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-orange-500/30 transition-all cursor-pointer overflow-hidden hover:shadow-lg hover:shadow-orange-500/5"
            >
              {/* Card Header */}
              <div className={`bg-gradient-to-r ${module.color} p-4 relative`}>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setEditingModule(module); }}
                      className="p-1.5 bg-black/20 hover:bg-black/40 rounded-lg text-white transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setDeleteConfirm(module.id); }}
                      className="p-1.5 bg-black/20 hover:bg-red-500/80 rounded-lg text-white transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-1 rounded-md bg-black/20 text-black text-xs font-bold font-mono border border-black/10">
                    {module.code}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium bg-black/20 text-black border border-black/10`}>
                    {module.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-black mb-1">{module.name}</h3>
                <p className="text-black/70 text-sm">{module.instructor}</p>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400">CA Progress</span>
                    <span className="text-white font-bold">{caProgress.percentage.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${module.color}`}
                      style={{ width: `${caProgress.percentage}%` }}
                    />
                  </div>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 bg-slate-700/30 rounded-lg border border-slate-600/50">
                    <div className="text-xs text-slate-400 mb-1">Credits</div>
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4 text-orange-400" />
                      <span className="text-white font-bold">{module.credits}</span>
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg border ${
                    dpStatus.achieved 
                      ? 'bg-green-500/10 border-green-500/20' 
                      : 'bg-yellow-500/10 border-yellow-500/20'
                  }`}>
                    <div className="text-xs text-slate-400 mb-1">DP Status</div>
                    <div className="flex items-center gap-1.5">
                      {dpStatus.achieved ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-400" />
                      )}
                      <span className={`font-bold ${dpStatus.achieved ? 'text-green-400' : 'text-yellow-400'}`}>
                        {dpStatus.achieved ? 'Achieved' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Next Class */}
                <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-700/50">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Next: {module.classSchedule[0]?.day} {module.classSchedule[0]?.startTime}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide-over Details Panel */}
      {selectedModule && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setSelectedModule(null)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-slate-900 border-l border-slate-700 shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Panel Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedModule(null)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedModule.code}</h2>
                    <p className="text-slate-400">{selectedModule.name}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setEditingModule(selectedModule)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white border border-slate-700 transition-colors"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => setDeleteConfirm(selectedModule.id)}
                    className="p-2 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-white border border-slate-700 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Grade Calculator Section */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-orange-400" />
                  Grade Calculator
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                    <div className="text-sm text-slate-400 mb-1">Current CA</div>
                    <div className="text-2xl font-bold text-white">
                      {calculateCAProgress(selectedModule).earned.toFixed(1)}%
                    </div>
                    <div className="text-xs text-slate-500">
                      out of {selectedModule.assessments.ca.weight}%
                    </div>
                  </div>
                  
                  {(() => {
                    const toPass = calculateGradeNeeded(selectedModule, selectedModule.assessments.passingMark);
                    return (
                      <div className={`p-4 rounded-lg border ${toPass.isPossible ? 'bg-blue-500/10 border-blue-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                        <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                          <Target className="h-4 w-4" />
                          <span>To Pass</span>
                        </div>
                        <div className={`text-2xl font-bold ${toPass.isPossible ? 'text-blue-400' : 'text-red-400'}`}>
                          {toPass.neededPercentage.toFixed(1)}%
                        </div>
                        <div className="text-xs text-slate-500">
                          needed on Final
                        </div>
                      </div>
                    );
                  })()}

                  {selectedModule.targetGrade && (() => {
                    const toTarget = calculateGradeNeeded(selectedModule, selectedModule.targetGrade);
                    return (
                      <div className={`p-4 rounded-lg border ${toTarget.isPossible ? 'bg-orange-500/10 border-orange-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                        <div className="text-sm text-slate-400 mb-1">Target ({selectedModule.targetGrade}%)</div>
                        <div className={`text-2xl font-bold ${toTarget.isPossible ? 'text-orange-400' : 'text-red-400'}`}>
                          {toTarget.neededPercentage.toFixed(1)}%
                        </div>
                        <div className="text-xs text-slate-500">
                          needed on Final
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Class Schedule */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-400" />
                  Class Schedule
                </h3>
                <div className="space-y-3">
                  {selectedModule.classSchedule.map((schedule, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-slate-700 rounded-lg">
                          <Clock className="h-5 w-5 text-slate-400" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{schedule.day}</div>
                          <div className="text-sm text-slate-400">{schedule.startTime} - {schedule.endTime}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-white">{schedule.location}</div>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${
                          schedule.type === 'lecture' ? 'bg-blue-500/20 text-blue-400' :
                          schedule.type === 'lab' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {schedule.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assessments */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-orange-400" />
                  Assessments
                </h3>
                <div className="space-y-3">
                  {selectedModule.assessments.ca.components.map((comp, idx) => (
                    <div key={idx} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">{comp.name}</div>
                          <div className="text-sm text-slate-400">Weight: {comp.weight}%</div>
                        </div>
                        <div className="text-right">
                          {comp.score !== undefined ? (
                            <div className="text-green-400 font-bold">{comp.score}/{comp.maxScore}</div>
                          ) : (
                            <div className="text-yellow-400 font-medium">Pending</div>
                          )}
                          {comp.dueDate && (
                            <div className="text-xs text-slate-500 mt-1">
                              Due: {new Date(comp.dueDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Final Exam Card */}
                  <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-red-300 font-medium">Final Exam</div>
                        <div className="text-sm text-red-400/70">Weight: {selectedModule.assessments.finalExam.weight}%</div>
                      </div>
                      <div className="text-right">
                        <div className="text-red-300 font-medium">
                          {new Date(selectedModule.assessments.finalExam.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
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
