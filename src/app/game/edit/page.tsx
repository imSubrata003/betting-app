'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { validateUser } from '@/utils/validateAdmin';

const EditGamePage = () => {
  const [games, setGames] = useState<any[]>([]);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editImage, setEditImage] = useState<string | File>('');
  const [loading, setLoading] = useState(false);
  const [gameStatus, setGameStatus] = useState("on");
    const router = useRouter();
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
    const getAllGames = async () => {
      try {
        const res = await axios.get('/api/admin/getAllGames');
        setGames(res.data);
      } catch (error) {
        toast.error('Failed to fetch games');
      }
    };
    getAllGames();
  }, []);

  const handleEditClick = (game: any) => {
    setSelectedGame(game);
    setEditName(game.name);
    setEditImage(game.image);
    setGameStatus(game.status ?? "on");
    setShowModal(true);
  };

  const handleUpdateGame = async () => {
    setLoading(true);

    try {
      let imageUrl = selectedGame.image;

      if (editImage && typeof editImage === 'object' && editImage instanceof window.File) {
        const formData = new FormData();
        formData.append('file', editImage);
        formData.append('upload_preset', 'Gambling-App');

        const cloudinaryRes = await axios.post(
          'https://api.cloudinary.com/v1_1/djrdw0sqz/image/upload',
          formData
        );

        imageUrl = cloudinaryRes.data.secure_url;
      }

      await axios.post('/api/admin/updateGame', {
        gameId: selectedGame.id,
        name: editName,
        image: imageUrl,
        status: gameStatus,
      });


      const updatedGames = games.map((game: any) =>
        game.id === selectedGame.id ? { ...game, name: editName, image: imageUrl, status: gameStatus } : game
      );

      setGames(updatedGames);
      setShowModal(false);
      toast.success('Game updated successfully!');
    } catch (err) {
      console.error('Failed to update game:', err);
      toast.error('Failed to update game.');
    } finally {
      setLoading(false);
    }
  };

  if (games.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">No games available</h1>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-2xl font-bold mb-6">Manage Games</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {games.map((game: any) => (
          <div
            key={game.id}
            className="relative bg-white rounded-2xl shadow-md p-5 flex flex-col items-center text-center transition hover:shadow-lg"
          >
            <img
              src={game.image}
              alt={game.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 mb-4"
            />
            <h2 className="text-lg font-semibold text-gray-800">{game.name}</h2>

            <button
              onClick={() => handleEditClick(game)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <MoreVertical />
            </button>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Edit Game</h2>

            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Game Name"
              className="w-full border border-gray-300 p-2 rounded mb-4"
            />

            <input
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setEditImage(e.target.files[0]);
                }
              }}
              className="w-full border border-gray-300 p-2 rounded mb-4"
            />

            <select
              value={gameStatus}
              onChange={(e) => setGameStatus(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded mb-4"
            >
              <option value="on">On</option>
              <option value="off">Off</option>
            </select>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                disabled={loading}
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateGame}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditGamePage;
