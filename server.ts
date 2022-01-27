import { Client } from "pg";
import { config } from "dotenv";
import express from "express";
import cors from "cors";

config();

const herokuSSLSetting = { rejectUnauthorized: false };
const sslSetting = process.env.LOCAL ? false : herokuSSLSetting;
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: sslSetting,
};

const app = express();

app.use(express.json());
app.use(cors());

const client = new Client(dbConfig);
client.connect();

//GET requests

app.get("/users", async (req, res) => {
  const dbres = await client.query("select * from users");
  res.json(dbres.rows);
});

app.get("/scores", async (req, res) => {
  const dbres = await client.query(
    "SELECT max(scores.score) as highscore, users.name, scores.category FROM scores JOIN users ON scores.user_id = users.user_id GROUP BY users.name, scores.category ORDER BY highscore desc, scores.category;"
  );
  res.json(dbres.rows);
});

//POST requests

app.post("/users/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const dbres = await client.query("insert into users (name) values ($1)", [
      username,
    ]);
    res.status(201).json({
      status: "success",
      data: dbres.rows[0],
    });
  } catch (err) {
    res.status(400).json({ status: "failed", error: err });
  }
});

app.post("/scores", async (req, res) => {
  const { score, user_id, category } = req.body;
  try {
    const dbres = await client.query(
      "insert into scores (score, user_id, category) values ($1, $2, $3)",
      [score, user_id, category]
    );
    res.status(201).json({
      status: "success",
      data: dbres.rows[0],
    });
  } catch (err) {
    res.status(400).json({ status: "failed", error: err });
  }
});

//Start the server on the given port
const port = process.env.PORT;
if (!port) {
  throw "Missing PORT environment variable.  Set it in .env file.";
}
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
