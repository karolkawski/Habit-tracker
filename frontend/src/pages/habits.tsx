import { Frequency } from '../components/UI/Frequency/Frequency';
import { ColorBox } from '../components/UI/ColorBox/ColorBox';
import { Button, Table } from 'flowbite-react';
import { Header } from '../layout/Header/Header';
import { Icon } from '../components/UI/Icon/Icon';
import { Link } from 'react-router-dom';
import data from '../assets/data';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

export const Habits = () => {
  const habits = useSelector((state: { data }) => state.data.habits);

  if (!habits) {
    return (
      <>
        <Header />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="overflow-x-auto container mx-auto">
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
                  key={item.id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {item.name}
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
                      size=""
                      days={item.frequency.days}
                      repeat={item.frequency.repeat}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/habits/${item.id}/edit`}>
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
      </div>
    </>
  );
};
