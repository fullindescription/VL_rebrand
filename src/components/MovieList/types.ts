// types.ts
export type Session = {
    id: number;
    title: string; // Добавляем название фильма
    time: string;
    price: number;
    available_tickets: number;
    row?: number;
    seat?: number;
    occupiedSeats?: { row: number; seat: number }[]; // Опционально добавляем список занятых мест
    date: string; // Добавляем свойство `date` для фильтрации по дате
};
