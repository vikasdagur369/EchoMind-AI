import { useContext, useEffect } from "react";
import { userDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);

  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      console.log(error);
    }
  };

  const speak=(text) => {
    const utterance = new SpeechSynthesisUtterance(text);
  }

  

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.lang = "en-US";
      recognition.onresult = async (e) => {
        const transcript = e.results[e.results.length - 1][0].transcript.trim();
        console.log("heard :" + transcript);
        if (
          transcript
            .toLowerCase()
            .includes(userData.assistantName.toLowerCase())
        ) {
          const data = await getGeminiResponse(transcript);
        }
      };

      recognition.start();
    } else {
      console.warn("SpeechRecognition is not supported in this browser.");
    }
  }, []);

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#020236] flex flex-col justify-center items-center p-[20px] gap-[15px]">
      <button
        type="submit"
        className="mt-5 min-w-[150px] h-[60px] bg-white font-bold rounded-full absolute top-[20px] right-[20px] cursor-pointer text-black"
        onClick={handleLogOut}
      >
        Log out
      </button>
      <button
        type="submit"
        className="mt-5 font-bold min-w-[150px] h-[60px] bg-white rounded-full absolute top-[100px] right-[20px] text-black cursor-pointer px-[20px] py-[20px]"
        onClick={() => navigate("/customize")}
      >
        Customize your Assistant
      </button>
      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden  rounded-4xl shadow-lg">
        <img
          src={userData?.assistantImage}
          alt=""
          className="h-full object-cover "
        />
      </div>
      <h1 className="text-white text-[18px] font-bold">
        I'm {userData?.assistantName}
      </h1>
    </div>
  );
};
export default Home;
