const asyncHandler = require("express-async-handler");
const axios = require("axios");
const ContentHistory = require("../models/ContentHistory");
const User = require("../models/User");

// Generate content
const openAIController = asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  //generate content based on prompt
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "gpt-3.5-turbo-instruct",
        prompt,
        max_tokens: 5,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const content = response?.data?.choices[0].text.trim();
    //store the history
    const newContent = await ContentHistory.create({
      username: req?.user?.id,
      content,
    });
    const userFound = await User.findById(req?.user?.id);
    userFound.contentHistory.push(newContent?._id);
    //update the user's api request count
    userFound.apiRequestCount = userFound.apiRequestCount + 1;
    await userFound.save();
    //send the response to the client
    res.status(200).json(content);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { openAIController };
