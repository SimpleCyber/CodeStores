import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Homepage from "./components/Homepage"
import ProjectsPage from "./components/ProjectsPage"
import ProjectDetailsPage from "./components/ProjectDetailsPage"
import AdminMain from "./components/admin/adminMain"
import ContactForm from "./components/contact"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/project/:id" element={<ProjectDetailsPage />} />
        <Route path="/admin" element={<AdminMain />} />
        <Route path="/contact" element={<ContactForm />} />
      </Routes>
    </Router>
  )
}

export default App
