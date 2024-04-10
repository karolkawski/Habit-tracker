import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Label, TextInput } from 'flowbite-react';
import { ContentWrapper } from '../Layout/ContentWrapper';
import { ButtonCustomTheme } from '../theme/ButtonCustomTheme';

export const Registry = () => {
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassowrd] = useState('');
  const [passwordRepeated, setPassowrdRepeated] = useState('');
  const navigate = useNavigate();
  const [IsLoading, setIsLoading] = useState(false);

  const signUp = async () => {
    try {
      setIsLoading(true);
      axios
        .post('http://localhost:5001/api/user/add', {
          name,
          email,
          login: email,
          password,
        })
        .then((response) => {
          navigate('/dashboard');
        })
        .catch((e) => {
          console.error('Something went wrong during signing in: ', e);
        });
    } catch (err) {
      console.error('Some error occured during signing in: ', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormData = (data) => {
    const { id, value } = data.target;

    switch (id) {
      case 'login':
        setLogin(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'name':
        setName(value);
        break;
      case 'password':
        setPassowrd(value);
        break;
      case 'password-repeat':
        setPassowrdRepeated(value);
        break;
      default:
        break;
    }
  };

  if (IsLoading) {
    <ContentWrapper>loading...</ContentWrapper>;
  }

  return (
    <ContentWrapper>
      <div
        className="flex flex-col justify-center items-center"
        style={{ height: '100vh' }}
      >
        <a
          href="/"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Habit tracker
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign up
            </h1>
            <form className="flex max-w-md flex-col gap-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="login" value="Login" />
                </div>
                <TextInput
                  id="login"
                  type="text"
                  placeholder="login"
                  value={login}
                  onChange={handleFormData}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="login" value="Name" />
                </div>
                <TextInput
                  id="name"
                  type="text"
                  placeholder="name"
                  value={name}
                  onChange={handleFormData}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="login" value="Your email" />
                </div>
                <TextInput
                  id="email"
                  type="text"
                  placeholder="email"
                  value={email}
                  onChange={handleFormData}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="password" value="Your password" />
                </div>
                <TextInput
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={handleFormData}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="password-repeat"
                    value="Repeat your password"
                  />
                </div>
                <TextInput
                  id="password-repeat"
                  type="password"
                  required
                  value={passwordRepeated}
                  onChange={handleFormData}
                />
              </div>
              <div className="flex items-center gap-2"></div>
              <Button
                theme={ButtonCustomTheme}
                color="secondary"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  if (login.length < 5 || email.length < 5 || name.length < 5) {
                    return;
                  }

                  if (password.length < 5 || passwordRepeated.length < 5) {
                    return;
                  }

                  if (password !== passwordRepeated) {
                    return;
                  }
                  signUp();
                }}
              >
                Submit
              </Button>
            </form>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Do you alerady have account?
              <a
                href="/"
                className="font-medium pl-2 text-secondary hover:underline dark:text-primary-500"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};
