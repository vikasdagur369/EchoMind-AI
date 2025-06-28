import { useContext, useState } from "react";
import bg from "../assets/authBg.png";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/userContext";
import axios from "axios";

const SignIn = () => {
  const navigate = useNavigate();

  const { serverUrl, userData, setUserData } = useContext(userDataContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSignIn = async (e) => {
    //console.log(email, password);
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      console.log("result : ", result);
      setUserData(result.data);
      setLoading(false);
      navigate("/");
    } catch (error) {
      setUserData(null);
      console.log(`signin error ${error}`);
      setLoading(false);

      setErr(error.response?.data?.message || "Login Error");
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center flex justify-center items-center px-4"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        onSubmit={handleSignIn}
        className="w-full max-w-md bg-black/60 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6 flex flex-col gap-5"
      >
        <h1 className="text-white text-2xl sm:text-3xl font-bold text-center">
          Sign in to <span className="text-blue-400">Virtual Assistance</span>
        </h1>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full h-14 px-4 rounded-full bg-white/10 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <input
          type="password"
          placeholder="Enter your password"
          className="w-full h-14 px-4 rounded-full bg-white/10 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        {err.length > 0 && (
          <p className="text-red-400 text-center text-sm">* {err}</p>
        )}

        <button
          type="submit"
          className="w-full h-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 text-white font-semibold hover:from-blue-600 hover:to-blue-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>

        <p
          className="text-white text-center text-sm sm:text-base cursor-pointer hover:underline"
          onClick={() => navigate("/signup")}
        >
          Don't have an account?{" "}
          <span className="text-blue-400 font-medium">Sign up</span>
        </p>
      </form>
    </div>
  );
};
export default SignIn;
