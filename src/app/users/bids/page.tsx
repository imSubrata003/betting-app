'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import { DataTable } from '@/components/DataTable'
import { Loader2, X } from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { validateUser } from '@/utils/validateAdmin'

type Bet = {
  id: string
  amount: number
  createdAt: string
  status: 'WIN' | 'LOSE' | 'PENDING'
  game: string
  bajiName: string
  winAmount: string
}

type User = {
  id: string
  name: string
  [key: string]: any
}

const Page = () => {
  const searchParams = useSearchParams()
  const userId = searchParams.get('id')

  const [todayBets, setTodayBets] = useState<Bet[]>([])
  const [oldBets, setOldBets] = useState<Bet[]>([])
  const [loadingToday, setLoadingToday] = useState(false)
  const [loadingOld, setLoadingOld] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
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
    if (!userId) return

    const fetchData = async () => {
      setInitialLoading(true)
      try {
        const [userRes, betRes] = await Promise.all([
          axios.get(`/api/admin/getAllUsers`),
          axios.post(`/api/admin/getUserBet`, { userId }),
        ])


        const user = userRes.data.find((user: any) => user.id === userId)
        setSelectedUser(user ?? null)

        const rawBets = betRes.data.userBets

        const formattedBets: Bet[] = rawBets.map((bet: any) => ({
          id: bet.id,
          amount: bet.amount,
          number: bet.number,
          createdAt: bet.createdAt,
          status: (bet.status?.toUpperCase() ?? 'PENDING') as Bet['status'],
          game: bet.Baji?.game?.name || 'Unknown Game',
          bajiName: bet.Baji?.name || 'Unknown Baji',
          winAmount: bet.winAmount
        }))

        const today = new Date().toDateString()

        const todayBets = formattedBets.filter(
          (bet) => new Date(bet.createdAt).toDateString() === today
        )
        const oldBets = formattedBets.filter(
          (bet) => new Date(bet.createdAt).toDateString() !== today
        )

        setTodayBets(todayBets)
        setOldBets(oldBets)

      } catch (err) {
        console.error('Error loading data:', err)
      } finally {
        setInitialLoading(false)
      }
    }

    fetchData()
  }, [userId])

  const deleteBets = async (betId: string) => {
    setDeletingId(betId)
    try {
      await axios.post(`/api/admin/deleteUserBet`, { id: betId })
      setTodayBets((prevBets) => prevBets.filter((bet) => bet.id !== betId))
      setOldBets((prevBets) => prevBets.filter((bet) => bet.id !== betId))
      toast.success('Bet deleted successfully!')
    } catch (err) {
      console.error('Error deleting bet:', err)
      toast.error('Failed to delete bet.')
    } finally {
      setDeletingId(null)
    }
  }

  const hasWinningBets = todayBets.some(
    bet =>
      bet.status === 'WIN' ||
      (bet.status === 'LOSE' && Number(bet.winAmount) > 0)
  )


  const columns = [
    { header: 'Game', accessor: (row: Bet) => row.game },
    { header: 'Baji Name', accessor: (row: Bet) => row.bajiName },
    { header: 'Number', accessor: (row: Bet) => (row as any).number }, // number is not in Bet type, but used in mapping
    { header: 'Amount', accessor: (row: Bet) => row.amount },
    {
      header: 'Status',
      accessor: (row: Bet) => (
        <span
          className={
            row.status === 'WIN'
              ? 'text-green-600 font-bold'
              : row.status === 'LOSE'
                ? 'text-red-600 font-bold'
                : 'text-yellow-600 font-bold'
          }
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Date',
      accessor: (row: Bet) =>
        new Date(row.createdAt).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
    {
      header: hasWinningBets ? 'Win Amount' : 'Actions',
      accessor: (row: Bet) => {
        if (row.status === 'WIN') {
          return (
            <span className="text-green-700 font-bold">
              ₹{row.winAmount ? Number(row.winAmount).toFixed(2) : '0.00'}
            </span>
          );
        } else if (row.status === 'PENDING') {
          return (
            <div className="flex gap-2">
              <button
                onClick={() => deleteBets(row.id)}
                className="flex items-center gap-1 px-2 py-1 border text-sm rounded text-red-600 border-red-600 hover:bg-red-100"
                disabled={deletingId === row.id}
              >
                {deletingId === row.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <X className="w-4 h-4" />
                )}
                Delete
              </button>
            </div>
          );
        } else {
          return null;
        }
      },
    },
  ]


  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500 mr-2" />
        <span className="text-gray-600 text-lg">Loading user data...</span>
      </div>
    )
  }

  return (
    <div className="p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl font-bold mb-4">
        User Bids for {selectedUser?.name ?? ''}
      </h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Today's Bets</h2>
        <DataTable
          data={todayBets}
          columns={columns}
          loading={loadingToday}
          emptyMessage="No bets placed today."
        />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Older Bet History</h2>
        <DataTable
          data={oldBets}
          columns={columns}
          loading={loadingOld}
          emptyMessage="No older bets found."
        />
      </section>
    </div>
  )
}

export default Page
