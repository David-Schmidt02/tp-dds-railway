import './Header.css'; 
import NavBar from "../../components/navbar/Navbar";

const Header = ({carrito}) => {
  return (
    <header className="header">
        <NavBar carrito={carrito}/>
    </header>
  );
};

export default Header;
