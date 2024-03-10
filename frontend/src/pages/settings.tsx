import { ToggleSwitch } from 'flowbite-react';
import { Navigation } from '../Layout/Navigation/Navigation';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { ContentWrapper } from '../Layout/ContentWrapper';
import { AuthHeader } from '../auth/AuthHeader';
import { Header } from '../components/UI/Header/Header';

export const Settings = () => {
  const darkMode = useSelector(
    (state: { settings }) => state.settings.darkMode
  );

  const handleChangeDarmMode = (darkMode: boolean) => {
    addSetiingsDarkMode(darkMode);
  };

  const addSetiingsDarkMode = (darkMode) => {
    axios
      .post(
        'http://localhost:4000/api/settings/add',
        {
          name: 'darkMode',
          value: darkMode,
        },
        AuthHeader
      )
      .then((res) => {
        setDarkMode(darkMode);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <>
      <Navigation />
      <ContentWrapper>
        <Header title={'Settings'} />

        <ToggleSwitch
          checked={darkMode}
          id="darkMode"
          label="Dark mode"
          onChange={() => {
            handleChangeDarmMode(!darkMode);
          }}
        />
      </ContentWrapper>
    </>
  );
};
