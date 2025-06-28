import { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Customize2 = () => {
  const { userData, selectedImage, serverUrl, setUserData } =
    useContext(userDataContext);
  const navigate = useNavigate();
  const [assistantName, setAssistantName] = useState(
    userData?.assistantName || ""
  );
  const [error, setError] = useState(""); // Add state for error handling

  const handleUpdateAssistant = async () => {
    try {
      if (!assistantName || !selectedImage) {
        setError("Please provide both an assistant name and an image.");
        return;
      }

      const formData = new FormData();
      formData.append("assistantName", assistantName);
      formData.append("imageUrl", selectedImage);

      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        { withCredentials: true }
      );

      console.log("API Response:", result.data);
      setUserData(result.data);

      // Only navigate if the API response contains the required fields
      if (result.data?.assistantName && result.data?.assistantImage) {
        navigate("/");
      } else {
        setError("Failed to update assistant. Please try again.");
      }
    } catch (error) {
      console.error("Frontend error:", error.response?.data || error.message);
      setError(
        "An error occurred while updating the assistant. Please try again."
      );
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#020236] flex flex-col justify-center items-center px-4 py-10">
      <h1 className="text-white text-2xl sm:text-3xl font-bold text-center mb-8">
        Enter your <span className="text-blue-300">Assistant Name</span>
      </h1>

      <input
        type="text"
        placeholder="e.g., Jarvis"
        className="w-full max-w-xl h-14 px-4 rounded-full bg-white/10 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        onChange={(e) => setAssistantName(e.target.value)}
        value={assistantName}
        required
      />

      {error && (
        <p className="text-red-400 mt-2 text-sm text-center max-w-sm">
          {error}
        </p>
      )}

      {assistantName && (
        <button
          onClick={handleUpdateAssistant}
          className="mt-8 w-72 h-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 text-white font-semibold hover:from-blue-600 hover:to-blue-500 transition"
        >
          Create your Assistant
        </button>
      )}
    </div>
  );
};

export default Customize2;
