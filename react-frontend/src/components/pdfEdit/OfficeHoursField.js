

const OfficeHoursField = ({officeHours, key}) => {
    return (
        <div className="mt-5">
            <label className="input-field inline-flex items-baseline border-2 border-black rounded  p-4">
                <span className="text-md font-semibold text-zinc-900 mr-4" htmlFor="name">
                    OfficeHour #{key}
                </span>
            <div className="flex-1 leading-none">
                <input id="handle" type="text" className="w-full mr-2 pl-1 bg-transparent focus:outline-none" name="handle" placeholder="start-time"/>
            </div>
            <div className="flex-1 leading-none">
                <input id="handle" type="text" className="w-full pl-1 bg-transparent focus:outline-none" name="handle"/>
            </div>
            </label>
        </div>
    )
}