import { useState } from 'react';
import { Calendar, BookOpen, Clock, Target } from 'lucide-react';

// Types for this step's data shape
export interface ExamItem {
  name: string;
  date: string; // ISO date string (YYYY-MM-DD)
  importance: '' | 'low' | 'medium' | 'high' | 'critical';
}

export interface AssignmentItem {
  name: string;
  deadline: string; // ISO date string
  priority: '' | 'low' | 'medium' | 'high';
}

export interface ProjectItem {
  name: string;
  deadline: string; // ISO date string
  priority: '' | 'low' | 'medium' | 'high';
}

export interface EventPrepData {
  upcomingExams: ExamItem[];
  assignmentDeadlines: AssignmentItem[];
  projectDeadlines: ProjectItem[];
  prepTimePreference: '' | '1-week' | '2-weeks' | '1-month' | 'flexible';
  studyIntensity: '' | 'light' | 'moderate' | 'intense' | 'cramming';
  reminderPreferences: string[];
  stressLevel: '' | '1' | '2' | '3' | '4' | '5';
}

interface EventPrepStepProps {
  data?: Partial<EventPrepData>;
  onDataChange: (data: EventPrepData) => void;
}

const defaultEventPrepData: EventPrepData = {
  upcomingExams: [],
  assignmentDeadlines: [],
  projectDeadlines: [],
  prepTimePreference: '',
  studyIntensity: '',
  reminderPreferences: [],
  stressLevel: '',
};

