// app/movies/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Movie {
  title: string;
  poster: string;
  release_year: number;
  rating: number;
  trailer_url?: string;
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(
          "https://ai-flix-lfgy.onrender.com/api/movies/"
        );
        setMovies(res.data);
      } catch (err) {
        console.error("Failed to load movies", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <h1 className="text-4xl font-bold mb-6 text-center">🎬 Browse Movies</h1>

      {loading ? (
        <p className="text-center text-gray-400">Loading movies...</p>
      ) : movies.length === 0 ? (
        <p className="text-center text-gray-400">No movies found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-72 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{movie.title}</h3>
                <p className="text-sm text-gray-400 mb-2">
                  {movie.release_year} • ⭐ {movie.rating}
                </p>
                {movie.trailer_url && (
                  <a
                    href={movie.trailer_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-400 hover:underline text-sm"
                  >
                    Watch Trailer
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
