import './dashboard.scss';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Header } from '../layout/Header/Header';
import { EntryRow } from '../components/EntryRow';
import { getTokenFromLocalStorage } from '../utils/token';
import { Cal } from '../Calendar/Calendar';
import { EntryType } from '../types/Entrie.d';
import data from '../assets/data';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDataRequest,
  fetchDataSuccess,
} from '../store/actions/dataActions';
const config = {
  headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
};

export const Dashboard = () => {
  const type = 'Tasks';
  const dispatch = useDispatch();

  const habits = useSelector((state: { data }) => state.data.habits);
  const [noEntries, setNoEntries] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(new Date().toISOString())
  );

  const fetchHabitsByDate = () => {
    dispatch(fetchDataRequest());

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
        dispatch(fetchDataSuccess(res.data));
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
    // setHabits(newHabits);
  };

  const handleRemoveEntry = (removedEntry: EntryType) => {
    const habit_id = removedEntry.habit_id;
    const newHabits = [...habits];
    Object.values(newHabits).map(({ habit, entry }, index) => {
      if (habit._id === habit_id && entry) {
        newHabits[index].entry = null;
      }
    });
    // setHabits(newHabits);
  };

  return (
    <>
      <Header />
      <div className="Dashboard container mx-auto">
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
              {habits ? (
                habits.map((habit) => (
                  <EntryRow
                    key={habit.id + 'key'}
                    habit={habit}
                    entry={undefined}
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
