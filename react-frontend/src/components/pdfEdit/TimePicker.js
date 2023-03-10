
export const TimePicker = ({label}) => {
    return (
        <div className="mt-5 p-3 inline-flex items-baseline border-2 border-black rounded ">
            <div className="flex">
            <span className="text-md font-semibold text-zinc-900 mr-4" htmlFor="name">
                {label}
            </span>
            <select name="hours" className="bg-transparent text-md appearance-none outline-none" value={label==="End-Time" ? 5 : 4}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={7}>7</option>
                <option value={8}>8</option>
                <option value={9}>9</option>
                <option value={10}>10</option>
                <option value={11}>10</option>
                <option value={12}>12</option>
            </select>
            <span className="text-md mr-3">:</span>
            <select name="minutes" className="bg-transparent text-md appearance-none outline-none mr-4" value={30}>
                <option value={0}>00</option>
                <option value={15}>15</option>
                <option value={30}>30</option>
                <option value={45}>45</option>
            </select>
            <select name="ampm" className="bg-transparent text-md appearance-none outline-none" value={"pm"}>
                <option value="am">AM</option>
                <option value="pm">PM</option>
            </select>
            </div>
        </div>
    )
}

export default TimePicker