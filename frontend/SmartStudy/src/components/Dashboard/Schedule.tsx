import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  Bell,
  Target
} from 'lucide-react';

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const scheduleData = {
    '2024-01-15': [
      { id: 1, title: 'Math Lecture', time: '09:00', duration: '1h', type: 'class', subject: 'Mathematics' },
      { id: 2, title: 'Study Session', time: '14:00', duration: '2h', type: 'study', subject: 'Physics' },
      { id: 3, title: 'Assignment Due', time: '23:59', duration: '0', type: 'deadline', subject: 'Computer Science' }
    ],
    '2024-01-16': [
      { id: 4, title: 'Physics Lab', time: '10:00', duration: '3h', type: 'lab', subject: 'Physics' },
      { id: 5, title: 'Group Study', time: '16:00', duration: '1.5h', type: 'group', subject: 'Mathematics' }
    ],
    '2024-01-17': [
      { id: 6, title: 'Chemistry Lecture', time: '11:00', duration: '1h', type: 'class', subject: 'Chemistry' },
      { id: 7, title: 'Exam Prep', time: '19:00', duration: '2h', type: 'study', subject: 'Mathematics' }
    ]
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'class': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'study': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'lab': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'group': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'deadline': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'class': return BookOpen;
      case 'study': return Target;
      case 'lab': return Clock;
      case 'group': return BookOpen;
      case 'deadline': return Bell;
      default: return Calendar;
    }
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return date.toDateString() === selectedDate.toDateString();
  };

  const getSelectedDateEvents = () => {
    const dateKey = formatDate(selectedDate);
    return scheduleData[dateKey as keyof typeof scheduleData] || [];
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Study Schedule</h1>
          <p className="text-slate-300 mt-2">Manage your classes, study sessions, and deadlines</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-semibold rounded-lg hover:from-orange-400 hover:to-yellow-400 transition-all duration-300">
          <Plus className="h-4 w-4" />
          <span>Add Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors duration-300"
              >
                <ChevronLeft className="h-4 w-4 text-slate-400" />
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors duration-300"
              >
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayNames.map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-slate-400">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays().map((day, index) => (
              <div
                key={index}
                className={`aspect-square p-2 rounded-lg cursor-pointer transition-all duration-300 ${
                  day === null
                    ? 'invisible'
                    : isToday(day)
                    ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-semibold'
                    : isSelected(day)
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                    : 'hover:bg-slate-700/50 text-slate-300'
                }`}
                onClick={() => day && setSelectedDate(new Date(currentYear, currentMonth, day))}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Date Events */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <h2 className="text-xl font-bold text-white mb-6">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h2>

          {getSelectedDateEvents().length > 0 ? (
            <div className="space-y-4">
              {getSelectedDateEvents().map((event) => {
                const IconComponent = getEventIcon(event.type);
                return (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border ${getEventTypeColor(event.type)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-4 w-4" />
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm opacity-80">{event.subject}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 hover:bg-white/10 rounded">
                          <Edit className="h-3 w-3" />
                        </button>
                        <button className="p-1 hover:bg-white/10 rounded">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{event.time}</span>
                      </span>
                      {event.duration !== '0' && (
                        <span>{event.duration}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">No events scheduled</p>
              <button className="mt-4 text-orange-400 hover:text-orange-300 text-sm font-medium">
                Add your first event
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-400" />
            </div>
            <span className="text-2xl font-bold text-white">12</span>
          </div>
          <h3 className="text-slate-300 text-sm">Classes This Week</h3>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Target className="h-5 w-5 text-orange-400" />
            </div>
            <span className="text-2xl font-bold text-white">8h</span>
          </div>
          <h3 className="text-slate-300 text-sm">Study Time Planned</h3>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Bell className="h-5 w-5 text-red-400" />
            </div>
            <span className="text-2xl font-bold text-white">3</span>
          </div>
          <h3 className="text-slate-300 text-sm">Upcoming Deadlines</h3>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Clock className="h-5 w-5 text-green-400" />
            </div>
            <span className="text-2xl font-bold text-white">85%</span>
          </div>
          <h3 className="text-slate-300 text-sm">Schedule Adherence</h3>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
