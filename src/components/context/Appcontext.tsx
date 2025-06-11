"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AppContextType {
  theme: string;
  toggleTheme: () => void;
  demoData: {
    games: {
      id: string;
      gameTitle: string;
      gameTime: string;
      date: string;
      description: string;
      players: string[];
      status: string;
      singleWinNumber: number;
      pattiWinNumber: string;
      jodiWinNumber: string;
    }[];
  };
  name: string;
  userData: {
    phone: string;
    pass: string;
    name: string;
    id: string;
    role: string;
  };
  setUserData: (userData: { phone: string; pass: string }) => void;
  setName: (name: string) => void;
  selectedGame: any;
  setSelectedGame: (game: any) => void;
  // demoUsers: {
  //   users: {
  //     id: number;
  //     username: string;
  //     email: string;
  //     passwordHash: string;
  //     balance: number;
  //     betsPlaced: {
  //       betId: number;
  //       game: string;
  //       amount: number;
  //       status: "won" | "lost" | "pending";
  //       payout: number;
  //     }[];
  //     transactions: {
  //       transactionId: number;
  //       type: "deposit" | "withdrawal";
  //       amount: number;
  //       date: string;
  //       status?: "pending" | "approved" | "rejected";
  //     }[];
  //     status: "active" | "inactive" | "banned";
  //     vipLevel: "Bronze" | "Silver" | "Gold" | "Platinum";
  //   }[];
  // };
  user: string;
  setuser: (user: string) => void;
  games: { name: string; image?: string; id: string }[];
  setGames: React.Dispatch<React.SetStateAction<{ name: string; image?: string; id: string }[]>>;
  bajis: {
    id: string;
    name: string;
    gameId: string;
    startTime: string;
    endTime: string;
    createdAt: string;
    jodiResult: string;
    pattiResult: string;
    singleResult: string;
    prizeMoney: string;
  }[];
  setBajis: React.Dispatch<React.SetStateAction<any[]>>;
}


const AppContext = createContext<AppContextType | undefined>(undefined);

const demoData = {
  games: [
    {
      id: "1",
      gameTitle: "🎯 KOLKATA FATAFAT",
      gameTime: "10:00 AM",
      date: "2025-04-03",
      description: "Description for Game 1",
      players: ["Player 1", "Player 2"],
      status: "running",
      singleWinNumber: 5,
      pattiWinNumber: "123",
      jodiWinNumber: "58",
    },
    {
      id: "2",
      gameTitle: "❤️ MAIN BAJAR",
      gameTime: "11:30 AM",
      date: "2025-04-03",
      description: "Description for Game 2",
      players: ["Player 3", "Player 4"],
      status: "paused",
      singleWinNumber: 8,
      pattiWinNumber: "245",
      jodiWinNumber: "96",
    },
    {
      id: "3",
      gameTitle: "🎯 RAJDHANI DAY",
      gameTime: "1:00 PM",
      date: "2025-04-03",
      description: "Description for Game 3",
      players: ["Player 5", "Player 6"],
      status: "stopped",
      singleWinNumber: 2,
      pattiWinNumber: "567",
      jodiWinNumber: "31",
    },
    {
      id: "4",
      gameTitle: "💥 KALYAN DAY",
      gameTime: "2:30 PM",
      date: "2025-04-03",
      description: "Description for Game 4",
      players: ["Player 7", "Player 8"],
      status: "running",
      singleWinNumber: 7,
      pattiWinNumber: "678",
      jodiWinNumber: "45",
    },
    {
      id: "5",
      gameTitle: "🦜 KALYAN NIGHT",
      gameTime: "4:00 PM",
      date: "2025-04-03",
      description: "Description for Game 5",
      players: ["Player 9", "Player 10"],
      status: "paused",
      singleWinNumber: 3,
      pattiWinNumber: "789",
      jodiWinNumber: "82",
    },
    {
      id: "6",
      gameTitle: "❣️ RAJDHANI NIGHT",
      gameTime: "5:30 PM",
      date: "2025-04-03",
      description: "Description for Game 6",
      players: ["Player 11", "Player 12"],
      status: "stopped",
      singleWinNumber: 9,
      pattiWinNumber: "910",
      jodiWinNumber: "63",
    },
    {
      id: "7",
      gameTitle: "🎯 KOLKATA FATAFAT",
      gameTime: "7:00 PM",
      date: "2025-04-03",
      description: "Description for Game 7",
      players: ["Player 13", "Player 14"],
      status: "running",
      singleWinNumber: 1,
      pattiWinNumber: "234",
      jodiWinNumber: "79",
    },
    {
      id: "8",
      gameTitle: "❤️ MAIN BAJAR",
      gameTime: "8:30 PM",
      date: "2025-04-03",
      description: "Description for Game 8",
      players: ["Player 15", "Player 16"],
      status: "paused",
      singleWinNumber: 6,
      pattiWinNumber: "345",
      jodiWinNumber: "28",
    },
    {
      id: "9",
      gameTitle: "🎯 RAJDHANI DAY",
      gameTime: "9:45 PM",
      date: "2025-04-03",
      description: "Description for Game 9",
      players: ["Player 17", "Player 18"],
      status: "running",
      singleWinNumber: 4,
      pattiWinNumber: "456",
      jodiWinNumber: "91",
    },
    {
      id: "10",
      gameTitle: "❣️ RAJDHANI NIGHT",
      gameTime: "11:00 PM",
      date: "2025-04-03",
      description: "Description for Game 10",
      players: ["Player 19", "Player 20"],
      status: "stopped",
      singleWinNumber: 0,
      pattiWinNumber: "678",
      jodiWinNumber: "14",
    }
  ],
};


export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState("light");
  const [name, setName] = useState('biswa')
  const [selectedGame, setSelectedGame] = useState('');
  const [bajis, setBajis] = useState<any[]>([])

  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("userData");
    if (stored) {
      setUserData(JSON.parse(stored));
    }
  }, []);

  const [games, setGames] = useState<{ name: string; image?: string, id: string }[]>([])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme, name, setName, selectedGame, setSelectedGame, userData, setUserData, games, setGames, bajis, setBajis, demoData, user: '', setuser: () => {} }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
