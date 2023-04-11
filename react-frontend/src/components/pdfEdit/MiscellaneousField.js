import AddButton from "./AddButton";

const MiscellaneousField = ({items, setters}) => {
    return (
        <>
            <h1 className="text-2xl font-semibold mt-10 mb-3">
                Miscellaneous:
                <span>
                    <AddButton
                        originalValue={}
                        insertValue=""
                        setValue={}
                    />
                </span>
            </h1>

        </>
    );
}
 
export default MiscellaneousField;