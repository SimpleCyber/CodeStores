import React from 'react';
import { Moon, Sun, Code, BookOpen, Clock, Users, Cpu, Headphones } from 'lucide-react';
import { useState } from 'react';

const Homepage = () => {
  const [darkMode, setDarkMode] = useState(false);

  const features = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "Exclusive Projects",
      description: "Get unique, one-of-a-kind projects that stand out in your portfolio"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Fast Delivery",
      description: "Complete project delivery within 7-15 days"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Black Book Included",
      description: "Comprehensive documentation in soft copy format"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Personalization",
      description: "Custom projects tailored to your specific requirements"
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Diverse Tech Stacks",
      description: "Support for Java, MERN, Python, and various technologies"
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: "Dedicated Support",
      description: "Live code explanation and deployment assistance"
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Navigation */}
      <nav className={`px-6 py-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">InstatCode</h1>
          <div className="flex items-center gap-4">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Transform Your College Projects</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get industry-standard projects perfect for your final year, resume, and job applications.
          </p>
          <button className={`px-8 py-3 rounded-full text-white ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} transition-colors`}>
            Explore Projects
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose InstatCode?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-lg ${
                  darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                } transition-colors`}
              >
                <div className="mb-4 text-blue-500">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className={`container mx-auto text-center ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-2xl p-12`}>
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get a unique project that sets you apart from the crowd.
          </p>
          <button className={`px-8 py-3 rounded-full text-white ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} transition-colors`}>
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
};

export default Homepage;