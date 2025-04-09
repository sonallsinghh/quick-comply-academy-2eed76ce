
import { 
  Shield, 
  Clock, 
  BarChart, 
  UserCheck, 
  Award,
  Users
} from "lucide-react";

const features = [
  {
    name: "Custom Compliance Courses",
    description: "Tailor compliance training to your specific industry and organizational needs.",
    icon: Shield,
  },
  {
    name: "Progress Tracking",
    description: "Track employee progress through courses in real-time with comprehensive reporting.",
    icon: BarChart,
  },
  {
    name: "Automated Certification",
    description: "Automatically issue compliance certificates upon successful course completion.",
    icon: Award,
  },
  {
    name: "Time-Efficient",
    description: "Streamlined courses designed to maximize knowledge retention while respecting employees' time.",
    icon: Clock,
  },
  {
    name: "Employee Engagement",
    description: "Interactive content that keeps employees engaged throughout their training journey.",
    icon: UserCheck,
  },
  {
    name: "Multi-Tenant Platform",
    description: "Manage multiple organizations with separate user bases and customized training programs.",
    icon: Users,
  },
];

const Features = () => {
  return (
    <div id="features" className="py-24 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center animate-fade-in">
          <h2 className="text-base font-semibold uppercase tracking-wide text-complybrand-700 dark:text-complybrand-400">
            Features
          </h2>
          <p className="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            A better way to manage compliance
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
            CompliQuick provides a comprehensive platform for creating, managing, and tracking compliance training programs.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div 
                key={feature.name} 
                className="group relative bg-white dark:bg-gray-800 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-complybrand-500 hover:shadow-lg transition-shadow rounded-lg border border-gray-100 dark:border-gray-700 animate-fade-in hover:scale-105 transition-transform"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-complybrand-600 text-white group-hover:bg-complybrand-700 transition-colors">
                    <feature.icon className="h-6 w-6 animate-[pulse_4s_ease-in-out_infinite]" aria-hidden="true" />
                  </div>
                  <h3 className="ml-4 text-xl font-medium text-gray-900 dark:text-white">
                    {feature.name}
                  </h3>
                </div>
                <p className="mt-4 text-base text-gray-500 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
