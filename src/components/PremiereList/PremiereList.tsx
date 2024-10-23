import React, { useEffect, useState } from "react";
import { Session } from "../Session&SeatSelection/Session/Session.ts";
import { format, parse } from "date-fns";
import { ru } from 'date-fns/locale';
import './PremiereList.scss';

interface Movie {
    id: number;
    title: string;
    description: string;
    duration: number;
    category_name: string;
    age_restriction: string;
    image_url: string | null;
    video_url: string | null;
}

interface MovieWithSessions {
    movie: Movie;
    sessions: Session[];
}

type PremiereListProps = {
    currentView: string;
    currentFilter: string;
};

const PremiereList: React.FC<PremiereListProps> = ({ currentView, currentFilter }) => {
    const [moviesWithSessions, setMoviesWithSessions] = useState<MovieWithSessions[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPremieres = async () => {
            try {
                const url = `/api/events/getpremiers/`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const jsonData = await response.json();
                    if (Array.isArray(jsonData.data)) {
                        const normalizedData = jsonData.data.map((item: any) => ({
                            movie: item.movie,
                            sessions: item.sessions.map((session: any) => ({
                                ...session,
                                date: session.date,
                            })),
                        }));
                        setMoviesWithSessions(normalizedData);
                    } else {
                        setMoviesWithSessions([]);
                    }
                } else {
                    setError('Ошибка при загрузке данных.');
                }
            } catch (err) {
                setError('Ошибка сети.');
            } finally {
                setLoading(false);
            }
        };

        if (currentFilter === 'premiere') {
            fetchPremieres();
        }
    }, [currentFilter]);

    if (loading) return <p>Загрузка премьер...</p>;
    if (error) return <p>{error}</p>;

    const formatReleaseDate = (date: string) => {
        const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
        return format(parsedDate, 'dd MMMM yyyy', { locale: ru });
    };

    return (
        <section className="container mt-5 mb-5">
            <h2 className="text-center mb-5">{currentView} в городе Владивосток</h2>
            <div className="row row-cols-1 row-cols-md-2 g-4">
                {moviesWithSessions.length > 0 ? (
                    moviesWithSessions.map(({ movie, sessions }) => (
                        <div key={movie.id} className="col">
                            <div className="container card  text-white w-100 h-100 d-flex flex-row premiere-card p-3">
                                <div className="container position-relative me-1 image-container w-50" style={{
                                    backgroundImage: `url(${movie.image_url || '/images/1.jpg'})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}>
                                    <div className="position-absolute top-0 start-0 m-2 p-1 bg-danger text-white rounded w-auto h-auto">
                                        {movie.age_restriction}
                                    </div>
                                </div>
                                <div className="card-body d-flex flex-column">
                                    <div className="container w-auto">
                                        <h3 className="card-title mb-1">{movie.title}</h3>
                                        <p className="card-category mt-3">{movie.category_name}</p>
                                        <p className="card-release-date mt-3">
                                            <strong>Дата выхода:</strong> {sessions.length > 0 && formatReleaseDate(sessions[0].date)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Премьер нет.</p>
                )}
            </div>
        </section>
    );
};

export default PremiereList;
