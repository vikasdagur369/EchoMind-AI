import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const userDataContext = createContext();

const UserContext = ({ children }) => {
  const serverUrl = "http://localhost:8000";

  const [userData, setUserData] = useState(null);

  const handleCurrentuser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleCurrentuser();
  }, []);

  const value = { serverUrl };

  return (
    <userDataContext.Provider value={value}>
      <div>{children}</div>
    </userDataContext.Provider>
  );
};
export default UserContext;
