const express = require("express");
const { validateUser } = require("./helpers.js");
const app = express();
const port = 3000;
const users = [];

app.use(express.json());

app.post("/users", validateUser, (req, res) => {
  const newUser = req.body;
  if (!newUser) {
    return res.status(400).json({
      status: "error",
      message: "No user provided",
    });
  }
  users.push(newUser);

  console.log("Created user:", newUser);

  res.status(201).json({
    status: "success",
    message: "User created successfully",
    data: newUser,
  });
});

app.get("/users", (req, res) => {
  if (users.length < 1) {
    res.status(200).json({ status: "success", message: "No users found" });
  } else {
    res.json(users);
  }
});

app.get("/users/:userId", (req, res) => {
  const userId = req.params.userId;
  const user = users.find((user) => user.id === userId);
  if (!user) {
    res.status(404).json({ message: "user not found" });
  } else {
    res.json(user);
  }
});

app.put("/users/:userId", (req, res) => {
  const userId = req.params.userId;
  const updatedUser = req.body;
  const index = users.findIndex((user) => user.id === userId);
  if (index === -1) {
    res.status(404).json({ message: "user not found" });
  } else {
    users[index] = updatedUser;
    res.json(updatedUser);
  }
});

app.patch("/users/:userId", (req, res) => {
  const userId = req.params.userId;
  const updatedUser = req.body;
  const index = users.findIndex((user) => user.id === userId);
  if (index === -1) {
    res.status(404).json({ message: "user not found" });
  } else {
    users[index] = updatedUser;
    res.json(updatedUser);
  }
});

app.delete("/users/:userId", (req, res) => {
  const userId = req.params.userId;
  const index = users.findIndex((user) => user.id === userId);
  if (index === -1) {
    res.status(404).json({ message: "user not found" });
  } else {
    users.splice(index, 1);
    res.status(204).end(); // No content in the response
  }
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
