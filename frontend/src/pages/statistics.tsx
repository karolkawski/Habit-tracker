import './statistics.scss';
import axios from 'axios';
import LineChart from '../Charts/LineChart';
import CalendarChart from '../Charts/CalendarChart';
import PieChart from '../Charts/PieChart';
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faChartPie } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import useIsMobile from '../utils/isMobile';
import { Navigation } from '../Layout/Navigation/Navigation';
import { Button, ButtonGroup, Dropdown } from 'flowbite-react';
import {
  fetchDataRequest,
  fetchDataSuccess,
} from '../store/actions/habitActions';
import { ContentWrapper } from '../Layout/ContentWrapper';
import { AuthHeader } from '../auth/AuthHeader';
import { ButtonCustomTheme } from '../theme/ButtonCustomTheme';

export const Statistics = () => {
  const dispatch = useDispatch();

  const habits = useSelector((state: { habit }) => state.habit.habits);
  const token = useSelector((state: { user }) => state.user.token);

  const isMobile = useIsMobile();
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [habit, setHabit] = useState<any>('ALL');
  const [chartWrapperSize, setChartWrapperSize] = useState(
    getCurrentDimension(1)
  );
  const chartWrapperRef = useRef(null);
  const [chartType, setChartType] = useState<'linear' | 'circle'>('linear');
  const [calendarChartData, setCalendarChartData] = useState([]);
  const [Pie1ChartData, setPie1ChartData] = useState([]);
  const [Pie2ChartData, setPie2ChartData] = useState([]);
  const [pie1ChartTime, setPie1ChartTime] = useState('3m');
  const [pie2ChartTime, setPie2ChartTime] = useState('3m');
  const fetchHabits = async () => {
    dispatch(fetchDataRequest());

    try {
      const fetchedHabits = await axios.get(
        'http://localhost:4000/api/habits',
        AuthHeader(token)
      );
      if (fetchedHabits) {
        dispatch(fetchDataSuccess(fetchedHabits.data));
      }
    } catch (e) {
      console.error(e);
    }
  };
  function getCurrentDimension(scale: number) {
    const heatmapWrapper: HTMLElement | null =
      document.querySelector('#heat-map');
    return {
      width: heatmapWrapper ? heatmapWrapper.clientWidth * scale : 0,
      height: heatmapWrapper ? heatmapWrapper.clientHeight * scale : 0,
    };
  }
  const fetchEntriesStats = () => {
    axios
      .get('http://localhost:4000/api/statistics/entries', {
        params: {
          habitID: habit === 'ALL' ? 'ALL' : habit._id,
          year: year,
        },
        ...AuthHeader(token),
      })
      .then((res) => {
        setCalendarChartData(res.data);
      })
      .catch((e) => {
        console.error(e);
      });
  };
  const fetchHabitsStats = () => {
    axios
      .get('http://localhost:4000/api/statistics/habits', {
        params: {
          time: pie1ChartTime,
        },
        ...AuthHeader(token),
      })
      .then((res) => {
        setPie1ChartData(res.data);
      })
      .catch((e) => {
        console.error(e);
      });
  };
  const fetchWeekdayStats = () => {
    axios
      .get('http://localhost:4000/api/statistics/habitWeekdays', {
        params: {
          habitID: habit === 'ALL' ? 'ALL' : habit._id,
          time: pie2ChartTime,
        },
        ...AuthHeader(token),
      })
      .then((res) => {
        setPie2ChartData(res.data);
      })
      .catch((e) => {
        console.error(e);
      });
  };
  const fetchStats = () => {
    fetchEntriesStats();
    fetchHabitsStats();
    fetchWeekdayStats();
  };

  useEffect(() => {
    fetchHabitsStats();
  }, [pie1ChartTime]);

  useEffect(() => {
    fetchWeekdayStats();
  }, [pie2ChartTime]);

  useEffect(() => {
    fetchStats();
  }, [year, habit]);

  useEffect(() => {
    fetchHabits();
    fetchStats();
  }, [token]);

  const toogleTimeHandler = (chart: 'pie1' | 'pie2', value: any) => {
    if (chart === 'pie1') {
      setPie1ChartTime(value);
    }

    if (chart === 'pie2') {
      setPie2ChartTime(value);
    }
  };

  function chageMonthOrYear(date: Date | undefined) {
    if (date === undefined) {
      return;
    }

    const selectedYear: number = date.getFullYear();
    setYear(selectedYear);
  }

  const changeChartType = (type: 'linear' | 'circle') => {
    setChartType(type);
  };

  const handleSelectHabit = (habit: any) => setHabit(habit);

  useEffect(() => {
    const updateDimension = () => {
      const size: { width: number; height: number } = getCurrentDimension(1);
      setChartWrapperSize(size);
    };
    window.addEventListener('resize', updateDimension);

    return () => {
      window.removeEventListener('resize', updateDimension);
    };
  }, [chartWrapperSize]);

  // Obsługa przewijania
  useEffect(() => {
    const wrapper = chartWrapperRef.current;
    if (wrapper) {
      wrapper.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto',
      });
    }
  }, [calendarChartData]);

  return (
    <>
      <Navigation />
      <ContentWrapper>
        <div className={'Statistics mb-10'}>
          <div className="mb-5 flex justify-between md:justify-start items-center">
            <div className="flex justify-center items-center">
              <p className="mb-0 mr-3 bold">YEAR:</p>
              <Dropdown size={'sm'} label={new Date().getFullYear()}>
                <Dropdown.Item
                  onClick={() => handleSelectHabit(new Date().getFullYear())}
                  href={`#/${new Date().getFullYear()}`}
                >
                  {new Date().getFullYear()}
                </Dropdown.Item>
              </Dropdown>
            </div>
            <div className="ml-2 flex justify-center items-center">
              <p className="mb-0 mr-3">HABIT:</p>
              <Dropdown
                size={'sm'}
                label={habit && habit !== 'ALL' ? habit.name : 'ALL'}
              >
                <Dropdown.Item
                  onClick={() => handleSelectHabit('ALL')}
                  href={`#/ALL`}
                >
                  ALL
                </Dropdown.Item>
                {habits &&
                  habits.map((habit, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => handleSelectHabit(habit)}
                      href={`#/${habit._id}`}
                    >
                      {habit.name}
                    </Dropdown.Item>
                  ))}
              </Dropdown>
            </div>
          </div>
          <div className="mb-10">
            {/* Dodano kontener przewijania */}
            <div
              className="overflow-x-scroll w-[100%] h-[100%] md:overflow-hidden mb-10"
              id="heat-map"
              ref={chartWrapperRef}
            >
              <div className="min-w-[800px]">
                <div className="bg-white rounded flex justify-center items-center min-w-[800px]">
                  <CalendarChart
                    data={calendarChartData}
                    dimensions={{
                      margin: { top: 0, right: 0, bottom: 0, left: 50 },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {!isMobile ? (
            <></>
          ) : (
            <div className="pb-10 flex justify-center items-center">
              <ButtonGroup>
                {chartType === 'linear' ? (
                  <Button
                    color={'secondary'}
                    onClick={() => changeChartType('linear')}
                    theme={ButtonCustomTheme}
                  >
                    <FontAwesomeIcon icon={faChartLine} /> Linear
                  </Button>
                ) : (
                  <Button
                    theme={ButtonCustomTheme}
                    color={'gray'}
                    onClick={() => changeChartType('linear')}
                  >
                    <FontAwesomeIcon icon={faChartLine} /> Linear
                  </Button>
                )}
                {chartType === 'circle' ? (
                  <Button
                    theme={ButtonCustomTheme}
                    color="secondary"
                    onClick={() => changeChartType('circle')}
                  >
                    <FontAwesomeIcon icon={faChartPie} /> Circle
                  </Button>
                ) : (
                  <Button
                    theme={ButtonCustomTheme}
                    color={'gray'}
                    onClick={() => changeChartType('circle')}
                  >
                    <FontAwesomeIcon icon={faChartPie} /> Circle
                  </Button>
                )}
              </ButtonGroup>
            </div>
          )}
          <div className="bg-white rounded" id="pie-chart">
            {!isMobile || chartType === 'circle' ? (
              <>
                <PieChart data={Pie1ChartData} dimensions={{ margin: 20 }} />
                <div className="py-10 flex justify-center items-center">
                  <ButtonGroup>
                    <Button
                      theme={ButtonCustomTheme}
                      color={pie1ChartTime === '7d' ? 'secondary' : 'gray'}
                      onClick={() => {
                        toogleTimeHandler('pie1', '7d');
                      }}
                    >
                      7d
                    </Button>
                    <Button
                      theme={ButtonCustomTheme}
                      color={pie1ChartTime === '14d' ? 'secondary' : 'gray'}
                      onClick={() => {
                        toogleTimeHandler('pie1', '14d');
                      }}
                    >
                      14d
                    </Button>
                    <Button
                      theme={ButtonCustomTheme}
                      color={pie1ChartTime === '1m' ? 'secondary' : 'gray'}
                      onClick={() => {
                        toogleTimeHandler('pie1', '1m');
                      }}
                    >
                      1m
                    </Button>
                    <Button
                      theme={ButtonCustomTheme}
                      color={pie1ChartTime === '3m' ? 'secondary' : 'gray'}
                      onClick={() => {
                        toogleTimeHandler('pie1', '3m');
                      }}
                    >
                      3m
                    </Button>
                    <Button
                      theme={ButtonCustomTheme}
                      color={pie1ChartTime === '1y' ? 'secondary' : 'gray'}
                      onClick={() => {
                        toogleTimeHandler('pie1', '1y');
                      }}
                    >
                      1y
                    </Button>
                  </ButtonGroup>
                </div>
              </>
            ) : (
              <></>
            )}
            {!isMobile || chartType === 'circle' ? (
              <>
                <PieChart data={Pie2ChartData} dimensions={{ margin: 20 }} />
                <div className="py-10 flex justify-center items-center">
                  <ButtonGroup>
                    <Button
                      theme={ButtonCustomTheme}
                      color={pie1ChartTime === '7d' ? 'secondary' : 'gray'}
                      onClick={() => {
                        toogleTimeHandler('pie2', '7d');
                      }}
                    >
                      7d
                    </Button>
                    <Button
                      theme={ButtonCustomTheme}
                      color={pie2ChartTime === '14d' ? 'secondary' : 'gray'}
                      onClick={() => {
                        toogleTimeHandler('pie2', '14d');
                      }}
                    >
                      14d
                    </Button>
                    <Button
                      theme={ButtonCustomTheme}
                      color={pie2ChartTime === '1m' ? 'secondary' : 'gray'}
                      onClick={() => {
                        toogleTimeHandler('pie2', '1m');
                      }}
                    >
                      1m
                    </Button>
                    <Button
                      theme={ButtonCustomTheme}
                      color={pie2ChartTime === '3m' ? 'secondary' : 'gray'}
                      onClick={() => {
                        toogleTimeHandler('pie2', '3m');
                      }}
                    >
                      3m
                    </Button>
                    <Button
                      theme={ButtonCustomTheme}
                      color={pie2ChartTime === '1y' ? 'secondary' : 'gray'}
                      onClick={() => {
                        toogleTimeHandler('pie2', '1y');
                      }}
                    >
                      1y
                    </Button>
                  </ButtonGroup>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
          <div
            className="bg-white rounded relative pointer flex justify-center items-center"
            id="line-chart"
          >
            <div id="tolltip-linear">
              <div className="tooltip__date"></div>
              <div className="tooltip__content"></div>
            </div>
            {chartType === 'linear' ? (
              <LineChart data={calendarChartData} dimensions={{ margin: 0 }} />
            ) : (
              <></>
            )}
          </div>
        </div>
      </ContentWrapper>
    </>
  );
};
