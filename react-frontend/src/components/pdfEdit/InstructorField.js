import FieldInput from "./FieldInput";
import AddButton from "./AddButton";
import MinusButton from "./MinusButton";

export const InstructorField = ({ setInstructors, instructors }) => {
    const instructorBody = {
        name: "",
        email: "",
        isProf: false,
    };

    return (
        <>
            <h1 className="text-2xl font-semibold mt-10 mb-3">
                Instructors:
                <span>
                    <AddButton
                        originalValue={instructors}
                        insertValue={instructorBody}
                        setValue={setInstructors}
                    />
                </span>
            </h1>
            {instructors
                ? instructors.map((instructor, index) => (
                      <div
                          className=" flex flex-row align-middle justify-between "
                          key={index}
                      >
                          <div className="relative block p-3 border-2 border-black rounded w-11/12 mt-5">
                              <span className="text-lg font-semibold text-zinc-900">
                                  {"Instructor"} # {index + 1}
                              </span>

                              <FieldInput
                                  title="Name"
                                  item={instructor.name}
                                  index={index}
                                  setItems={setInstructors}
                                  items={instructors}
                              />

                              <FieldInput
                                  title="Email"
                                  item={instructor.email}
                                  index={index}
                                  setItems={setInstructors}
                                  items={instructors}
                              />

                          </div>

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
