import React, { useState } from 'react';
import { Calendar, Clock, BookOpen, Users, Zap } from 'lucide-react';

interface ScheduleStepProps {
  data: any;
  onDataChange: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  onComplete: () => void;
}

const ScheduleStep = ({ data, onDataChange, onNext }: ScheduleStepProps) => {
  const [formData, setFormData] = useState({
    weeklySchedule: data?.weeklySchedule || {},
    classSchedule: data?.classSchedule || [],
    extracurricularActivities: data?.extracurricularActivities || [],
    workSchedule: data?.workSchedule || {},
    freeTime: data?.freeTime || '',
    studyBlocks: data?.studyBlocks || [],
  });

  const handleInputChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onDataChange(newData);
  };

  const handleScheduleChange = (day: string, timeSlot: string, value: string) => {
    const newSchedule = { ...formData.weeklySchedule };
    if (!newSchedule[day]) newSchedule[day] = {};
    newSchedule[day][timeSlot] = value;
    handleInputChange('weeklySchedule', newSchedule);
  };

  const handleNext = () => {
    onDataChange(formData);
    onNext();
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];

  const activities = [
    { id: 'sports', label: 'Sports', icon: Zap },
    { id: 'clubs', label: 'Clubs/Societies', icon: Users },
    { id: 'volunteer', label: 'Volunteer Work', icon: BookOpen },
    { id: 'part-time', label: 'Part-time Job', icon: Clock },
    { id: 'hobbies', label: 'Hobbies', icon: Calendar },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mb-4">
          <Calendar className="h-8 w-8 text-black" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Set up your schedule</h2>
        <p className="text-slate-300">
          Help us understand your weekly schedule to optimize your study time.
        </p>
      </div>

      {/* Weekly Schedule */}
      <div className="space-y-4">
        <label className="text-lg font-medium text-orange-300">Your weekly availability</label>
        <div className="bg-slate-800/50 rounded-lg p-4 border border-orange-500/20">
          <div className="grid grid-cols-8 gap-2">
            <div className="text-sm font-medium text-orange-300">Day</div>
            {timeSlots.map((slot) => (
              <div key={slot} className="text-sm font-medium text-orange-300 text-center">
                {slot}
              </div>
            ))}
            <div className="text-sm font-medium text-orange-300">Free</div>
          </div>
          {days.map((day) => (
            <div key={day} className="grid grid-cols-8 gap-2 mt-2">
              <div className="text-sm text-slate-300 py-2">{day}</div>
              {timeSlots.map((slot) => (
                <select
                  key={slot}
                  value={formData.weeklySchedule[day]?.[slot] || ''}
                  onChange={(e) => handleScheduleChange(day, slot, e.target.value)}
                  className="text-xs px-2 py-1 bg-slate-700 border border-orange-500/30 rounded text-white focus:border-orange-500"
                >
                  <option value="">-</option>
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="class">Class</option>
                  <option value="study">Study</option>
                </select>
              ))}
              <div className="text-sm text-slate-300 py-2 text-center">
                {Object.values(formData.weeklySchedule[day] || {}).filter(v => v === 'available').length}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Class Schedule */}
      <div className="space-y-4">
        <label className="text-lg font-medium text-orange-300">Add your classes</label>
        <div className="space-y-3">
          {formData.classSchedule.map((classItem: any, index: number) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-slate-700/50 rounded-lg border border-orange-500/20">
              <input
                type="text"
                placeholder="Course name"
                value={classItem.name || ''}
                onChange={(e) => {
                  const newSchedule = [...formData.classSchedule];
                  newSchedule[index] = { ...newSchedule[index], name: e.target.value };
                  handleInputChange('classSchedule', newSchedule);
                }}
                className="px-3 py-2 bg-slate-600 border border-orange-500/30 rounded text-white placeholder-slate-400 focus:border-orange-500"
              />
              <input
                type="text"
                placeholder="Day (e.g., Mon, Wed, Fri)"
                value={classItem.days || ''}
                onChange={(e) => {
                  const newSchedule = [...formData.classSchedule];
                  newSchedule[index] = { ...newSchedule[index], days: e.target.value };
                  handleInputChange('classSchedule', newSchedule);
                }}
                className="px-3 py-2 bg-slate-600 border border-orange-500/30 rounded text-white placeholder-slate-400 focus:border-orange-500"
              />
              <input
                type="time"
                value={classItem.startTime || ''}
                onChange={(e) => {
                  const newSchedule = [...formData.classSchedule];
                  newSchedule[index] = { ...newSchedule[index], startTime: e.target.value };
                  handleInputChange('classSchedule', newSchedule);
                }}
                className="px-3 py-2 bg-slate-600 border border-orange-500/30 rounded text-white focus:border-orange-500"
              />
              <input
                type="time"
                value={classItem.endTime || ''}
                onChange={(e) => {
                  const newSchedule = [...formData.classSchedule];
                  newSchedule[index] = { ...newSchedule[index], endTime: e.target.value };
                  handleInputChange('classSchedule', newSchedule);
                }}
                className="px-3 py-2 bg-slate-600 border border-orange-500/30 rounded text-white focus:border-orange-500"
              />
            </div>
          ))}
          <button
            onClick={() => {
              const newSchedule = [...formData.classSchedule, { name: '', days: '', startTime: '', endTime: '' }];
              handleInputChange('classSchedule', newSchedule);
            }}
            className="w-full py-2 border-2 border-dashed border-orange-500/50 rounded-lg text-orange-300 hover:border-orange-500 hover:bg-orange-500/10 transition-all duration-300"
          >
            + Add Class
          </button>
        </div>
      </div>

      {/* Extracurricular Activities */}
      <div className="space-y-4">
        <label className="text-lg font-medium text-orange-300">Extracurricular activities</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activities.map((activity) => (
            <button
              key={activity.id}
              onClick={() => {
                const currentActivities = formData.extracurricularActivities;
                const newActivities = currentActivities.includes(activity.id)
                  ? currentActivities.filter((a: string) => a !== activity.id)
                  : [...currentActivities, activity.id];
                handleInputChange('extracurricularActivities', newActivities);
              }}
              className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                formData.extracurricularActivities.includes(activity.id)
                  ? 'border-orange-500 bg-orange-500/20 text-white'
                  : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-orange-500/50 hover:bg-orange-500/10'
              }`}
            >
              <activity.icon className="h-6 w-6 mb-2 text-orange-400" />
              <div className="font-medium">{activity.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Work Schedule */}
      <div className="space-y-4">
        <label className="text-lg font-medium text-orange-300">Do you have a part-time job?</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Work days per week</label>
            <select
              value={formData.workSchedule.daysPerWeek || ''}
              onChange={(e) => {
                const newWorkSchedule = { ...formData.workSchedule, daysPerWeek: e.target.value };
                handleInputChange('workSchedule', newWorkSchedule);
              }}
              className="w-full px-4 py-3 bg-slate-700 border border-orange-500/30 rounded-lg text-white focus:border-orange-500"
            >
              <option value="">Select</option>
              <option value="0">No job</option>
              <option value="1">1 day</option>
              <option value="2">2 days</option>
              <option value="3">3 days</option>
              <option value="4">4 days</option>
              <option value="5">5 days</option>
              <option value="6">6 days</option>
              <option value="7">7 days</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Hours per week</label>
            <input
              type="number"
              min="0"
              max="40"
              value={formData.workSchedule.hoursPerWeek || ''}
              onChange={(e) => {
                const newWorkSchedule = { ...formData.workSchedule, hoursPerWeek: e.target.value };
                handleInputChange('workSchedule', newWorkSchedule);
              }}
              className="w-full px-4 py-3 bg-slate-700 border border-orange-500/30 rounded-lg text-white focus:border-orange-500"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Free Time */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-orange-300">When do you prefer to have free time?</label>
        <select
          value={formData.freeTime}
          onChange={(e) => handleInputChange('freeTime', e.target.value)}
          className="w-full px-4 py-3 bg-slate-700 border border-orange-500/30 rounded-lg text-white focus:border-orange-500"
        >
          <option value="">Select preference</option>
          <option value="weekends">Weekends only</option>
          <option value="evenings">Evenings</option>
          <option value="afternoons">Afternoons</option>
          <option value="flexible">Flexible</option>
          <option value="minimal">Minimal free time</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-semibold rounded-lg hover:from-orange-400 hover:to-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ScheduleStep;
