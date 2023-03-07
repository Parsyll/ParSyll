
export const InstructorField = ({instructor , index, setInstructors, instructors}) => {

    const handleOnChange = (e) => {
        e.preventDefault();
        let copied_instructors = JSON.parse(JSON.stringify(instructors));
        copied_instructors[index] = e.target.value
        setInstructors(copied_instructors)
    }

    return(
        <label className="relative block p-3 border-2 border-black rounded" htmlFor="name">
                <span className="text-md font-semibold text-zinc-900" htmlFor="name">
                Instructor # {index + 1}
                </span>
                <input className="w-full bg-transparent p-0 text-sm  text-gray-500 focus:outline-none" id="name" 
                type="text" placeholder="instructor" value={instructor} onChange={handleOnChange}/>
        </label>
    )
}

export default InstructorField