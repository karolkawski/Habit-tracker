import axios from 'axios';
import { useState, useEffect } from 'react';
import { Navigation } from '../Layout/Navigation/Navigation';
import { EntryRow } from '../Entry/EntryRow';
import { Cal } from '../Calendar/Calendar';
import { EntryType } from '../types/Entrie.d';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEntryRequest,
  fetchEntrySuccess,
  setIsDoneEntry,
  setIsUndoneEntry,
} from '../store/actions/entryActions';
import { ContentWrapper } from '../Layout/ContentWrapper';
import { AuthHeader } from '../auth/AuthHeader';

export const Dashboard = () => {
  const type = 'Tasks';
  const dispatch = useDispatch();
  const token = useSelector((state: { user }) => state.user.token);
  const todayHabits = useSelector((state: { entry }) => state.entry.entries);
  const [noEntries, setNoEntries] = useState(true);

  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(new Date().toISOString())
  );

  const fetchHabitsByDate = () => {
    dispatch(fetchEntryRequest());

    axios
      .get('http://localhost:5001/api/habitsByDate', {
        ...AuthHeader(token),
        params: { time: selectedDate },
      })
      .then((res) => {
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

  return (
    <>
      <Navigation />
      <ContentWrapper>
        <div className="Dashboard__Navigation Calendar">
          <Cal
            selectedDate={selectedDate}
            handleChangeDate={handleChangeDate}
          />
        </div>
        <div>
          <div className="text-xl pb-5">Your today's runtime</div>
          <div>
            <div className="text-lg pb-5">
              {type} ({todayHabits ? todayHabits.length : 0})
            </div>
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
              <div className="flex h-20 bg-white justify-center items-center border-gray-100 my-5">
                No entries
              </div>
            )}
          </div>
        </div>
      </ContentWrapper>
    </>
  );
};
