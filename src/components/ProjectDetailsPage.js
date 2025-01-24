import React, { useState } from 'react';
import { Moon, Sun, Clock, Book, Code, Download, CheckCircle } from 'lucide-react';

import NavigationBar from './ui/header';


const ProjectDetailsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('features');

  // Example project data
  const project = {
    title: "E-Learning Platform",
    description: "A comprehensive learning management system built with the MERN stack, featuring video courses, interactive quizzes, and real-time progress tracking.",
    timeline: "10-12 days",
    technologies: ["React", "Node.js", "MongoDB", "Express", "Redux", "JWT"],
    features: [
      "User authentication and authorization",
      "Course creation and management",
      "Video content streaming",
      "Interactive quizzes and assessments",
      "Progress tracking and analytics",
      "Payment integration"
    ],
    documentation: [
      "System architecture document",
      "Database schema design",
      "API documentation",
      "User manual",
      "Installation guide"
    ],
    requirements: [
      "Basic understanding of web development",
      "Familiarity with JavaScript",
      "MongoDB Atlas account",
      "Node.js environment"
    ]
  };


  

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-slate-200'} text-gray-900 dark:text-white`}>
      {/* Navigation */}
      <NavigationBar />

      {/* Project Details */}
      <div className="container mx-auto px-6 py-8">
        <div className={`rounded-lg p-8 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <h1 className="text-3xl font-bold mb-6">{project.title}</h1>
          
          <p className={`text-lg mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {project.description}
          </p>

          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} flex items-center gap-3`}>
              <Clock className="w-6 h-6 text-blue-500" />
              <div>
                <h3 className="font-semibold">Timeline</h3>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{project.timeline}</p>
              </div>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} flex items-center gap-3`}>
              <Book className="w-6 h-6 text-blue-500" />
              <div>
                <h3 className="font-semibold">Documentation</h3>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Included</p>
              </div>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} flex items-center gap-3`}>
              <Code className="w-6 h-6 text-blue-500" />
              <div>
                <h3 className="font-semibold">Support</h3>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Live Code Review</p>
              </div>
            </div>
          </div>

          {/* Technologies */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Technologies Used</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className={`px-4 py-2 rounded-full ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
              {['features', 'documentation', 'requirements'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-500 text-blue-500'
                      : darkMode
                      ? 'text-gray-400 hover:text-gray-300'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {activeTab === 'features' && project.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}

              {activeTab === 'documentation' && project.documentation.map((doc, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Book className="w-5 h-5 text-blue-500" />
                  <span>{doc}</span>
                </div>
              ))}

              {activeTab === 'requirements' && project.requirements.map((req, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-500" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} text-center`}>
            <h3 className="text-xl font-semibold mb-4">Ready to Get Started?</h3>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Get this project customized according to your requirements
            </p>
            <div className="flex justify-center gap-4">
              <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Request Project
              </button>
              <button className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
                darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-100'
              }`}>
                <Download className="w-5 h-5" />
                Download Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;