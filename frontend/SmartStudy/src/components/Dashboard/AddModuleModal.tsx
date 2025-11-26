import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

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
  maxScore: number;
  dueDate?: string;
}

interface AddModuleModalProps {
  onClose: () => void;
  onSave: (moduleData: any) => void;
  existingModule?: any; // For edit mode
}

const AddModuleModal = ({ onClose, onSave, existingModule }: AddModuleModalProps) => {
  const isEditMode = !!existingModule;
  const [step, setStep] = useState(1);
  
  // Basic Info
  const [code, setCode] = useState(existingModule?.code || '');
  const [name, setName] = useState(existingModule?.name || '');
  const [credits, setCredits] = useState(existingModule?.credits || 3);
  const [instructor, setInstructor] = useState(existingModule?.instructor || '');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(existingModule?.difficulty || 'medium');
  const [targetGrade, setTargetGrade] = useState(existingModule?.targetGrade || 75);
  
  // Class Schedule
  const [classSchedule, setClassSchedule] = useState<ClassSchedule[]>(
    existingModule?.classSchedule || [
      { day: 'Monday', startTime: '09:00', endTime: '11:00', location: '', type: 'lecture' }
    ]
  );
  
  // Assessment Structure
  const [caWeight, setCaWeight] = useState(existingModule?.assessments?.ca?.weight || 40);
  const [finalWeight, setFinalWeight] = useState(existingModule?.assessments?.finalExam?.weight || 60);
  const [dpRequirement, setDpRequirement] = useState(existingModule?.assessments?.dpRequirement || 40);
  const [passingMark, setPassingMark] = useState(existingModule?.assessments?.passingMark || 50);
  const [caComponents, setCaComponents] = useState<AssessmentComponent[]>(
    existingModule?.assessments?.ca?.components || [
      { name: 'Assignment 1', weight: 10, maxScore: 10 }
    ]
  );
  const [finalExamDate, setFinalExamDate] = useState(existingModule?.assessments?.finalExam?.date || '');

  const addClassSchedule = () => {
    setClassSchedule([...classSchedule, { 
      day: 'Monday', 
      startTime: '09:00', 
      endTime: '11:00', 
      location: '', 
      type: 'lecture' 
    }]);
  };

  const removeClassSchedule = (index: number) => {
    setClassSchedule(classSchedule.filter((_, i) => i !== index));
  };

  const updateClassSchedule = (index: number, field: keyof ClassSchedule, value: string) => {
    const updated = [...classSchedule];
    updated[index] = { ...updated[index], [field]: value };
    setClassSchedule(updated);
  };

  const addCAComponent = () => {
    setCaComponents([...caComponents, { 
      name: `Component ${caComponents.length + 1}`, 
      weight: 10, 
      maxScore: 10 
    }]);
  };

  const removeCAComponent = (index: number) => {
    setCaComponents(caComponents.filter((_, i) => i !== index));
  };

  const updateCAComponent = (index: number, field: keyof AssessmentComponent, value: string | number) => {
    const updated = [...caComponents];
    updated[index] = { ...updated[index], [field]: value };
    setCaComponents(updated);
  };

  const handleSave = () => {
    const moduleData = {
      id: existingModule?.id || Date.now().toString(),
      code,
      name,
      credits,
      instructor,
      difficulty,
      targetGrade,
      classSchedule,
      assessments: {
        ca: {
          weight: caWeight,
          components: caComponents
        },
        finalExam: {
          weight: finalWeight,
          date: finalExamDate
        },
        dpRequirement,
        passingMark
      },
      color: difficulty === 'hard' ? 'from-orange-500 to-red-500' : 
             difficulty === 'medium' ? 'from-blue-500 to-cyan-500' : 
             'from-green-500 to-emerald-500'
    };
    onSave(moduleData);
  };

  const totalCAWeight = caComponents.reduce((sum, comp) => sum + comp.weight, 0);
  const isCAWeightValid = totalCAWeight === caWeight;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-orange-500/20 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{isEditMode ? 'Edit Module' : 'Add New Module'}</h2>
              <p className="text-slate-400 text-sm mt-1">Step {step} of 3</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div 
                key={s}
                className={`flex-1 h-1 rounded-full ${s <= step ? 'bg-orange-500' : 'bg-slate-700'}`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Module Code *
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="CSI311"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Credits *
                  </label>
                  <input
                    type="number"
                    value={credits}
                    onChange={(e) => setCredits(parseInt(e.target.value))}
                    min="1"
                    max="6"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Module Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Data Structures & Algorithms"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Instructor
                </label>
                <input
                  type="text"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  placeholder="Dr. Sarah Johnson"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Target Grade (%)
                  </label>
                  <input
                    type="number"
                    value={targetGrade}
                    onChange={(e) => setTargetGrade(parseInt(e.target.value))}
                    min="50"
                    max="100"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Class Schedule</h3>
                <button
                  onClick={addClassSchedule}
                  className="flex items-center gap-2 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-black rounded-lg text-sm font-medium transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Class
                </button>
              </div>

              <div className="space-y-4">
                {classSchedule.map((schedule, index) => (
                  <div key={index} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-sm font-medium text-slate-300">Class {index + 1}</span>
                      {classSchedule.length > 1 && (
                        <button
                          onClick={() => removeClassSchedule(index)}
                          className="p-1 hover:bg-slate-600 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Day</label>
                        <select
                          value={schedule.day}
                          onChange={(e) => updateClassSchedule(index, 'day', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500"
                        >
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Type</label>
                        <select
                          value={schedule.type}
                          onChange={(e) => updateClassSchedule(index, 'type', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500"
                        >
                          <option value="lecture">Lecture</option>
                          <option value="tutorial">Tutorial</option>
                          <option value="lab">Lab</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Start Time</label>
                        <input
                          type="time"
                          value={schedule.startTime}
                          onChange={(e) => updateClassSchedule(index, 'startTime', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">End Time</label>
                        <input
                          type="time"
                          value={schedule.endTime}
                          onChange={(e) => updateClassSchedule(index, 'endTime', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-xs text-slate-400 mb-1">Location</label>
                        <input
                          type="text"
                          value={schedule.location}
                          onChange={(e) => updateClassSchedule(index, 'location', e.target.value)}
                          placeholder="Lecture Hall A"
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Assessment Structure</h3>

              {/* Weights */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    CA Weight (%)
                  </label>
                  <input
                    type="number"
                    value={caWeight}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setCaWeight(val);
                      setFinalWeight(100 - val);
                    }}
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Final Exam Weight (%)
                  </label>
                  <input
                    type="number"
                    value={finalWeight}
                    disabled
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    DP Requirement (% of CA)
                  </label>
                  <input
                    type="number"
                    value={dpRequirement}
                    onChange={(e) => setDpRequirement(parseInt(e.target.value))}
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Passing Mark (%)
                  </label>
                  <input
                    type="number"
                    value={passingMark}
                    onChange={(e) => setPassingMark(parseInt(e.target.value))}
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* CA Components */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-semibold text-white">CA Components</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Total: {totalCAWeight}% {!isCAWeightValid && (
                        <span className="text-red-400">(should equal {caWeight}%)</span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={addCAComponent}
                    className="flex items-center gap-2 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-black rounded-lg text-sm font-medium transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Component
                  </button>
                </div>

                <div className="space-y-3">
                  {caComponents.map((component, index) => (
                    <div key={index} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-sm font-medium text-slate-300">Component {index + 1}</span>
                        {caComponents.length > 1 && (
                          <button
                            onClick={() => removeCAComponent(index)}
                            className="p-1 hover:bg-slate-600 rounded transition-colors"
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-3">
                          <label className="block text-xs text-slate-400 mb-1">Name</label>
                          <input
                            type="text"
                            value={component.name}
                            onChange={(e) => updateCAComponent(index, 'name', e.target.value)}
                            placeholder="Assignment 1"
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:border-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Weight (%)</label>
                          <input
                            type="number"
                            value={component.weight}
                            onChange={(e) => updateCAComponent(index, 'weight', parseInt(e.target.value))}
                            min="0"
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Max Score</label>
                          <input
                            type="number"
                            value={component.maxScore}
                            onChange={(e) => updateCAComponent(index, 'maxScore', parseInt(e.target.value))}
                            min="0"
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Due Date (optional)</label>
                          <input
                            type="date"
                            value={component.dueDate || ''}
                            onChange={(e) => updateCAComponent(index, 'dueDate', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Exam Date */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Final Exam Date
                </label>
                <input
                  type="date"
                  value={finalExamDate}
                  onChange={(e) => setFinalExamDate(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 flex items-center justify-between">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          <div className="flex gap-3">
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && (!code || !name)}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-black font-medium rounded-lg transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={!isCAWeightValid || !code || !name}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-black font-medium rounded-lg transition-all"
              >
                {isEditMode ? 'Update Module' : 'Save Module'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddModuleModal;
