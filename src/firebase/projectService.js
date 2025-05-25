import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "./config"
import { v2 as cloudinary } from 'cloudinary'


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.REACT_APP_CLOUD_NAME,
  api_key: process.env.REACT_APP_CLOUD_API_KEY,
  api_secret: process.env.REACT_APP_CLOUD_API_SECRET,
});


// Upload image to Cloudinary
const uploadToCloudinary = async (file) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'instantcode')

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw error
  }
}


// Add a new project
export const addProject = async (projectData) => {
  try {
    // Upload image to Cloudinary if it exists
    if (projectData.image && projectData.image instanceof File) {
      const imageUrl = await uploadToCloudinary(projectData.image)
      projectData.image = imageUrl
    }

    const docRef = await addDoc(collection(db, "projects"), {
      ...projectData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding project:", error)
    throw error
  }
}




// Get all projects
export const getAllProjects = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "projects"))
    const projects = []
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() })
    })
    return projects
  } catch (error) {
    console.error("Error getting projects:", error)
    throw error
  }
}

// Get projects by category
export const getProjectsByCategory = async (category) => {
  try {
    const q = query(collection(db, "projects"), where("category", "==", category))
    const querySnapshot = await getDocs(q)
    const projects = []
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() })
    })
    return projects
  } catch (error) {
    console.error("Error getting projects by category:", error)
    throw error
  }
}

// Get single project by ID
export const getProjectById = async (id) => {
  try {
    const docRef = doc(db, "projects", id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      throw new Error("Project not found")
    }
  } catch (error) {
    console.error("Error getting project:", error)
    throw error
  }
}



// Update project
export const updateProject = async (id, projectData) => {
  try {
    // Upload image to Cloudinary if it exists
    if (projectData.image && projectData.image instanceof File) {
      const imageUrl = await uploadToCloudinary(projectData.image)
      projectData.image = imageUrl
    }

    const docRef = doc(db, "projects", id)
    await updateDoc(docRef, {
      ...projectData,
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error("Error updating project:", error)
    throw error
  }
}


// Delete project
export const deleteProject = async (id) => {
  try {
    await deleteDoc(doc(db, "projects", id))
  } catch (error) {
    console.error("Error deleting project:", error)
    throw error
  }
}

// Upload image to Firebase Storage
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
