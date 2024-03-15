import 'react-day-picker/dist/style.css';
import './Calendar.scss';
import React, { useEffect } from 'react';
import { format, endOfWeek, isWithinInterval, startOfWeek } from 'date-fns';
import {
  CaptionProps,
  DayPicker,
  Row,
  RowProps,
  useNavigation,
} from 'react-day-picker';
import { Button, ButtonGroup } from 'flowbite-react';

export function Cal({
  selectedDate,
  handleChangeDate,
}: {
  selectedDate: Date;
  handleChangeDate: (date: Date) => void;
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
  }, [handleChangeDate, selected]);

  function CustomCaption(props: CaptionProps) {
    const { goToMonth, nextMonth, previousMonth, currentMonth } =
      useNavigation();

    return (
      <>
        <div className="flex justify-between">
          <h1 className="flex justify-center items-center text-xl">
            {format(props.displayMonth, 'MMM yyy')}
          </h1>
          <ButtonGroup>
            <Button
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
          </ButtonGroup>
        </div>
      </>
    );
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
