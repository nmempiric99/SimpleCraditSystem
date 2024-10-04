const User = require("../models/users");
const dotenv = require("dotenv");
dotenv.config();

// credit plan
const creditPlans = {
  basic: { credits: 100, price: 10 },
  standard: { credits: 250, price: 20 },
  premium: { credits: 500, price: 30 },
};

//register user
const registerUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const newUser = new User({
      email: email,
      password: password,
      createdAt: new Date(),
    });

    await newUser.save();
    return res.status(200).json({ message: "User Registered successfully" });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "User not Registered", error: e.message });
  }
};

//create free API
const createFreeAPI = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not Registered" });
    }
    //add APIInfo into apiKey array
    const APIData = {
      email: email,
      userId: user._id,
      createdAt: new Date(),
    };
    user.apiKeyInfo.push(APIData);
    await user.save();
    res.status(200).json({ message: "API created successfully" });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Error to create an Free API", error: e.message });
  }
};

// Key info
const apiKeyInfo = async (req, res) => {
  const { _id } = req.params;
  const apiKey = req.header("x-api-key");
  if (!apiKey) {
    return res.status(401).json({ error: "API key is missing" });
  }
  try {
    //find user
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "User not registered" });
    }
    const validUserApiKey = user.apiKeyInfo.find(
      (key) => key.apiKey === apiKey
    );
    // console.log("validUserApiKey-----", validUserApiKey);
    if (!validUserApiKey) {
      return res.status(401).json({ error: "Invalid API key" });
    }
    res.send(validUserApiKey);
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Error to getting apiKey Info", error: e.message });
  }
};

// purchase Credit limit
const purchaseCredit = async (req, res) => {
  const { _id } = req.params;
  const { planName } = req.body;
  
  try {
    const plan = creditPlans[planName];

    if (!plan) {
      return res.status(400).json({ message: "Invalid plan name" });
    }
    //find user
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "User not registered" });
    }

    //add APIInfo into apiKey array
    const APIData = {
      email: user.email,
      userId: user._id,
      createdAt: new Date(),
      credits_left : plan.credits,
    };
    user.apiKeyInfo.push(APIData);

    await user.save();
    return res
      .status(200)
      .json({ message: "User Purchase credits successfully" });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Error in purchase credit limit", error: e.message });
  }
};

// API to use credit limit
const useLimit = async (req, res) => {
  const { _id } = req.params;
  const apiKey = req.header("x-api-key");
  if (!apiKey) {
    return res.status(401).json({ error: "API key is missing" });
  }
  try {
    const user = await User.findById({ _id });
    if (!user) {
      return res.status(404).json({ message: "User not Registered" });
    }
    const validUserApiKey = user.apiKeyInfo.find(
        (key) => key.apiKey === apiKey
      );
      // console.log("validUserApiKey-----", validUserApiKey);
      if (!validUserApiKey) {
        return res.status(401).json({ error: "Invalid API key" });
      }
    const now = new Date();
    console.log("now date -----------", now);
    console.log("reset date------------", validUserApiKey.resetDate);
    if (now > validUserApiKey.resetDate) {
        console.log("inside if----------")
        validUserApiKey.credits = 50;
        validUserApiKey.credits_left = 50;
        validUserApiKey.credits_used = 0;
        validUserApiKey.resetDate = new Date(now.getTime() + 1 * 60 * 1000);
      await user.save();
    }
    if (validUserApiKey.credits_left >= process.env.USELIMIT_API_CREDIT_USE) {
        validUserApiKey.credits_left -= process.env.USELIMIT_API_CREDIT_USE;
        validUserApiKey.credits_used += process.env.USELIMIT_API_CREDIT_USE;

      await user.save();
      return res
        .status(200)
        .json({ message: "UseLimit API call successfully" });
    } else {
      return res.status(429).json({
        message: "You've exceeded your API Key's rate limit.",
        timeStamp: new Date(),
        resetDate: validUserApiKey.resetDate,
        credits : validUserApiKey.credits_left
      });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Error to call useLimit API", error: e.message });
  }
};

module.exports = {
  registerUser,
  createFreeAPI,
  apiKeyInfo,
  purchaseCredit,
  useLimit,
};
