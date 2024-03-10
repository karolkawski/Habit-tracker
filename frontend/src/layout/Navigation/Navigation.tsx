import { Navbar } from 'flowbite-react';
import { Link } from 'react-router-dom';

export const Navigation = () => {
  return (
    <Navbar>
      <Navbar.Brand as={Link} href="https://flowbite-react.com">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Flowbite React
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link href="/dashboard">Dashboard</Navbar.Link>{' '}
        <Navbar.Link href="/habits">Habits</Navbar.Link>{' '}
        <Navbar.Link href="/statistics">Statistics</Navbar.Link>
        <Navbar.Link href="/settings">Settings</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};
