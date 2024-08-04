import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY!);

export async function fetchStockNews(ticker: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `Tell me three dates that shifted ${ticker} stocks and why it shifted in the last 3 months`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text()
  return text.split('\n').filter(phrase => phrase.trim() !== ''); // Split by newline and filter out empty strings
}