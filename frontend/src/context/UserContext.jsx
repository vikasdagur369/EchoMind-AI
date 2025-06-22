import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const userDataContext = createContext();

const UserContext = ({ children }) => {
  const serverUrl = "http://localhost:8000";
  console.log("user context called!");
  const [userData, setUserData] = useState(null);

  const handleCurrentUser = async () => {
    try {
      console.log("user context called2!");

      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      console.log("user context called3!");

      setUserData(result.data);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = { serverUrl, userData, setUserData };

  return (
    <userDataContext.Provider value={value}>
      <div>{children}</div>
    </userDataContext.Provider>
  );
};
export default UserContext;
