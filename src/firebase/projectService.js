import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where, orderBy, limit, startAfter } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "./config"

// Cache for projects to avoid repeated fetches
const projectCache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Helper function to check if cache is valid
const isCacheValid = (timestamp) => {
  return Date.now() - timestamp < CACHE_DURATION
}

// Generate cache key for paginated queries
const getCacheKey = (category, limitSize) => {
  return `${category}_${limitSize}`
}

export const getPaginatedProjects = async (category = "all", limitSize = 6, lastVisible = null, reset = false) => {
  try {
    const cacheKey = getCacheKey(category, limitSize)
    
    // If reset is true, clear the cache for this query
    if (reset) {
      projectCache.delete(cacheKey)
    }
    
    // Check if we have cached data and it's still valid
    const cached = projectCache.get(cacheKey)
    if (cached && !lastVisible && isCacheValid(cached.timestamp)) {
      return { projects: cached.projects, lastVisible: cached.lastVisible }
    }

    let baseQuery = collection(db, "projects")
    const constraints = []

    // Add category filter if specified
    if (category !== "all") {
      constraints.push(where("category", "==", category))
      console.log("Fetching with category:", category)
    }

    // Add sorting and limit
    constraints.push(orderBy("createdAt", "desc"))
    constraints.push(limit(limitSize))

    // Start after last doc if provided
    if (lastVisible) {
      constraints.push(startAfter(lastVisible))
    }

    const paginatedQuery = query(baseQuery, ...constraints)
    const querySnapshot = await getDocs(paginatedQuery)

    const projects = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        // Convert Firestore timestamps to ISO strings for better performance
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      }
    })

    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null
    const hasMore = querySnapshot.docs.length === limitSize

    // Cache the first page results
    if (!lastVisible) {
      projectCache.set(cacheKey, {
        projects,
        lastVisible: lastDoc,
        timestamp: Date.now()
      })
    }

    return { projects, lastVisible: lastDoc, hasMore }
  } catch (error) {
    console.error("Error fetching paginated projects:", error)
    throw error
  }
}

// Optimized image conversion with compression
export const convertToBase64 = (file, maxWidth = 800, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality)
      resolve(compressedBase64)
    }
    
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

// Batch operations for better performance
export const addProjectsBatch = async (projectsData) => {
  try {
    const batch = []
    for (const projectData of projectsData) {
      // Convert image file to base64 if it exists
      if (projectData.image && projectData.image instanceof File) {
        const base64Image = await convertToBase64(projectData.image)
        projectData.image = base64Image
      }

      const docRef = await addDoc(collection(db, "projects"), {
        ...projectData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      batch.push(docRef.id)
    }
    
    // Clear cache after adding new projects
    projectCache.clear()
    return batch
  } catch (error) {
    console.error("Error adding projects batch:", error)
    throw error
  }
}

// Add a new project with cache invalidation
export const addProject = async (projectData) => {
  try {
    // Convert image file to base64 if it exists
    if (projectData.image && projectData.image instanceof File) {
      const base64Image = await convertToBase64(projectData.image)
      projectData.image = base64Image
    }

    const docRef = await addDoc(collection(db, "projects"), {
      ...projectData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    
    // Clear cache after adding new project
    projectCache.clear()
    return docRef.id
  } catch (error) {
    console.error("Error adding project:", error)
    throw error
  }
}

// Optimized get all projects with caching
export const getAllProjects = async (useCache = true) => {
  try {
    const cacheKey = 'all_projects'
    
    // Check cache first
    if (useCache) {
      const cached = projectCache.get(cacheKey)
      if (cached && isCacheValid(cached.timestamp)) {
        return cached.projects
      }
    }

    const querySnapshot = await getDocs(collection(db, "projects"))
    const projects = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      }
    })
    
    // Cache the results
    if (useCache) {
      projectCache.set(cacheKey, {
        projects,
        timestamp: Date.now()
      })
    }
    
    return projects
  } catch (error) {
    console.error("Error getting projects:", error)
    throw error
  }
}

// Get projects by category with caching
export const getProjectsByCategory = async (category, useCache = true) => {
  try {
    const cacheKey = `category_${category}`
    
    // Check cache first
    if (useCache) {
      const cached = projectCache.get(cacheKey)
      if (cached && isCacheValid(cached.timestamp)) {
        return cached.projects
      }
    }

    const q = query(collection(db, "projects"), where("category", "==", category))
    const querySnapshot = await getDocs(q)
    const projects = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      }
    })
    
    // Cache the results
    if (useCache) {
      projectCache.set(cacheKey, {
        projects,
        timestamp: Date.now()
      })
    }
    
    return projects
  } catch (error) {
    console.error("Error getting projects by category:", error)
    throw error
  }
}

// Get single project by ID with caching
export const getProjectById = async (id, useCache = true) => {
  try {
    const cacheKey = `project_${id}`
    
    // Check cache first
    if (useCache) {
      const cached = projectCache.get(cacheKey)
      if (cached && isCacheValid(cached.timestamp)) {
        return cached.project
      }
    }

    const docRef = doc(db, "projects", id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      const project = {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      }
      
      // Cache the result
      if (useCache) {
        projectCache.set(cacheKey, {
          project,
          timestamp: Date.now()
        })
      }
      
      return project
    } else {
      throw new Error("Project not found")
    }
  } catch (error) {
    console.error("Error getting project:", error)
    throw error
  }
}

// Update project with cache invalidation
export const updateProject = async (id, projectData) => {
  try {
    // Convert image file to base64 if it exists
    if (projectData.image && projectData.image instanceof File) {
      const base64Image = await convertToBase64(projectData.image)
      projectData.image = base64Image
    }

    const docRef = doc(db, "projects", id)
    await updateDoc(docRef, {
      ...projectData,
      updatedAt: new Date(),
    })
    
    // Clear relevant cache entries
    projectCache.delete(`project_${id}`)
    projectCache.clear() // Clear all cache to ensure consistency
  } catch (error) {
    console.error("Error updating project:", error)
    throw error
  }
}

// Delete project with cache invalidation
export const deleteProject = async (id) => {
  try {
    await deleteDoc(doc(db, "projects", id))
    
    // Clear relevant cache entries
    projectCache.delete(`project_${id}`)
    projectCache.clear() // Clear all cache to ensure consistency
  } catch (error) {
    console.error("Error deleting project:", error)
    throw error
  }
}

// Upload image to Firebase Storage (unchanged but added for completeness)
export const uploadImage = async (file, path) => {
  try {
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}

// Utility function to clear cache manually
export const clearProjectCache = () => {
  projectCache.clear()
}

// Utility function to preload next page
export const preloadNextPage = async (category, limitSize, lastVisible) => {
  try {
    // Preload in background without blocking UI
    setTimeout(async () => {
      await getPaginatedProjects(category, limitSize, lastVisible)
    }, 100)
  } catch (error) {
    // Silently fail for preloading
    console.log("Preload failed:", error)
  }
}