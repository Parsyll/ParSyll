import { useEffect, useState } from "react"

export const TimePicker = ({label, time, setTime}) => {
    // Parse information
    useEffect(() => {
        if(time) {
            time = time
            setAmpm(time.slice(-2))
            let values = time.substring(0, time.length - 2).split(":")
            setHours(parseInt(values[0], 10))
            setMinutes(parseInt(values[1], 10))
        }
    })

    const [minutes, setMinutes] = useState(0)
    const [hours, setHours] = useState(12)
    const [ampm, setAmpm] = useState("pm")

    const handleAmPmChange = (e) => {
        e.preventDefault()
        setAmpm(e.target.value)
        setTime(`${hours}:${minutes}${e.target.value}`)
    }

    const handleHourChange = (e) => {
        e.preventDefault()
        setHours(e.target.value)
        setTime(`${e.target.value}:${minutes}${ampm}`)
    }

    const handleMinuteChange = (e) => {
        e.preventDefault()
        setMinutes(e.target.value)
        setTime(`${hours}:${e.target.value}${ampm}`)
    }
    return (
        <div className="mt-5 p-3 inline-flex items-baseline border-2 border-black rounded ">
            <div className="flex">
            <span className="text-md font-semibold text-zinc-900 mr-4" htmlFor="name">
                {label}
            </span>
            <select name="hours" className="bg-transparent text-md appearance-none outline-none" value={hours} onChange={handleHourChange}>
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
            <select name="minutes" className="bg-transparent text-md appearance-none outline-none mr-4" value={minutes} onChange={handleMinuteChange}>
                <option value={0}>00</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={25}>25</option>
                <option value={30}>30</option>
                <option value={35}>35</option>
                <option value={45}>45</option>
                <option value={50}>50</option>
                <option value={55}>55</option>
            </select>
            <select name="ampm" className="bg-transparent text-md appearance-none outline-none" value={ampm} onChange={handleAmPmChange}>
                <option value="am">AM</option>
                <option value="pm">PM</option>
            </select>
            </div>
        </div>
    )
}

export default TimePicker