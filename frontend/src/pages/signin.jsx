import { useContext, useState } from "react";
import bg from "../assets/authBg.png";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/userContext";
import axios from "axios";

const SignIn = () => {
  const navigate = useNavigate();

  const { serverUrl } = useContext(userDataContext);

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
      console.log(result);
      setLoading(false);
    } catch (error) {
      console.log(`signin error ${error}`);
      setLoading(false);

      setErr(error.response?.data?.message || "Login Error");
    }
  };

  return (
    <div
      className="w-full h-[100vh] bg-cover flex justify-center item-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        className="w-[90%] h-[600px] max-w-[500px] bg-[#00000096] backdrop-blur shadow-lg shadow-blue-950 flex flex-col items-center justify-center gap-[20px] p-5"
        onSubmit={handleSignIn}
      >
        <h1 className="text-white text-[30px] font-semibold mb-[30px]">
          SignIn to <span className="text-blue-500">Virtual Assitance</span>
        </h1>

        <input
          type="email"
          placeholder="Enter your email"
          className=" px-2 py-2 w-full h-[60px] outline-none border-2 bg-transparent text-white border-white placeholder-grey-300 rounded-3xl text-[18px]"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <div className="w-full h-[60px] rounded-full border-2 border-white bg-transparent text-white rouded-full text-[18px] relative">
          <input
            type="password"
            placeholder="Enter your password"
            className=" px-2 py-2 w-full h-[60px] outline-none bg-transparent  placeholder-grey-300  text-[18px]"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        {err.length > 0 && <p className="text-red-500">*{err}</p>}
        <button
          type="submit"
          className="mt-5 min-w-[150px] h-[60px] bg-white rounded-full text-black font-semibold"
          disabled={loading}
        >
          {loading?"Loading...":"SignIn"}
        </button>
        <p
          className="text-white text-[18px] cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Don't have an account? <span className="text-blue-400">Sign-up</span>
        </p>
      </form>
    </div>
  );
};
export default SignIn;
