import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import FormData from "form-data";
import axios from "axios";
import fs from "fs";

dotenv.config();

const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.get("/", (req, res) => {
  res.send("Hello, This is server of datisekai");
});

app.get("/remove", async (req: Request, res: Response) => {
  const { url, size = "auto" } = req.query;
  if (!url) {
    return res.status(404).json("Missing url");
  }
  const formData = new FormData();
  formData.append("size", size);
  formData.append("image_url", url);

  try {
    const result = await axios({
      method: "post",
      url: "https://api.remove.bg/v1.0/removebg",
      data: formData,
      responseType: "arraybuffer",
      headers: {
        ...formData.getHeaders(),
        "X-Api-Key": "j1LdSphMAw7PCunLF7u4aHmz",
      },
    });

    const base64String = btoa(
      String.fromCharCode(...new Uint8Array(result.data))
    );
    return res.json({ url: `data:image/png;base64,${base64String}` });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server");
  }
});

const PORT = process.env.PORT || 5801;

app.listen(PORT, () => {
  console.log("Server running....");
});
