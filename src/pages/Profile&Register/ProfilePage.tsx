import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();

    // Добавляем состояние для хранения информации о пользователе
    const [user, setUser] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
    });

    // Извлекаем данные пользователя из localStorage при загрузке страницы
    useEffect(() => {
        const username = localStorage.getItem('username');
        const email = localStorage.getItem('email');
        const firstName = localStorage.getItem('first_name');
        const lastName = localStorage.getItem('last_name');

        // Если данные существуют, обновляем состояние пользователя
        if (username) {
            setUser({
                username,
                email: email || '',
                firstName: firstName || '',
                lastName: lastName || '',
            });
        } else {
            // Если пользователя нет, перенаправляем на страницу логина
            navigate('/login');
        }
    }, [navigate]);

    // Функция выхода из аккаунта
    const handleLogout = () => {
        // Очищаем данные пользователя из localStorage
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('first_name');
        localStorage.removeItem('last_name');
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');

        // Перенаправляем на главную страницу
        navigate('/home');
    };

    return (
        <div className="container"> {/* Добавляем отступ для фиксированного header */}
            <div className="row justify-content-center align-items-center vh-100">
                <div className="col-md-6 col-lg-4">
                    <div className="card shadow-lg p-4" style={{ borderRadius: '10px' }}> {/* Карточка с тенью */}
                        {user.username ? (
                            <>
                                <h2 className="text-center mb-4">Профиль пользователя</h2>
                                <div className="text-center mb-3">
                                    <i className="fas fa-user-circle fa-5x text-secondary"></i> {/* Иконка профиля */}
                                </div>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item"><strong>Имя:</strong> {user.firstName || 'Не указано'}</li>
                                    <li className="list-group-item"><strong>Фамилия:</strong> {user.lastName || 'Не указано'}</li>
                                    <li className="list-group-item"><strong>Username:</strong> {user.username}</li>
                                    <li className="list-group-item"><strong>Email:</strong> {user.email || 'Не указано'}</li>
                                </ul>
                                {/* Кнопка выхода из аккаунта */}
                                <div className="d-grid gap-2 mt-4">
                                    <button className="btn btn-danger" onClick={handleLogout}>
                                        Выйти из аккаунта
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p>Вы не авторизованы</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;