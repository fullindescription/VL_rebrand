import React from 'react';

import Header from './components/UI/Header';
import MovieCarousel from './components/MovieCarousel/MovieCarousel';
import {MovieList} from './components/MovieList/MovieList';
import Footer from './components/UI/Footer';

const App: React.FC = () => {
    return (
        <div className="App">
            <Header title="VL.RU" />
            <MovieCarousel />
            <MovieList />
            <Footer />
        </div>
    );
};

export default App;