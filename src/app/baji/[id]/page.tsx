'use client'

import { useAppContext } from '@/components/context/Appcontext'
import { validateUser } from '@/utils/validateAdmin'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState, useCallback } from 'react'
import { toast, ToastContainer } from 'react-toastify'


const GameResultPage = () => {
    const [singleWinValue, setSingleWinValue] = useState('')
    const [pattiWinValue, setPattiWinValue] = useState('')
    const [processed, setProcessed] = useState(false)

    const [singleData, setSingleData] = useState([])
    const [pattiData, setPattiData] = useState([])
    const [jodiData, setJodiData] = useState([])
    const [loading, setLoading] = useState(false)
    const [dataLoading, setDataLoading] = useState(true)
    const [rewardSend, setRewardSend] = useState(false)

    const [buttonLoading, setButtonLoading] = useState({
        update: false,
        wrong: false,
        reward: false,
    })

    const { id: bajiId } = useParams()
    const { bajis } = useAppContext()
    const matchedBaji = bajis.find(baji => baji.id === bajiId)

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


    const fetchInitialData = useCallback(async () => {
        if (!matchedBaji) return

        setDataLoading(true)
        try {
            const [resultRes, analyticsRes] = await Promise.all([
                axios.post('/api/admin/getBajiResult', {
                    bajiId: matchedBaji.id,
                    gameId: matchedBaji.gameId,
                }),
                axios.post('/api/admin/getBetAnalytics', {
                    bajiId: matchedBaji.id,
                }),
            ])

            const resultData = resultRes.data[0] || {}
            setSingleWinValue(resultData.singleResult || '')
            setPattiWinValue(resultData.pattiResult || '')
            setRewardSend(resultData.rewardSent)

            const analyticsData = analyticsRes.data.data
            setSingleData(analyticsData.SINGLE?.bets || [])
            setPattiData(analyticsData.PATTI?.bets || [])
            setJodiData(analyticsData.JODI?.bets || [])
        } catch (err) {
            console.error('Error fetching data:', err)
            toast.error('Failed to load data.')
        } finally {
            setDataLoading(false)
        }
    }, [matchedBaji])

    useEffect(() => {
        if (matchedBaji) {
            fetchInitialData()
        }
    }, [fetchInitialData, matchedBaji])

    const handleEditResult = async () => {
        if (!matchedBaji) return

        setButtonLoading(prev => ({ ...prev, update: true }))
        try {
            await axios.post('/api/admin/updateBajiResult', {
                singleResult: singleWinValue,
                pattiResult: pattiWinValue,
                bajiId: matchedBaji.id,
                gameId: matchedBaji.gameId,
            })

            toast.success('Result Processed Successfully!')
            setProcessed(true)
        } catch (error) {
            console.error('Error updating result:', error)
            toast.error('Failed to process result.')
        } finally {
            setButtonLoading(prev => ({ ...prev, update: false }))
        }
    }

    const wrongResultHandler = async () => {
        setButtonLoading(prev => ({ ...prev, wrong: true }))
        try {
            await axios.post('/api/admin/wrongAnswer', { bajiId })
            toast.success('Reward reverted successfully!')
            setRewardSend(false)
        } catch (error) {
            console.error('Error reverting reward:', error)
            toast.error('Failed to revert reward.')
        } finally {
            setButtonLoading(prev => ({ ...prev, wrong: false }))
        }
    }

    const rewardWinnerHandler = async () => {
        setButtonLoading(prev => ({ ...prev, reward: true }))
        try {
            await axios.post('/api/admin/rewardWinner', { bajiId })
            toast.success('Reward sent successfully!')
            setRewardSend(true)
        } catch (error) {
            console.error('Error sending reward:', error)
            toast.error('Failed to send reward.')
        } finally {
            setButtonLoading(prev => ({ ...prev, reward: false }))
        }
    }

    const BetTable = ({ title, data }: { title: string; data: any[] }) => (
        <div className="mb-10">
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <div className="text-gray-700 mb-4">
                <p>Total Amount: ₹ {data.reduce((sum, item) => sum + item.totalbidamount, 0)}</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border text-left">
                    <thead className="bg-purple-700 text-white">
                        <tr>
                            <th className="p-2 border">Bid Number</th>
                            <th className="p-2 border">Total Bid Amount</th>
                            <th className="p-2 border">Total Bids</th>
                            <th className="p-2 border">P/L</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, idx) => (
                            <tr key={idx} className="border">
                                <td className="p-2 border">{item.number}</td>
                                <td className="p-2 border">₹ {item.totalbidamount}</td>
                                <td className="p-2 border">{item.totalbid}</td>
                                <td className="p-2 border">₹ {item["p&l"]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )

    if (dataLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-lg text-purple-700">Loading game data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Game Result</h1>
            <ToastContainer />

            {/* Input Fields */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex flex-col w-full">
                    <label className="mb-1 font-medium">Single Win Value*</label>
                    <input
                        type="text"
                        value={singleWinValue}
                        onChange={(e) => setSingleWinValue(e.target.value)}
                        className="p-2 border rounded w-full"
                        placeholder="Enter Single Win Value"
                    />
                </div>
                <div className="flex flex-col w-full">
                    <label className="mb-1 font-medium">Patti Win Value*</label>
                    <input
                        type="text"
                        value={pattiWinValue}
                        onChange={(e) => setPattiWinValue(e.target.value)}
                        className="p-2 border rounded w-full"
                        placeholder="Enter Patti Win Value"
                    />
                </div>
                <button
                    onClick={handleEditResult}
                    className="self-end bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 disabled:opacity-60 flex items-center justify-center min-w-[100px]"
                    disabled={buttonLoading.update}
                >
                    {buttonLoading.update ? (
                        <Loader2 className="animate-spin mr-2" />
                    ) : 'Update'}
                </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-x-3 my-5 font-bold">
                <button
                    onClick={wrongResultHandler}
                    disabled={!rewardSend || buttonLoading.wrong}
                    className={`bg-red-600 p-2 rounded text-white flex items-center justify-center min-w-[120px] ${rewardSend ? '' : 'opacity-60 cursor-not-allowed'
                        }`}
                >
                    {buttonLoading.wrong ? (
                        <Loader2 className="animate-spin mr-2" />
                    ) : 'Wrong Result'}
                </button>
                <button
                    onClick={rewardWinnerHandler}
                    disabled={rewardSend || buttonLoading.reward}
                    className={`bg-green-600 p-2 rounded text-white flex items-center justify-center min-w-[120px] ${rewardSend ? 'opacity-60 cursor-not-allowed' : ''
                        }`}
                >
                    {buttonLoading.reward ? (
                        <Loader2 className="animate-spin mr-2" />
                    ) : 'Reward Winner'}
                </button>
            </div>

            {/* Tables */}
            <BetTable title="Single Data" data={singleData} />
            <BetTable title="Patti Data" data={pattiData} />
            <BetTable title="Jodi Data" data={jodiData} />
        </div>
    )
}

export default GameResultPage
