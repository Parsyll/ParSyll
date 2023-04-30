import FieldInput from "./FieldInput";
import AddButton from "./AddButton";
import MinusButton from "./MinusButton";
import { FormControlLabel } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useEffect, useState } from "react";

export const InstructorField = ({ setInstructors, instructors }) => {
    const instructorBody = {
        name: "",
        email: "",
        isProf: false,
    };

    useEffect(() => {
        sortInstructors(instructors);        
        setInstructors(instructors);
    }, []);

    const sortInstructors = (instructors) => {
        instructors.sort((a, b) => (b.isProf - a.isProf))
    }

    const handleFieldChanges = (field, value, index) => {
        let instructorCopy = instructors.map((k, v) => (JSON.parse(JSON.stringify(k))))
        if (field === "name") {
            instructorCopy[index].name = value
        } else if (field === "email") {
            instructorCopy[index].email = value
        } else if (field === "isProf") {
            instructorCopy[index].isProf = value
        }
        sortInstructors(instructorCopy)
        setInstructors(instructorCopy)
    }

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
                                  field="name"
                                  item={instructor.name}
                                  index={index}
                                  setItems={handleFieldChanges}
                              />

                              <FieldInput
                                  title="Email"
                                  field="email"
                                  item={instructor.email}
                                  index={index}
                                  setItems={handleFieldChanges}
                              />

                              <FormControlLabel
                                  control={
                                      <Checkbox
                                          checked={instructor.isProf}
                                          onChange={(e) => {
                                            handleFieldChanges("isProf", e.target.checked, index)
                                          }}
                                      />
                                  }
                                  label="Professor"
                                  labelPlacement="start"
                                  sx={{ padding: 0, margin: 0 }} //I can't remove the left space for some reason
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
