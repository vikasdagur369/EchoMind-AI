import Card from "../components/Card";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import { useContext } from "react";
import { userDataContext } from "../context/UserContext";

const Customize = () => {
  const { serverUrl, userData, setUserData, selectedImage, setSelectedImage } =
    useContext(userDataContext);
  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#020236] flex flex-col justify-center items-center">
      <div className="w-[90%] max-w-[60%] flex justify-center items-center flex-wrap gap-[20px]">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />
      </div>
      <button className="mt-5 min-w-[150px] h-[60px] bg-white rounded-full text-black font-semibold cursor-pointer">
        Next
      </button>
    </div>
  );
};
export default Customize;
