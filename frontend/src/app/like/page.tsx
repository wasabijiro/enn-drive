"use client"
import { faCar, faGear, faHeart, faHouse, faPlay, faStop, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';

import formatCreatedAt from '../utils/formatDate';

import Snackbar from '@mui/material/Snackbar';
import HeartAnimation from '../heart/page';

const LikeScreen = () => {
    const [selectedTab, setSelectedTab] = useState("home");
    const [play, setPlay] = useState(false);
    const [open, setOpen] = useState(false);
    const [sumToken, setSumToken] = useState(null);
    const [surplus, setSurplus] = useState(0);
    const [intToken, setIntToken] = useState(0);
    const [lastDate, setLastDate] = useState(null);
    const [geo, setGeo] = useState({ lat: null, lon: null });
    const [placeName, setPlaceName] = useState("Tokyo");
    const [heart, setHeart] = useState(false);
    const [user_id, setuser_id] = useState(1);

    useEffect(() => {
        // @ts-ignore
        let intervalId;

        if (play) {
            // play が true のときだけインターバルを設定
            intervalId = setInterval(() => {
                console.log("send");
                addLocation(1);
                fetchTotalTokens(1);
            }, 15000);
        } else {
            // play が false の場合は、もしインターバルが設定されていればクリアする
            console.log("not send");
            if (intervalId) {
                clearInterval(intervalId);
            }
        }

        // クリーンアップ関数
        return () => {
            // @ts-ignore
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [play]); // play ステートが変更されるたびに効果が再実行される


    useEffect(() => {
        fetchTotalTokens(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // @ts-ignore
    const fetchTotalTokens = async (user_id) => {
        try {
            const response = await fetch('http://localhost:3000/api/getLikeInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ taker_id: user_id })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseData = await response.json();
            if (responseData.length > 0) {
                const latestLike = responseData[0];
                if (sumToken && sumToken != latestLike.total_tokens) {
                    toggleHeart();
                }
                setSumToken(latestLike.total_tokens);
                // @ts-ignore
                setLastDate(formatCreatedAt(latestLike.latest_created_at));
                // @ts-ignore
                setGeo({ lat: latestLike.latest_latitude, lon: latestLike.latest_longitude });
            }
        } catch (error) {
            console.error("Fetching total tokens failed:", error);
        }
    };

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

        fetchPlaceName();
    }, [geo]);

    useEffect(() => {
        setSurplus(sumToken ? Math.floor(sumToken % 1 * 100) : 0);
        setIntToken(sumToken ? Math.floor(sumToken) : 0);
    }, [sumToken])

    // @ts-ignore
    async function apiRequest(endpoint, options = {}) {
        const response = await fetch(endpoint, {
            headers: {
                "Content-Type": "application/json",
                // @ts-ignore
                ...options.headers,
            },
            ...options,
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        return response.json();
    }

    const getCurrentPosition = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    };

    // @ts-ignore
    const addLocation = async (user_id) => {
        try {
            const position = await getCurrentPosition();
            // @ts-ignore
            const { latitude, longitude } = position.coords;
            const newLocation = await apiRequest("/api/location", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id, latitude, longitude })
            });
            if (!newLocation || !('id' in newLocation)) {
                throw new Error("Invalid location data");
            }
        } catch (error) {
            console.error("Error adding location: ", error);
        }
    };

    // @ts-ignore
    const likeFunction = async (user_id) => {
        try {
            const position = await getCurrentPosition();
            // @ts-ignore
            const { latitude, longitude } = position.coords;
            await apiRequest("/api/like", {
                method: "POST",
                body: JSON.stringify({ user_id, latitude, longitude })
            });
        } catch (error) {
            console.error("Error sending like: ", error);
        }
    };

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
            setHeart(false);
        }, 10000);
    };

    const handleClick = () => {
        setOpen(true);
        likeFunction(2);
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
                message="You spread an enn of likes!"
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
