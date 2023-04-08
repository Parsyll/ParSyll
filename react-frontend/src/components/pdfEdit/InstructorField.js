import FieldInput from "./FieldInput";
import AddButton from "./AddButton";
import MinusButton from "./MinusButton";
import { useEffect, useState } from "react";

export const InstructorField = ({ setInstructors, instructors }) => {

    const [names, setNames] = useState(instructors.map(instructor => instructor.name));
    const [emails, setEmails] = useState(instructors.map(instructor => instructor.email));
    const [isProfs, setIsProfs] = useState(instructors.map(instructor => instructor.isProf));

    const instructorBody = {
        name: "",
        email: "",
        isProf: false,
    };

    useEffect(() => {
        instructors.forEach((instructor, index) => {
            instructor.name = names[index];
            instructor.email = emails[index];
            instructor.isProf = isProfs[index];
        })

        setInstructors(instructors);

    }, [names, emails, isProfs])


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
                                  item={names[index] ? names[index]: ""}
                                  index={index}
                                  setItems={setNames}
                                  items={names}
                              />

                              <FieldInput
                                  title="Email"
                                  item={emails[index] ? emails[index] : ""}
                                  index={index}
                                  setItems={setEmails}
                                  items={emails}
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
