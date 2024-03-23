import { Frequency } from '../components/UI/Frequency/Frequency';
import { Icon } from '../components/UI/Icon/Icon';
import { ColorBox } from '../components/UI/ColorBox/ColorBox';
import { Back } from '../components/UI/Back/Back';
import { Button } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { HabitType } from '../types/Habit.d';
import axios from 'axios';
import { Navigation } from '../Layout/Navigation/Navigation';
import { ContentWrapper } from '../Layout/ContentWrapper';
import { AuthHeader } from '../auth/AuthHeader';
import './habit.scss';
import { Day, DayPicker, DayProps } from 'react-day-picker';
import PieChart from '../Charts/PieChart';
import LineChart from '../Charts/LineChart';
import getLastThreeMonths from '../utils/getLastThreeMonths';

export const Habit = () => {
  const habits = useSelector((state: { habit }) => state.habit.habits);
  const token = useSelector((state: { user }) => state.user.token);
  const [doneDays, setDoneDays] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);

  const [rel, setRel] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (!rel) {
      setRel(true);
      return;
    }
    navigate('/habits');
  }, [habits]);

  useEffect(() => {
    fetchEntriesStats();
    fetchWeekdayStats();
    fetchHabitMonth();
  }, []);
  const habit: HabitType | undefined = habits.find(
    (habit: { _id: string }) => habit._id === params.id
  );

  if (!habit) {
    return <>NO EXIST</>;
  }

  const fetchWeekdayStats = () => {
    axios
      .get('http://localhost:4000/api/statistics/habitWeekdays', {
        params: {
          habitID: habit._id,
          time: '1y',
        },
        ...AuthHeader(token),
      })
      .then((res) => {
        setPieChartData(res.data);
      })
      .catch((e) => {
        console.error(e);
      });
  };
  const handleDeleteHabit = () => {
    axios
      .delete(
        `http://localhost:4000/api/habits/${params.id}`,
        AuthHeader(token)
      )
      .then((res) => {
        navigate('/habits');
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  const fetchEntriesStats = () => {
    axios
      .get('http://localhost:4000/api/statistics/entries', {
        params: {
          habitID: habit._id,
          year: new Date().getFullYear(),
        },
        ...AuthHeader(token),
      })
      .then((res) => {
        setLineChartData(res.data);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const fetchHabitMonth = () => {
    axios
      .get(
        `http://localhost:4000/api/statistics/currentMonthhHabitEntries?habit_id=${habit._id}`,
        AuthHeader(token)
      )
      .then((res) => {
        setDoneDays(res.data);
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  function CustomDay(props: DayProps) {
    const monthIndex = new Date(props.displayMonth).getMonth();
    const propsDate =
      typeof props.date === 'string' ? new Date(props.date) : props.date;

    const isinArray =
      doneDays && doneDays[monthIndex]
        ? doneDays[monthIndex].entries.find((d) => {
            const dateFromDoneDays =
              typeof d.date === 'string' ? new Date(d.date) : d.date;

            console.log(dateFromDoneDays, propsDate);
            return dateFromDoneDays.getTime() === propsDate.getTime();
          })
        : false;
    return (
      <div className={isinArray ? 'done' : ''}>
        <Day {...props} />
      </div>
    );
  }
  return (
    <>
      <Navigation />
      <ContentWrapper>
        {!habit ? (
          <>NO EXIST</>
        ) : (
          <div className="Habit mx-2">
            <div className="font-bold text-2xl py-10">
              <div>{habit.name}</div>
            </div>
            <div className="flex">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 flex-1">
                <div className="font-bold">
                  NO: <div>{habit._id}</div>
                </div>

                <div className="font-bold">
                  Type <div>{habit.type}</div>
                </div>

                <div className="font-bold">
                  Color:{' '}
                  <div className="flex">
                    <ColorBox color={habit.color} />
                  </div>
                </div>

                <div className="font-bold">
                  Frequency:<div>{habit.frequency.repeat}</div>
                </div>
                <div className="font-bold">
                  Icon:{' '}
                  <div>
                    <Icon icon={habit.icon} />
                  </div>
                </div>

                <div className="font-bold">
                  Days:
                  <div className="flex">
                    <Frequency size={''} {...habit.frequency} />
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-[400px]" id="pie-chart">
                <PieChart data={pieChartData} dimensions={{ margin: 20 }} />
              </div>
            </div>

            <div className="font-bold py-10 text-xl">History</div>
            <div className="flex justify-between">
              {doneDays ? (
                <>
                  {getLastThreeMonths(new Date()).map((month) => (
                    <DayPicker
                      components={{ Day: CustomDay }}
                      disableNavigation
                      mode="single"
                      defaultMonth={new Date(month.year, month.month)}
                      fixedWeeks
                    />
                  ))}
                </>
              ) : (
                <></>
              )}
            </div>

            <div id="line-chart">
              <LineChart data={lineChartData} dimensions={{ margin: 0 }} />
            </div>

            <div className="flex justify-end mt-10 right-5 bottom-5 fixed md:relative md:right-0">
              <Back />
              <Button color="failure" onClick={handleDeleteHabit}>
                Delete
              </Button>
            </div>
          </div>
        )}
      </ContentWrapper>
    </>
  );
};
