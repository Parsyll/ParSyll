const FieldInput = ({title, item, index, setItems, field}) => {

    const handleOnChange = (e) => {
        e.preventDefault();
        setItems(field, e.target.value, index)
    }

    return ( 
        <div className="">
            <label className="" htmlFor={title}>
                    <span className="text-md font-semibold text-zinc-900" htmlFor={title}>
                    {title}
                    </span>
                    <input className="w-full bg-transparent p-0 text-sm  text-gray-500 focus:outline-none" id={title} 
                    type="text" placeholder={title} value={item} onChange={handleOnChange}/>
            </label>
        </div>

    );

}
 
export default FieldInput;
