import { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ai from "../assets/ai.gif";
import userImg from "../assets/user.gif";

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();

  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const greetedRef = useRef(false);

  const synth = window.speechSynthesis;

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      console.log(error);
    }
  };

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
        setListening(true);
      } catch (error) {
        if (!error.message.includes("start")) {
          console.error("Recognition error:", error);
        }
      }
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    const voices = synth.getVoices();
    const hindiVoice = voices.find((v) => v.lang === "hi-IN");
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }
    isSpeakingRef.current = true;
    utterance.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      setTimeout(() => {
        startRecognition();
      }, 800);
    };
    synth.cancel();
    synth.speak(utterance);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;

    if (type === "google-search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }

    if (type === "youtube-search" || type === "youtube-play") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }

    if (type === "calculator-open") {
      window.open("calculator://", "_blank");
    }

    if (type === "instagram-open") {
      window.open("https://www.instagram.com", "_blank");
    }

    if (type === "facebook-open") {
      window.open("https://www.facebook.com", "_blank");
    }

    if (type === "weather-show") {
      const query = encodeURIComponent(userInput || "weather");
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }

    if (type === "get-time") {
      const now = new Date();
      speak(`The current time is ${now.toLocaleTimeString()}`);
    }

    if (type === "get-date") {
      const now = new Date();
      speak(`Today's date is ${now.toLocaleDateString()}`);
    }

    if (type === "get-day") {
      const now = new Date();
      speak(
        `Today is ${now.toLocaleDateString(undefined, { weekday: "long" })}`
      );
    }

    if (type === "get-month") {
      const now = new Date();
      speak(
        `The current month is ${now.toLocaleDateString(undefined, {
          month: "long",
        })}`
      );
    }

    if (type === "general") {
      speak(response);
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("SpeechRecognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    let isMounted = true;

    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
        } catch (error) {
          if (error.name !== "InvalidStateError") {
            console.error("Start error :", error);
          }
        }
      }
    }, 1000);

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("Recognition requested!");
            } catch (error) {
              if (error.name !== "InvalidStateError") {
                console.error("Start error :", error);
              }
            }
          }
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error: ", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("Recognition restarted after error");
            } catch (error) {
              if (error.name !== "InvalidStateError") {
                console.error(error);
              }
            }
          }
        }, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        setAiText("");
        setUserText(transcript);
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);
        const data = await getGeminiResponse(transcript);
        handleCommand(data);
        setAiText(data.response);
        setUserText("");
      }
    };

    const handleVoicesChanged = () => {
      if (!greetedRef.current) {
        const greeting = new SpeechSynthesisUtterance(
          `Hello ${userData.name}, how can I help you?`
        );
        greeting.lang = "hi-IN";
        greeting.onend = () => {
          startTimeout();
        };
        synth.speak(greeting);
        greetedRef.current = true; // speak only once
      }
    };

    window.speechSynthesis.addEventListener(
      "voiceschanged",
      handleVoicesChanged
    );

    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        handleVoicesChanged
      );
    };
  }, [userData, getGeminiResponse]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#020236] flex flex-col items-center justify-center px-4 py-10 relative gap-4">
      {/* Log Out Button */}
      <button
        onClick={handleLogOut}
        className="absolute top-5 right-5 w-32 h-12 rounded-full bg-gradient-to-r from-red-500 to-red-400 text-white font-semibold shadow-md hover:from-red-600 hover:to-red-500 transition"
      >
        Log out
      </button>

      {/* Customize Button */}
      <button
        onClick={() => navigate("/customize")}
        className="absolute top-20 right-5 w-48 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 text-white font-semibold shadow-md hover:from-blue-600 hover:to-blue-500 transition"
      >
        Customize Assistant
      </button>

      {/* Assistant Image */}
      <div className="w-72 h-96 rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-black/40 backdrop-blur-md flex justify-center items-center">
        <img
          src={userData?.assistantImage}
          alt="Assistant"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Assistant Name */}
      <h1 className="text-white text-xl sm:text-2xl font-bold mt-4">
        I'm {userData?.assistantName}
      </h1>

      {/* Image Below Name */}
      {!aiText ? (
        <img
          src={userImg}
          alt="User Speaking"
          className="w-48 sm:w-52 mt-4 rounded-2xl shadow-lg"
        />
      ) : (
        <img
          src={ai}
          alt="AI Speaking"
          className="w-48 sm:w-52 mt-4 rounded-2xl shadow-lg"
        />
      )}

      {/* Text Display */}
      {(userText || aiText) && (
        <h2 className="text-white text-center text-lg sm:text-xl mt-4 px-4 max-w-md">
          {userText ? userText : aiText}
        </h2>
      )}
    </div>
  );
};
export default Home;
