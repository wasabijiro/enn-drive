"use client"
import PieChart from './piechart';
import React from "react"

const Home = () => {
    const data = [
        { value: 10, color: 'red' },
        { value: 20, color: 'blue' },
        { value: 30, color: 'green' },
    ];

    return (
        <div className="container mx-auto">
            <PieChart data={data} />
        </div>
    );
};

export default Home;
