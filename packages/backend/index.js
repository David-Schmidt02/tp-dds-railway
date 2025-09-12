import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const port = 3000
app.use(express.json());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
      : true,
  }),
);

app.get('/healthCheck', (req, res) => {
  res.status(200).json({mensaje:'Todo marcha bien!'})
})

app.listen(port, () => {
  console.log(`Backend escuchando en puerto ${port}`)
})