import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import axios from 'axios';
import {
  fetchDataRequest,
  fetchDataSuccess,
} from '../store/actions/habitActions';
import { getTokenFromLocalStorage } from '../utils/token';
import { Navigation } from '../Layout/Navigation/Navigation';
import { Button, Table } from 'flowbite-react';
import { ColorBox } from '../components/UI/ColorBox/ColorBox';
import { Frequency } from '../components/UI/Frequency/Frequency';
import { Link } from 'react-router-dom';
import { Icon } from '../components/UI/Icon/Icon';
import { ContentWrapper } from '../Layout/ContentWrapper';

const config = {
  headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
};

export const Habits = () => {
  const dispatch = useDispatch();
  const habits = useSelector((state: { habit }) => state.habit.habits);

  const fetchHabits = async () => {
    dispatch(fetchDataRequest());

    try {
      const fetchedHabits = await axios.get(
        'http://localhost:4000/api/habits',
        config
      );
      if (fetchedHabits) {
        dispatch(fetchDataSuccess(fetchedHabits.data));
      }
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    fetchHabits();
  }, []);

  if (!habits) {
    return (
      <>
        <Navigation />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <ContentWrapper>
        <Table>
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Type</Table.HeadCell>
            <Table.HeadCell>Color</Table.HeadCell>
            <Table.HeadCell>Icon</Table.HeadCell>
            <Table.HeadCell>Frequency</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {habits &&
              habits.map((item) => (
                <Table.Row
                  key={item._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    <Link to={`/habits/${item._id}`}>{item.name}</Link>
                  </Table.Cell>
                  <Table.Cell> {item.type}</Table.Cell>
                  <Table.Cell>
                    <ColorBox color={item.color} />
                  </Table.Cell>
                  <Table.Cell>
                    <Icon icon={item.icon} />
                  </Table.Cell>
                  <Table.Cell>
                    <Frequency
                      size="s"
                      days={item.frequency.days}
                      repeat={item.frequency.repeat}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/habits/${item._id}/edit`}>
                      <Button>Edit</Button>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
        <Link to={`/add`}>
          <Button>Add</Button>
        </Link>
      </ContentWrapper>
    </>
  );
};
