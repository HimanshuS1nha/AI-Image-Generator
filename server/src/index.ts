import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { GoogleGenAI, Modality } from "@google/genai";
import { ZodError } from "zod";
import { config } from "dotenv";
config();

import { inputValidator } from "./validators/input-validator.js";

const app = new Hono();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.get("/", (c) => {
  return c.text("Hello from AI Image Generator!");
});

app.post("/api/generate", async (c) => {
  try {
    const data = await c.req.json();
    const { aspectRatio, prompt } = await inputValidator.parseAsync(data);

    const updatedPrompt = `${prompt}. The image should be in the aspect ratio ${aspectRatio}`;

    let base64Image = "";

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: updatedPrompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });
    if (response.candidates?.[0].content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;
          base64Image += imageData;
        }
      }
    } else {
      throw new Error("Unable to generate image");
    }

    return c.json({ image: `data:image/png;base64,${base64Image}` });
  } catch (error) {
    if (error instanceof ZodError) {
      c.status(422);
      return c.json({ error: error.issues[0].message });
    } else {
      c.status(500);
      return c.json({ error: "Some error occured. Please try again later" });
    }
  }
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
