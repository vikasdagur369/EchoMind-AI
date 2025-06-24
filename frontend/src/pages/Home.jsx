import { useContext } from "react";
import { userDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { userData } = useContext(userDataContext);

  const navigate = useNavigate();
  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#020236] flex flex-col justify-center items-center p-[20px] gap-[15px]">
      <button
        type="submit"
        className="mt-5 min-w-[150px] h-[60px] bg-white font-bold rounded-full absolute top-[20px] right-[20px] cursor-pointer text-black"
      >
        Log out
      </button>
      <button
        type="submit"
        className="mt-5 font-bold min-w-[150px] h-[60px] bg-white rounded-full absolute top-[100px] right-[20px] text-black  px-[20px] py-[20px]"
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
