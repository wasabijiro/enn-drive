"use client"
import React, { useState, useEffect } from 'react';
import './HeartAnimation.css'; // アニメーションのスタイルシートをインポート
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const Heart = () => (
    <div className="heart">❤️</div>
);

const HeartAnimation = () => {
    const [hearts, setHearts] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const id = Math.random();
            const newHeart = {
                id: id,
                style: {
                    left: `calc(${Math.random() * 100}% - 4em)`,
                    top: `calc(${Math.random() * 100}% - 4em)`
                }
            };
            setHearts(currentHearts => [...currentHearts, newHeart]);

        }, 60);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className='fixed h-full w-full z-0 fullheart'>
            {hearts.map(heart => (
                <div key={heart.id} className="heart" style={heart.style}>
                    <FontAwesomeIcon icon={faHeart} size={'8x'} />
                </div>
            ))}
        </div>
    );
};

export default HeartAnimation;
