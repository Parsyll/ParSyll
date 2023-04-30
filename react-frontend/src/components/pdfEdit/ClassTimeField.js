import TimePickerWrapper from "./TimePickerWrapper";
import DaysOfWeekField from "./DaysOfWeekField";
import ClassAttributeField from "./ClassAttributeField";
import FieldInput from "./FieldInput";
import AddButton from "./AddButton";
import MinusButton from "./MinusButton";
import { useEffect, useState } from "react";

const attribute_list = ["LEC", "REC", "LAB", "OH"]

const ClassTimeField = ({ classTimes, setClassTimes }) => {
    const classTimeObj = {
        location: "",
        start: "12:00 AM",
        end: "12:00 AM",
        day_of_week: "Monday",
        attribute: "LEC",
    };

    const handleFieldChanges = (field, value, index) => {
        let newTimeCopy = classTimes.map((k, v) => (JSON.parse(JSON.stringify(k))))
        if (field === "location") {
            newTimeCopy[index].location = value
        } else if (field === "start") {
            newTimeCopy[index].start = value
        } else if (field === "end") {
            newTimeCopy[index].end = value
        } else if (field === "day_of_week") {
            newTimeCopy[index].day_of_week = value
        } else if (field === "attribute") {
            newTimeCopy[index].attribute = value
        }
        setClassTimes(newTimeCopy)
    }
    return (
        <>
            <h1 className="text-2xl font-semibold mt-10 mb-3">
                Class Schedule:
                <span>
                    <AddButton
                        originalValue={classTimes}
                        insertValue={classTimeObj}
                        setValue={setClassTimes}
                    />
                </span>
            </h1>

            {(classTimes && classTimes.length > 0)
                ? classTimes.map((classTime, index) => (
                      <div
                          className=" flex flex-row align-middle justify-between"
                          key={index}
                      >
                          <div className="relative block p-3 border-2 border-black rounded w-11/12 mt-5">
                              <h1 className="text-lg font-semibold text-zinc-900">
                                  {"Class Schedule"} # {index + 1}
                              </h1>

                              <div className="mb-2">
                                  <TimePickerWrapper
                                      label={"Start-Time"}
                                      index={index}
                                      time={classTime.start}
                                      setTimes={handleFieldChanges}
                                      field = {"start"}
                                  />
                                  <TimePickerWrapper
                                      label={"End-Time"}
                                      index={index}
                                      time={classTime.end}
                                      setTimes={handleFieldChanges}
                                      field={"end"}
                                  />
                              </div>

                              <div className="mb-2">
                                  <DaysOfWeekField
                                      dayOfWeek={classTime.day_of_week}
                                      index={index}
                                      setDaysOfWeek={handleFieldChanges}
                                  />
                              </div>

                              <div className="mb-2">
                                  <ClassAttributeField
                                      field={"attribute"}
                                      index={index}
                                      attribute={classTime.attribute}
                                      setAttributes={handleFieldChanges}
                                      attribute_list={attribute_list}
                                  />
                              </div>

                              <div className="mb-2">
                                  <FieldInput
                                      title="Location"
                                      field="location"
                                      item={classTime.location}
                                      index={index}
                                      setItems={handleFieldChanges}
                                  />
                              </div>
                          </div>
                          <MinusButton
                              index={index}
                              originalValue={classTimes}
                              setValue={setClassTimes}
                          />
                      </div>
                  ))
                : ""}
        </>
    );
};

export default ClassTimeField;
