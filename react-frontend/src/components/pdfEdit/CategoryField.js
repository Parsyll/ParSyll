const CategoryField = () => {
    return (
        <>
            <h1 className="text-2xl font-semibold mt-10">
                Category :
            </h1>
            <p className="text-black text-sm font-normal flex gap gap-2 pt-2">
                <button className="border-2 border-black rounded-md border-b-4 border-l-4 font-black px-2">
                    Business
                </button>
                <button className="border-2 border-black rounded-md border-b-4 border-l-4 font-black px-2">
                    Creative
                </button>
                <button className="border-2 border-black rounded-md border-b-4 border-l-4 font-black px-2">
                    Education
                </button>
            </p>
            <p className="text-black text-sm font-normal flex gap gap-2 pt-2">
                <button className="border-2 border-black rounded-md border-b-4 border-l-4 font-black px-2">
                    Tech
                </button>
                <button className="border-2 border-black rounded-md border-b-4 border-l-4 font-black px-2">
                    Entertainment
                </button>
                <button className="border-2 border-black rounded-md border-b-4 border-l-4 font-black px-2">
                    Other
                </button>
            </p>

        </>
    );
}
 
export default CategoryField;