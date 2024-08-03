import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_API_KEY);

export async function fetchStockNews(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  // const prompt = "Tell me three dates that shifted Apple stocks and why it shifted in the last 3 months";

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();

  return text.split('\n').filter(phrase => phrase.trim() !== ''); // Split by newline and filter out empty strings
}