import { Header } from '../Header';
import LoginForm from '../loginForm/loginForm';
import RegisterForm from '../registerForm/registerForm';
import './styles.scss';

export default function App() {
  return (
    <>
      <Header />
      {/* <LoginForm /> */}
      <RegisterForm />
    </>
  );
}
