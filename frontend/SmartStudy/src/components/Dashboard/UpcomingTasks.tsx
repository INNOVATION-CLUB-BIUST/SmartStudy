import React, { useState } from 'react';
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  BookOpen,
  Target,
  Filter,
  Search,
  SortAsc,
  Bell
} from 'lucide-react';

const UpcomingTasks = () => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');

  const tasks = [
    {
      id: 1,
      title: 'Complete Math Assignment 3',
      subject: 'Mathematics',
      description: 'Solve problems 1-20 from chapter 5',
      dueDate: '2024-01-15',
      dueTime: '23:59',
      priority: 'high',
      status: 'in-progress',
      progress: 60,
      estimatedTime: '3h',
      tags: ['homework', 'calculus']
    },
    {
      id: 2,
      title: 'Physics Lab Report',
      subject: 'Physics',
      description: 'Write lab report for experiment 7',
      dueDate: '2024-01-16',
      dueTime: '14:00',
      priority: 'high',
      status: 'pending',
      progress: 0,
      estimatedTime: '4h',
      tags: ['lab', 'report']
    },
    {
      id: 3,
      title: 'Read Chemistry Chapter 8',
      subject: 'Chemistry',
      description: 'Read and take notes on organic chemistry',
      dueDate: '2024-01-17',
      dueTime: '10:00',
      priority: 'medium',
      status: 'pending',
      progress: 0,
      estimatedTime: '2h',
      tags: ['reading', 'notes']
    },
    {
      id: 4,
      title: 'Computer Science Project',
      subject: 'Computer Science',
      description: 'Complete final project for CS101',
      dueDate: '2024-01-20',
      dueTime: '17:00',
      priority: 'high',
      status: 'in-progress',
      progress: 30,
      estimatedTime: '8h',
      tags: ['project', 'programming']
    },
    {
      id: 5,
      title: 'Study for Math Exam',
      subject: 'Mathematics',
      description: 'Review chapters 1-5 for midterm exam',
      dueDate: '2024-01-22',
      dueTime: '09:00',
      priority: 'medium',
      status: 'pending',
      progress: 0,
      estimatedTime: '6h',
      tags: ['exam', 'review']
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'in-progress': return 'bg-orange-500/20 text-orange-400';
      case 'pending': return 'bg-slate-500/20 text-slate-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isOverdue = (dueDate: string) => {
    return getDaysUntilDue(dueDate) < 0;
  };

  const isDueToday = (dueDate: string) => {
    return getDaysUntilDue(dueDate) === 0;
  };

  const isDueTomorrow = (dueDate: string) => {
    return getDaysUntilDue(dueDate) === 1;
  };

  const getDueDateText = (dueDate: string) => {
    const days = getDaysUntilDue(dueDate);
    if (isOverdue(dueDate)) return 'Overdue';
    if (isDueToday(dueDate)) return 'Due Today';
    if (isDueTomorrow(dueDate)) return 'Due Tomorrow';
    if (days <= 7) return `Due in ${days} days`;
    return `Due in ${days} days`;
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'high-priority') return task.priority === 'high';
    if (filter === 'due-today') return isDueToday(task.dueDate);
    if (filter === 'overdue') return isOverdue(task.dueDate);
    if (filter === 'in-progress') return task.status === 'in-progress';
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
    }
    return 0;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Tasks & Assignments</h1>
          <p className="text-slate-300 mt-2">Manage your academic tasks and deadlines</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-semibold rounded-lg hover:from-orange-400 hover:to-yellow-400 transition-all duration-300">
          <Plus className="h-4 w-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
              filter === 'all'
                ? 'bg-orange-500 text-black'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            All Tasks
          </button>
          <button
            onClick={() => setFilter('high-priority')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
              filter === 'high-priority'
                ? 'bg-orange-500 text-black'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            High Priority
          </button>
          <button
            onClick={() => setFilter('due-today')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
              filter === 'due-today'
                ? 'bg-orange-500 text-black'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Due Today
          </button>
          <button
            onClick={() => setFilter('overdue')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
              filter === 'overdue'
                ? 'bg-orange-500 text-black'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Overdue
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-slate-700 border border-orange-500/30 rounded-lg text-white text-sm focus:border-orange-500"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {sortedTasks.map((task) => (
          <div
            key={task.id}
            className={`p-6 rounded-xl border transition-all duration-300 ${
              isOverdue(task.dueDate)
                ? 'bg-red-500/10 border-red-500/30'
                : isDueToday(task.dueDate)
                ? 'bg-orange-500/10 border-orange-500/30'
                : 'bg-slate-800/50 border-orange-500/20'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                <p className="text-slate-300 mb-2">{task.description}</p>
                <div className="flex items-center space-x-4 text-sm text-slate-400">
                  <span className="flex items-center space-x-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{task.subject}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{task.estimatedTime}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors duration-300">
                  <Edit className="h-4 w-4 text-slate-400" />
                </button>
                <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors duration-300">
                  <Trash2 className="h-4 w-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            {task.status === 'in-progress' && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Progress</span>
                  <span className="text-sm text-slate-400">{task.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full">
                  <div
                    className="h-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transition-all duration-300"
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Due Date Alert */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isOverdue(task.dueDate) && (
                  <AlertCircle className="h-4 w-4 text-red-400" />
                )}
                {isDueToday(task.dueDate) && (
                  <Bell className="h-4 w-4 text-orange-400" />
                )}
                <span className={`text-sm font-medium ${
                  isOverdue(task.dueDate)
                    ? 'text-red-400'
                    : isDueToday(task.dueDate)
                    ? 'text-orange-400'
                    : 'text-slate-400'
                }`}>
                  {getDueDateText(task.dueDate)} at {task.dueTime}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {task.status !== 'completed' && (
                  <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-medium rounded-lg hover:from-orange-400 hover:to-yellow-400 transition-all duration-300">
                    {task.status === 'in-progress' ? 'Continue' : 'Start'}
                  </button>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {task.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <CheckSquare className="h-5 w-5 text-orange-400" />
            </div>
            <span className="text-2xl font-bold text-white">{tasks.length}</span>
          </div>
          <h3 className="text-slate-300 text-sm">Total Tasks</h3>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <span className="text-2xl font-bold text-white">
              {tasks.filter(task => isOverdue(task.dueDate)).length}
            </span>
          </div>
          <h3 className="text-slate-300 text-sm">Overdue</h3>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Clock className="h-5 w-5 text-orange-400" />
            </div>
            <span className="text-2xl font-bold text-white">
              {tasks.filter(task => isDueToday(task.dueDate)).length}
            </span>
          </div>
          <h3 className="text-slate-300 text-sm">Due Today</h3>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Target className="h-5 w-5 text-green-400" />
            </div>
            <span className="text-2xl font-bold text-white">
              {tasks.filter(task => task.status === 'in-progress').length}
            </span>
          </div>
          <h3 className="text-slate-300 text-sm">In Progress</h3>
        </div>
      </div>
    </div>
  );
};

export default UpcomingTasks;
