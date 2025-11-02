import {Outlet} from "react-router";

import Header from "../../components/header/Header";
import NavBar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

const Layout = () => {
  return(
        <>
          <Header></Header>
          <NavBar></NavBar>
          <main style={{ minHeight: "80vh" }}>
            <Outlet /> {/* Aca se inyecta el contenido de cada página */}
          </main>
          <Footer></Footer>
        </>
    );
}

export default Layout;