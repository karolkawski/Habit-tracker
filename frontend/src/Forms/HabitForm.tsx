import { Navigation } from '../Layout/Navigation/Navigation';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Label,
  Radio,
  Select,
  TextInput,
  ToggleSwitch,
} from 'flowbite-react';
import { Back } from '../components/UI/Back/Back';
import { Formik } from 'formik';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { HabitType } from '../types/Habit.d';
import { ContentWrapper } from '../Layout/ContentWrapper';
import { AuthHeader } from '../auth/AuthHeader';
import { Header } from '../components/UI/Header/Header';

interface MyFormValues {
  _id: string;
  name: string;
  type: string;
  color: string;
  icon: string;
  count_mode: boolean;
  amount: number;
  frequency: {
    days: {
      Mon: boolean;
      Tue: boolean;
      Wed: boolean;
      Thu: boolean;
      Fri: boolean;
      Sat: boolean;
      Sun: boolean;
    };
    repeat: string;
  };
}

enum DayOfWeek {
  Mon = 'Mon',
  Tue = 'Tue',
  Wed = 'Wed',
  Thu = 'Thu',
  Fri = 'Fri',
  Sat = 'Sat',
  Sun = 'Sun',
}

const colorFormBoxes = [
  {
    name: 'color',
    value: '#0000ff',
    className: 'color-box color-box--blue',
    label: 'Blue',
    id: 'color1',
  },
  {
    name: 'color',
    value: '#ffff00',
    className: 'color-box color-box--yellow',
    label: 'Yellow',
    id: 'color2',
  },
  {
    name: 'color',
    value: '#00ff00',
    className: 'color-box color-box--green',
    label: 'Green',
    id: 'color3',
  },
  {
    name: 'color',
    value: '#e40000',
    className: 'color-box color-box--red',
    label: 'Red',
    id: 'color4',
  },
];

const iconsForm = [
  {
    className: 'icon-box icon-box--apple',
    id: 'fa-apple',
    value: 'apple',
    name: 'icon',
    label: 'Apple',
  },
  {
    className: 'icon-box icon-box--pencil',
    id: 'fa-pencil',
    value: 'pencil',
    name: 'icon',
    label: 'Pencil',
  },
  {
    className: 'icon-box icon-box--plane',
    id: 'fa-plane',
    value: 'plane',
    name: 'icon',
    label: 'Plane',
  },
];

