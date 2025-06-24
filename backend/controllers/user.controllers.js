import User from "../models/user.model.js";
import geminiResponse from "../gemini.js";
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Get current user error." });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    console.log(assistantName);
    const assistantImage = imageUrl;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        assistantName,
        assistantImage,
      },
      { new: true }
    ).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    console.log("updateassitantUser : ", error);
  }
};

export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    const user = await User.findById(req.userId);
    const userName = user.name;
    const assistantName = user.assistantName;

    const result = await geminiResponse();
  } catch (error) {
    console.log(error);
  }
};
