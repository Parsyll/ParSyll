export const ClassTypeCard = ({ classType }) => {
    return (
        <div className="mt-3 mb-3">
            <h1 className=" text-lg text-center font-bold mt-4">ClassType:</h1>
            <h1 className=" text-md text-center">{classType.toUpperCase()}</h1>
        </div>
    );
};

export default ClassTypeCard;
