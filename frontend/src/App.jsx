import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./pages/signup";
import SignIn from "./pages/signin";
import Home from "./pages/Home";
import Customize from "./pages/Customize";
import { useContext } from "react";
import { userDataContext } from "./context/userContext";

const App = () => {
  const { userData, setUserData } = useContext(userDataContext);
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            userData?.assistantImage && userData?.assistantName ? (
              <Home />
            ) : (
              <Navigate to={"/customize"} />
            )
          }
        />

        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to={"/"} />}
        />
        <Route
          path="/signin"
          element={!userData ? <SignIn /> : <Navigate to={"/"} />}
        />
        <Route
          path="/customize"
          element={userData ? <Customize /> : <Navigate to={"/signin"} />}
        />
      </Routes>
    </div>
  );
};
export default App;
