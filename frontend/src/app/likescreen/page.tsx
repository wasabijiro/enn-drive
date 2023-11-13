"use client"
import { faGear, faHeart, faHouse, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

const LikeScreen = () => {
    const likePercentage = 50; // いいねの割合（例：50%）

    const [selectedTab, setSelectedTab] = useState("home"); // 'home' または 'settings'

    // 外側の円（リング）のスタイル
    const outerRingStyle = {
        background: `conic-gradient(
            #00bfff ${likePercentage * 3.6}deg,
            transparent ${likePercentage * 3.6}deg 360deg
        )`,
    };

    const buttonStyle = {
        backgroundColor: '#ff69b4',  // ホットピンク
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
    };

    // ホバー時のスタイル
    const hoverStyle = {
        backgroundColor: '#cc5599',  // 暗めのピンク
    };

    return (
        <>
            <div className="flex justify-center items-center h-screen bg-gray-100 px-3">
                <div className="p-3 max-w-sm w-full bg-white shadow-md rounded-md">
                    {/* 円グラフ */}
                    <div className="flex justify-center my-4">
                        <div className="relative w-64 h-64">
                            {/* 外側の円 */}
                            <div className="w-full h-full rounded-full shadow-md" style={outerRingStyle}></div>
                            {/* 内側の円 */}
                            <div className="absolute top-2 left-2 w-60 h-60 bg-white rounded-full flex items-center justify-center">
                                {/* いいね数をここに表示 */}
                                <div>
                                    <p className="text-lg font-semibold text-center">{likePercentage}%</p>
                                    <p className="text-center text-sm text-center">Total Likes: 100</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 最近のいいね情報 */}
                    <div className="text-center text-xs my-4">
                        <p>Last Like: 10:30 AM</p>
                        <p>Location: Tokyo</p>
                    </div>

                    {/* いいねボタン */}
                    <div className="flex justify-center mt-4">
                        {/* <button className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Like
                        </button> */}
                        <button style={buttonStyle} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}>
                            Like<FontAwesomeIcon icon={faHeart} className='ms-2'/>
                        </button>
                    </div>
                </div>
            </div>
            <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white flex justify-evenly">
                {/* ホームタブ */}
                <button
                    className={`py-3 flex flex-col items-center justify-center flex-1 text-center ${selectedTab === 'home' ? 'bg-gray-700' : ''}`}
                    onClick={() => setSelectedTab('home')}
                >
                    <FontAwesomeIcon icon={faHouse} />
                    <span>Home</span>
                </button>
                <button
                    className={`py-3 flex flex-col items-center justify-center flex-1 text-center ${selectedTab === 'trophy' ? 'bg-gray-700' : ''}`}
                    onClick={() => setSelectedTab('trophy')}
                >
                    <FontAwesomeIcon icon={faTrophy} />
                    <span>Trophy</span>
                </button>

                {/* 設定タブ */}
                <button
                    className={`py-3 flex flex-col items-center justify-center flex-1 text-center ${selectedTab === 'settings' ? 'bg-gray-700' : ''}`}
                    onClick={() => setSelectedTab('settings')}
                >
                    <FontAwesomeIcon icon={faGear} />
                    <span>Settings</span>
                </button>
            </div>
        </>
    );
};

export default LikeScreen;
