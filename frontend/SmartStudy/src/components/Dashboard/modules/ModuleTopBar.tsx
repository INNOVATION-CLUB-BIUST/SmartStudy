import { Plus } from 'lucide-react';

interface Module {
  id: string;
  code: string;
  name: string;
  color: string;
}

interface ModuleTopBarProps {
  modules: Module[];
  selectedModuleId: string | null;
  onSelectModule: (module: Module) => void;
  onAddModule: () => void;
}

const ModuleTopBar = ({ modules, selectedModuleId, onSelectModule, onAddModule }: ModuleTopBarProps) => {
  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {/* Add Module Button */}
      <button
        onClick={onAddModule}
        className="flex-shrink-0 flex flex-col items-center justify-center w-32 h-24 rounded-xl border-2 border-dashed border-slate-600 hover:border-orange-500/50 hover:bg-slate-800/50 transition-all group"
      >
        <div className="p-2 rounded-full bg-slate-700 group-hover:bg-orange-500/20 transition-colors mb-2">
          <Plus className="h-5 w-5 text-slate-400 group-hover:text-orange-400" />
        </div>
        <span className="text-xs font-medium text-slate-400 group-hover:text-orange-400">Add Module</span>
      </button>

      {/* Module List */}
      {modules.map((module) => {
        const isSelected = selectedModuleId === module.id;
        return (
          <button
            key={module.id}
            onClick={() => onSelectModule(module)}
            className={`flex-shrink-0 w-48 h-24 rounded-xl p-4 text-left transition-all relative overflow-hidden ${
              isSelected
                ? `bg-gradient-to-br ${module.color} shadow-lg`
                : 'bg-slate-800 border border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="relative z-10 h-full flex flex-col justify-between">
              <span className={`font-mono text-sm font-bold ${isSelected ? 'text-black/80' : 'text-orange-400'}`}>
                {module.code}
              </span>
              <span className={`font-medium line-clamp-2 text-sm ${isSelected ? 'text-black' : 'text-white'}`}>
                {module.name}
              </span>
            </div>
            
            {/* Background decoration for selected state */}
            {isSelected && (
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ModuleTopBar;
