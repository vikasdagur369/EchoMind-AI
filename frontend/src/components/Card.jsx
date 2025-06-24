// Card.jsx
import { useContext } from "react";
import { userDataContext } from "../context/UserContext";

const Card = ({ image }) => {
  const context = useContext(userDataContext);

  // Debug: Log context to verify values

  // Fallback if context is not provided
  if (!context) {
    console.error("Card: userDataContext is not provided. Ensure Card is within UserContext.");
    return <div>Error: Context not available</div>;
  }

  const { selectedImage, setSelectedImage } = context;

 

  return (
    <div
      className={`w-[150px] h-[250px] bg-[#30326] border-2 border-[#0000ff80] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer
        hover:border-4 hover:border-white ${
          selectedImage === image
            ? "border-4 border-white shadow-2xl shadow-blue-950"
            : ""
        }`}
      onClick={() => {
        setSelectedImage(image);
      }}
    >
      <img src={image} className="h-full object-cover" alt="card image" />
    </div>
  );
};

export default Card;