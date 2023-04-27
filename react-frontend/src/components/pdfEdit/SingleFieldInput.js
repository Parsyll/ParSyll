const SingleFieldInput = ({header, label, value, setValue, placeholder}) => {

    return (
        <>
            {header? 
                <h1 className="text-2xl font-semibold mt-10 mb-3">
                    {header} :
                </h1> : ""
            }
            <label
                className="relative block p-3 border-2 border-black rounded mb-4 w-11/12"
                htmlFor="name"
            >
                <span
                    className="text-md font-semibold text-zinc-900"
                    htmlFor="name"
                >
                    {label}
                </span>
                <input
                    className="w-full bg-transparent p-0 text-sm  text-gray-500 focus:outline-none"
                    id="name"
                    type="text"
                    placeholder= {placeholder ? placeholder : ""}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </label>

        </>
    )
}

export default SingleFieldInput