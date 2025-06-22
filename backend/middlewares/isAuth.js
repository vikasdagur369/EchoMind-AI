import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(400).json({ message: "Token not found!" });
    }

    const verifyToken = await jwt.sign(token, process.env.JWT_SECRET);

    req.userId = verifyToken.userId;

    next();
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:"isAuth error!"})
  }
};

export default isAuth;