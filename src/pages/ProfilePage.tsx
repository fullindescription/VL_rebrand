import React, { useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();

    // Извлекаем данные пользователя из localStorage
    const user = {
        username: localStorage.getItem('username') || '',
        email: localStorage.getItem('email') || '',
        firstName: localStorage.getItem('first_name') || '',
        lastName: localStorage.getItem('last_name') || '',
    };

    // Если пользователя нет, перенаправляем на главную
    useEffect(() => {
        if (!user.username) {
            navigate('/');
        }
    }, [user.username, navigate]);

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