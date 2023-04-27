import AddButton from "./AddButton";
import {useState, useEffect} from 'react'
import FieldInput from "./FieldInput";
import ClassAttributeField from "./ClassAttributeField";
import MinusButton from "./MinusButton";

const attribute_list = ["URL", "Email", "Textbook", "Other"];

const MiscellaneousField = ({miscs, setMiscs}) => {
    const [values, setValues] = useState(
        miscs.map((misc) => misc.value)
    )
    const [tags, setTags] = useState(
        miscs.map((misc) => misc.tag)
    )

    const classTimeObj = {
        value:"",
        tag: "URL",
    };

    useEffect(() => {
        miscs.forEach((misc, index) => {
            misc.value = values[index];
            misc.tag = tags[index];
        });

        setMiscs(miscs);
    }, [values, tags]);

    const handleRemoveItem = (index, updatedObj) => {
        let newValues = values.splice(index, 1)
        console.log(index)
        let newTags = tags.splice(index, 1)
        setValues(newValues)
        setTags(newTags)
        setMiscs(updatedObj)
    }
    
    return (
        <>
            <h1 className="text-2xl font-semibold mt-10 mb-3">
                Miscellaneous:
                <span>
                    <AddButton
                        originalValue={miscs}
                        insertValue= {classTimeObj}
                        setValue={setMiscs}
                    />
                </span>
            </h1>
            {console.log(miscs, values, tags)}
            { (miscs && miscs.length > 0) ?
                miscs.map((misc, index) => (
                    <div
                    className=" flex flex-row align-middle justify-between"
                    key={index}
                    >
                        <div className="relative block p-3 border-2 border-black rounded w-11/12 mt-5">
                            <h1 className="text-lg font-semibold text-zinc-900 mb-4">
                                {"Misc"} # {index + 1}
                            </h1>
                            <div className="mb-2">
                                <FieldInput
                                    title="value"
                                    item={
                                        values[index]
                                            ? values[index]
                                            : ""
                                    }
                                    index={index}
                                    setItems={setValues}
                                    items={values}
                                />
                                <div className="mb-4"> </div>
                                <ClassAttributeField 
                                    attribute={
                                        tags[index]
                                        ? tags[index] : "URL"
                                    }
                                    index={index}
                                    attributes={tags}
                                    setAttributes={setTags}
                                    attribute_list={attribute_list}
                                />
                            </div>
                        </div>
                        <MinusButton
                              index={index}
                              originalValue={miscs}
                              setValue={handleRemoveItem}
                          />
                    </div>
                ))
                : ""
            }

        </>
    );
}
 
export default MiscellaneousField;