import React, { useState } from 'react';
import { Send, User, Mail, MessageCircle, X } from 'lucide-react';
import NavigationBar from './ui/header';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <>
    <NavigationBar />
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 transform transition-all hover:scale-105">
          <h3 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
            Message Us
          </h3>

          <form 
            action="https://api.web3forms.com/submit" 
            method="POST" 
            className="space-y-6"
          >
            {/* Hidden Access Key */}
            <input 
              type="hidden" 
              name="access_key" 
              value="e4dbfa47-dc93-4448-a8b8-042686516c78" 
            />

            {/* Name Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="text-purple-500 w-5 h-5" />
              </div>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="text-purple-500 w-5 h-5" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Your E-mail"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>

            {/* Message Textarea */}
            <div className="relative">
              <div className="absolute top-3 left-0 pl-3 pointer-events-none">
                <MessageCircle className="text-purple-500 w-5 h-5" />
              </div>
              <textarea
                name="message"
                placeholder="Your Message"
                required
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 transition resize-none"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:opacity-90 transition flex items-center justify-center space-x-2"
            >
              <Send className="w-5 h-5 mr-2" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default ContactForm;