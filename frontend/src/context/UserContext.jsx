import { createContext } from "react";

export const userDataContext = createContext();

const UserContext = ({ children }) => {
  
    const serverUrl = "http://localhost:8000";

  const value = { serverUrl };
 
  return (
    <userDataContext.Provider value={value}>
      <div>{children}</div>
    </userDataContext.Provider>
  );
};
export default UserContext;
