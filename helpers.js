// Rate Limiting
const requestCounts = new Map();

const rateLimitMiddleware = (req, res, next) => {
  const clientIP = req.ip;

  const maxRequestsPerWindow = 5;
  const windowMs = 60000;

  if (!requestCounts.has(clientIP)) {
    requestCounts.set(clientIP, []);
  }

  const requestsInWindow = requestCounts.get(clientIP).filter((timestamp) => {
    return Date.now() - timestamp < windowMs;
  });

  if (requestsInWindow.length >= maxRequestsPerWindow) {
    return res.status(429).json({
      status: "error",
      message: "Rate limit exceeded. Please try again later.",
    });
  }

  requestCounts.get(clientIP).push(Date.now());

  next();
};

// Validate Input For POST requests
const validateName = (name, res) => {
  if (!name) {
    return false;
  }
  return true;
};

const validateEmail = (email, res) => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
};

const validatePassword = (password, res) => {
  const passwordPattern = /^.{8,}$/;
  return passwordPattern.test(password);
};

const validateAge = (age, res) => {
  if (!age || typeof age !== "number") {
    return false;
  }
  return true;
};

const validateUser = (req, res, next) => {
  const { name, email, password, age } = req.body;

  if (!validateName(name, res)) {
    res.status(400).json({
      status: "error",
      message: "Invalid name provided",
    });
  } else if (!validateEmail(email, res)) {
    res.status(400).json({
      status: "error",
      message: "Invalid email provided",
    });
  } else if (!validatePassword(password, res)) {
    res.status(400).json({
      status: "error",
      message: "Invalid password provided",
    });
  } else if (!validateAge(age, res)) {
    res.status(400).json({
      status: "error",
      message: "Invalid age provided",
    });
  } else {
    next();
  }
};

module.exports = { validateUser, rateLimitMiddleware };
