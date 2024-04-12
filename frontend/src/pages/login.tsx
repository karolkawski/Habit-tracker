import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Label, TextInput } from 'flowbite-react';
import { ContentWrapper } from '../Layout/ContentWrapper';
import { ButtonCustomTheme } from '../theme/ButtonCustomTheme';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTokenSuccess } from '../store/actions/userActions';

export const Login = () => {
  const dispatch = useDispatch();
  const [loginOrEmail, setLoginOrEmail] = useState('');
  const [password, setPassowrd] = useState('');
  const [errorMessage, setErrorMessage] = useState<undefined | string>(
    undefined
  );
  const token = useSelector((state: { user }) => state.user.token);

  const navigate = useNavigate();
  const [IsLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [dispatch, navigate, token]);

  const signIn = async () => {
    try {
      setIsLoading(true);
      axios
        .post('http://localhost:5001/api/user/login', {
          loginOrEmail,
          password,
        })
        .then((response) => {
          dispatch(fetchTokenSuccess(response.data.token));
        })
        .catch((e) => {
          console.error('Something went wrong during signing in: ', e);
          setErrorMessage(
            'Invalid Credentials: The email address or password you entered is incorrect. Please try again'
          );
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
        setLoginOrEmail(value);
        break;
      case 'password':
        setPassowrd(value);
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
              Sign in to your account
            </h1>
            <form className="flex max-w-md flex-col gap-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="login" value="Your email or login" />
                </div>
                <TextInput
                  id="login"
                  type="text"
                  placeholder="login"
                  value={loginOrEmail}
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
              <div className="flex items-center gap-2"></div>
              <Button
                theme={ButtonCustomTheme}
                color="secondary"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  setErrorMessage(undefined);
                  if (login.length < 5) {
                    setErrorMessage(
                      'Short Login: Login must be at least 5 characters long'
                    );
                    return;
                  }
                  if (password.length < 5) {
                    setErrorMessage(
                      'Short Password: Password must be at least 5 characters long'
                    );
                    return;
                  }
                  signIn();
                }}
              >
                Submit
              </Button>
            </form>
            <p className="text-red-500">{errorMessage}</p>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Don’t have an account yet?{' '}
              <a
                href="/registry"
                className="font-medium pl-2 text-secondary hover:underline dark:text-primary-500"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};
