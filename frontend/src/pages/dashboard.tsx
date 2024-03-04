import './dashboard.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Header } from '../layout/Header/Header';
import { EntryRow } from '../components/EntryRow';
import { getTokenFromLocalStorage } from '../utils/token';
import { Cal } from '../Calendar/Calendar';
import { EntryType } from '../types/Entrie.d';

const config = {
  headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
};

export const Dashboard = () => {
  const type = 'Tasks';
  const [habits, setHabits] = useState<any>([]);
  const [noEntries, setNoEntries] = useState(true);

  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(new Date().toISOString())
  );

  const fetchHabitsByDate = () => {
    axios
      .get('http://localhost:4000/api/habitsByDate', {
        ...config,
        params: { time: selectedDate },
      })
      .then((res) => {
        if (res.data.length === 0) {
          setNoEntries(true);
          return;
        }
        setHabits(res.data);
        setNoEntries(false);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    fetchHabitsByDate();
  }, []);

  useEffect(() => {
    fetchHabitsByDate();
  }, [selectedDate]);

  const handleChangeDate = (date: Date): void => {
    setSelectedDate(date);
  };

  const handleAddEntry = (addedEntry: EntryType): void => {
    const habit_id = addedEntry.habit_id;
    const newHabits = [...habits];
    Object.values(newHabits).map(({ habit, entry }, index) => {
      if (habit._id === habit_id && !entry) {
        newHabits[index].entry = addedEntry;
      }
    });
    setHabits(newHabits);
  };

  const handleRemoveEntry = (removedEntry: EntryType) => {
    const habit_id = removedEntry.habit_id;
    const newHabits = [...habits];
    Object.values(newHabits).map(({ habit, entry }, index) => {
      console.log(habit);
      if (habit._id === habit_id && entry) {
        newHabits[index].entry = null;
      }
    });
    setHabits(newHabits);
  };

  return (
    <>
      <Header />
      <div className="Dashboard">
        <div className="Dashboard__Header Calendar">
          <Cal
            selectedDate={selectedDate}
            handleChangeDate={handleChangeDate}
          />
        </div>
        <div className="Dashboard__Body">
          <div className="Dashboard__Title"> Your today's runtime</div>
          <div className="Dashboard__List">
            <div className={`Dashboard__${type}`}>
              <div className="List__Label">{type} (x)</div>
              {!noEntries && habits ? (
                habits.habitEntries.map(({ habit, entry }) => (
                  <EntryRow
                    key={habit._id + 'key'}
                    habit={habit}
                    entry={entry}
                    selectedDate={selectedDate}
                    handleAddEntry={handleAddEntry}
                    handleRemoveEntry={handleRemoveEntry}
                  />
                ))
              ) : (
                <div className="nodata">No entries</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
