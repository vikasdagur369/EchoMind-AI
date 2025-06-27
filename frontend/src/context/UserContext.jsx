// UserContext.js
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const userDataContext = createContext(null); // Initialize with null for safety

const userContext = ({ children }) => {
  const serverUrl = "http://localhost:8000";
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
      console.log("hello everyone!");

      const result = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        { command },
        { withCredentials: true }
      );

      console.log("result.data", result.data);

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
