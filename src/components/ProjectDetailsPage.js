"use client"

import React,{ useState, useEffect, useCallback, useMemo } from "react"
import { useParams } from "react-router-dom"
import { Clock, Book, Code, Download, CheckCircle, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import NavigationBar from "./ui/header"
import { getProjectById } from "../firebase/projectService"

// Memoized components for better performance
const ProjectImage = React.memo(({ src, alt, className }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  return (
    <div className={`relative ${className}`}>
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-lg" />
      )}
      <img
        src={imageError ? "/placeholder.svg" : src}
        alt={alt}
        className={`w-full h-48 object-cover rounded-lg transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        loading="lazy"
      />
    </div>
  )
})

const InfoCard = React.memo(({ icon: Icon, title, content, darkMode }) => (
  <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} flex items-center gap-3`}>
    <Icon className="w-6 h-6 text-blue-500" />
    <div>
      <h3 className="font-semibold">{title}</h3>
      <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
        {content}
      </p>
    </div>
  </div>
))

const TechTag = React.memo(({ tech, darkMode }) => (
  <span
    className={`px-4 py-2 rounded-full ${
      darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
    }`}
  >
    {tech}
  </span>
))

const FeatureItem = React.memo(({ feature }) => (
  <div className="flex items-center gap-3">
    <CheckCircle className="w-5 h-5 text-green-500" />
    <span>{feature}</span>
  </div>
))

const LoadingSkeleton = React.memo(({ darkMode }) => (
  <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-slate-200"}`}>
    <NavigationBar />
    <div className="container mx-auto px-6 py-8">
      <div className="animate-pulse">
        <div className={`h-4 w-32 ${darkMode ? "bg-gray-700" : "bg-gray-300"} rounded mb-6`} />
        <div className={`rounded-lg p-8 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <div className={`h-8 w-3/4 ${darkMode ? "bg-gray-700" : "bg-gray-300"} rounded mb-6`} />
          <div className={`h-4 w-full ${darkMode ? "bg-gray-700" : "bg-gray-300"} rounded mb-2`} />
          <div className={`h-4 w-2/3 ${darkMode ? "bg-gray-700" : "bg-gray-300"} rounded mb-8`} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`h-48 ${darkMode ? "bg-gray-700" : "bg-gray-300"} rounded-lg`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
))

const ErrorState = React.memo(({ darkMode, error }) => (
  <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-slate-200"} text-gray-900 dark:text-white`}>
    <NavigationBar />
    <div className="container mx-auto px-6 py-8 text-center">
      <h1 className="text-2xl font-bold mb-4">
        {error === "Project not found" ? "Project Not Found" : "Error Loading Project"}
      </h1>
      <p className="mb-4">
        {error === "Project not found" 
          ? "The project you're looking for doesn't exist." 
          : "There was an error loading the project. Please try again."
        }
      </p>
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Link>
    </div>
  </div>
))

const ProjectDetailsPage = () => {
  const { id } = useParams()
  const [darkMode, setDarkMode] = useState(true)
  const [activeTab, setActiveTab] = useState("features")
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Memoized YouTube embed URL
  const embedUrl = useMemo(() => {
    if (!project?.youtubeVideo) return null
    const videoId = project.youtubeVideo.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : null
  }, [project?.youtubeVideo])

  // Memoized project info cards data
  const infoCards = useMemo(() => [
    {
      icon: Clock,
      title: "Timeline",
      content: project?.timeline || "Contact for details"
    },
    {
      icon: Book,
      title: "Difficulty",
      content: project?.difficulty
        ? project.difficulty.charAt(0).toUpperCase() + project.difficulty.slice(1)
        : "Intermediate"
    },
    {
      icon: Code,
      title: "Category",
      content: project?.category ? project.category.toUpperCase() : "General"
    }
  ], [project])

  const fetchProject = useCallback(async () => {
    if (!id) return
    
    setLoading(true)
    setError(null)
    
    try {
      const projectData = await getProjectById(id)
      setProject(projectData)
    } catch (error) {
      console.error("Error fetching project:", error)
      setError(error.message || "Failed to load project")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchProject()
  }, [fetchProject])

  // Early returns for loading and error states
  if (loading) {
    return <LoadingSkeleton darkMode={darkMode} />
  }

  if (error || !project) {
    return <ErrorState darkMode={darkMode} error={error} />
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-slate-200"} text-gray-900 dark:text-white`}>
      <NavigationBar />

      <div className="container mx-auto px-6 py-8">
        <Link 
          to="/projects" 
          className="inline-flex items-center gap-2 mb-6 text-blue-500 hover:text-blue-600 transition-colors"
        >
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
                  <ProjectImage
                    key={`${project.id}-image-${index}`}
                    src={image}
                    alt={`${project.name} ${index + 1}`}
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
                <iframe 
                  src={embedUrl} 
                  title="Project Demo" 
                  className="w-full h-full rounded-lg" 
                  allowFullScreen 
                  loading="lazy"
                />
              </div>
            </div>
          )}

          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {infoCards.map((card, index) => (
              <InfoCard
                key={index}
                icon={card.icon}
                title={card.title}
                content={card.content}
                darkMode={darkMode}
              />
            ))}
          </div>

          {/* Technologies */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Technologies Used</h2>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, index) => (
                  <TechTag
                    key={`${project.id}-tech-${index}`}
                    tech={tech}
                    darkMode={darkMode}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="mb-8">
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
              <button
                onClick={() => setActiveTab("features")}
                className={`px-6 py-3 transition-colors ${
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
              {activeTab === "features" && project.features && project.features.length > 0 ? (
                project.features.map((feature, index) => (
                  <FeatureItem
                    key={`${project.id}-feature-${index}`}
                    feature={feature}
                  />
                ))
              ) : (
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  No features listed for this project.
                </p>
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
                className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-colors ${
                  darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-white hover:bg-gray-100"
                }`}
                onClick={() => {
                  // Add download functionality here
                  console.log("Download project details")
                }}
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