import './dashboard.scss';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Header } from '../layout/Header/Header';
import { EntryRow } from '../components/EntryRow';
import { getTokenFromLocalStorage } from '../utils/token';
import { Cal } from '../Calendar/Calendar';
import { EntryType } from '../types/Entrie.d';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDataRequest,
  fetchTodaySuccess,
} from '../store/actions/dataActions';

const config = {
  headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
};

export const Dashboard = () => {
  const type = 'Tasks';
  const dispatch = useDispatch();

  const todays = useSelector((state: { data }) => state.data.today);
  const [noEntries, setNoEntries] = useState(true);

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
        dispatch(fetchTodaySuccess(res.data.habitEntries));
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

  const handleAddEntry = (addedEntry: EntryType): void => {};

  const handleRemoveEntry = (removedEntry: EntryType) => {};

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
              {!noEntries && todays ? (
                Object.values(todays).map(({ habit, entry }) => (
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
