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
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#020236] flex flex-col justify-center items-center p-[20px]">
    <h1 className="text-white mb-[40px] text-[30px] text-center">select your <span className="text-blue-200">Assistant Image</span></h1>
      <div className="w-[90%] max-w-[60%] flex justify-center items-center flex-wrap gap-[20px]">
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
          className="mt-5 min-w-[150px] h-[60px] bg-white rounded-full text-black font-semibold cursor-pointer"
          onClick={() => navigate("/customize2")}
        >
          Next
        </button>
      )}
    </div>
  );
};
export default Customize;
