import FieldInput from "./FieldInput";
import AddButton from "./AddButton";
import MinusButton from "./MinusButton";

export const InstructorField = ({
    setInstructors,
    instructors,
}) => {
    return (
        <>
            <h1 className="text-2xl font-semibold mt-10 mb-3">
                Instructors:
                <span>
                    <AddButton
                        originalValue={instructors}
                        insertValue=""
                        setValue={setInstructors}
                    />
                </span>
            </h1>
            {instructors
                ? instructors.map((instructor, index) => (
                      <div
                          className=" flex flex-row align-middle justify-between"
                          key={index}
                      >
                          <FieldInput
                              title="Instructor"
                              item={instructor}
                              index={index}
                              setItems={setInstructors}
                              items={instructors}
                          />
                          
                          <MinusButton
                              index={index}
                              originalValue={instructors}
                              setValue={setInstructors}
                          />
                      </div>
                  ))
                : ""}
        </>
    );
};

export default InstructorField;
