import { Outlet } from 'react-router-dom';
import { Header } from '../Header';
import Footer from '../footer/footer';

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
