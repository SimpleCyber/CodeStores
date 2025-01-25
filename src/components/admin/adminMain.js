import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Save, X, ImagePlus 
} from 'lucide-react';

const AdminProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState({
    title: '',
    description: '',
    timeline: '',
    technologies: [],
    features: [],
    documentation: [],
    category: '',
    image: null
  });

  // Load projects from local storage on component mount
  useEffect(() => {
    const savedProjects = JSON.parse(localStorage.getItem('instatcodeProjects') || '[]');
    setProjects(savedProjects);
  }, []);

  // Save projects to local storage whenever projects change
  useEffect(() => {
    localStorage.setItem('instatcodeProjects', JSON.stringify(projects));
  }, [projects]);

  const handleAddProject = () => {
    const newProject = {
      ...currentProject,
      id: Date.now().toString(),
      technologies: currentProject.technologies.split(',').map(tech => tech.trim()),
      features: currentProject.features.split(',').map(feature => feature.trim()),
      documentation: currentProject.documentation.split(',').map(doc => doc.trim())
    };

    setProjects([...projects, newProject]);
    setIsAddModalOpen(false);
    // Reset form
    setCurrentProject({
      title: '',
      description: '',
      timeline: '',
      technologies: [],
      features: [],
      documentation: [],
      category: '',
      image: null
    });
  };

  const handleDeleteProject = (id) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setCurrentProject({
        ...currentProject,
        image: reader.result
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Project Management</h1>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div 
              key={project.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {project.image && (
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
                <p className="text-gray-600 mb-4">{project.description}</p>
                
                <div className="flex justify-between">
                  <span className="text-sm text-blue-500">{project.category}</span>
                  <div className="flex space-x-2">
                    <button 
                      className="text-blue-500 hover:bg-blue-100 p-2 rounded"
                      // Implement edit functionality
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-red-500 hover:bg-red-100 p-2 rounded"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Project Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Add New Project</h2>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block mb-2">Project Image</label>
                  <div className="flex items-center">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="imageUpload"
                    />
                    <label 
                      htmlFor="imageUpload"
                      className="flex items-center px-4 py-2 bg-blue-100 text-blue-600 rounded cursor-pointer"
                    >
                      <ImagePlus className="mr-2 w-5 h-5" />
                      Upload Image
                    </label>
                    {currentProject.image && (
                      <img 
                        src={currentProject.image} 
                        alt="Project" 
                        className="ml-4 w-20 h-20 object-cover rounded"
                      />
                    )}
                  </div>
                </div>
                {/* Input Fields */}
                <input 
                  type="text"
                  placeholder="Project Title"
                  value={currentProject.title}
                  onChange={(e) => setCurrentProject({
                    ...currentProject, 
                    title: e.target.value
                  })}
                  className="w-full p-2 border rounded"
                />
                <textarea 
                  placeholder="Project Description"
                  value={currentProject.description}
                  onChange={(e) => setCurrentProject({
                    ...currentProject, 
                    description: e.target.value
                  })}
                  className="w-full p-2 border rounded"
                />
                <input 
                  type="text"
                  placeholder="Timeline (e.g., 10-12 days)"
                  value={currentProject.timeline}
                  onChange={(e) => setCurrentProject({
                    ...currentProject, 
                    timeline: e.target.value
                  })}
                  className="w-full p-2 border rounded"
                />
                <input 
                  type="text"
                  placeholder="Technologies (comma-separated)"
                  value={currentProject.technologies}
                  onChange={(e) => setCurrentProject({
                    ...currentProject, 
                    technologies: e.target.value
                  })}
                  className="w-full p-2 border rounded"
                />
                <input 
                  type="text"
                  placeholder="Features (comma-separated)"
                  value={currentProject.features}
                  onChange={(e) => setCurrentProject({
                    ...currentProject, 
                    features: e.target.value
                  })}
                  className="w-full p-2 border rounded"
                />
                <input 
                  type="text"
                  placeholder="Documentation (comma-separated)"
                  value={currentProject.documentation}
                  onChange={(e) => setCurrentProject({
                    ...currentProject, 
                    documentation: e.target.value
                  })}
                  className="w-full p-2 border rounded"
                />
                <select 
                  value={currentProject.category}
                  onChange={(e) => setCurrentProject({
                    ...currentProject, 
                    category: e.target.value
                  })}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Category</option>
                  <option value="mern">MERN Stack</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="ai">AI/ML</option>
                </select>

                <div className="flex justify-end space-x-4">
                  <button 
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 rounded"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={handleAddProject}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Save Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProjectPage;