import { useEffect, useState } from 'react';
import { Header } from '../layout/Header/Header';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Label,
  Radio,
  Select,
  TextInput,
  ToggleSwitch,
} from 'flowbite-react';
import { Back } from '../components/UI/Back/Back';
import { Form, Formik } from 'formik';
import { v4 as uuidv4 } from 'uuid';
import { HabitType } from '../types/Habit.d';
import { useSelector } from 'react-redux';

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

export const Add = () => {
  const [rel, setRel] = useState(false);
  const habits = useSelector((state: { habit }) => state.habit.habits);
  const navigate = useNavigate();
  const [switch1, setSwitch1] = useState(false);
  const [switch2, setSwitch2] = useState(true);
  const [switch3, setSwitch3] = useState(true);
  const [switch4, setSwitch4] = useState(false);
  const [switch5, setSwitch5] = useState(true);
  const [switch6, setSwitch6] = useState(true);
  const [addFormData, setAddFormData] = useState({
    _id: '',
    name: '',
    type: 'other',
    color: '#E74C3C',
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
      repeat: 'weekx2',
    },
  });

  useEffect(() => {
    if (!rel) {
      setRel(true);
      return;
    }
    navigate('/habits');
  }, [habits]);
  const initialValues: MyFormValues = { ...addFormData };
  const handleAddFormChange = (event: {
    [x: string]: any;
    preventDefault: () => void;
  }) => {
    const fieldName: string = event.target.getAttribute('name');
    const fieldvalue = event.target.value;
    const newFormData: HabitType = { ...addFormData };

    switch (fieldName) {
      case 'repeat':
        newFormData.frequency.repeat = event.target.value;
        break;
      case 'days':
        const dayName: string = event.target.getAttribute('id');
        newFormData.frequency.days[dayName as DayOfWeek] = event.target.checked;
        break;
      default:
        //@ts-ignore
        newFormData[fieldName] = fieldvalue;
        break;
    }

    setAddFormData(newFormData);
  };

  const handleAddFormsubmit = (event: { preventDefault: () => void }) => {
    // event.preventDefault();

    const newHabit: HabitType = {
      _id: uuidv4(),
      name: addFormData.name,
      type: addFormData.type,
      color: addFormData.color,
      icon: addFormData.icon,
      count_mode: false,
      amount: 1,
      frequency: {
        days: {
          Mon: addFormData.frequency.days.Mon,
          Tue: addFormData.frequency.days.Tue,
          Wed: addFormData.frequency.days.Wed,
          Thu: addFormData.frequency.days.Thu,
          Fri: addFormData.frequency.days.Fri,
          Sat: addFormData.frequency.days.Sat,
          Sun: addFormData.frequency.days.Sun,
        },
        repeat: addFormData.frequency.repeat,
      },
    };
    const token = 'xyz';
    const config = {
      headers: {
        Authorization: 'Bearer ' + token,
        'content-type': 'application/json',
        'content-length': 'application/json',
      },
    };
    axios
      .post('/api/habits/add', newHabit, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        //Therefore, it is best to ensure that the res object is of the correct type before attempting to add it to the updatedHabits array. You can do this by checking the type of the response object and using conditional logic to ensure that it matches the HabitType interface.
        // const updatedHabits: HabitType[] = [...habits, res as unknown as HabitType];
        // setHabits(updatedHabits);
      })
      .catch((error: any) => {
        console.error(error);
      });
  };
  return (
    <>
      <Header />
      <div className="container mx-auto">
        <h4>Add habit</h4>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, actions) => {}}
        >
          <form onSubmit={handleAddFormsubmit}>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Name" />
              </div>
              <TextInput
                id="name"
                type="name"
                placeholder="John"
                required
                onChange={handleAddFormChange}
              />
            </div>

            <div className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="type" value="Type" />
              </div>
              <Select id="countries" required onChange={handleAddFormChange}>
                <option value="other">other</option>
                <option value="medical">medical</option>
                <option value="enterteiment">enterteiment</option>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="color" value="Color" />
              {colorFormBoxes.map((color: any) => {
                return (
                  <>
                    <Radio
                      key={uuidv4()}
                      id={color.color}
                      name={color.name}
                      value={color.value}
                      className={color.className}
                      onChange={handleAddFormChange}
                    />
                    <Label htmlFor="color">{color.label}</Label>
                  </>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="icon" value="Icon" />

              <>
                <Radio
                  className="icon-box icon-box--plane"
                  id="fa-plane"
                  value="fa-plane"
                  name="icon"
                  onChange={handleAddFormChange}
                />
                <Label htmlFor="color">Plane</Label>
              </>
              <>
                <Radio
                  className="icon-box icon-box--pencil"
                  id="fa-pencil"
                  value="fa-pencil"
                  name="icon"
                  onChange={handleAddFormChange}
                />
                <Label htmlFor="color">Pencil</Label>
              </>
              <>
                <Radio
                  className="icon-box icon-box--apple"
                  id="fa-apple"
                  value="fa-apple-whole"
                  name="icon"
                  onChange={handleAddFormChange}
                />
                <Label htmlFor="color">Apple</Label>
              </>
            </div>
            <div className="flex max-w-md flex-col gap-4">
              <ToggleSwitch
                checked={switch1}
                label="Mon"
                onChange={setSwitch1}
              />
              <ToggleSwitch
                checked={switch2}
                label="Tue"
                onChange={setSwitch2}
              />
              <ToggleSwitch
                checked={switch3}
                label="Wed"
                onChange={setSwitch3}
              />
              <ToggleSwitch
                checked={switch4}
                label="Thu"
                onChange={setSwitch4}
              />
              <ToggleSwitch
                checked={switch5}
                label="Fri"
                onChange={setSwitch5}
              />
              <ToggleSwitch
                checked={switch6}
                label="Sat"
                onChange={setSwitch6}
              />
              <ToggleSwitch
                checked={switch6}
                label="Sun"
                onChange={setSwitch6}
              />
            </div>

            <div className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="repeat" value="Frequency" />
              </div>
              <Select id="countries" required onChange={handleAddFormChange}>
                <option value="week">week</option>
                <option value="2 weeks">2 weeks</option>
                <option value="month">month</option>
              </Select>
            </div>
            <Button type="submit" color="success">
              Submit
            </Button>
          </form>
        </Formik>
        <Back />
      </div>
    </>
  );
};
