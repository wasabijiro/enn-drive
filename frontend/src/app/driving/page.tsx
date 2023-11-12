
const Driving = () => {
    return (
        <div className="flex h-screen justify-center items-center relative">
            <input
                type="text"
                defaultValue="1"
                className="absolute top-0 left-0 m-4 p-2 border border-gray-300 rounded"
            />
            <button className="bg-pink-500 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded">
                いいね
            </button>
        </div>
    );
};

export default Driving;
