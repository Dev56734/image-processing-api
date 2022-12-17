import express from "express";
import router from "./routes";

const app = express();
const port = 3000;

app.use("/", router);

app.get("/", async (req, res) => {
  res.send("Image processing api project");
});

app.listen(port, () => {
  console.log(`server started on http://localhost:${port}`);
});

export default app;
