import {Outlet} from "react-router";
import NavBar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

const Layout = () => {
  return(
        <>
          <NavBar />
          <main style={{ minHeight: "80vh" }}>
            <Outlet /> {/* Aca se inyecta el contenido de cada página */}
          </main>
          <Footer />
        </>
    );
}

export default Layout;