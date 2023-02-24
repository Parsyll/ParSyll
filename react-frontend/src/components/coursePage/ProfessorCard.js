
export const ProfessorCard = ({professor}) => {

    return (
        <div className="mt-12">
            <h1 className=" text-4xl text-center font-bold mt-4">{professor.name}</h1>
            <h1 className=" text-2xl text-center font-bold mt-4">{professor.email}</h1>
        </div>
    )
}

export default ProfessorCard;