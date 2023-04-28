import AddButton from "./AddButton";
import {useState, useEffect} from 'react'
import FieldInput from "./FieldInput";
import ClassAttributeField from "./ClassAttributeField";
import MinusButton from "./MinusButton";

const attribute_list = ["URL", "Email", "Textbook", "Other"];

const MiscellaneousField = ({miscs, setMiscs}) => {
    const classTimeObj = {
        value:"",
        tag: "URL",
    };
    
    const handleFieldChanges = (field, value, index) => {
        let newTimeCopy = miscs.map((k, v) => (JSON.parse(JSON.stringify(k))))
        if (field === "value") {
            newTimeCopy[index].value = value
        } else if (field === "tag") {
            newTimeCopy[index].tag = value
        }
        setMiscs(newTimeCopy)
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
                                    field = "value"
                                    item={misc.value}
                                    index={index}
                                    setItems={handleFieldChanges}
                                />
                                <div className="mb-4"> </div>
                                <ClassAttributeField 
                                    attribute={misc.tag}
                                    index={index}
                                    setAttributes={handleFieldChanges}
                                    attribute_list={attribute_list}
                                />
                            </div>
                        </div>
                        <MinusButton
                              index={index}
                              originalValue={miscs}
                              setValue={setMiscs}
                          />
                    </div>
                ))
                : ""
            }

        </>
    );
}
 
export default MiscellaneousField;