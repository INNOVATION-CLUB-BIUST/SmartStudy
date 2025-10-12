import { Link } from 'react-router-dom';
import { BarChart, Bot, Calendar, Target, ArrowRight, CheckCircle, Star, Users, BookOpen, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import Section from '../components/ui/Section';

const features = [
  {
    icon: <Bot className="h-6 w-6 text-white" />,
    title: 'AI-Powered Study Planning',
    description: 'Generate personalized study schedules based on your courses, assignments, and exams.',
    gradient: 'from-purple-500 to-indigo-600',
  },
  {
    icon: <Calendar className="h-6 w-6 text-white" />,
    title: 'Interactive Study Mode',
    description: 'Utilize focus tools with timers and productivity techniques to stay on track.',
    gradient: 'from-blue-500 to-cyan-600',
  },
  {
    icon: <BarChart className="h-6 w-6 text-white" />,
    title: 'Analytics Dashboard',
    description: "Track your study progress and performance to identify what's working and what's not.",
    gradient: 'from-green-500 to-emerald-600',
  },
  {
    icon: <Target className="h-6 w-6 text-white" />,
    title: 'Comprehensive Onboarding',
    description: 'A quick setup process to capture your academic profile for a personalized experience.',
    gradient: 'from-orange-500 to-red-600',
  },
];

const stats = [
  { label: 'University Students', value: '2,500+' },
  { label: 'Study Hours Optimized', value: '15,000+' },
  { label: 'Academic Success Rate', value: '92%' },
  { label: 'BIUST Students', value: '500+' },
];

const testimonials = [
  {
    name: 'Thabo Mokoena',
    role: 'Computer Science Student, BIUST',
    content: 'SmartStudy revolutionized my study routine. The AI-powered scheduling helped me balance my coursework and improved my grades significantly.',
    rating: 5,
  },
  {
    name: 'Lerato Kgosi',
    role: 'Engineering Student, BIUST',
    content: 'As a BIUST student, this tool is perfect for our academic environment. The focus tools and study analytics are exactly what I needed.',
    rating: 5,
  },
  {
    name: 'Kgotso Molefe',
    role: 'Business Student, BIUST',
    content: 'The personalized study plans adapt perfectly to my university schedule. It\'s like having a personal academic assistant designed for BIUST students.',
    rating: 5,
  },
];

const HomePage = () => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-black to-slate-800 min-h-screen text-white">
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-orange-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Bot className="h-6 w-6 text-black" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  SmartStudy
                </span>
                <span className="text-xs text-orange-300">by BIUST Innovation Club</span>
              </div>
            </Link>
            <div className="hidden md:flex md:items-center md:space-x-8">
              <Button to="/login" variant="link" className="hover:text-orange-400 transition-colors text-orange-200">
                Log in
              </Button>
              <Button to="/get-started" variant="primary" className="ml-8 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-orange-500 to-yellow-500 text-black hover:from-orange-400 hover:to-yellow-400">
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="relative pt-16 sm:pt-24 lg:pt-32 lg:pb-32 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-orange-400/20 to-yellow-400/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-orange-300 text-sm font-medium mb-8 shadow-lg border border-orange-500/30">
                <Zap className="h-5 w-5 mr-2" />
                AI-Powered Study Assistant for University Students
              </div>
              <h1 className="text-5xl tracking-tight font-extrabold text-white sm:text-6xl md:text-7xl lg:text-8xl">
                <span className="block">Excel in your</span>
                <span className="block bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  university journey
                </span>
              </h1>
              <p className="mt-8 text-xl text-slate-300 sm:text-2xl lg:text-3xl max-w-4xl mx-auto leading-relaxed">
                Designed by BIUST Innovation Club for university students. SmartStudy helps you manage coursework, assignments, and exams with AI-powered study planning and productivity tools.
              </p>
              <div className="mt-12 flex justify-center">
                <Button to="/onboarding" variant="primary" className="px-10 py-5 text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-orange-500 to-yellow-500 text-black hover:from-orange-400 hover:to-yellow-400">
                  Start your academic journey
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </div>
              <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-400">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-orange-400 mr-2" />
                  Free for university students
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-orange-400 mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-orange-400 mr-2" />
                  Setup in 2 minutes
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <Section className="bg-gradient-to-r from-orange-600 to-yellow-600">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-black mb-12">Trusted by BIUST students</h2>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-black mb-2">{stat.value}</div>
                  <div className="text-orange-900">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Feature Section */}
        <Section className="bg-slate-900">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-500/20 text-orange-300 text-sm font-medium mb-6 border border-orange-500/30">
              <Star className="h-4 w-4 mr-2" />
              University-Focused Features
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight sm:text-4xl lg:text-5xl">
              Everything you need for university success
            </h2>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-slate-300">
              Designed specifically for university students by BIUST Innovation Club. Stay organized, focused, and ahead of your coursework with AI-powered tools.
            </p>
          </div>
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full border border-orange-500/20">
                    <div className={`inline-flex items-center justify-center p-3 bg-gradient-to-r ${feature.gradient} rounded-xl shadow-lg mb-6`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Testimonials Section */}
        <Section className="bg-slate-800">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-500/20 text-orange-300 text-sm font-medium mb-6 border border-orange-500/30">
              <Users className="h-4 w-4 mr-2" />
              BIUST Student Success Stories
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight sm:text-4xl lg:text-5xl">
              What BIUST students are saying
            </h2>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-slate-300">
              Join hundreds of BIUST students who have transformed their academic performance with SmartStudy.
            </p>
          </div>
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-slate-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-500/20">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-orange-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-300 mb-6 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-orange-300 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* CTA Section */}
        <div className="relative bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-700 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-4xl mx-auto text-center py-20 px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-black sm:text-5xl lg:text-6xl">
              <span className="block">Ready to excel at BIUST?</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-800 to-yellow-800">
                Start your academic journey today.
              </span>
            </h2>
            <p className="mt-6 text-xl text-orange-900 max-w-2xl mx-auto">
              Join hundreds of BIUST students who have already transformed their academic performance with SmartStudy.
            </p>
            <div className="mt-10 flex justify-center">
              <Button to="/onboarding" variant="secondary" className="px-8 py-4 text-lg bg-black text-orange-400 hover:bg-slate-900 shadow-xl">
                Start your journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center space-x-8 text-sm text-orange-800">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-orange-600 mr-2" />
                Free for BIUST students
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-orange-600 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-orange-600 mr-2" />
                Setup in 2 minutes
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl shadow-lg">
                  <Bot className="h-6 w-6 text-black" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">SmartStudy</span>
                  <span className="text-sm text-orange-300">by BIUST Innovation Club</span>
                </div>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                Your personal AI-powered assistant for university success. Designed by BIUST Innovation Club to help students excel in their academic journey.
              </p>
              <div className="flex space-x-4">
                <div className="p-2 bg-slate-800 rounded-lg hover:bg-orange-500/20 transition-colors cursor-pointer border border-orange-500/20">
                  <BookOpen className="h-5 w-5 text-orange-400" />
                </div>
                <div className="p-2 bg-slate-800 rounded-lg hover:bg-orange-500/20 transition-colors cursor-pointer border border-orange-500/20">
                  <Users className="h-5 w-5 text-orange-400" />
                </div>
                <div className="p-2 bg-slate-800 rounded-lg hover:bg-orange-500/20 transition-colors cursor-pointer border border-orange-500/20">
                  <BarChart className="h-5 w-5 text-orange-400" />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">For Students</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-orange-400 transition-colors">Study Planning</a></li>
                <li><a href="#" className="text-slate-400 hover:text-orange-400 transition-colors">Assignment Tracker</a></li>
                <li><a href="#" className="text-slate-400 hover:text-orange-400 transition-colors">Exam Prep</a></li>
                <li><a href="#" className="text-slate-400 hover:text-orange-400 transition-colors">Analytics</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">BIUST Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-orange-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-slate-400 hover:text-orange-400 transition-colors">Contact Innovation Club</a></li>
                <li><a href="#" className="text-slate-400 hover:text-orange-400 transition-colors">Student Resources</a></li>
                <li><a href="#" className="text-slate-400 hover:text-orange-400 transition-colors">BIUST Community</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-orange-500/20 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-400 text-sm">
                &copy; 2025 SmartStudy by BIUST Innovation Club. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-slate-400 hover:text-orange-400 transition-colors text-sm">Privacy Policy</a>
                <a href="#" className="text-slate-400 hover:text-orange-400 transition-colors text-sm">Terms of Service</a>
                <a href="#" className="text-slate-400 hover:text-orange-400 transition-colors text-sm">BIUST Guidelines</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;