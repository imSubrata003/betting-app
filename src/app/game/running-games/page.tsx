"use client";

import { useAppContext } from "@/components/context/Appcontext";
import { getGamesWithStatus } from "@/components/RunningGames";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { validateUser } from "@/utils/validateAdmin";

const RunningGames = () => {
  const router = useRouter();
  const [RunningGames, setRunningGames] = useState<
    { name: string; image?: string; id: string; status: "Running" | "Closed" }[]
  >([]);
  const [imageLoaded, setImageLoaded] = useState<{ [key: string]: boolean }>(
    {}
  );
  const { setGames } = useAppContext();
  const [loading, setLoading] = useState(true);
    // const router = useRouter();
    useEffect(() => {
        const adminCheck = async () => {
            const data = await validateUser();
            // console.log('data', data);
            if (data) {
                return data
            } else {
                localStorage.removeItem("userData");
                router.push('/');
            }
        }

        adminCheck();
    }, []);

  useEffect(() => {
    const getGames = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/admin/getAllGames");
        setGames(res.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    getGames();
  }, [setGames]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getGamesWithStatus();
        setRunningGames(
          data
            .filter((game) => game.status === "Running")
            .map((game) => ({
              id: (game as any).id ?? "",
              name: game.name,
              image: (game as any).image,
              status: game.status,
            }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      {RunningGames.length > 0 ? (
        <ul className="space-y-4">
          {RunningGames.map((game, index) => (
            <li
              key={index}
              onClick={() => router.push(`/game/${game.id}`)}
              className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg cursor-pointer transition transform hover:scale-105"
            >
              <div className="w-16 h-16 relative">
                {!imageLoaded[game.id] && (
                  <div className="w-16 h-16 rounded-full border-4 border-t-4 border-gray-700 border-t-blue-500 animate-spin" />
                )}
                {game.image && (
                  <img
                    src={game.image}
                    alt={game.name}
                    className={`w-16 h-16 object-cover rounded-full border-2 border-blue-500 absolute top-0 left-0 transition-opacity duration-300 ${
                      imageLoaded[game.id] ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() =>
                      setImageLoaded((prev) => ({ ...prev, [game.id]: true }))
                    }
                  />
                )}
              </div>
              <span className="text-lg">{game.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex items-center justify-center h-full mt-64">
          <h1 className="text-2xl">No running games</h1> 
        </div>
      )}
    </div>
  );
};

export default RunningGames;
