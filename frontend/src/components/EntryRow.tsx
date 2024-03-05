import { useEffect, useState } from 'react';
import { Icon } from './UI/Icon/Icon';
import axios from 'axios';
// import HabitContext, { DashboardContext } from '../store/context';
import { EntryType } from '../types/Entrie.d';

export const EntryRow = ({
  habit,
  selectedDate,
  entry,
  handleAddEntry,
  handleRemoveEntry,
}: any) => {
  console.log('🚀 ~ file: EntryRow.tsx:14 ~ entry:', entry);
  console.log('🚀 ~ file: EntryRow.tsx:14 ~ habit:', habit);
  const { name, icon } = habit;
  const [isDone, setIsDone] = useState(!!entry);

  const toggleEntry = () => {
    if (!entry) {
      let token = 'xyz';
      let config = {
        headers: {
          Authorization: 'Bearer ' + token,
          'content-type': 'application/json',
        },
      };

      axios
        .post(
          `http://localhost:4000//api/entries/add`,
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
      .delete(`http://localhost:4000//api/entries/${entry._id}`)
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
    console.log('2', entry);
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
        {/* <div className='Dashboard__HabitDetailsTime'><Icon icon={'fa-clock'}/>12:23</div>
          <div className='Dashboard__HabitDetailsStreak'><Icon icon={'fa-bullseye'}/>0</div> */}
      </div>
      <div className="Dashboard__HabitIcon">
        <Icon icon={icon} />
      </div>
    </div>
  );
};
