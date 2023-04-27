import AddButton from "./AddButton";
import {useState, useEffect} from 'react'
import FieldInput from "./FieldInput";
import ClassAttributeField from "./ClassAttributeField";
import MinusButton from "./MinusButton";

const attribute_list = ["A+", "A", "A-",
                        "B+", "B", "B-",
                        "C+", "C", "C-",
                        "D+", "D", "D-",
                        "E+", "E", "E-",
                        "F+", "F", "F-"]

const GradingSchemeField = ({gradingScheme, setGradingScheme}) => {
    const [letterGrades, setLetterGrades] = useState(
        gradingScheme.map((grade) => grade.letter)
    )
    const [lowerBounds, setLowerBounds] = useState(
        gradingScheme.map((grade) => grade.lower)
    )
    const [upperBounds, setUpperBounds] = useState(
        gradingScheme.map((grade) => grade.upper)
    )

    useEffect(() => {
        if (gradingScheme == null) {
            setGradingScheme([
                {letter: "A+", upper: 100, lower: 95},
                {letter: "A", upper: 94, lower: 91},
                {letter: "A-", upper: 90, lower: 88},
                {letter: "B+", upper: 87, lower: 85},
                {letter: "B", upper: 84, lower: 81},
                {letter: "B-", upper: 80, lower: 78},
                {letter: "C+", upper: 77, lower: 75},
                {letter: "C", upper: 74, lower: 71},
                {letter: "C-", upper: 70, lower: 68},
            ])
        } else {
            gradingScheme.forEach((grade, index) => {
                grade.letter = letterGrades[index];
                grade.upperBounds = upperBounds[index];
                grade.lowerBounds = lowerBounds[index];
        });
        setGradingScheme(gradingScheme);

        }

    }, [letterGrades, lowerBounds, upperBounds]);

    const letterGradeObj = {
        letter: "A+",
        upperBounds: 100,
        lowerBounds: 95,
    };
    
    return (
        <>
            <h1 className="text-2xl font-semibold mt-10 mb-3">
                Grading Scheme:
                <span>
                    <AddButton
                        originalValue={gradingScheme}
                        insertValue= {letterGradeObj}
                        setValue={setGradingScheme}
                    />
                </span>
            </h1>
            { (gradingScheme && gradingScheme.length > 0) ?
                <div className="border-2 border-black rounded p-3">
                {gradingScheme.map((misc, index) => (
                    <div
                    className=" flex flex-row align-middle justify-between"
                    key={index}
                    >
                        <div className="mb-2 relative w-11/12 flex flex-row justify-evenly content-evenly">
                            <ClassAttributeField 
                                attribute={
                                    letterGrades[index]
                                    ? letterGrades[index] : "A+"
                                }
                                index={index}
                                attributes={letterGrades}
                                setAttributes={setLetterGrades}
                                attribute_list = {attribute_list}
                            />
                            <div className="ml-4"></div>
                            <FieldInput
                                title="To"
                                item={
                                    upperBounds[index] != null
                                        ? upperBounds[index]
                                        : 100
                                }
                                index={index}
                                setItems={setUpperBounds}
                                items={upperBounds}
                            />
                            <div className="ml-4"></div>
                            <FieldInput
                                title="From"
                                item={
                                    lowerBounds[index] != null
                                        ? lowerBounds[index]
                                        : 95
                                }
                                index={index}
                                setItems={setLowerBounds}
                                items={lowerBounds}
                            />
                        </div>
                        <MinusButton
                              index={index}
                              originalValue={gradingScheme}
                              setValue={setGradingScheme}
                          />
                    </div>
                ))}
                </div>
                : ""
            }
        </>
    );
}
 
export default GradingSchemeField;