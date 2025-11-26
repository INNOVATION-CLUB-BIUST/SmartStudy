import { Edit2, Trash2, GraduationCap } from 'lucide-react';

interface Module {
  id: string;
  code: string;
  name: string;
  credits: number;
  instructor: string;
  difficulty: 'easy' | 'medium' | 'hard';
  color: string;
}

interface ModuleInfoProps {
  module: Module;
  onEdit: () => void;
  onDelete: () => void;
}

const ModuleInfo = ({ module, onEdit, onDelete }: ModuleInfoProps) => {
  return (
    <div className={`bg-gradient-to-r ${module.color} rounded-xl p-6 shadow-lg relative overflow-hidden group`}>
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 rounded-md bg-black/20 text-black text-sm font-bold font-mono border border-black/10 backdrop-blur-sm">
              {module.code}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/20 text-black border border-black/10 backdrop-blur-sm uppercase tracking-wide">
              {module.difficulty}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-black mb-2 tracking-tight">{module.name}</h1>
          
          <div className="flex items-center gap-4 text-black/80 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="opacity-75">Instructor:</span>
              <span>{module.instructor}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-black/40" />
            <div className="flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 opacity-75" />
              <span>{module.credits} Credits</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button 
            onClick={onEdit}
            className="p-2 bg-black/20 hover:bg-black/30 rounded-lg text-black transition-colors backdrop-blur-sm"
            title="Edit Module"
          >
            <Edit2 className="h-5 w-5" />
          </button>
          <button 
            onClick={onDelete}
            className="p-2 bg-black/20 hover:bg-red-500/80 hover:text-white rounded-lg text-black transition-colors backdrop-blur-sm"
            title="Delete Module"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
    </div>
  );
};

export default ModuleInfo;
