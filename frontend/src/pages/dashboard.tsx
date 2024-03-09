import './dashboard.scss';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Navigation } from '../layout/Navigation/Navigation';
import { EntryRow } from '../Entry/EntryRow';
import { getTokenFromLocalStorage } from '../utils/token';
import { Cal } from '../Calendar/Calendar';
import { EntryType } from '../types/Entrie.d';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEntryRequest,
  fetchEntrySuccess,
  setIsDoneEntry,
  setIsUndoneEntry,
} from '../store/actions/entryActions';

const config = {
  headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
};

export const Dashboard = () => {
  const type = 'Tasks';
  const dispatch = useDispatch();

  const todayHabits = useSelector((state: { entry }) => state.entry.entries);
  console.log('🚀 ~ Dashboard ~ todayHabits:', todayHabits);
  const [noEntries, setNoEntries] = useState(true);

  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(new Date().toISOString())
  );

  const fetchHabitsByDate = () => {
    dispatch(fetchEntryRequest());

    axios
      .get('http://localhost:4000/api/habitsByDate', {
        ...config,
        params: { time: selectedDate },
      })
      .then((res) => {
        console.log('🚀 ~ .then ~ res:', res);
        if (res.data.habitEntries && res.data.habitEntries.length === 0) {
          setNoEntries(true);
          return;
        }
        dispatch(fetchEntrySuccess(res.data.habitEntries));
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
  }, [selectedDate, dispatch]);

  const handleChangeDate = (date: Date): void => {
    setSelectedDate(date);
  };

  const handleAddEntry = (addedEntry: EntryType): void => {
    const habit_id = addedEntry.habit_id;
    const newHabits = [...todayHabits];
    Object.values(newHabits).map(({ habit, entry }, index) => {
      if (habit._id === habit_id && !entry) {
        newHabits[index].entry = addedEntry;
      }
    });

    dispatch(setIsDoneEntry(newHabits));
  };

  const handleRemoveEntry = (removedEntry: EntryType) => {
    const habit_id = removedEntry.habit_id;
    const newHabits = [...todayHabits];
    Object.values(newHabits).map(({ habit, entry }, index) => {
      if (habit._id === habit_id && entry) {
        newHabits[index].entry = null;
      }
    });
    dispatch(setIsUndoneEntry(newHabits));
  };

  console.log(noEntries, todayHabits);

  return (
    <>
      <Navigation />
      <div className="Dashboard container mx-auto">
        <div className="Dashboard__Navigation Calendar">
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
              {!noEntries && todayHabits ? (
                Object.values(todayHabits).map(({ habit, entry }) => (
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
