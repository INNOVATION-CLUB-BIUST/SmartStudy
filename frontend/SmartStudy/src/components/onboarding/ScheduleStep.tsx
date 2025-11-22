import { useState } from 'react';
import { Calendar, Zap, Users, BookOpen } from 'lucide-react';

type Weekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
type TimeSlot = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

type WeeklySchedule = Partial<Record<Weekday, Partial<Record<TimeSlot, string>>>>;



export interface ScheduleData {
  weeklySchedule: WeeklySchedule;
  extracurricularActivities: string[];
  freeTime: '' | 'weekends' | 'evenings' | 'afternoons' | 'flexible' | 'minimal';
  studyBlocks: unknown[];
}

interface ScheduleStepProps {
  data?: Partial<ScheduleData>;
  onDataChange: (data: ScheduleData) => void;
  errors?: Record<string, string>;
}

const defaultScheduleData: ScheduleData = {
  weeklySchedule: {},
  extracurricularActivities: [],
  freeTime: '',
  studyBlocks: [],
};

const ScheduleStep = ({ data, onDataChange, errors = {} }: ScheduleStepProps) => {
  const [formData, setFormData] = useState<ScheduleData>({
    ...defaultScheduleData,
    ...data,
  });

  const handleInputChange = <K extends keyof ScheduleData>(field: K, value: ScheduleData[K]) => {
    const newData: ScheduleData = { ...formData, [field]: value } as ScheduleData;
    setFormData(newData);
    onDataChange(newData);
  };

  const handleScheduleChange = (day: Weekday, timeSlot: TimeSlot, value: string) => {
    const newSchedule: WeeklySchedule = { ...formData.weeklySchedule };
    if (!newSchedule[day]) newSchedule[day] = {};
    (newSchedule[day] as Partial<Record<TimeSlot, string>>)[timeSlot] = value;
    handleInputChange('weeklySchedule', newSchedule);
  };

  const days: Weekday[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots: TimeSlot[] = ['Morning', 'Afternoon', 'Evening', 'Night'];

  const activities = [
    { id: 'sports', label: 'Sports', icon: Zap },
    { id: 'clubs', label: 'Clubs/Societies', icon: Users },
    { id: 'volunteer', label: 'Volunteer Work', icon: BookOpen },
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

      {/* Free Time */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-orange-300">When do you prefer to have free time?</label>
        <select
          value={formData.freeTime}
          onChange={(e) => handleInputChange('freeTime', e.target.value as ScheduleData['freeTime'])}
          className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white focus:ring-1 transition-all duration-300 ${
            errors.freeTime 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
              : 'border-orange-500/30 focus:border-orange-500 focus:ring-orange-500'
          }`}
        >
          <option value="">Select preference</option>
          <option value="weekends">Weekends only</option>
          <option value="evenings">Evenings</option>
          <option value="afternoons">Afternoons</option>
          <option value="flexible">Flexible</option>
          <option value="minimal">Minimal free time</option>
        </select>
      </div>
    </div>
  );
};

export default ScheduleStep;
