
export const LocationsField = ({location, index, locations, setLocations}) => {


    const handleOnChange = (e) => {
        e.preventDefault();
        let copied_locations = JSON.parse(JSON.stringify(locations));
        copied_locations[index] = e.target.value
        setLocations(copied_locations)
    }

    return(
        <label className="relative block p-3 border-2 border-black rounded mt-5" htmlFor="name">
                <span className="text-md font-semibold text-zinc-900" htmlFor="name">
                Locations #{index + 1}
                </span>
                <input className="w-full bg-transparent p-0 text-sm  text-gray-500 focus:outline-none" id="name" type="text" 
                placeholder="instructor" value={location} onChange={handleOnChange}/>
        </label>
    )
}

export default LocationsField