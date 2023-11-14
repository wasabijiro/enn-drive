"use client"
import { faCar, faGear, faHeart, faHouse, faPlay, faStop, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';

import formatCreatedAt from '../utils/formatDate';

import Snackbar from '@mui/material/Snackbar';
import HeartAnimation from '../heart/page';

const LikeScreen = () => {
    const [selectedTab, setSelectedTab] = useState("home"); // 'home' または 'settings'
    const [play, setPlay] = useState(false);
    const [open, setOpen] = useState(false);
    const [sumToken, setSumToken] = useState(0);
    const [surplus, setSurplus] = useState(0);
    const [intToken, setIntToken] = useState(0);
    const [lastDate, setLastDate] = useState(null);
    const [geo, setGeo] = useState({ lat: null, lon: null });
    const [placeName, setPlaceName] = useState("Tokyo");
    const [heart, setHeart] = useState(false);
    useEffect(() => {
        // APIを呼び出す関数
        const fetchTotalTokens = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/getLikeInfo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ taker_id: 2 })
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const responseData = await response.json(); // 応答をJSONとしてパース
                if (responseData.length > 0) {
                    const latestLike = responseData[0];
                    setSumToken(latestLike.total_tokens); // total_tokens ステートをセット
                    // @ts-ignore
                    setLastDate(formatCreatedAt(latestLike.latest_created_at));
                    // @ts-ignore
                    setGeo({ lat: latestLike.latest_latitude, lon: latestLike.latest_longitude });
                }
            } catch (error) {
                console.error("Fetching total tokens failed:", error);
            }
        };

        fetchTotalTokens(); // 関数を実行
    }, []); // 空の依存配列でコンポーネントのマウント時に実行

    useEffect(() => {
        // APIを呼び出す関数
        const fetchPlaceName = async () => {
            if (geo.lat && geo.lon) {
                try {
                    const response = await fetch('http://localhost:3000/api/getPlaceName', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(geo)
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const responseData = await response.json(); // 応答をJSONとしてパース
                    if (responseData) {
                        setPlaceName(responseData.neighbourhood);
                    }
                } catch (error) {
                    console.error("Fetching place name failed:", error);
                }
            }
        };

        fetchPlaceName(); // 関数を実行
    }, [geo]); // 空の依存配列でコンポーネントのマウント時に実行

    useEffect(() => {
        setSurplus(Math.floor(sumToken % 1 * 100));
        setIntToken(Math.floor(sumToken));
    }, [sumToken])

    // @ts-ignore



    // 外側の円（リング）のスタイル
    const outerRingStyle = {
        background: `conic-gradient(
            #00bfff ${surplus * 3.6}deg,
            transparent ${surplus * 3.6}deg 360deg
        )`,
    };

    const toggleHeart = () => {
        setHeart(true);
        setTimeout(() => {
            setSumToken(sumToken + 0.3);
        }, 4000); // 5秒後に heart を false に設定

        setTimeout(() => {
            setHeart(false);
        }, 10000); // 5秒後に heart を false に設定
    };

    const handleClick = () => {
        setOpen(true);
        toggleHeart();
    };

    //   @ts-ignore
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const buttonStyle = {
        backgroundColor: '#ff69b4',  // ホットピンク
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
    };

    const togglePlay = () => {
        setPlay(!play);
    }

    return (
        <div className='bg-gray-100  h-screen flex justify-center items-center'>
            {heart && <HeartAnimation />}
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={open}
                autoHideDuration={4000}
                onClose={handleClose}
                // message="You spread the likes around!"
                message="You got some likes"
                key={'top,center'}
                sx={{
                    '& .MuiSnackbarContent-root': {
                        backgroundColor: 'white', // 背景色を白に設定
                        color: 'black', // テキストの色を黒に設定
                    }
                }}
            />
            <div className="p-3 mx-3 max-w-sm w-full bg-white shadow-md rounded-md z-10">
                <div className="flex justify-center my-4">
                    <div className="relative w-64 h-64">
                        <div className="w-full h-full rounded-full shadow-md" style={outerRingStyle}></div>
                        <div className="absolute top-2 left-2 w-60 h-60 bg-white rounded-full flex items-center justify-center">
                            <div>
                                <p className="text-lg font-semibold text-center">{surplus}%</p>
                                <p className="text-center text-sm text-center">Total Likes: {intToken}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center text-xs my-4">
                    <p>Last Like: {lastDate}</p>
                    <p>Location: {placeName}</p>
                </div>
                <div className="flex justify-center mt-4">
                    <button className={`text-slate-50 w-12 h-12 justify-center align-center me-5 rounded-full ${!play ? "bg-green-500" : "bg-red-500"}`} onClick={togglePlay}>
                        {!play ? <FontAwesomeIcon icon={faCar} size={'xl'} /> : <FontAwesomeIcon icon={faStop} size={'xl'} />}
                    </button>
                    <button style={buttonStyle} onClick={handleClick} className='h-12'>
                        <span className='font-extrabold text-lg'>Like</span><FontAwesomeIcon icon={faHeart} className='ms-2' size={'xl'} />
                    </button>
                    <div className='w-12 ms-5'></div>
                </div>
            </div>
            <div id="navbar" className="fixed bottom-0 left-0 right-0">
                <div className='bg-gray-800 text-white flex justify-evenly'>
                    <button
                        className={`py-3 flex flex-col items-center justify-center flex-1 text-center ${selectedTab === 'home' ? 'bg-gray-700' : ''}`}
                        onClick={() => setSelectedTab('home')}
                    >
                        <FontAwesomeIcon icon={faHouse} size={'xl'} className='mb-1' />
                        <span className='text-xs'>Home</span>
                    </button>
                    <button
                        className={`py-3 flex flex-col items-center justify-center flex-1 text-center ${selectedTab === 'trophy' ? 'bg-gray-700' : ''}`}
                        onClick={() => setSelectedTab('trophy')}
                    >
                        <FontAwesomeIcon icon={faTrophy} size={'xl'} className='mb-1' />
                        <span className='text-xs'>Trophy</span>
                    </button>
                    <button
                        className={`py-3 flex flex-col items-center justify-center flex-1 text-center ${selectedTab === 'settings' ? 'bg-gray-700' : ''}`}
                        onClick={() => setSelectedTab('settings')}
                    >
                        <FontAwesomeIcon icon={faGear} size={'xl'} className='mb-1' />
                        <span className='text-xs'>Settings</span>
                    </button>
                </div>
            </div>
        </div >
    );
};

export default LikeScreen;