export const HabitForm = ({ isAdd }) => {
  const habits = useSelector((state: { habit }) => state.habit.habits);
  let habit: HabitType | undefined;
  const navigate = useNavigate();
  const params = useParams();

  if (!habits) {
    return <></>;
  }

  if (!isAdd) {
    habit = habits.find((habit: HabitType) => habit._id === params.id);
  }

  if (!habit && !isAdd) {
    return <></>;
  }

  const initialValues: MyFormValues = {
    _id: uuidv4(),
    name: '',
    type: 'other',
    color: '#ffff00',
    icon: 'fa-plane',
    count_mode: false,
    amount: 1,
    frequency: {
      days: {
        Mon: false,
        Tue: false,
        Wed: false,
        Thu: false,
        Fri: false,
        Sat: false,
        Sun: false,
      },
      repeat: 'week',
    },
  };

  const handleDeleteHabit = () => {
    console.log('delete');
    axios
      .delete(`http://localhost:4000/api/habits/${params.id}`, AuthHeader)
      .then((res) => {
        navigate('/habits');
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  return (
    <>
      <Navigation />
      <ContentWrapper>
        <Header title={'New habit'} />

        <Formik
          initialValues={isAdd ? initialValues : habit}
          onSubmit={(values) => {
            if (isAdd) {
              axios
                .post(
                  'http://localhost:4000/api/habits/add',
                  { ...values },
                  AuthHeader
                )
                .then((res) => {
                  console.log(res.data);
                  navigate('/habits');
                })
                .catch((error: any) => {
                  console.error(error);
                });
              return;
            }

            axios
              .patch(
                `http://localhost:4000/api/habits/${values._id}`,
                { ...values },
                AuthHeader
              )
              .then((res) => {
                navigate('/habits');
              })
              .catch((error: any) => {
                console.error(error);
              });
          }}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit}>
              <div className="md:flex">
                <div className="md:flex-1 md:pr-1">
                  <div className="mb-2 block">
                    <Label htmlFor="name" value="Name" />
                  </div>
                  <TextInput
                    id="name"
                    type="name"
                    placeholder="John"
                    value={props.values.name}
                    required
                    onChange={props.handleChange}
                  />
                </div>

                <div className="md:flex-1 md:pl-1">
                  <div className="mb-2 block">
                    <Label htmlFor="type" value="Type" />
                  </div>
                  <Select
                    id="type"
                    required
                    onChange={props.handleChange}
                    value={props.values.type}
                  >
                    <option value="other">other</option>
                    <option value="medical">medical</option>
                    <option value="enterteiment">enterteiment</option>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col mt-2">
                <Label htmlFor="color" value="Color" className="mb-2" />
                <div className="flex gap-2">
                  {colorFormBoxes.map((color: any) => (
                    <div key={color.id}>
                      <Radio
                        id={color.id}
                        name={color.name}
                        className={color.className}
                        onChange={props.handleChange}
                        value={color.value}
                      />
                      <Label htmlFor={color.id} className="ml-2">
                        {color.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col mt-2">
                <Label htmlFor="icon" value="Icon" className="mb-2" />
                <div className="flex gap-2">
                  {iconsForm.map((icon) => (
                    <div key={icon.id} className="flex items-center">
                      <Radio
                        className={icon.className}
                        id={icon.id}
                        value={icon.value}
                        name={icon.name}
                        onChange={props.handleChange}
                      />
                      <Label htmlFor="icon" className="ml-2">
                        {icon.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-2">
                <Label htmlFor="days">Days</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <ToggleSwitch
                    checked={props.values.frequency.days.Mon}
                    id="frequency.days.Mon"
                    label="Mon"
                    onChange={(checked) => {
                      props.setFieldValue('frequency.days.Mon', checked);
                    }}
                  />
                  <ToggleSwitch
                    checked={props.values.frequency.days.Tue}
                    id="frequency.days.Tue"
                    label="Tue"
                    onChange={(checked) => {
                      props.setFieldValue('frequency.days.Tue', checked);
                    }}
                  />
                  <ToggleSwitch
                    checked={props.values.frequency.days.Wed}
                    id="frequency.days.Wed"
                    label="Wed"
                    onChange={(checked) => {
                      props.setFieldValue('frequency.days.Wed', checked);
                    }}
                  />
                  <ToggleSwitch
                    checked={props.values.frequency.days.Thu}
                    id="frequency.days.Thu"
                    label="Thu"
                    onChange={(checked) => {
                      props.setFieldValue('frequency.days.Thu', checked);
                    }}
                  />
                  <ToggleSwitch
                    checked={props.values.frequency.days.Fri}
                    id="frequency.days.Fri"
                    label="Fri"
                    onChange={(checked) => {
                      props.setFieldValue('frequency.days.Fri', checked);
                    }}
                  />
                  <ToggleSwitch
                    checked={props.values.frequency.days.Sat}
                    id="frequency.days.Sat"
                    label="Sat"
                    onChange={(checked) => {
                      props.setFieldValue('frequency.days.Sat', checked);
                    }}
                  />
                  <ToggleSwitch
                    checked={props.values.frequency.days.Sun}
                    id="frequency.days.Sun"
                    label="Sun"
                    onChange={(checked) => {
                      props.setFieldValue('frequency.days.Sun', checked);
                    }}
                  />
                </div>
              </div>

              <div className="mt-2 mb-4 md:max-w-[50%]">
                <div className="mb-2 block">
                  <Label htmlFor="repeat" value="Frequency" />
                </div>
                <Select
                  id="frequency.repeat"
                  required
                  onChange={props.handleChange}
                  value={props.values.frequency.repeat}
                >
                  <option value="week">week</option>
                  <option value="2 weeks">2 weeks</option>
                  <option value="month">month</option>
                </Select>
              </div>
              <div className="flex justify-end">
                {isAdd ? (
                  <Button type="submit" color="success">
                    Submit
                  </Button>
                ) : (
                  <>
                    <Button color="danger" onClick={handleDeleteHabit}>
                      Delete
                    </Button>
                    <Button type="submit" color="success">
                      Update
                    </Button>
                  </>
                )}
              </div>
            </form>
          )}
        </Formik>
        <Back />
      </ContentWrapper>
    </>
  );
};
