import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { Goal } from '../../types';

// Form-specific types use strings for date inputs
type FormMilestone = {
  title: string;
  targetDate: string; // yyyy-mm-dd
  completed: boolean;
};

type FormGoal = {
  title: string;
  description: string;
  type: Goal['type'];
  priority: Goal['priority'];
  status: Goal['status'];
  targetDate: string;
  progress: number;
  milestones: FormMilestone[];
};

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingGoal?: Goal | null;
}

const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose, onSave, editingGoal }) => {
  const [formData, setFormData] = useState<FormGoal>({
    title: '',
    description: '',
    type: 'academic',
    priority: 'medium',
    status: 'active',
    targetDate: '',
    progress: 0,
    milestones: []
  });

  const [newMilestone, setNewMilestone] = useState<FormMilestone>({
    title: '',
    targetDate: '',
    completed: false
  });

  useEffect(() => {
    if (editingGoal) {
      setFormData({
        title: editingGoal.title,
        description: editingGoal.description || '',
        type: editingGoal.type,
        priority: editingGoal.priority,
        status: editingGoal.status,
        targetDate: editingGoal.targetDate.toISOString().split('T')[0],
        progress: editingGoal.progress,
        milestones: editingGoal.milestones.map(m => ({
          title: m.title,
          targetDate: m.targetDate.toISOString().split('T')[0],
          completed: m.completed
        }))
      });
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'academic',
        priority: 'medium',
        status: 'active',
        targetDate: '',
        progress: 0,
        milestones: []
      });
    }
  }, [editingGoal, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'> = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      priority: formData.priority,
      status: formData.status,
      targetDate: new Date(formData.targetDate),
      progress: formData.progress,
      milestones: formData.milestones.map((milestone, index) => ({
        id: `${Date.now()}-${index}`,
        title: milestone.title,
        targetDate: new Date(milestone.targetDate),
        completed: milestone.completed,
        completedAt: milestone.completed ? new Date() : undefined
      }))
    };

    onSave(goalData);
    onClose();
  };

  const addMilestone = () => {
    if (newMilestone.title && newMilestone.targetDate) {
      setFormData(prev => ({
        ...prev,
        milestones: [...prev.milestones, newMilestone]
      }));
      setNewMilestone({ title: '', targetDate: '', completed: false });
    }
  };

  const removeMilestone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {editingGoal ? 'Edit Goal' : 'Add New Goal'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Goal['type'] }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="academic">Academic</option>
                  <option value="study">Study</option>
                  <option value="personal">Personal</option>
                  <option value="career">Career</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Goal['priority'] }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Goal['status'] }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Target Date *
                </label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
            </div>

            {/* Milestones */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Milestones
              </label>
              
              {/* Add Milestone */}
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  placeholder="Milestone title"
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                  className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                />
                <input
                  type="date"
                  value={newMilestone.targetDate}
                  onChange={(e) => setNewMilestone(prev => ({ ...prev, targetDate: e.target.value }))}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={addMilestone}
                  className="px-4 py-2 bg-orange-500 text-black rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Milestones List */}
              <div className="space-y-2">
                {formData.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-slate-700/50 rounded-lg">
                    <input
                      type="checkbox"
                      checked={milestone.completed}
                      onChange={(e) => {
                        const updatedMilestones = [...formData.milestones];
                        updatedMilestones[index].completed = e.target.checked;
                        setFormData(prev => ({ ...prev, milestones: updatedMilestones }));
                      }}
                      className="rounded border-slate-600 bg-slate-700 text-orange-500 focus:ring-orange-500"
                    />
                    <span className={`flex-1 text-sm ${milestone.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                      {milestone.title}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(milestone.targetDate).toLocaleDateString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-slate-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-slate-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-black rounded-lg font-medium hover:from-orange-600 hover:to-yellow-600 transition-all duration-300"
              >
                {editingGoal ? 'Update Goal' : 'Create Goal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GoalModal;
