import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const languages = [
  "English", "Hindi", "Bengali", "Telugu", "Marathi", "Tamil", "Urdu", "Gujarati",
  "Malayalam", "Kannada", "Odia", "Punjabi", "Assamese", "Nepali", "Sanskrit",
  "Spanish", "French", "Mandarin", "Arabic", "Russian", "Japanese"
];

const LanguageSelection = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value);
  };

  const handleSubmit = () => {
    if (selectedLanguage) {
      localStorage.setItem("prefLang", selectedLanguage);
      navigate("/"); 
    } else {
      alert("Please select a language.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-semibold mb-6">Select Your Preferred Language</h1>
      <select
        value={selectedLanguage || ""}
        onChange={handleLanguageChange}
        className="p-3 text-lg border border-gray-300 rounded-md mb-6 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>Select a language</option>
        {languages.map((language, index) => (
          <option key={index} value={language}>{language}</option>
        ))}
      </select>
      <button
        onClick={handleSubmit}
        className="px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Save and Continue
      </button>
    </div>
  );
};
export default LanguageSelection;
