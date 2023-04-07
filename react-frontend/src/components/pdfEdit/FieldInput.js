const FieldInput = ({title, item, index, setItems, items}) => {

    const handleOnChange = (e) => {
        e.preventDefault();
        let copied_items = JSON.parse(JSON.stringify(items));
        copied_items[index] = e.target.value
        setItems(copied_items)
    }

    return ( 
        <label className="relative block p-3 border-2 border-black rounded w-11/12 mt-5" htmlFor={title}>
                <span className="text-md font-semibold text-zinc-900" htmlFor={title}>
                {title} # {index + 1}
                </span>
                <input className="w-full bg-transparent p-0 text-sm  text-gray-500 focus:outline-none" id={title} 
                type="text" placeholder={title} value={item} onChange={handleOnChange}/>
        </label>

    );

}
 
export default FieldInput;
