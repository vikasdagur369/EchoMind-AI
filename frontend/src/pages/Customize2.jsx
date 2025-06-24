import { useContext, useState } from "react";
import { userDataContext } from "../context/userContext";
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
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#020236] flex flex-col justify-center items-center">
      <h1 className="text-white mb-[40px] text-[30px] text-center">
        Enter your <span className="text-blue-200">Assistant Name</span>
      </h1>
      <input
        type="text"
        placeholder="e.g Jarvis"
        className="px-2 py-2 w-full max-w-[600px] h-[60px] outline-none border-2 bg-transparent text-white border-white placeholder-grey-300 rounded-3xl text-[18px]"
        onChange={(e) => setAssistantName(e.target.value)}
        value={assistantName}
        required
      />
      {error && <p className="text-red-500 mt-2 text-[16px]">{error}</p>}
      {assistantName && (
        <button
          className="mt-5 min-w-[300px] h-[60px] bg-white rounded-full text-black font-semibold cursor-pointer"
          onClick={handleUpdateAssistant}
        >
          Create your Assistant
        </button>
      )}
    </div>
  );
};

export default Customize2;
