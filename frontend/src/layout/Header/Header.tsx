// import Container from 'react-bootstrap/esm/Container';
// import Nav from 'react-bootstrap/esm/Nav';
// import Navbar from 'react-bootstrap/esm/Navbar';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   faChartSimple,
//   faGear,
//   faCalendarDays,
//   faList,
// } from '@fortawesome/free-solid-svg-icons';
// import NavDropdown from 'react-bootstrap/esm/NavDropdown';
// import Dropdown from 'react-bootstrap/esm/Dropdown';
// import Button from 'react-bootstrap/esm/Button';
// import ButtonGroup from 'react-bootstrap/ButtonGroup';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   faChartSimple,
//   faGear,
//   faCalendarDays,
//   faList,
// } from '@fortawesome/free-solid-svg-icons';
import { Navbar } from 'flowbite-react';
import { Link } from 'react-router-dom';

export const Header = () => {
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

// <Navbar bg="dark" variant="dark">
//   <Container>
//     <Navbar.Brand href="#home">
//       <img
//         width="50"
//         height="50"
//         className="rounded-circle"
//         src="src/logo-prototype.png"
//         alt="Logo"
//       />
//     </Navbar.Brand>
//     <Nav className="m-auto justify-content-center flex-center">
//       <Nav.Link href="/dashboard">
//         <FontAwesomeIcon icon={faCalendarDays} /> Dashboard
//       </Nav.Link>
//       <Nav.Link href="/habits">
//         <FontAwesomeIcon icon={faList} /> Habits
//       </Nav.Link>
//       <Nav.Link href="/statistics">
//         <FontAwesomeIcon icon={faChartSimple} /> Statistics
//       </Nav.Link>
//     </Nav>
//     <Dropdown as={ButtonGroup}>
//       <Button variant="success">Panel</Button>

//       <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />

//       <Dropdown.Menu>
//         <Dropdown.Header>
//           <img
//             width="50"
//             height="50"
//             className="rounded-circle"
//             src="src/logo-prototype.png"
//             alt="Logo"
//           />
//           <h6>name surname</h6>
//           <h6>email@email.com</h6>
//         </Dropdown.Header>
//         <Dropdown.Item href="#/action-1">
//           <Nav.Link href="/settings">
//             <FontAwesomeIcon icon={faGear} /> Settings
//           </Nav.Link>
//         </Dropdown.Item>
//         <Dropdown.Divider />
//         <Dropdown.Item href="#/action-3">Logut</Dropdown.Item>
//       </Dropdown.Menu>
//     </Dropdown>

//     <NavDropdown title="Dropdown" id="collapsible-nav-dropdown">
//       <h6>Imie nazwisko</h6>
//       <h6>email@wmail.com</h6>
//       <NavDropdown.Item href="#action/3.1">Details</NavDropdown.Item>
//       <NavDropdown.Item href="#action/3.2">Settings</NavDropdown.Item>
//       <NavDropdown.Divider />
//       <NavDropdown.Item href="#action/3.4">Logout</NavDropdown.Item>
//     </NavDropdown>
//   </Container>
// </Navbar>
//   );
// };
