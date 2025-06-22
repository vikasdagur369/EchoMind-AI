import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

//--------------------SIGNUP CONTROLLER----------------------------------------------------
export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existEmail = await User.findOne({ email });

    if (existEmail) {
      return res.status(400).json({ message: "User is already exist!" });
    }

    if (password.length < 5) {
      return res
        .status(400)
        .json({ message: "password must be atleast 6 digits." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = User.create({ name, password: hashedPassword, email });

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: false,
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: `signup error ${error}` });
  }
};

//--------------------------LOGIN CONTROLLER------------------------------------------------

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does't exists!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password!" });
    }


    const token = await genToken(user._id);


    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: false,
    });

    return res.status(200).json({ message: "user login successfully!" });
  } catch (error) {
    return res.status(500).json({ message: `login error - ${error}` });
  }
};

//----------------------LOGOUT---------------------------------------------------

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "logout successfully!" });
  } catch (error) {
    res.status(500).json({ message: `error in signout ${error}` });
  }
};
