export const LocationCard = ({ location }) => {
    return (
        <div className="mt-3 mb-3">
            <h1 className=" text-xl text-center font-bold mt-4">Location:</h1>
            <h1 className=" text-lg text-center">{location ? location : "N/A"}</h1>
        </div>
    );
};

export default LocationCard;