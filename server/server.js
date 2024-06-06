const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

const publicPath = path.join(__dirname, "..", "public");
app.use(express.static(publicPath));
app.use(express.json());

const dataFilePath = path.join(__dirname, "data.json");

function readDataFile() {
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeDataFile(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
}

function generateUserId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

app.get("/users", (req, res) => {
  const users = readDataFile();
  res.json(users);
});

app.post("/users", (req, res) => {
  const newUser = { id: generateUserId(), ...req.body };
  const users = readDataFile();
  users.push(newUser);
  writeDataFile(users);
  res.json(newUser);
});

app.put("/users/:id", (req, res) => {
  const userId = req.params.id;
  const updatedUserData = req.body;
  const users = readDataFile();
  const updatedUsers = users.map((user) => {
    if (user.id === userId) {
      return { ...user, ...updatedUserData };
    }
    return user;
  });
  writeDataFile(updatedUsers);
  res.json(updatedUserData);
});

app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;
  const users = readDataFile();
  const updatedUsers = users.filter((user) => user.id !== userId);
  writeDataFile(updatedUsers);
  res.status(204).send();
});

app.get("*", (req, res) => {
  const page404Path = path.join(publicPath, "pages", "page404.html");
  res.status(404).sendFile(page404Path);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
