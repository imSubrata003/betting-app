'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'

const GameHistoryPage = () => {
  const [allGames, setAllGames] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getAllGames = async () => {
      try {
        const res = await axios.get(`/api/admin/getAllGames`)
        setAllGames(res.data)
      } catch (error) {
        console.error('Failed to fetch games:', error)
      } finally {
        setLoading(false)
      }
    }
    getAllGames()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Game History</h1>

      {loading ? (
        <div className="text-center text-gray-500">Loading games...</div>
      ) : allGames.length === 0 ? (
        <div className="text-center text-gray-500">No games found.</div>
      ) : (
        <ul className="space-y-4">
          {allGames.map((game, index) => (
            <li
              key={index}
              className="flex items-center bg-white rounded-lg shadow p-4 hover:shadow-md transition"
            >
              {game.image ? (
                <img
                  src={game.image}
                  alt={game.name || 'Game'}
                  className="w-16 h-16 rounded-full object-cover mr-4 border"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-4 border">
                  No Image
                </div>
              )}
              <div>
                <h2 className="text-lg font-medium text-gray-800">
                  {game.name || `Game #${index + 1}`}
                </h2>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default GameHistoryPage
