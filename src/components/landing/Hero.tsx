
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative overflow-hidden pt-16">
      <div className="relative pt-10 pb-20 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:mx-auto md:max-w-3xl lg:col-span-6 lg:text-left animate-fade-in">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-5xl md:text-6xl">
                <span className="block transition-all duration-300 hover:translate-x-1">Simplify</span>
                <span className="block text-complybrand-700 dark:text-complybrand-400 transition-all duration-300 hover:translate-x-2">Compliance Training</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                CompliQuick helps organizations deliver effective compliance training that employees actually complete. Our platform streamlines the entire compliance training process.
              </p>
              <div className="mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow hover:shadow-lg transition-all duration-300">
                  <a href="#contact">
                    <Button className="w-full flex items-center justify-center px-8 py-3 text-base font-medium bg-complybrand-700 hover:bg-complybrand-800 transition-transform hover:scale-105">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4 animate-pulse" />
                    </Button>
                  </a>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <a href="#features">
                    <Button variant="outline" className="w-full flex items-center justify-center px-8 py-3 text-base font-medium transition-transform hover:scale-105">
                      Learn More
                    </Button>
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-12 sm:mt-16 lg:col-span-6 lg:mt-0 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="relative mx-auto w-full rounded-lg shadow-xl lg:max-w-md hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <div className="relative block w-full overflow-hidden rounded-lg bg-complybrand-700">
                  <img
                    className="w-full opacity-80 hover:opacity-90 transition-opacity duration-300"
                    src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80"
                    alt="CompliQuick Dashboard"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="h-20 w-20 text-white hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 84 84">
                      <circle opacity="0.8" cx="42" cy="42" r="42" fill="white" />
                      <path d="M55 41.5L36 54.5V28.5L55 41.5Z" fill="#1E40AF" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
