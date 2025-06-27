import User from "../models/user.model.js";
import geminiResponse from "../gemini.js";
import moment from "moment/moment.js";

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

    console.log("userName :", userName);
    const assistantName = user.assistantName;

    const result = await geminiResponse(command, assistantName, userName);
    console.log("Gemini raw output:", result);

    if (!result || typeof result !== "string") {
      return res.status(400).json({ response: "Empty response from Gemini." });
    }

    // Clean any markdown formatting like ```json or ``` at beginning/end
    const cleanedOutput = result.replace(/```json|```/g, "").trim();

    let gemResult;

    try {
      // Try parsing directly
      gemResult = JSON.parse(cleanedOutput);
    } catch (err) {
      // Try extracting a JSON block from messy string
      const jsonMatch = cleanedOutput.match(/{[\s\S]+}/);
      if (!jsonMatch) {
        return res
          .status(400)
          .json({ response: "Sorry, I can't understand that." });
      }

      try {
        gemResult = JSON.parse(jsonMatch[0]);
      } catch (parseErr) {
        return res
          .status(400)
          .json({ response: "Sorry, the response was invalid JSON." });
      }
    }

    const { type, userInput, response: voiceResponse } = gemResult;

    switch (type) {
      case "get-date":
        return res.json({
          type,
          userInput,
          response: `Current date is ${moment().format("YYYY-MM-DD")}`,
        });
      case "get-time":
        return res.json({
          type,
          userInput,
          response: `Current time is ${moment().format("hh:mm A")}`,
        });
      case "get-day":
        return res.json({
          type,
          userInput,
          response: `Today is ${moment().format("dddd")}`,
        });
      case "get-month":
        return res.json({
          type,
          userInput,
          response: `Current month is ${moment().format("MMMM")}`,
        });
      case "google_search":
      case "youtube_search":
      case "youtube_play":
      case "general":
      case "calculator_open":
      case "instagram_open":
      case "facebook_open":
      case "weather_show":
        return res.json({
          type,
          userInput,
          response: voiceResponse || userInput,
        });

      default:
        return res.status(400).json({
          response: "I didn't understand that command.",
        });
    }
  } catch (error) {
    console.error("askToAssistant error:", error);
    res.status(500).json({ response: "Something went wrong on the server." });
  }
};
