'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import { validateUser } from '@/utils/validateAdmin'

interface Bet {
  id: string
  amount: number
  number: string
  betType: string
  bajiId: string
  createdAt: string
  user: {
    id: string
    name: string
    phone: string
  }
}

const BidsHistoryPage = () => {
  const [bets, setBets] = useState<Bet[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
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
    const getAllBets = async () => {
      try {
        const res = await axios.get('/api/admin/getAllBets')
        setBets(res.data)
      } catch (error) {
        console.error('Failed to fetch bets:', error)
      } finally {
        setLoading(false)
      }
    }

    getAllBets()
  }, [])

  // Filter bets based on the search query
  const filteredBets = bets.filter(
    (bet) =>
      bet.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bet.user.phone.includes(searchQuery) ||
      bet.betType.toUpperCase().includes(searchQuery.toUpperCase())
  )

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">User Bets History</h1>
        <input
          type="text"
          placeholder="Search by name or phone"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-64"
        />
      </div>


      {loading ? (
        <div className="flex justify-center items-center text-gray-500">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-600"></div>
        </div>
      ) : filteredBets.length === 0 ? (
        <div className="text-center text-gray-500">No bets found.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-pink-600 text-white text-sm">
              <tr>
                <th className="px-4 py-3 text-left border-b">User</th>
                <th className="px-4 py-3 text-left border-b">Phone</th>
                <th className="px-4 py-3 text-left border-b">Bet Type</th>
                <th className="px-4 py-3 text-left border-b">Number</th>
                <th className="px-4 py-3 text-left border-b">Amount</th>
                <th className="px-4 py-3 text-left border-b">Placed At</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {filteredBets.map((bet) => (
                <tr key={bet.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b">{bet.user.name}</td>
                  <td className="px-4 py-3 border-b">{bet.user.phone}</td>
                  <td className="px-4 py-3 border-b">{bet.betType}</td>
                  <td className="px-4 py-3 border-b">{bet.number}</td>
                  <td className="px-4 py-3 border-b text-green-600 font-semibold">₹{bet.amount}</td>
                  <td className="px-4 py-3 border-b text-gray-500">
                    {moment(bet.createdAt).format('DD MMM YYYY, hh:mm A')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default BidsHistoryPage
