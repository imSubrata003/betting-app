'use client';

import axios from 'axios';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

const WalletPage = () => {
    const [number, setNumber] = useState('');
    const [balance, setBalance] = useState('');
    const [type, setType] = useState('');
    const [loading, setLoading] = useState(false);

    const updateWallet = async () => {
        try {
            setLoading(true);
            const res = await axios.post('/api/admin/walletUpdate', {
                number,
                balance: Number(balance),
                type
            });
            //console.log(res.data);
            toast.success('Wallet updated successfully ✅');
            setNumber('');
            setBalance('');
            setType('');
        } catch (err) {
            toast.error('Something went wrong ❌');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Update Wallet</h2>

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Phone number"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="number"
                        placeholder="Amount"
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Type</option>
                        <option value="credit">Credit</option>
                        <option value="debit">Debit</option>
                    </select>

                    <button
                        onClick={updateWallet}
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Update Wallet'}
                    </button>
                </div>
            </div>

            {/* Toast Container */}
            <ToastContainer />
        </div>
    );
};

export default WalletPage;
