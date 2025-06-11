import React from 'react'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-yellow-400 mb-4">FF Moon Admin Dashboard 🎰💰</h1>

      {/* Intro Section */}
      <p className="text-lg mb-6">
        <strong>Control. Monitor. Win.</strong> Welcome to the <span className="text-yellow-300">ultimate command center</span> of your betting empire! 🚀
      </p>

      {/* Features List */}
      <ul className="space-y-4">
        <li className="flex items-center gap-2">
          ✅ <span className="text-lg"> <strong>Real-time Game Monitoring</strong> – Track running games & past results 📊</span>
        </li>
        <li className="flex items-center gap-2">
          ✅ <span className="text-lg"> <strong>User Management</strong> – Ban, approve, and oversee players with ease 👥</span>
        </li>
        <li className="flex items-center gap-2">
          ✅ <span className="text-lg"> <strong>Payouts & Withdrawals</strong> – Control every transaction seamlessly 💵</span>
        </li>
        <li className="flex items-center gap-2">
          ✅ <span className="text-lg"> <strong>Advanced Analytics</strong> – Get insights to maximize profits 📈</span>
        </li>
        <li className="flex items-center gap-2">
          ✅ <span className="text-lg"> <strong>Security & Compliance</strong> – Keep everything safe & fair 🔐</span>
        </li>
      </ul>

      {/* Closing Statement */}
      <p className="mt-6 text-xl text-yellow-300 font-semibold">
        Your casino, your rules. Stay in control & keep the odds in your favor! 🎲🔥
      </p>
    </div>
  );
};

export default HomePage;
