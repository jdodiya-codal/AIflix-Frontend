"use client";

import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const suggestions = [
  "Suggest a top-rated action movie",
  "Tell me a scary horror film",
  "What are some AI-themed movies?",
  "Recommend a feel-good comedy",
  "Best movies of 2023 so far",
];
interface MovieData {
  title: string;
  poster: string;
  release_date: number;
  rating: number;
  trailer_url?: string;
}

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [model, setModel] = useState("mistralai/mistral-7b-instruct:free");

  const handleAskAI = async (q?: string) => {
    const userQuestion = q || question;
    if (!userQuestion) return;

    setLoading(true);
    setAnswer("");
    setMovies([]);
    try {
      const res = await axios.post(
        "https://ai-flix-lfgy.onrender.com/api/ask-ai/",
        {
          question: userQuestion,
          model: model, // send selected model
        }
      );
      setAnswer(res.data.answer);
      setMovies(res.data.movie_data || []);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setAnswer("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-sm shadow-sm flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-bold">🎬 AIFlix</h1>
        <button
          className="hidden md:inline bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition"
          onClick={() =>
            document
              .getElementById("ask-section")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Ask AI
        </button>
        <div className="space-x-4">
          <a href="#" className="hover:text-red-400">
            Movies
          </a>
          <a href="#" className="hover:text-red-400">
            Reviews
          </a>
          <a href="#" className="hover:text-red-400">
            Contact
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="ask-section"
        className="flex flex-col items-center justify-center px-4 py-24 text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ask AI About Movies 🍿
        </h2>
        <p className="text-gray-400 max-w-xl mb-8">
          This free tool runs on limited servers. For best results, ask short
          and focused questions like: “Suggest two top comedy movies.”
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full max-w-2xl">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything about movies..."
            className="flex-1 px-4 py-3 rounded-md text-white"
          />
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="px-3 py-2 rounded-md text-white"
          >
            <option value="mistralai/mistral-7b-instruct:free">
              Mistral 7B (Free)
            </option>
            <option value="openchat/openchat-3.5">OpenChat 3.5</option>
            <option value="anthropic/claude-3-sonnet">Claude 3 Sonnet</option>
            <option value="gryphe/mythomax-l2-13b">MythoMax L2</option>
            <option value="meta-llama/llama-4-maverick:free">
              LLaMA 4 Maverick
            </option>
            <option value="deepseek/deepseek-r1:free">DeepSeek R1</option>
            <option value="deepseek/deepseek-v3-0324:free">DeepSeek V3</option>
            <option value="google/gemma-7b-it">Gemma 7B</option>
            <option value="nvidia/llama-3.1-nemotron-nano-8b-v1:free">
              Nemotron 8B
            </option>
            <option value="mistralai/mistral-small-3.1-24b-instruct:free">
              Mistral Small 24B
            </option>
          </select>
          <button
            onClick={() => handleAskAI()}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-md text-white"
          >
            {loading ? "Thinking..." : "Ask AI"}
          </button>
        </div>

        {/* Suggestions */}
        <div className="text-sm text-gray-300 mb-6">
          <p className="mb-2">Try one of these:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleAskAI(sug)}
                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full text-xs"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Response */}
        {answer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900 p-6 rounded-md max-w-2xl text-left border border-gray-700"
          >
            <h3 className="text-lg font-semibold mb-2">🎯 AI Suggestion</h3>
            <p className="whitespace-pre-wrap text-gray-200 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
        {/* Movie Cards */}
        {movies.length > 0 && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6 max-w-6xl w-full">
            {movies.map((movie, idx) => (
              <div
                key={idx}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-md"
              >
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-72 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-lg font-semibold mb-1">{movie.title}</h4>
                  <p className="text-sm text-gray-400 mb-2">
                    {movie.release_date} • ⭐ {movie.rating}
                  </p>
                  {movie.trailer_url && (
                    <a
                      href={movie.trailer_url}
                      target="_blank"
                      className="inline-block text-red-400 hover:underline text-sm"
                      rel="noopener noreferrer"
                    >
                      Watch Trailer
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
