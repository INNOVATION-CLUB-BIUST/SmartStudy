import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  BarChart, 
  Target, 
  Clock,
  Brain,
  Users,
  Settings,
  HelpCircle,
  TrendingUp,
  CheckSquare,
  Timer
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: BookOpen,
      description: 'Overview of your academic progress'
    },
    {
      name: 'Schedule',
      href: '/dashboard/schedule',
      icon: Calendar,
      description: 'Manage your study schedule'
    },
    {
      name: 'Study Time',
      href: '/dashboard/study-time',
      icon: Timer,
      description: 'Track and optimize study sessions'
    },
    {
      name: 'Tasks',
      href: '/dashboard/tasks',
      icon: CheckSquare,
      description: 'Assignments and deadlines'
    },
    {
      name: 'Goals',
      href: '/dashboard/goals',
      icon: Target,
      description: 'Set and track academic goals'
    },
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: BarChart,
      description: 'Performance insights and trends'
    },
    {
      name: 'Study Groups',
      href: '/dashboard/study-groups',
      icon: Users,
      description: 'Connect with fellow students'
    },
    {
      name: 'AI Assistant',
      href: '/dashboard/ai-assistant',
      icon: Brain,
      description: 'Get personalized study recommendations'
    }
  ];

  const bottomItems = [
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings
    },
    {
      name: 'Help & Support',
      href: '/dashboard/help',
      icon: HelpCircle
    }
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-slate-900/50 lg:border-r lg:border-orange-500/20">
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-300 ${
                isActive(item.href)
                  ? 'bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 text-orange-300'
                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-orange-400'
              }`}
            >
              <item.icon className={`h-5 w-5 ${
                isActive(item.href) ? 'text-orange-400' : 'group-hover:text-orange-400'
              }`} />
              <div className="flex-1">
                <div className="font-medium text-sm">{item.name}</div>
                <div className="text-xs text-slate-400 group-hover:text-orange-300">
                  {item.description}
                </div>
              </div>
            </Link>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="px-4 py-4 border-t border-orange-500/20">
          <div className="space-y-2">
            {bottomItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-orange-300'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-orange-400'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="text-sm">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-orange-500/20">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-medium text-orange-300">Today's Progress</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Study Time</span>
                <span className="text-orange-400">2h 30m</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Tasks Completed</span>
                <span className="text-orange-400">3/5</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Focus Score</span>
                <span className="text-orange-400">85%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
