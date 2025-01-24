import React, { useState, useEffect } from "react";
import {
  Code,
  BookOpen,
  Clock,
  Users,
  Cpu,
  Headphones,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./ui/header";

const Homepage = () => {
  const navigate = useNavigate();
  const handlePrjectsPage = () => {
    navigate("/projects");
  };

  const [activeTab, setActiveTab] = useState("features");
  const project = {
    features: [
      "Projects for Final Year",
      "Projects for Resume",
      "Projects for Portfolio",
    ],
  };

  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage first, default to true if not set
    const savedMode = localStorage.getItem("darkMode");
    return savedMode !== null ? JSON.parse(savedMode) : true;
  });

  useEffect(() => {
    // Update localStorage when darkMode changes
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    // Update body class for global dark mode
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const features = [
    {
      icon: <Code className="w-8 h-8 text-purple-500" />,
      title: "Exclusive Projects",
      description: "Unique projects tailored to your needs",
      gradient: "from-purple-500 to-indigo-600",
    },
    {
      icon: <Clock className="w-8 h-8 text-green-500" />,
      title: "Fast Delivery",
      description: "Complete projects within 7-15 days",
      gradient: "from-green-500 to-teal-600",
    },
    {
      icon: <BookOpen className="w-8 h-8 text-pink-500" />,
      title: "Black Book Included",
      description: "Comprehensive documentation",
      gradient: "from-pink-500 to-rose-600",
    },
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: "Personalization",
      description: "Custom solutions for your requirements",
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      icon: <Cpu className="w-6 h-6 text-purple-500" />,
      title: "Diverse Tech Stacks",
      description: "Support for Java, MERN, Python, and various technologies",
      gradient: "from-purple-600 to-pink-500",
    },
    {
      icon: <Headphones className="w-6 h-6 text-orange-500" />,
      title: "Dedicated Support",
      description: "Live code explanation and deployment assistance",
      gradient: "from-orange-500 to-red-600",
    },
  ];

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-slate-200"
      } text-gray-900 dark:text-white`}
    >
      <NavigationBar />

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
            Transform Your Portfolio
          </h1>
          <p className="text-xl mb-8 text-gray-500">
            Elevate your academic and professional journey with cutting-edge,
            industry-ready projects.
          </p>

          <div className="space-y-4 text-xl mb-8 text-slate-950 dark:text-gray-500">
            {activeTab === "features" &&
              project.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
          </div>

          <div className="flex space-x-4">
            <button
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:scale-105 transition-transform"
              onClick={handlePrjectsPage}
            >
              Explore Projects
            </button>
            <button className="px-6 py-3 border border-purple-500 text-purple-500 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30">
              Learn More
            </button>
          </div>
        </div>

        <div className="relative w-full max-w-[600px] mx-auto">
          <div className="absolute inset-0 bg-black/30 rounded-lg"></div>
          <img
            src={process.env.PUBLIC_URL + "/home.jpg"}
            alt="Home"
            className="w-full h-auto sm:h-[250px] md:h-[300px] lg:h-[350px] object-cover rounded-lg shadow-lg"
          />
        </div>

      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
          Why Choose InstatCode?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-50 hover:bg-gray-100"
              } transition-colors`}
            >
              <div className="mb-4 text-blue-500">{feature.icon}</div>
              <h3
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-600"
                } text-xl font-semibold mb-2`}
              >
                {feature.title}
              </h3>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-80">
            Transform your academic projects into professional masterpieces
          </p>
          <button className="px-8 py-3 bg-white text-purple-600 rounded-lg hover:bg-purple-100 transition-colors" onClick={handlePrjectsPage}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
