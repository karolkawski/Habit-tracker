import { useEffect, useState } from 'react';
import { Icon } from './UI/Icon/Icon';
import axios from 'axios';
import { getTokenFromLocalStorage } from '../utils/token';
// import HabitContext, { DashboardContext } from '../store/context';
// import { EntryType } from '../types/Entrie.d';
const config = {
  headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
};

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
      axios
        .post(
          `http://localhost:4000/api/entries/add`,
          {
            time: new Date(selectedDate),
            amount: 1,
            count_mode: habit.count_mode,
            habit_id: habit._id,
          },
          config
        )
        .then((res) => {
          handleAddEntry(res.data);
          setIsDone(true);
        })
        .catch((error: Error) => {
          console.error('API error /api/entries/add ' + error);
        });
      return;
    }

    axios
      .delete(`http://localhost:4000/api/entries/${entry._id}`, config)
      .then((res) => {
        if (res.data) {
          handleRemoveEntry(res.data);
          setIsDone(false);
        }
      })
      .catch((error: Error) => {
        console.error('API error /api/entries/ ' + error);
      });
  };

  useEffect(() => {
    setIsDone(false);
  }, []);

  useEffect(() => {
    if (entry) {
      setIsDone(true);
    } else {
      setIsDone(false);
    }
  }, [entry, selectedDate]);

  return (
    <div className="Dashboard__Habit">
      <button
        className={`Dashboard__HabitDone ${
          isDone && 'Dashboard__HabitDone--done'
        }`}
        onClick={() => toggleEntry()}
      >
        <Icon icon={'fa-check'} />
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
