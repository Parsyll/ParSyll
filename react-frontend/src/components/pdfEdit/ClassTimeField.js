import TimePickerWrapper from "./TimePickerWrapper";
import DaysOfWeekField from "./DaysOfWeekField";
import ClassAttributeField from "./ClassAttributeField";
import FieldInput from "./FieldInput";
import AddButton from "./AddButton";
import MinusButton from "./MinusButton";
import { useEffect, useState } from "react";

const ClassTimeField = ({ classTimes, setClassTimes }) => {
    const [locations, setLocations] = useState(
        classTimes.map((classTime) => classTime.location)
    );
    const [startTimes, setStartTimes] = useState(
        classTimes.map((classTime) => classTime.start)
    );
    const [endTimes, setEndTimes] = useState(
        classTimes.map((classTime) => classTime.end)
    );
    const [daysOfWeek, setDaysOfWeek] = useState(
        classTimes.map((classTime) => classTime.day_of_week)
    );
    const [attributes, setAttributes] = useState(
        classTimes.map((classTime) => classTime.attribute)
    );
    const classTimeObj = {
        location: "",
        start: "12:00 AM",
        end: "12:00 AM",
        day_of_week: "Monday",
        attribute: "lec",
    };

    useEffect(() => {
        classTimes.forEach((classTime, index) => {
            classTime.location = locations[index];
            classTime.start = startTimes[index];
            classTime.end = endTimes[index];
            classTime.day_of_week = daysOfWeek[index];
            classTime.attribute = attributes[index];
        });

        setClassTimes(classTimes);
    }, [locations, startTimes, endTimes, daysOfWeek, attributes]);

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

            {classTimes
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
                                      time={startTimes[index]}
                                      times={startTimes}
                                      setTimes={setStartTimes}
                                  />
                                  <TimePickerWrapper
                                      label={"End-Time"}
                                      index={index}
                                      time={endTimes[index]}
                                      times={endTimes}
                                      setTimes={setEndTimes}
                                  />
                              </div>

                              <div className="mb-2">
                                  <DaysOfWeekField
                                      dayOfWeek={
                                          daysOfWeek[index]
                                              ? daysOfWeek[index]
                                              : "Monday"
                                      }
                                      index={index}
                                      daysOfWeek={daysOfWeek}
                                      setDaysOfWeek={setDaysOfWeek}
                                  />
                              </div>

                              <div className="mb-2">
                                  <ClassAttributeField
                                      attribute={
                                          attributes[index]
                                              ? attributes[index]
                                              : "rec"
                                      }
                                      index={index}
                                      attributes={attributes}
                                      setAttributes={setAttributes}
                                      attribute_list={["lec", "rec", "lab"]}
                                  />
                              </div>

                              <div className="mb-2">
                                  <FieldInput
                                      title="Location"
                                      item={
                                          locations[index]
                                              ? locations[index]
                                              : ""
                                      }
                                      index={index}
                                      setItems={setLocations}
                                      items={locations}
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
