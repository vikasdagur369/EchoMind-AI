import { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../context/userContext";
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

  const synth = window.speechSynthesis;

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
    const voices = window.speechSynthesis.getVoices();
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

    if (type === "youtube-search") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }

    if (type === "youtube-play") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }

    if (type === "calculator-open") {
      window.open("calculator://", "_blank"); // Note: Native calculator cannot be opened via URL, handle with OS APIs if needed
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
      const timeString = now.toLocaleTimeString();
      speak(`The current time is ${timeString}`);
    }

    if (type === "get-date") {
      const now = new Date();
      const dateString = now.toLocaleDateString();
      speak(`Today's date is ${dateString}`);
    }

    if (type === "get-day") {
      const now = new Date();
      const dayString = now.toLocaleDateString(undefined, { weekday: "long" });
      speak(`Today is ${dayString}`);
    }

    if (type === "get-month") {
      const now = new Date();
      const monthString = now.toLocaleDateString(undefined, { month: "long" });
      speak(`The current month is ${monthString}`);
    }

    // For "general", handle using your default TTS response:
    if (type === "general") {
      speak(response); // using your TTS function
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
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
    if (SpeechRecognition) {
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
                console.log("Recoginition requested!");
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
        console.warn("Recognition error : ", event.error);
        isRecognizingRef.current = false;
        setListening(false);
        if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
          setTimeout(() => {
            if (isMounted) {
              try {
                recognition.start();
                console.log("Recognition restarted after error");
              } catch (error) {
                if (e.name !== "InvalidStateError") console.log(error);
              }
            }
          }, 1000);
        }
      };

      recognition.onresult = async (e) => {
        const transcript = e.results[e.results.length - 1][0].transcript.trim();
        if (
          transcript
            .toLowerCase()
            .includes(userData.assistantName.toLowerCase())
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

      window.speechSynthesis.onvoicechanged = () => {
        const greeting = new SpeechSynthesisUtterance(
          `Hello ${userData.name}, how can I help you?`
        );
        greeting.lang = "hi-IN";
        greeting.onend = () => {
          startTimeout();
        };
        window.speechSynthesis.speak(greeting);
      };
      return () => {
        isMounted = false;
        clearTimeout(startTimeout);
        recognition.stop();
        setListening(false);
        isRecognizingRef.current = false;
      };
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
      {!aiText && <img src={userImg} className="w-[200px]" alt="" />}
      {aiText && <img src={ai} className="w-[200px]" alt="" />}

      <h1 className="text-white text-[18px] ">
        {userText ? userText : aiText ? aiText : null}
      </h1>
    </div>
  );
};
export default Home;
