// UserContext.js
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const userDataContext = createContext(null); // Initialize with null for safety

const userContext = ({ children }) => {
  const serverUrl = "https://echomind-ai-backend.onrender.com";
  const [userData, setUserData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // Consistent naming

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getGeminiResponse = async (command) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        { command },
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      console.log("getGeminiResponse: ", error);
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  // Include selectedImage and setSelectedImage in context value
  const value = {
    serverUrl,
    userData,
    setUserData,
    selectedImage,
    setSelectedImage,
    getGeminiResponse,
  };

  // Debug: Log context value

  return (
    <userDataContext.Provider value={value}>
      {children} {/* Remove unnecessary <div> */}
    </userDataContext.Provider>
  );
};

export default userContext;
