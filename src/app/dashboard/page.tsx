'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { getGamesWithStatus } from '@/components/RunningGames';
import { validateUser } from '@/utils/validateAdmin';
import { useRouter } from 'next/navigation';

type User = {
    id: string
    name: string
    phone?: string
    balance: number
    password: string
    status: 'ACTIVE' | 'INACTIVE'
}

const AdminDashboard = () => {
    const [allUsers, setAllUsers] = useState<User[]>([])
    const [userLength, setUserLength] = useState(0)
    const [totalWalletBalance, setTotalWalletBalance] = useState(0)
    const [totalDeposit, setTotalDeposit] = useState(0)
    const [totalWithdrawal, setTotalWithdrawal] = useState(0)
    const [todayBidAmount, setTodayBidAmount] = useState(0)
    const [totalBettingAmount, setTotalBettingAmount] = useState(0)
    const [todayWinAmount, setTodayWinAmount] = useState(0)
    const [monthlyWinAmount, setMonthlyWinAmount] = useState(0)
    const [monthlyBidAmount, setMonthlyBidAmount] = useState(0)
    const [totalTodayDeposit, setTotalTodayDeposit] = useState(0)
    const [totalTodayWithdrawal, setTotalTodayWithdrawal] = useState(0)
    const [monthlyDepostiAmount, setMonthlyDepostiAmount] = useState(0)
    const [monthlyWithdrawalAmount, setMonthlyWithdrawalAmount] = useState(0)
    const [loading, setLoading] = useState(true);
    const [runningGames, setRunningGames] = useState<{ name: string; status: 'Running' | 'Closed' }[]>([])
    const [depositReq, setDepositReq] = useState<any[]>([])
    const [withdrawReq, setWithdrawReq] = useState<any[]>([])

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
        const fetchData = async () => {
            const data = await getGamesWithStatus()
            setRunningGames(data.filter((game) => game.status === 'Running'))
        }
        fetchData()
    }, [])

    const fetchDepositRequests = async () => {
        try {
            const res = await axios.get("/api/admin/getDepositReq");
            if (res.status === 200 && Array.isArray(res.data)) {
                const pending = res.data.filter((item: any) => item.status === 'pending');
                setDepositReq(pending);
            }
        } catch (error) {
            console.error("Error fetching deposit requests:", error);
        }
    };

    const fetchWithdrawalRequests = async () => {
        try {
            const res = await axios.get("/api/admin/getWithdrawReq");
            if (res.status === 200 && Array.isArray(res.data)) {
                const pending = res.data.filter((item: any) => item.status === 'pending');
                setWithdrawReq(pending);
            }
        } catch (error) {
            console.error("Error fetching withdrawal requests:", error);
        }
    };

    useEffect(() => {
        fetchDepositRequests();
        fetchWithdrawalRequests();
    }, []);


    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [
                    usersRes,
                    depositRes,
                    withdrawRes,
                    todayBidRes,
                    allBidsRes,
                    todayWinRes,
                    depositTodayRes,
                    withdrawalTodayRes,
                    monthlyDepositRes,
                    monthlyWithdrawRes
                ] = await Promise.all([
                    axios.get('/api/admin/getAllUsers'),
                    axios.get('/api/admin/getDepositReq'),
                    axios.get('/api/admin/getWithdrawReq'),
                    axios.get('/api/admin/getTodayBetAmount'),
                    axios.get('/api/admin/getAllBids'),
                    axios.get('/api/admin/getTodayWinAmount'),
                    axios.get('/api/admin/getDepositReq'),
                    axios.get('/api/admin/getWithdrawReq'),
                    axios.get('/api/admin/getDepositReq'),
                    axios.get('/api/admin/getWithdrawReq'),
                ]);

                const res = await axios.get('/api/admin/getAllUsers')

                // All users
                const users = res.data;
                setAllUsers(users);
                setUserLength(users.length);

                const totalBalance = users.reduce((acc: number, user: User) => acc + user.balance, 0);
                setTotalWalletBalance(totalBalance);

                // Approved deposits
                const approvedDeposits = depositRes.data.filter((item: any) => item.status === 'approved');
                setTotalDeposit(approvedDeposits.reduce((sum: number, item: any) => sum + item.amount, 0));

                // Approved withdrawals
                const approvedWithdrawals = withdrawRes.data.filter((item: any) => item.status === 'approved');
                setTotalWithdrawal(approvedWithdrawals.reduce((sum: number, item: any) => sum + item.amount, 0));


                // Today bid
                setTodayBidAmount(todayBidRes.data);

                // Monthly bid
                const allBids = allBidsRes.data;
                const now = new Date();
                const thisMonth = now.getMonth();
                const thisYear = now.getFullYear();
                const monthlyBids = allBids.filter((bid: any) => {
                    const d = new Date(bid.createdAt);
                    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
                });
                setMonthlyBidAmount(
                    monthlyBids.reduce((sum: number, b: any) => {
                        const amount = Number(b.amount);
                        return sum + (isNaN(amount) ? 0 : amount);
                    }, 0)
                );


                // Today win
                setTodayWinAmount(todayWinRes.data[0]?.totalAmount || 0);

                // Monthly win
                const winData = todayWinRes.data;
                const monthlyWins = winData.filter((entry: any) => {
                    const date = new Date(entry.date);
                    return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
                });
                setMonthlyWinAmount(monthlyWins.reduce((sum: number, entry: any) => sum + entry.totalAmount, 0));

                // Today's approved deposit
                const today = new Date().toISOString().split('T')[0];
                const todayDeposits = depositTodayRes.data.filter((item: any) => {
                    const date = new Date(item.date || item.createdAt).toISOString().split('T')[0];
                    return item.status === 'approved' && date === today;
                });
                // console.log('today deposits : ', depositTodayRes.data);
                setTotalTodayDeposit(todayDeposits.reduce((sum: number, item: any) => sum + item.amount, 0));

                // Today's approved withdrawals
                const todayWithdrawals = withdrawalTodayRes.data.filter((item: any) => {
                    const date = new Date(item.date || item.createdAt).toISOString().split('T')[0];
                    return item.status === 'approved' && date === today;
                });
                setTotalTodayWithdrawal(todayWithdrawals.reduce((sum: number, item: any) => sum + item.amount, 0));

                // Monthly deposits
                const monthlyApprovedDeposits = monthlyDepositRes.data.filter((item: any) => {
                    const d = new Date(item.date || item.createdAt);
                    return item.status === 'approved' && d.getMonth() === thisMonth && d.getFullYear() === thisYear;
                });
                setMonthlyDepostiAmount(monthlyApprovedDeposits.reduce((sum: number, item: any) => sum + item.amount, 0));

                // Monthly withdrawals
                const monthlyApprovedWithdrawals = monthlyWithdrawRes.data.filter((item: any) => {
                    const d = new Date(item.date || item.createdAt);
                    return item.status === 'approved' && d.getMonth() === thisMonth && d.getFullYear() === thisYear;
                });
                setMonthlyWithdrawalAmount(monthlyApprovedWithdrawals.reduce((sum: number, item: any) => sum + item.amount, 0));

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const dashboardStats = [
        { label: "Total Players", value: userLength, color: "bg-blue-500" },
        { label: "Total Wallet Balance", value: totalWalletBalance, color: "bg-green-400", currency: true },
        { label: "Total Deposit Amount", value: totalDeposit, color: "bg-blue-400", currency: true },
        { label: "Total Withdrawal Amount", value: totalWithdrawal, color: "bg-red-400", currency: true },
        { label: "Today Bid Amount", value: todayBidAmount, color: "bg-cyan-500", currency: true },
        { label: "Today Win Amount", value: todayWinAmount, color: "bg-green-500", currency: true },
        { label: "Today Deposit Amount", value: totalTodayDeposit, color: "bg-yellow-400", currency: true },
        { label: "Today Withdrawal Amount", value: totalTodayWithdrawal, color: "bg-teal-400", currency: true },
        { label: "Monthly Bid Amount", value: monthlyBidAmount, color: "bg-orange-500", currency: true },
        { label: "Monthly Win Amount", value: monthlyWinAmount, color: "bg-pink-500", currency: true },
        { label: "Monthly Deposit Amount", value: monthlyDepostiAmount, color: "bg-green-400", currency: true },
        { label: "Monthly Withdrawal Amount", value: monthlyWithdrawalAmount, color: "bg-sky-400", currency: true },
    ];

    const upperStats = [
        { label: "Running Games", value: runningGames.length, color: "bg-white", ref: '/game/running-games' },
        { label: "Payout Requests", value: withdrawReq.length, color: "bg-white", ref: '/payout/view-payouts' },
        { label: "Deposit Requests", value: depositReq.length, color: "bg-white", ref: '/deposit/new-req' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            </div>

            <div className="flex w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {upperStats.map((stat, index) => (
                    <div key={index} className={`rounded-lg p-4 shadow-md text-black w-full flex flex-col ${stat.color}`}>
                        <h2 className="text-lg font-semibold">{stat.label}</h2>
                        <p className="text-2xl font-bold mt-2 flex flex-col gap-3">
                            {stat.value}
                            <button
                                onClick={() => window.location.href = stat.ref}
                                disabled={stat.value < 1}
                                className={`px-3 py-1 text-sm rounded w-full cursor-pointer  ${stat.value >= 1
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                    }`}
                            >
                                View
                            </button>
                        </p>
                    </div>
                ))}
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {dashboardStats.map((stat, index) => (
                    <div key={index} className={`rounded-lg p-4 shadow-md text-white ${stat.color}`}>
                        <h2 className="text-lg font-semibold">{stat.label}</h2>
                        <p className="text-2xl font-bold mt-2">
                            {stat.currency ? `₹${stat.value.toLocaleString()}` : stat.value}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
