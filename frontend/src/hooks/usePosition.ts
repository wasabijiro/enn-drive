const getCurrentPosition = () => {
    console.log("-start- getCurrentPosition")
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
};

export default getCurrentPosition;