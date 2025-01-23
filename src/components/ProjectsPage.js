import React, { useState } from 'react';
import { Moon, Sun, Search } from 'lucide-react';

const ProjectsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'mern', name: 'MERN Stack' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' },
    { id: 'ai', name: 'AI/ML' },
  ];

  const projects = [
    {
      id: 1,
      title: "E-Learning Platform",
      category: "mern",
      description: "A full-stack learning management system with video courses and quizzes",
      technologies: ["React", "Node.js", "MongoDB", "Express"],
      difficulty: "Advanced"
    },
    {
      id: 2,
      title: "AI Image Recognition",
      category: "python",
      description: "Deep learning model for image classification and object detection",
      technologies: ["Python", "TensorFlow", "OpenCV"],
      difficulty: "Advanced"
    },
    {
      id: 3,
      title: "Hospital Management System",
      category: "java",
      description: "Complete healthcare management solution with patient records",
      technologies: ["Java", "Spring Boot", "MySQL"],
      difficulty: "Intermediate"
    }
    // Add more projects as needed
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Navigation */}
      <nav className={`px-6 py-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">InstatCode</h1>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search projects..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-gray-100 border-gray-200'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : darkMode
                    ? 'bg-gray-800 hover:bg-gray-700'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              className={`rounded-lg p-6 ${
                darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
              } transition-all cursor-pointer`}
            >
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm ${
                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Difficulty: {project.difficulty}
                </span>
                <button className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;