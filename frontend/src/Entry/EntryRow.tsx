import { useEffect, useState } from 'react';
import { Icon } from '../components/UI/Icon/Icon';
import axios from 'axios';
import { AuthHeader } from '../auth/AuthHeader';

export const EntryRow = ({
  habit,
  selectedDate,
  entry,
  handleAddEntry,
  handleRemoveEntry,
}: any) => {
  const { name, icon } = habit;
  const [isDone, setIsDone] = useState(!!entry);

  const isDoneStyles = {
    true: 'bg-secondary',
    false: 'bg-white',
  };
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
          AuthHeader
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
      .delete(`http://localhost:4000/api/entries/${entry._id}`, AuthHeader)
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
    <div className="flex flex-row items-center border-b-[1px] py-2">
      <button
        className={`Dashboard__HabitDone w-10 h-10 rounded-[50%] border-[1px] mr-5 pointer text-white  ${isDoneStyles[isDone]}`}
        onClick={() => toggleEntry()}
      >
        {isDone ? <Icon icon={'check'} /> : ''}
      </button>
      <div className="flex flex-col w-full">
        <div className="text-base">{name}</div>
      </div>
      <div className="border-[1px] border-black w-10 h-10 p-2 rounded flex justify-center bg-white">
        <Icon icon={icon} />
      </div>
    </div>
  );
};
