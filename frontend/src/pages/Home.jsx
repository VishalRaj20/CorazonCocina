import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import SignatureDishes from '../components/SignatureDishes';
import Testimonials from '../components/Testimonials';
import Gallery from '../components/Gallery';
import Location from '../components/Location';

const Home = () => {
    return (
        <div className="w-full overflow-hidden">
            <Hero />
            <About />
            <SignatureDishes />
            <Testimonials />
            <Gallery />
            <Location />
        </div>
    );
};

export default Home;
