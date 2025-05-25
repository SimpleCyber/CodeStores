"use client"

import { useState, useEffect } from "react"
import { Search, ExternalLink } from "lucide-react"
import { Link } from "react-router-dom"
import NavigationBar from "./ui/header"
import { getAllProjects, getProjectsByCategory } from "../firebase/projectService"

const ProjectsPage = () => {
  const [darkMode, setDarkMode] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  const categories = [
    { id: "all", name: "All Projects" },
    { id: "python", name: "Python" },
    { id: "iot", name: "IoT" },
    { id: "mern", name: "MERN Stack" },
    { id: "java", name: "Java" },
    { id: "arvr", name: "AR/VR" },
    { id: "game", name: "Game Development" },
  ]

  useEffect(() => {
    fetchProjects()
  }, [selectedCategory])

  useEffect(() => {
    filterProjects()
  }, [projects, searchTerm])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      let projectsData
      if (selectedCategory === "all") {
        projectsData = await getAllProjects()
      } else {
        projectsData = await getProjectsByCategory(selectedCategory)
      }
      setProjects(projectsData)
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterProjects = () => {
    if (!searchTerm) {
      setFilteredProjects(projects)
    } else {
      const filtered = projects.filter(
        (project) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.techStack?.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredProjects(filtered)
    }
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <NavigationBar />

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200"
              } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  selectedCategory === category.id
                    ? "bg-blue-500 text-white"
                    : darkMode
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-500">Loading projects...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className={`rounded-lg p-6 ${
                  darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-50 hover:bg-gray-100"
                } transition-all cursor-pointer`}
              >
                {project.images && project.images.length > 0 && (
                  <img
                    src={project.images[0] || "/placeholder.svg"}
                    alt={project.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}

                <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{project.shortDescription}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack?.slice(0, 4).map((tech, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm ${
                        darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack?.length > 4 && (
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      +{project.techStack.length - 4}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Difficulty: {project.difficulty || "Intermediate"}
                  </span>
                  <Link
                    to={`/project/${project.id}`}
                    className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    View Details
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No projects found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectsPage
