// UserContext.js
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const userDataContext = createContext(null); // Initialize with null for safety

const UserContext = ({ children }) => {
  const serverUrl = "http://localhost:8000";
  const [userData, setUserData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // Consistent naming

  const handleCurrentUser = async () => {
    try {
      console.log("user context called2!");
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      console.log("user context called3!");
      setUserData(result.data);
    } catch (error) {
      console.log(error);
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
  };

  // Debug: Log context value
  console.log("UserContext - Provided Value:", value);

  return (
    <userDataContext.Provider value={value}>
      {children} {/* Remove unnecessary <div> */}
    </userDataContext.Provider>
  );
};

export default UserContext;
