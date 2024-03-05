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
import { Header } from '../layout/Header/Header';

export const Habit = () => {
  const habits = useSelector((state: { data }) => state.data.habits);
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

  const habit: HabitType | undefined = habits.find(
    (habit: { _id: string }) => habit._id === params.id
  );

  if (!habit) {
    return <>NO EXIST</>;
  }

  const handleDeleteHabit = () => {
    let token = 'xyz';
    let config = {
      headers: {
        Authorization: 'Bearer ' + token,
        'content-type': 'application/json',
      },
    };
    axios
      .delete(`http://localhost:4000/api/habits/${params.id}`, config)
      .then((res) => {
        const filteredHabits = habits.filter(
          (habit: HabitType) => habit._id !== params.id
        );
        navigate('/');
      })
      .catch((error: any) => {
        console.error(error);
      });
  };
  return (
    <>
      <Header />
      {!habit ? (
        <>NO EXIST</>
      ) : (
        <>
          <h2>Habit NO:{habit._id}</h2>
          <h2>Habit name: {habit.name}</h2>
          <div className="Habit__details">
            <h3>Details</h3>
            <div>type: {habit.type}</div>
            <div>
              color: <ColorBox color={habit.color} />
            </div>
            <div>
              icon: <Icon icon={habit.icon} />
            </div>
            <div>frequency: {habit.frequency.repeat}</div>
          </div>
          <div className="Habit__stats">
            <Frequency size={''} {...habit.frequency} />
          </div>
          <div className="Habit__actions">
            <Button color="danger">Delete</Button>
            <Back />
          </div>
        </>
      )}
    </>
  );
};
