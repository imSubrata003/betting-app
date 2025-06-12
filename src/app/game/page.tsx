'use client'

import { useAppContext } from '@/components/context/Appcontext'
import { validateUser } from '@/utils/validateAdmin'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const GamePage = () => {
  const router = useRouter()
  const [localGame, setLocalGame] = useState<{ name: string; image?: string; id: string }[]>([])
  const [showModal, setShowModal] = useState(false)
  const [gameName, setGameName] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [modalLoading, setModalLoading] = useState(false)
  const [gamesLoading, setGamesLoading] = useState(true)
  const { games, setGames } = useAppContext()
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


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const uploadImageToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await axios.post('/api/admin/uploadGameBanner', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const data = res.data
      if (res.status !== 200) throw new Error(data.error || 'Upload failed')

      return data.url
    } catch (err) {
      console.error('Image upload error:', err)
      toast.error('Image upload failed.')
      return null
    }
  }

  const addGames = async () => {
    if (!selectedImage || !gameName.trim()) {
      toast.error('Game name or image is missing!')
      return
    }

    setModalLoading(true)

    const image = await uploadImageToCloudinary(selectedImage)
    if (!image) {
      setModalLoading(false)
      return
    }

    try {
      const res = await axios.post('/api/admin/createGame', {
        name: gameName,
        image: image,
      })

      setGames(prev => [...prev, { name: gameName, image, id: res.data.id }])
      toast.success('Game added successfully!')

      setGameName('')
      setSelectedImage(null)
      setImagePreview('')
      setShowModal(false)

      window.location.reload()
    } catch (error) {
      console.error('Error creating game:', error)
      toast.error('Failed to add game.')
    } finally {
      setModalLoading(false)
    }
  }

  useEffect(() => {
    const getGames = async () => {
      setGamesLoading(true)
      try {
        const res = await axios.get('/api/admin/getAllGames')
        setGames(res.data)
      } catch (error) {
        toast.error('Failed to fetch games.')
        console.error(error)
      } finally {
        setGamesLoading(false)
      }
    }
    getGames()
  }, [])

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Game List</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition duration-300"
        >
          Add Game
        </button>
      </div>

      {gamesLoading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
        </div>
      ) : (
        <ul className="space-y-4">
          {games.length > 0 ? (
            games.map((game, index) => (
              <li
                key={index}
                onClick={() => router.push(`/game/${game.id}`)}
                className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg cursor-pointer transition transform hover:scale-105"
              >
                {game.image && (
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-16 h-16 object-cover rounded-full border-2 border-blue-500"
                  />
                )}
                <span className="text-lg">{game.name}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-400">No games added yet</li>
          )}
        </ul>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition duration-300">
          <div className="bg-white text-black rounded-xl p-8 w-full max-w-md transform transition duration-500 scale-110">
            <h2 className="text-2xl font-bold mb-4">Add Game</h2>
            <input
              autoFocus
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="Game name"
              className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mb-4"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="w-full h-auto rounded-lg mb-4" />
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowModal(false)
                  setGameName('')
                  setImagePreview('')
                  setSelectedImage(null)
                }}
                className="bg-gray-300 text-black px-6 py-2 rounded-lg transition duration-300 hover:bg-gray-400"
                disabled={modalLoading}
              >
                Cancel
              </button>
              <button
                onClick={addGames}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center transition duration-300"
                disabled={modalLoading}
              >
                {modalLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                    </svg>
                    Adding...
                  </>
                ) : (
                  'Add'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GamePage
