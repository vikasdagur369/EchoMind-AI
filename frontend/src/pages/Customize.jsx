import Card from "../components/Card";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import { useContext } from "react";
import { userDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

const Customize = () => {
  const { selectedImage, setSelectedImage } = useContext(userDataContext);
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#020236] flex flex-col justify-center items-center px-4 py-10">
      <h1 className="text-white text-2xl sm:text-3xl font-bold text-center mb-8">
        Select your <span className="text-blue-300">Assistant Image</span>
      </h1>

      <div className="w-full max-w-4xl flex justify-center items-center flex-wrap gap-4 sm:gap-6">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />
      </div>

      {selectedImage && (
        <button
          onClick={() => navigate("/customize2")}
          className="mt-8 w-40 h-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 text-white font-semibold hover:from-blue-600 hover:to-blue-500 transition"
        >
          Next
        </button>
      )}
    </div>
  );
};
export default Customize;
