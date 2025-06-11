'use client'

import { useAppContext } from '@/components/context/Appcontext'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const GameIdPage = () => {
  const { id: gameId } = useParams()
  const { games, bajis, setBajis } = useAppContext()
  const router = useRouter()

  const [gameName, setGameName] = useState('')
  const [bajiName, setBajiName] = useState('')
  type Baji = {
    id: string
    name: string
    startTime: string
    endTime: string
    singleResult?: string
    pattiResult?: string
    singlePrizeMoney?: string
    jodiPrizeMoney?: string
    pattiPrizeMoney?: string
    gameId?: string
    // add other fields as needed
  }
  const [filteredBajis, setFilteredBajis] = useState<Baji[]>([])
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [singleResult, setSingleResult] = useState('')
  const [pattiResult, setPattiResult] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [singlePrice, setSinglePrice] = useState('')
  const [pattiPrice, setPattiPrice] = useState('')
  const [jodiPrice, setJodiPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingBajis, setLoadingBajis] = useState(true)
  const [editingBaji, setEditingBaji] = useState<any | null>(null)

  useEffect(() => {
    const selectedGame = games.find((game) => game.id === gameId)
    if (selectedGame) {
      setGameName(selectedGame.name)
    }
  }, [games, gameId])

  const getBajis = async () => {
    try {
      setLoadingBajis(true)
      const res = await axios.post(`/api/admin/getBaji`, { gameId })
      const filteredBajis = res.data.filter((baji: any) => baji.gameId === gameId)
      setFilteredBajis(filteredBajis)
      setBajis(filteredBajis)
    } catch (error) {
      toast.error('Failed to fetch Bajis')
    } finally {
      setLoadingBajis(false)
    }
  }

  useEffect(() => {
    getBajis()
  }, [gameId])

  const getCurrentDateString = () => {
    const currentDate = new Date();
    return currentDate.toISOString().split('T')[0]; // Gets only the YYYY-MM-DD part
  };
  const sortedBajis = [...filteredBajis].sort((a, b) => {
    const currentDate = getCurrentDateString();
    const aTime = new Date(`${currentDate}T${a.startTime}:00`);
    const bTime = new Date(`${currentDate}T${b.startTime}:00`);
    return aTime.getTime() - bTime.getTime();
  });


  const handleEditClick = (baji: any) => {
    setEditingBaji(baji)
    setBajiName(baji.name)
    setStartTime(baji.startTime)
    setEndTime(baji.endTime)
    setSingleResult(baji.singleResult || '')
    setPattiResult(baji.pattiResult || '')
    setSinglePrice(baji.singlePrice || '')
    setPattiPrice(baji.pattiPrice || '')
    setJodiPrice(baji.jodiPrice || '')
    setShowModal(true)
  }

  const handleEditSubmit = async () => {
    try {
      setLoading(true)
      await axios.post('/api/admin/updateBaji', {
        bajiId: editingBaji.id,
        name: bajiName,
        gameId,
        startTime,
        endTime,
        singlePrice,
        jodiPrice,
        pattiPrice,
      })
      toast.success('Baji updated successfully!')
      setShowModal(false)
      setEditingBaji(null)
      resetForm()
      getBajis()
    } catch (error) {
      toast.error('Failed to update Baji')
    } finally {
      setLoading(false)
    }
  }

  const handleAddSubmit = async () => {
    if (!bajiName || !startTime || !endTime || !singlePrice || !jodiPrice || !pattiPrice) {
      toast.error('All fields are required!')
      return
    }
    try {
      setLoading(true)
      await axios.post('/api/admin/addBaji', {
        bajiName,
        gameId,
        startTime,
        endTime,
        singlePrice,
        jodiPrice,
        pattiPrice,
      })
      toast.success('Baji added successfully!')
      setShowModal(false)
      resetForm()
      getBajis()
    } catch (error) {
      toast.error('Error adding Baji')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setBajiName('')
    setStartTime('')
    setEndTime('')
    setSingleResult('')
    setPattiResult('')
    setSinglePrice('')
    setJodiPrice('')
    setPattiPrice('')
  }

  const formatTimeWithAmPm = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':')
    const date = new Date()
    date.setHours(Number(hours))
    date.setMinutes(Number(minutes))
    return date.toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

const getStatus = (start: string, end: string): 'Running' | 'Closed' => {
  // Get current time in IST as a Date object
  const nowISTString = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const nowIST = new Date(nowISTString);

  const [startHours, startMinutes] = start.split(':').map(Number);
  const [endHours, endMinutes] = end.split(':').map(Number);

  const startDate = new Date(nowIST);
  startDate.setHours(startHours, startMinutes, 0, 0);

  const endDate = new Date(nowIST);
  endDate.setHours(endHours, endMinutes, 0, 0);

  // Handle overnight range (e.g. 23:30 - 01:00)
  if (endDate <= startDate) {
    endDate.setDate(endDate.getDate() + 1);
  }

  // Handle case where now is after midnight but range spans from previous day
  const prevStartDate = new Date(startDate);
  prevStartDate.setDate(startDate.getDate() - 1);
  const prevEndDate = new Date(endDate);
  prevEndDate.setDate(endDate.getDate() - 1);

  if (nowIST >= prevStartDate && nowIST <= prevEndDate) {
    return 'Running';
  }

  return nowIST >= startDate && nowIST <= endDate ? 'Running' : 'Closed';
};


  // console.log("status : ", getStatus("23:00", "23:59"))



  return (
    <div className="p-4 relative">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Game: {gameName || 'Loading...'}</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Add Baji
        </button>
      </div>

      <div className="space-y-2">
        {loadingBajis ? (
          <p className="text-gray-500">Loading bajis...</p>
        ) : bajis.length === 0 ? (
          <p className="text-gray-500">No bajis added...</p>
        ) : (
          sortedBajis.map((baji: any, index: number) => {
            const status = getStatus(baji.startTime, baji.endTime)

            return (
              <div
                key={index}
                className="border p-8 rounded shadow-sm text-black bg-white flex justify-between items-start"
              >
                <div
                  onClick={() => router.push(`/baji/${baji.id}`)}
                  className="cursor-pointer flex justify-between items-start w-full  px-3 "
                >
                  <h2 className="font-semibold">{baji.name}</h2>
                  <p className="text-sm text-gray-600">
                    Start: {formatTimeWithAmPm(baji.startTime)} | End: {formatTimeWithAmPm(baji.endTime)}
                  </p>
                  <p className={`text-sm font-medium ${status === 'Running' ? 'text-green-500' : 'text-red-500'} mr-5`}>
                    {status}
                  </p>
                </div>
                <button
                  onClick={() => handleEditClick(baji)}
                  className="cursor-pointer text-xl font-bold text-gray-500 hover:text-black"
                >
                  ⋯
                </button>
              </div>
            )
          })
        )}
      </div>

      {/* Combined Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white text-black p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {editingBaji ? 'Edit Baji' : 'Add New Baji'}
            </h2>

            <input
              className="border p-2 w-full mb-3"
              type="text"
              placeholder="Baji Name"
              value={bajiName}
              onChange={(e) => setBajiName(e.target.value)}
            />
            <input
              className="border p-2 w-full mb-3"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <input
              className="border p-2 w-full mb-3"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
            <input
              className="border p-2 w-full mb-3"
              type="text"
              placeholder="Single Prize Money"
              value={singlePrice}
              onChange={(e) => setSinglePrice(e.target.value)}
            />
            <input
              className="border p-2 w-full mb-3"
              type="text"
              placeholder="Patti Prize Money"
              value={pattiPrice}
              onChange={(e) => setPattiPrice(e.target.value)}
            />
            <input
              className="border p-2 w-full mb-3"
              type="text"
              placeholder="Jodi Prize Money"
              value={jodiPrice}
              onChange={(e) => setJodiPrice(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowModal(false)
                  setEditingBaji(null)
                  resetForm()
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={editingBaji ? handleEditSubmit : handleAddSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={loading}
              >
                {loading
                  ? editingBaji
                    ? 'Updating...'
                    : 'Saving...'
                  : editingBaji
                    ? 'Update'
                    : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameIdPage
function setJodiPrizeMoney(arg0: any) {
  throw new Error('Function not implemented.')
}

