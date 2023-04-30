
export const ProfessorCard = ({professor}) => {

    return (
        <div className="">
            <h1 className=" text-3xl text-center font-bold">{professor.name}</h1>
            <h1 className=" text-2xl text-center font-bold mt-4">{professor.email}</h1>
        </div>
    )
}

export default ProfessorCard;