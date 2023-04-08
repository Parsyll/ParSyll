import TimePicker from "./TimePicker";
import DaysOfWeekField from "./DaysOfWeekField";
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
        classTimes.map((classTime) => classTime.days_of_week)
    );

    const classTimeObj = {
        location: "",
        start: "",
        end: "",
        days_of_week: "",
        attribute: "lec",
    };

    useEffect(() => {
        setLocations(classTimes.map((classTime) => classTime.location));
    }, []);

    useEffect(() => {
        classTimes.forEach((classTime, index) => {
            classTime.location = locations[index];
            classTime.start = startTimes[index];
            classTime.end = endTimes[index];
            classTime.days_of_week = daysOfWeek[index];
        });

        setClassTimes(classTimes);
    }, [locations, startTimes, endTimes, daysOfWeek]);

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

                              {/* <span className="text-md font-semibold text-zinc-900">
                                  Class Times:
                              </span> */}
                              <TimePicker
                                  label={"Start-Time"}
                                  index={index}
                                  time={startTimes[index]}
                                  times={startTimes}
                                  setTimes={setStartTimes}
                              />
                              <TimePicker
                                  label={"End-Time"}
                                  index={index}
                                  time={endTimes[index]}
                                  times={endTimes}
                                  setTimes={setEndTimes}
                              />

                            <div className="mb-2"></div>

                              <FieldInput
                                  title="Location"
                                  item={
                                      locations[index] ? locations[index] : ""
                                  }
                                  index={index}
                                  setItems={setLocations}
                                  items={locations}
                              />

                              {/* <DaysOfWeekField
                                daysOfWeek={0}
                                //   daysOfWeek={daysOfWeek}
                                //   setDaysOfWeek={setDaysOfWeek}
                              /> */}
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
