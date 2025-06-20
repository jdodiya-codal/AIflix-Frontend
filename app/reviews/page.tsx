"use client";

import { useState } from "react";
import axios from "axios";

export default function ReviewsPage() {
  const [title, setTitle] = useState("");
  const [reviews, setReviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFetchReviews = async () => {
    if (!title.trim()) return;

    setLoading(true);
    setReviews([]);

    try {
      const res = await axios.post(
        "https://ai-flix-lfgy.onrender.com/api/movie-reviews/",
        {
          title,
        }
      );

      const parsed = res.data.reviews
        .split(/\n+/)
        .filter((line) => line.trim().length > 3);

      setReviews(parsed);
    } catch (err) {
      console.error(err);
      setReviews(["Could not fetch reviews. Try again later."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <h1 className="text-4xl font-bold mb-6 text-center">🍿 Movie Reviews</h1>

      <div className="max-w-xl mx-auto">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a movie name..."
          className="w-full px-4 py-3 rounded-md text-white mb-4"
        />
        <button
          onClick={handleFetchReviews}
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-md text-white w-full"
        >
          {loading ? "Fetching Reviews..." : "Get Reviews"}
        </button>
      </div>

      {reviews.length > 0 && (
        <div className="mt-8 max-w-2xl mx-auto bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">
            What people are saying:
          </h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            {reviews.map((rev, idx) => (
              <li key={idx}>{rev}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
