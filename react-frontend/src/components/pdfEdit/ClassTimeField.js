import TimePicker from "./TimePicker";
import DaysOfWeekField from "./DaysOfWeekField";
import FieldInput from "./FieldInput";
import AddButton from "./AddButton";
import MinusButton from "./MinusButton";
import { useEffect, useState } from "react";

const ClassTimeField = ({ classTimes, setClassTimes }) => {
    const [locations, setLocations] = useState(classTimes.map(classTime => classTime.location));

    const classTimeObj = {
        location: '',
        start: '',
        end: '',
        days_of_week: '',
        attribute: 'lec',
    }

    useEffect(() => {
        setLocations(classTimes.map(classTime => classTime.location));

    }, []);

    useEffect(() => {
        classTimes.forEach((classTime, index) => {
            classTime.location = locations[index];
        });

        setClassTimes(classTimes);

    }, [locations]);


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
                          <FieldInput
                              title="Location"
                              item={locations[index] ? locations[index] : ''}
                              index={index}
                              setItems={setLocations}
                              items={locations}
                          />


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
