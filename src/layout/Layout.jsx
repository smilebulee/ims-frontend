import { Link, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

const Layout = () => {
    return (
        <div>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="p-3">
                <Container style={{paddingLeft: "0px"}}>
                    <Navbar.Brand href="#home" style={{marginLeft: "-50px"}}>
                        <h3 style={{fontWeight: "bold", float:"left"}}>INF</h3>
                        <h3 style={{fontWeight: "bold", float:"left", color:"red"}}>O</h3>
                        <h3 style={{fontWeight: "bold", float:"left"}}>GEN IMS</h3>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                      <Nav className="me-auto" >                          
                          <Nav.Link>                              
                              <Link className="text-decoration-none text-white" to="/absences">근태관리</Link>
                          </Nav.Link>
                      
                          <Nav.Link>                              
                              <Link className="text-decoration-none text-white" to="/weeklyreport">주간보고관리</Link>
                          </Nav.Link>                          
                      </Nav>
                    </Navbar.Collapse>                    
                </Container>
            </Navbar>
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