const EventPrepStep = ({ data, onDataChange }: EventPrepStepProps) => {
  const [formData, setFormData] = useState<EventPrepData>({
    ...defaultEventPrepData,
    ...data,
  });

  const handleInputChange = <K extends keyof EventPrepData>(field: K, value: EventPrepData[K]) => {
    const newData: EventPrepData = { ...formData, [field]: value } as EventPrepData;
    setFormData(newData);
    onDataChange(newData);
  };

  const handleArrayToggle = (field: 'reminderPreferences', value: string) => {
    const currentArray = formData[field];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    handleInputChange(field, newArray);
  };


  const reminderOptions = [
    'Email notifications',
    'Push notifications',
    'SMS alerts',
    'Desktop notifications',
    'Calendar integration',
    'Study buddy reminders'
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mb-4">
          <Calendar className="h-8 w-8 text-black" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Prepare for upcoming events</h2>
        <p className="text-slate-300">
          Let us know about your upcoming exams, assignments, and projects.
        </p>
      </div>

      {/* Upcoming Exams */}
      <div className="space-y-4">
        <label className="text-lg font-medium text-orange-300">Upcoming Exams</label>
        <div className="space-y-3">
          {formData.upcomingExams.map((exam: ExamItem, index: number) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-slate-700/50 rounded-lg border border-orange-500/20">
              <input
                type="text"
                placeholder="Exam name"
                value={exam.name || ''}
                onChange={(e) => {
                  const newExams = [...formData.upcomingExams];
                  newExams[index] = { ...newExams[index], name: e.target.value };
                  handleInputChange('upcomingExams', newExams);
                }}
                className="px-3 py-2 bg-slate-600 border border-orange-500/30 rounded text-white placeholder-slate-400 focus:border-orange-500"
              />
              <input
                type="date"
                value={exam.date || ''}
                onChange={(e) => {
                  const newExams = [...formData.upcomingExams];
                  newExams[index] = { ...newExams[index], date: e.target.value };
                  handleInputChange('upcomingExams', newExams);
                }}
                className="px-3 py-2 bg-slate-600 border border-orange-500/30 rounded text-white focus:border-orange-500"
              />
              <select
                value={exam.importance || ''}
                onChange={(e) => {
                  const newExams = [...formData.upcomingExams];
                  newExams[index] = { ...newExams[index], importance: e.target.value as ExamItem['importance'] };
                  handleInputChange('upcomingExams', newExams);
                }}
                className="px-3 py-2 bg-slate-600 border border-orange-500/30 rounded text-white focus:border-orange-500"
              >
                <option value="">Importance</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          ))}
          <button
            onClick={() => {
              const newExams: ExamItem[] = [...formData.upcomingExams, { name: '', date: '', importance: '' }];
              handleInputChange('upcomingExams', newExams);
            }}
            className="w-full py-2 border-2 border-dashed border-orange-500/50 rounded-lg text-orange-300 hover:border-orange-500 hover:bg-orange-500/10 transition-all duration-300"
          >
            + Add Exam
          </button>
        </div>
      </div>

      {/* Assignment Deadlines */}
      <div className="space-y-4">
        <label className="text-lg font-medium text-orange-300">Assignment Deadlines</label>
        <div className="space-y-3">
          {formData.assignmentDeadlines.map((assignment: AssignmentItem, index: number) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-slate-700/50 rounded-lg border border-orange-500/20">
              <input
                type="text"
                placeholder="Assignment name"
                value={assignment.name || ''}
                onChange={(e) => {
                  const newAssignments = [...formData.assignmentDeadlines];
                  newAssignments[index] = { ...newAssignments[index], name: e.target.value };
                  handleInputChange('assignmentDeadlines', newAssignments);
                }}
                className="px-3 py-2 bg-slate-600 border border-orange-500/30 rounded text-white placeholder-slate-400 focus:border-orange-500"
              />
              <input
                type="date"
                value={assignment.deadline || ''}
                onChange={(e) => {
                  const newAssignments = [...formData.assignmentDeadlines];
                  newAssignments[index] = { ...newAssignments[index], deadline: e.target.value };
                  handleInputChange('assignmentDeadlines', newAssignments);
                }}
                className="px-3 py-2 bg-slate-600 border border-orange-500/30 rounded text-white focus:border-orange-500"
              />
              <select
                value={assignment.priority || ''}
                onChange={(e) => {
                  const newAssignments = [...formData.assignmentDeadlines];
                  newAssignments[index] = { ...newAssignments[index], priority: e.target.value as AssignmentItem['priority'] };
                  handleInputChange('assignmentDeadlines', newAssignments);
                }}
                className="px-3 py-2 bg-slate-600 border border-orange-500/30 rounded text-white focus:border-orange-500"
              >
                <option value="">Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          ))}
          <button
            onClick={() => {
              const newAssignments: AssignmentItem[] = [...formData.assignmentDeadlines, { name: '', deadline: '', priority: '' }];
              handleInputChange('assignmentDeadlines', newAssignments);
            }}
            className="w-full py-2 border-2 border-dashed border-orange-500/50 rounded-lg text-orange-300 hover:border-orange-500 hover:bg-orange-500/10 transition-all duration-300"
          >
            + Add Assignment
          </button>
        </div>
      </div>

      {/* Prep Time Preference */}
      <div className="space-y-4">
        <label className="text-lg font-medium text-orange-300">How far in advance do you like to start preparing?</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: '1-week', label: '1 week before', icon: Clock },
            { id: '2-weeks', label: '2 weeks before', icon: BookOpen },
            { id: '1-month', label: '1 month before', icon: Calendar },
            { id: 'flexible', label: 'Depends on the subject', icon: Target },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => handleInputChange('prepTimePreference', option.id as EventPrepData['prepTimePreference'])}
              className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                formData.prepTimePreference === option.id
                  ? 'border-orange-500 bg-orange-500/20 text-white'
                  : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-orange-500/50 hover:bg-orange-500/10'
              }`}
            >
              <option.icon className="h-6 w-6 mb-2 text-orange-400" />
              <div className="font-medium">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Study Intensity */}
      <div className="space-y-4">
        <label className="text-lg font-medium text-orange-300">How intense do you prefer your study sessions?</label>
        <div className="space-y-3">
          {[
            { id: 'light', label: 'Light - Easy pace, lots of breaks', description: '1-2 hours per day' },
            { id: 'moderate', label: 'Moderate - Balanced approach', description: '2-4 hours per day' },
            { id: 'intense', label: 'Intense - Focused, longer sessions', description: '4-6 hours per day' },
            { id: 'cramming', label: 'Cramming - High intensity before exams', description: '6+ hours per day' },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => handleInputChange('studyIntensity', option.id as EventPrepData['studyIntensity'])}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                formData.studyIntensity === option.id
                  ? 'border-orange-500 bg-orange-500/20 text-white'
                  : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-orange-500/50 hover:bg-orange-500/10'
              }`}
            >
              <div className="font-medium">{option.label}</div>
              <div className="text-sm text-slate-400">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Reminder Preferences */}
      <div className="space-y-4">
        <label className="text-lg font-medium text-orange-300">How would you like to be reminded?</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {reminderOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleArrayToggle('reminderPreferences', option)}
              className={`p-3 rounded-lg border transition-all duration-300 text-sm ${
                formData.reminderPreferences.includes(option)
                  ? 'border-orange-500 bg-orange-500/20 text-white'
                  : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-orange-500/50 hover:bg-orange-500/10'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Stress Level */}
      <div className="space-y-4">
        <label className="text-lg font-medium text-orange-300">How would you rate your current stress level?</label>
        <div className="flex space-x-4">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => handleInputChange('stressLevel', level.toString() as EventPrepData['stressLevel'])}
              className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                formData.stressLevel === level.toString()
                  ? 'border-orange-500 bg-orange-500 text-black'
                  : 'border-slate-600 bg-slate-700 text-slate-300 hover:border-orange-500/50'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-400">
          <span>Very Low</span>
          <span>Very High</span>
        </div>
      </div>

    </div>
  );
};

export default EventPrepStep;
