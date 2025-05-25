"use client"

import { useState, useEffect } from "react"
import { Save, X, Upload, Trash2 } from "lucide-react"
import { addProject, updateProject, uploadImage } from "../../firebase/projectService"




const ProjectForm = ({ project, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    detailedDescription: "",
    category: "python",
    techStack: [],
    features: [],
    images: [],
    youtubeVideo: "",
    timeline: "",
    difficulty: "beginner",
  })
  const [techInput, setTechInput] = useState("")
  const [featureInput, setFeatureInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  const categories = ["python", "iot", "mern", "java", "app", "game"]
  const difficulties = ["beginner", "intermediate", "advanced"]

  

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        shortDescription: project.shortDescription || "",
        detailedDescription: project.detailedDescription || "",
        category: project.category || "python",
        techStack: project.techStack || [],
        features: project.features || [],
        images: project.images || [],
        youtubeVideo: project.youtubeVideo || "",
        timeline: project.timeline || "",
        difficulty: project.difficulty || "beginner",
      })
    }
  }, [project])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  

  const addTechStack = () => {
    if (techInput.trim() && !formData.techStack.includes(techInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        techStack: [...prev.techStack, techInput.trim()],
      }))
      setTechInput("")
    }
  }

  

  const removeTechStack = (index) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((_, i) => i !== index),
    }))
  }

  const addFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }))
      setFeatureInput("")
    }
  }

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  // ...existing code...

const handleImageUpload = async (e) => {
  const files = Array.from(e.target.files)
  if (files.length === 0) return

  setUploadingImage(true)
  try {
    const base64Promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    })

    const base64Images = await Promise.all(base64Promises)
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...base64Images],
    }))
  } catch (error) {
    console.error("Error converting images:", error)
    alert("Error processing images")
  } finally {
    setUploadingImage(false)
  }
}

// ...existing code...

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (project) {
        await updateProject(project.id, formData)
      } else {
        await addProject(formData)
      }
      onClose()
    } catch (error) {
      console.error("Error saving project:", error)
      alert("Error saving project")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{project ? "Edit Project" : "Add New Project"}</h1>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Project Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Short Description</label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="One line description for project listing"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Detailed Description</label>
            <textarea
              name="detailedDescription"
              value={formData.detailedDescription}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Detailed description for project details page"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Timeline</label>
              <input
                type="text"
                name="timeline"
                value={formData.timeline}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 10-12 days"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Difficulty</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {difficulties.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">YouTube Video URL</label>
            <input
              type="url"
              name="youtubeVideo"
              value={formData.youtubeVideo}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tech Stack</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add technology"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTechStack())}
              />
              <button
                type="button"
                onClick={addTechStack}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.techStack.map((tech, index) => (
                <span key={index} className="bg-gray-600 px-3 py-1 rounded-full flex items-center gap-2">
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechStack(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Features</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add feature"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
              />
              <button type="button" onClick={addFeature} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg">
                Add
              </button>
            </div>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="bg-gray-700 px-4 py-2 rounded-lg flex items-center justify-between">
                  <span>{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Project Images</label>
            <div className="mb-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 inline-flex"
              >
                <Upload className="w-5 h-5" />
                {uploadingImage ? "Uploading..." : "Upload Images"}
              </label>
            </div>

<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {formData.images.map((image, index) => (
    <div key={index} className="relative">
      <img
        src={image}
        alt={`Project ${index + 1}`}
        className="w-full h-24 object-cover rounded-lg"
      />
      <button
        type="button"
        onClick={() => removeImage(index)}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  ))}
</div>

          </div>

          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {loading ? "Saving..." : "Save Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProjectForm
