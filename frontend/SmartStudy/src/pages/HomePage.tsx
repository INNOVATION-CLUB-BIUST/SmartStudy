import { Link } from 'react-router-dom';
import { BarChart, Bot, Calendar, Target } from 'lucide-react';
import Button from '../components/ui/Button';
import FeatureCard from '../components/ui/FeatureCard';
import Section from '../components/ui/Section';

const features = [
  {
    icon: <Bot className="h-6 w-6 text-white" />,
    title: 'AI-Powered Study Planning',
    description: 'Generate personalized study schedules based on your courses, assignments, and exams.',
  },
  {
    icon: <Calendar className="h-6 w-6 text-white" />,
    title: 'Interactive Study Mode',
    description: 'Utilize focus tools with timers and productivity techniques to stay on track.',
  },
  {
    icon: <BarChart className="h-6 w-6 text-white" />,
    title: 'Analytics Dashboard',
    description: "Track your study progress and performance to identify what's working and what's not.",
  },
  {
    icon: <Target className="h-6 w-6 text-white" />,
    title: 'Comprehensive Onboarding',
    description: 'A quick setup process to capture your academic profile for a personalized experience.',
  },
];

const HomePage = () => {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-slate-900">SmartStudy</span>
            </Link>
            <div className="hidden md:flex md:items-center md:space-x-8">
              <Button to="/login" variant="link">
                Log in
              </Button>
              <Button to="/get-started" variant="primary" className="ml-8">
                Get started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="relative pt-10 sm:pt-16 lg:pt-24 lg:pb-28">
          <div className="mx-auto max-w-7xl lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
              <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:px-0 lg:text-left lg:flex lg:items-center">
                <div className="lg:py-24">
                  <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
                    <span className="block">Supercharge your</span>
                    <span className="block text-indigo-600">university studies</span>
                  </h1>
                  <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                    SmartStudy is your personal AI-powered assistant for academic success. Effortlessly manage assignments, exams, and study schedules to achieve your goals.
                  </p>
                  <div className="mt-10 sm:mt-12">
                    <Button to="/get-started" variant="primary" className="px-8 py-3">
                      Get started for free
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-12 lg:m-0 lg:relative">
                <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
                  <img
                    className="w-full lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-auto lg:max-w-none rounded-lg shadow-2xl"
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Students studying together"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Section */}
        <Section className="bg-white">
          <div className="text-center">
            <h2 className="text-base font-semibold tracking-wider text-indigo-600 uppercase">Features</h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Everything you need for academic success
            </p>
            <p className="mt-5 max-w-prose mx-auto text-xl text-slate-500">
              Our platform is designed to help you stay organized, focused, and ahead of your coursework.
            </p>
          </div>
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <FeatureCard key={feature.title} icon={feature.icon} title={feature.title} description={feature.description} />
              ))}
            </div>
          </div>
        </Section>

        {/* CTA Section */}
        <div className="bg-indigo-700">
          <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Ready to take control of your studies?</span>
              <span className="block">Start your free trial today.</span>
            </h2>
            <div className="mt-8">
              <Button to="/get-started" variant="secondary" className="w-full sm:w-auto">
                Sign up for free
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            {/* Social links can be added here */}
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-slate-400">&copy; 2025 SmartStudy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;