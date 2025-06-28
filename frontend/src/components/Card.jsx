// Card.jsx
import { useContext } from "react";
import { userDataContext } from "../context/UserContext";

const Card = ({ image }) => {
  const context = useContext(userDataContext);

  // Debug: Log context to verify values

  // Fallback if context is not provided
  if (!context) {
    console.error(
      "Card: userDataContext is not provided. Ensure Card is within UserContext."
    );
    return <div>Error: Context not available</div>;
  }

  const { selectedImage, setSelectedImage } = context;

  return (
    <div
      className={`w-36 sm:w-40 md:w-44 h-60 bg-[#1e1f36] border-2 border-blue-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300
    hover:shadow-2xl hover:shadow-blue-900 hover:border-4 hover:border-white
    ${
      selectedImage === image
        ? "border-4 border-white shadow-2xl shadow-blue-900"
        : ""
    }
  `}
      onClick={() => setSelectedImage(image)}
    >
      <img
        src={image}
        alt="assistant option"
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
    </div>
  );
};

export default Card;
