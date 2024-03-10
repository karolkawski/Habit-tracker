import React, { useEffect } from 'react';
import { format, endOfWeek, isWithinInterval, startOfWeek } from 'date-fns';
import 'react-day-picker/dist/style.css';
import './Calendar.scss';
import {
  CaptionProps,
  DayPicker,
  Row,
  RowProps,
  useNavigation,
} from 'react-day-picker';
import { Button } from 'flowbite-react';

export function Cal({
  selectedDate,
  handleChangeDate,
}: {
  selectedDate: Date;
  handleChangeDate: () => void;
}) {
  const [selected, setSelected] = React.useState<Date>(selectedDate);

  function CustomSelect(date: Date | undefined) {
    if (date === undefined) {
      return;
    }

    date.setHours(selected.getHours());
    date.setMinutes(selected.getMinutes());
    date.setSeconds(selected.getSeconds());
    setSelected(date);
  }

  function CurrentWeekRow(props: RowProps) {
    const isDateInCurrentWeek = (dateToCheck: Date) => {
      const start = startOfWeek(selected);
      const end = endOfWeek(selected);

      return isWithinInterval(dateToCheck, { start, end });
    };
    const isNotCurrentWeek = props.dates.every(
      (date) => !isDateInCurrentWeek(date)
    );
    if (isNotCurrentWeek) return <></>;
    return <Row {...props} />;
  }

  useEffect(() => {
    handleChangeDate(selected);
  }, [selected]);

  const changeDateCalculation = (direction: 'prev' | 'next'): Date => {
    const date = selected;

    switch (direction) {
      case 'prev':
        date.setDate(date.getDate() - 7);
        date.setHours(selected.getHours());
        date.setMinutes(selected.getMinutes());
        date.setSeconds(selected.getSeconds());
        break;
      case 'next':
        date.setDate(date.getDate() + 7);
        date.setHours(selected.getHours());
        date.setMinutes(selected.getMinutes());
        date.setSeconds(selected.getSeconds());
        break;
      default:
        break;
    }
    return date;
  };

  function CustomCaption(props: CaptionProps) {
    const { goToMonth, nextMonth, previousMonth, currentMonth, goToDate } =
      useNavigation();

    return (
      <>
        <h2>{format(props.displayMonth, 'MMM yyy')}</h2>
        <div className="flex justify-end">
          <Button
            color={'blue'}
            className="mr-2"
            disabled={!previousMonth}
            onClick={() => {
              const date = new Date(selected);

              date.setDate(selected.getDate() - 7);
              date.setHours(selected.getHours());
              date.setMinutes(selected.getMinutes());
              date.setSeconds(selected.getSeconds());

              if (date.getMonth() !== currentMonth.getMonth()) {
                previousMonth && goToMonth(previousMonth);
              }
              CustomSelect(date);
            }}
          >
            {'<'}
          </Button>
          <Button
            color={'blue'}
            disabled={!nextMonth}
            onClick={() => {
              const date = new Date(selected);

              date.setDate(selected.getDate() + 7);
              date.setHours(selected.getHours());
              date.setMinutes(selected.getMinutes());
              date.setSeconds(selected.getSeconds());

              if (date.getMonth() !== currentMonth.getMonth()) {
                nextMonth && goToMonth(nextMonth);
              }
              CustomSelect(date);
            }}
          >
            {'>'}
          </Button>
        </div>
      </>
    );
  }
  let footer = <p>Please pick a day.</p>;
  if (selected) {
    footer = <p>You picked {format(selected, 'PP')}.</p>;
  }
  return (
    <DayPicker
      components={{ Row: CurrentWeekRow, Caption: CustomCaption }}
      showOutsideDays
      mode="single"
      selected={selected}
      fixedWeeks
      onSelect={CustomSelect}
    />
  );
}
