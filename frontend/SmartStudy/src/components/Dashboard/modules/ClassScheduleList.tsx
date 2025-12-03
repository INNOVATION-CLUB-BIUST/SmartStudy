import { Calendar, Clock, Trash2 } from 'lucide-react';

interface ClassSchedule {
  day: string;
  startTime: string;
  endTime: string;
  location: string;
  type: 'lecture' | 'tutorial' | 'lab';
}

interface ClassScheduleListProps {
  schedule: ClassSchedule[];
  onUpdate: (newSchedule: ClassSchedule[]) => void;
}

const ClassScheduleList = ({ schedule, onUpdate }: ClassScheduleListProps) => {
  const handleDelete = (index: number) => {
    const newSchedule = schedule.filter((_, i) => i !== index);
    onUpdate(newSchedule);
  };

  // Note: Full add/edit functionality would typically open a small modal or expand inline.
  // For this version, we'll rely on the main Edit Module modal for adding new classes
  
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Calendar className="h-5 w-5 text-orange-400" />
          Class Schedule
        </h3>
        <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-full border border-slate-700">
          {schedule.length} Sessions
        </span>
      </div>

      <div className="space-y-3">
        {schedule.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            No classes scheduled
          </div>
        ) : (
          schedule.map((item, idx) => (
            <div key={idx} className="group flex items-center justify-between p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition-colors border border-transparent hover:border-slate-600">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  item.type === 'lecture' ? 'bg-blue-500/10 text-blue-400' :
                  item.type === 'lab' ? 'bg-purple-500/10 text-purple-400' :
                  'bg-green-500/10 text-green-400'
                }`}>
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-white font-medium flex items-center gap-2">
                    {item.day}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold ${
                      item.type === 'lecture' ? 'bg-blue-500/20 text-blue-300' :
                      item.type === 'lab' ? 'bg-purple-500/20 text-purple-300' :
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">{item.startTime} - {item.endTime} • {item.location}</div>
                </div>
              </div>
              
              <button 
                onClick={() => handleDelete(idx)}
                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                title="Remove Class"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClassScheduleList;
