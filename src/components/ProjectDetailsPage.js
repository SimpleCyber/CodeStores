"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Clock, Book, Code, Download, CheckCircle, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import NavigationBar from "./ui/header"
import { getProjectById } from "../firebase/projectService"

const ProjectDetailsPage = () => {
  const { id } = useParams()
  const [darkMode, setDarkMode] = useState(true)
  const [activeTab, setActiveTab] = useState("features")
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProject()
  }, [id])

  const fetchProject = async () => {
    setLoading(true)
    try {
      const projectData = await getProjectById(id)
      setProject(projectData)
    } catch (error) {
      console.error("Error fetching project:", error)
      setError("Project not found")
    } finally {
      setLoading(false)
    }
  }

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : null
  }

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-slate-200"} text-gray-900 dark:text-white`}>
        <NavigationBar />
        <div className="container mx-auto px-6 py-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-4">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-slate-200"} text-gray-900 dark:text-white`}>
        <NavigationBar />
        <div className="container mx-auto px-6 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="mb-4">The project you're looking for doesn't exist.</p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  const embedUrl = getYouTubeEmbedUrl(project.youtubeVideo)

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-slate-200"} text-gray-900 dark:text-white`}>
      <NavigationBar />

      <div className="container mx-auto px-6 py-8">
        <Link to="/projects" className="inline-flex items-center gap-2 mb-6 text-blue-500 hover:text-blue-600">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        <div className={`rounded-lg p-8 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <h1 className="text-3xl font-bold mb-6">{project.name}</h1>

          <p className={`text-lg mb-8 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            {project.detailedDescription}
          </p>

          {/* Project Images */}
          {project.images && project.images.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Project Images</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.images.map((image, index) => (
                  <img
                    key={index}
                    src={image || "/placeholder.svg"}
                    alt={`${project.name} ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* YouTube Video */}
          {embedUrl && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Project Demo</h2>
              <div className="aspect-video">
                <iframe src={embedUrl} title="Project Demo" className="w-full h-full rounded-lg" allowFullScreen />
              </div>
            </div>
          )}

          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} flex items-center gap-3`}>
              <Clock className="w-6 h-6 text-blue-500" />
              <div>
                <h3 className="font-semibold">Timeline</h3>
                <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                  {project.timeline || "Contact for details"}
                </p>
              </div>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} flex items-center gap-3`}>
              <Book className="w-6 h-6 text-blue-500" />
              <div>
                <h3 className="font-semibold">Difficulty</h3>
                <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                  {project.difficulty
                    ? project.difficulty.charAt(0).toUpperCase() + project.difficulty.slice(1)
                    : "Intermediate"}
                </p>
              </div>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} flex items-center gap-3`}>
              <Code className="w-6 h-6 text-blue-500" />
              <div>
                <h3 className="font-semibold">Category</h3>
                <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                  {project.category ? project.category.toUpperCase() : "General"}
                </p>
              </div>
            </div>
          </div>

          {/* Technologies */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Technologies Used</h2>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className={`px-4 py-2 rounded-full ${
                      darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="mb-8">
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
              <button
                onClick={() => setActiveTab("features")}
                className={`px-6 py-3 ${
                  activeTab === "features"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : darkMode
                      ? "text-gray-400 hover:text-gray-300"
                      : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Features
              </button>
            </div>

            <div className="space-y-4">
              {activeTab === "features" &&
                project.features &&
                project.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}

              {activeTab === "features" && (!project.features || project.features.length === 0) && (
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>No features listed for this project.</p>
              )}
            </div>
          </div>

          {/* CTA Section */}
          <div className={`p-6 rounded-lg ${darkMode ? "bg-gray-700" : "bg-blue-50"} text-center`}>
            <h3 className="text-xl font-semibold mb-4">Ready to Get Started?</h3>
            <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Get this project customized according to your requirements
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/contact"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Request Project
              </Link>
              <button
                className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
                  darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-white hover:bg-gray-100"
                }`}
              >
                <Download className="w-5 h-5" />
                Download Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailsPage
