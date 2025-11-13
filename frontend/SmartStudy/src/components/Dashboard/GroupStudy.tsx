
import { useState } from 'react';
import { Plus, Users, BookOpen, Search, ArrowRight, Star } from 'lucide-react';

const GroupStudy = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const studyGroups = [
    {
      id: 1,
      name: 'Quantum Physics Crew',
      subject: 'Physics',
      members: 5,
      maxMembers: 8,
      description: 'Diving deep into the quantum realm. We meet twice a week.',
      isFeatured: true,
      avatars: [
        'https://i.pravatar.cc/150?img=1',
        'https://i.pravatar.cc/150?img=2',
        'https://i.pravatar.cc/150?img=3',
        'https://i.pravatar.cc/150?img=4',
        'https://i.pravatar.cc/150?img=5',
      ],
    },
    {
      id: 2,
      name: 'Calculus Champions',
      subject: 'Mathematics',
      members: 7,
      maxMembers: 10,
      description: 'Conquering derivatives and integrals together.',
      isFeatured: false,
      avatars: [
        'https://i.pravatar.cc/150?img=6',
        'https://i.pravatar.cc/150?img=7',
        'https://i.pravatar.cc/150?img=8',
        'https://i.pravatar.cc/150?img=9',
        'https://i.pravatar.cc/150?img=10',
        'https://i.pravatar.cc/150?img=11',
        'https://i.pravatar.cc/150?img=12',
      ],
    },
    {
      id: 3,
      name: 'Organic Chemistry Wizards',
      subject: 'Chemistry',
      members: 4,
      maxMembers: 6,
      description: 'Mastering reactions and molecular structures.',
      isFeatured: false,
      avatars: [
        'https://i.pravatar.cc/150?img=13',
        'https://i.pravatar.cc/150?img=14',
        'https://i.pravatar.cc/150?img=15',
        'https://i.pravatar.cc/150?img=16',
      ],
    },
    {
        id: 4,
        name: 'Data Structures & Algorithms',
        subject: 'Computer Science',
        members: 8,
        maxMembers: 8,
        description: 'LeetCode grinding and interview prep.',
        isFeatured: true,
        avatars: [
          'https://i.pravatar.cc/150?img=17',
          'https://i.pravatar.cc/150?img=18',
          'https://i.pravatar.cc/150?img=19',
          'https://i.pravatar.cc/150?img=20',
          'https://i.pravatar.cc/150?img=21',
          'https://i.pravatar.cc/150?img=22',
          'https://i.pravatar.cc/150?img=23',
          'https://i.pravatar.cc/150?img=24',
        ],
      },
  ];

  const filteredGroups = studyGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Group Study</h1>
          <p className="text-slate-300 mt-2">Find, join, or create study groups</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-semibold rounded-lg hover:from-orange-400 hover:to-yellow-400 transition-all duration-300">
          <Plus className="h-4 w-4" />
          <span>Create Group</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search for groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-orange-500/30 rounded-lg text-white focus:border-orange-500"
          />
        </div>
      </div>

      {/* Study Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map(group => (
          <div key={group.id} className="bg-slate-800/50 border border-orange-500/20 rounded-xl p-6 flex flex-col justify-between hover:border-orange-500/50 transition-all duration-300">
            <div>
              {group.isFeatured && (
                <div className="flex items-center space-x-2 text-yellow-400 mb-2">
                  <Star className="h-4 w-4" />
                  <span className="text-sm font-semibold">Featured Group</span>
                </div>
              )}
              <h3 className="text-xl font-bold text-white mb-2">{group.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-slate-400 mb-4">
                <BookOpen className="h-4 w-4" />
                <span>{group.subject}</span>
              </div>
              <p className="text-slate-300 text-sm mb-4">{group.description}</p>
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        {group.avatars.map((avatar, index) => (
                            <img
                            key={index}
                            src={avatar}
                            alt={`Member ${index + 1}`}
                            className={`h-8 w-8 rounded-full border-2 border-slate-700 ${index > 0 ? '-ml-3' : ''}`}
                            />
                        ))}
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-slate-400">
                        <Users className="h-4 w-4" />
                        <span>{group.members}/{group.maxMembers}</span>
                    </div>
                </div>

                <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-semibold rounded-lg hover:from-orange-400 hover:to-yellow-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={group.members >= group.maxMembers}
                >
                    <span>{group.members >= group.maxMembers ? 'Full' : 'Join Group'}</span>
                    {group.members < group.maxMembers && <ArrowRight className="h-4 w-4" />}
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupStudy;
