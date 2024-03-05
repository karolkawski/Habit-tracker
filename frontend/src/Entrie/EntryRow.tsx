
import { useState } from "react";
import { Icon } from "../components/UI/Icon/Icon";
export const EntryRow = ({
  habit,
  selectedDate,
  entry,
  handleAddEntry,
  handleRemoveEntry,
}: any) => {
  const { name, icon } = habit;
  const [isDone, setIsDone] = useState(!!entry);

  const toggleEntry = () => {
    if (!entry) {
      let token = "xyz";
      let config = {
        headers: {
          Authorization: "Bearer " + token,
          "content-type": "application/json",
        },
      };

      return;
    }

  return (
    <div className="Dashboard__Habit">
      <button
        className={`Dashboard__HabitDone ${
          isDone && "Dashboard__HabitDone--done"
        }`}
        onClick={() => toggleEntry()}
      >
        <Icon icon={"fa-check"} />
      </button>
      <div className="Dashboard__HabitDetails">
        <div className="Dashboard__HabitDetailsTitle">{name}</div>
      </div>
      <div className="Dashboard__HabitIcon">
        <Icon icon={icon} />
      </div>
    </div>
  );
};
