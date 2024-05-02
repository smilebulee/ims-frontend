import { Link, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';


const Layout = () => {
    const userNm = localStorage.getItem("userNm");
    const logoutHandler = () => {
        // localStorage.clear()
        localStorage.removeItem('accessToken');
        localStorage.removeItem('tokenExpiresIn');
        localStorage.removeItem('authGrpCd');
        localStorage.removeItem('userNm');
        localStorage.removeItem('userId');
        window.location.href = '/login'; 
    };

    return (
        <div>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="p-3">
                <Container style={{paddingLeft: "0px"}}>
                    <Navbar.Brand href="#home" style={{marginLeft: "-50px", marginRight: "50px"}}>
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
                <Col xs="auto" style={{float:"right", color:"white", paddingRight:"15px"}}>
                    {userNm}님
                </Col>
                <Col xs="auto">
                    <Button variant="secondary" onClick={logoutHandler}>LOGOUT</Button>
                </Col>
            </Navbar>
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
