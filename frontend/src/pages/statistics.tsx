import './statistics.scss';
import axios from 'axios';
import LineChart from '../Charts/LineChart';
import CalendarChart from '../Charts/CalendarChart';
import PieChart from '../Charts/PieChart';
import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faChartPie } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import useIsMobile from '../utils/isMobile';
import { Header } from '../layout/Header/Header';
import { Button } from 'flowbite-react';
import { getTokenFromLocalStorage } from '../utils/token';

const config = {
  headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
};

export const Statistics = () => {
  const habits = useSelector((state: { data }) => state.data.habits);
  const isMobile = useIsMobile();
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [habit, setHabit] = useState<any>('ALL');
  const [chartWrapperSize, setChartWrapperSize] = useState(
    getCurrentDimension(1)
  );
  const [chartType, setChartType] = useState<'linear' | 'circle'>('linear');
  const [calendarChartData, setCalendarChartData] = useState([]);
  const [Pie1ChartData, setPie1ChartData] = useState([]);
  const [Pie2ChartData, setPie2ChartData] = useState([]);
  const [pie1ChartTime, setPie1ChartTime] = useState('3m');
  const [pie2ChartTime, setPie2ChartTime] = useState('3m');

  function getCurrentDimension(scale: number) {
    const heatmapWrapper: HTMLElement | null =
      document.querySelector('.Statistic__Chart');
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
        ...config,
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
        ...config,
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
      .get('http://localhost:4000/api/statistics/weekday', {
        params: {
          habitID: habit === 'ALL' ? 'ALL' : habit._id,
          time: pie2ChartTime,
        },
        ...config,
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
    fetchStats();
  }, []);

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

    const selectedMonth: number = date.getMonth() + 1;
    const selectedYear: number = date.getFullYear();
    setYear(selectedYear);
    // setMonth(selectedMonth);
  }

  const changeChartType = (type: 'linear' | 'circle') => {
    setChartType(type);
  };

  //@ts-ignore //!to change
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

  if (habits && habits.length === 0) {
    return <>NONE</>;
  }

  return (
    <>
      <Header />
      <div className={'Statistics container'}>
        <div>
          <div className="my-1 d-flex flex-div">
            <p className="mb-0 mr-3 font-weight-bold d-flex justify-content-center align-items-center">
              YEAR:
            </p>
            <DayPicker
              selected={new Date()}
              captionLayout="dropdown-buttons"
              fromYear={2015}
              toYear={2025}
              onMonthChange={chageMonthOrYear}
            />
            <p className="mb-0 mr-3 font-weight-bold d-flex justify-content-center align-items-center ">
              HABIT:
            </p>
          </div>
        </div>
        <div>
          <div className="ChartPill Statistic__Chart" sm={12} md={12} lg={12}>
            <CalendarChart
              data={calendarChartData}
              dimensions={{ margin: { top: 0, right: 0, bottom: 0, left: 50 } }}
            />
          </div>
        </div>
        {!isMobile ? (
          <></>
        ) : (
          <div>
            <div className="Controls">
              {chartType === 'linear' ? (
                <Button
                  variant="primary"
                  onClick={() => changeChartType('linear')}
                >
                  <FontAwesomeIcon icon={faChartLine} /> Linear
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => changeChartType('linear')}
                >
                  <FontAwesomeIcon icon={faChartLine} /> Linear
                </Button>
              )}
              {chartType === 'circle' ? (
                <Button
                  variant="primary"
                  onClick={() => changeChartType('circle')}
                >
                  <FontAwesomeIcon icon={faChartPie} /> Circle
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => changeChartType('circle')}
                >
                  <FontAwesomeIcon icon={faChartPie} /> Circle
                </Button>
              )}
            </div>
          </div>
        )}

        <div>
          <div className="ChartPill pieCharts">
            {!isMobile || chartType === 'circle' ? (
              <>
                <PieChart data={Pie1ChartData} dimensions={{ margin: 20 }} />
                <div className="Controls">
                  <Button
                    variant={pie1ChartTime === '7d' ? 'primary' : 'secondary'}
                    onClick={() => {
                      toogleTimeHandler('pie1', '7d');
                    }}
                  >
                    7d
                  </Button>
                  <Button
                    variant={pie1ChartTime === '14d' ? 'primary' : 'secondary'}
                    onClick={() => {
                      toogleTimeHandler('pie1', '14d');
                    }}
                  >
                    14d
                  </Button>
                  <Button
                    variant={pie1ChartTime === '1m' ? 'primary' : 'secondary'}
                    onClick={() => {
                      toogleTimeHandler('pie1', '1m');
                    }}
                  >
                    1m
                  </Button>
                  <Button
                    variant={pie1ChartTime === '3m' ? 'primary' : 'secondary'}
                    onClick={() => {
                      toogleTimeHandler('pie1', '3m');
                    }}
                  >
                    3m
                  </Button>
                  <Button
                    variant={pie1ChartTime === '1y' ? 'primary' : 'secondary'}
                    onClick={() => {
                      toogleTimeHandler('pie1', '1y');
                    }}
                  >
                    1y
                  </Button>
                </div>
              </>
            ) : (
              <></>
            )}
            {!isMobile || chartType === 'circle' ? (
              <>
                <PieChart data={Pie2ChartData} dimensions={{ margin: 20 }} />
                <div className="Controls">
                  <Button
                    variant={pie1ChartTime === '7d' ? 'primary' : 'secondary'}
                    onClick={() => {
                      toogleTimeHandler('pie2', '7d');
                    }}
                  >
                    7d
                  </Button>
                  <Button
                    variant={pie2ChartTime === '14d' ? 'primary' : 'secondary'}
                    onClick={() => {
                      toogleTimeHandler('pie2', '14d');
                    }}
                  >
                    14d
                  </Button>
                  <Button
                    variant={pie2ChartTime === '1m' ? 'primary' : 'secondary'}
                    onClick={() => {
                      toogleTimeHandler('pie2', '1m');
                    }}
                  >
                    1m
                  </Button>
                  <Button
                    variant={pie2ChartTime === '3m' ? 'primary' : 'secondary'}
                    onClick={() => {
                      toogleTimeHandler('pie2', '3m');
                    }}
                  >
                    3m
                  </Button>
                  <Button
                    variant={pie2ChartTime === '1y' ? 'primary' : 'secondary'}
                    onClick={() => {
                      toogleTimeHandler('pie2', '1y');
                    }}
                  >
                    1y
                  </Button>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div>
          <div className="ChartPill lineChart">
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
      </div>
    </>
  );
};
