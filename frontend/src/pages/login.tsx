import axios from 'axios';
import { useState } from 'react';
import { storeTokenInLocalStorage } from '../utils/token';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';

export const Login = () => {
  const [login] = useState('karol1');
  const [password] = useState('krolinka13');
  const navigate = useNavigate();
  const [IsLoading, setIsLoading] = useState(false);

  const signIn = async () => {
    try {
      setIsLoading(true);
      axios
        .post('http://localhost:4000/api/user/login', {
          login,
          password,
        })
        .then((response) => {
          storeTokenInLocalStorage(response.data.token);
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

  if (IsLoading) {
    <>loading...</>;
  }

  return (
    <div
      className="flex flex-col justify-center items-center"
      style={{ height: '100vh' }}
    >
      <form className="flex max-w-md flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="login" value="Your email" />
          </div>
          <TextInput id="login" type="text" placeholder="login" required />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password1" value="Your password" />
          </div>
          <TextInput id="password1" type="password" required />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember">Remember me</Label>
        </div>
        <Button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            signIn();
          }}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};
