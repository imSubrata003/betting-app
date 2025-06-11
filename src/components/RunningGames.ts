import axios from "axios";

// Types
export type Game = {
    id: string;
    name: string;
    status: string;
    image: string,
};

export type Baji = {
    id: string;
    name: string;
    startTime: string; // "HH:mm"
    endTime: string;   // "HH:mm"
};

// 1. Fetch all games
export const fetchAllGames = async (): Promise<Game[]> => {
    const response = await axios.get<Game[]>("/api/admin/getAllGames");
    //console.log('Games in game page:', response.data);
    return response.data;
};

// 2. Fetch bajis for a specific game
export const fetchBajisForGame = async (gameId: string): Promise<Baji[]> => {
    const response = await axios.post<Baji[]>(`/api/admin/getBaji`, {
        gameId: gameId
    });
    //console.log('Running bajis:', response.data);
    return response.data;
};

// 🔥 3. Updated getGamesWithStatus function
export const getGamesWithStatus = async (): Promise<{ name: string; status: "Running" | "Closed" }[]> => {
    const games = await fetchAllGames();

    const timeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    };

    const now = new Date();
    const currentTimeMinutes = timeToMinutes(now.toTimeString().slice(0, 5));

    const gameStatuses = await Promise.all(
        games.map(async (game) => {
            const bajis = await fetchBajisForGame(game.id);

            const isAnyBajiRunning = bajis.some((baji) => {
                const startMinutes = timeToMinutes(baji.startTime);
                const endMinutes = timeToMinutes(baji.endTime);
                return startMinutes <= currentTimeMinutes && currentTimeMinutes <= endMinutes;
            });

            return {
                name: game.name,
                status: (isAnyBajiRunning ? "Running" : "Closed") as "Running" | "Closed",
                image: game.image,
                id: game.id
            };
        })
    );

    return gameStatuses;
};

