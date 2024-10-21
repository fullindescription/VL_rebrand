// Movie.ts (или в любом месте, где определен тип Movie)
export type Movie = {
    id: number;
    title: string;
    description: string;
    duration: number;
    category_name: string;
    age_restriction: string;
    image_url: string | null;
    video_url?: string | null;
};
