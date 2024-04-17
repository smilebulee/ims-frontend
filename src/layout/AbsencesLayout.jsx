import { Outlet, useLocation } from "react-router-dom";
  
//import {Container ,ListGroup, Col} from 'react-bootstrap';
//import {useState} from 'react';
//import SidebarItem from "./SidebarItem";
import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarFooter,
    CDBSidebarHeader,
    CDBSidebarMenu,
    CDBSidebarMenuItem,
  } from 'cdbreact';
  import { NavLink } from 'react-router-dom';

const AbsencesLayout = () => {
    // const pathName = useLocation().pathname;
    // const menus = [
    //     { name: "근무시간관리", path: "/absences" },
    //     { name: "결제요청관리", path: "/absences/apprreq" },
    //     { name: "직원관리", path: "/absences/emp" },
    //     { name: "Q&A", path: "/absences/qna" }
    // ];

    return (
        <>
            <div style={{display:"flex", flexDirection: "row", width: "100vw"}}>
                <div style={{ display: 'flex', height: '100vh', overflow: 'scroll initial', float:'left' }}>
                    {/* https://www.devwares.com/blog/create-responsive-sidebar-in-react/ */}
                    <CDBSidebar textColor="#fff" backgroundColor="#333">
                        <CDBSidebarContent className="sidebar-content">
                            <CDBSidebarMenu>
                                <NavLink exact="true" to="/absences/worktime" className={({ isActive }) => (isActive ? "activeClicked" : "")} >
                                    <CDBSidebarMenuItem icon="business-time">근무시간관리</CDBSidebarMenuItem>
                                </NavLink>
                                <NavLink exact="true" to="/absences/apprreq" className={({ isActive }) => (isActive ? "activeClicked" : "")} >
                                    <CDBSidebarMenuItem icon="clipboard">결재요청관리</CDBSidebarMenuItem>
                                </NavLink>
                                <NavLink exact="true" to="/absences/emp" className={({ isActive }) => (isActive ? "activeClicked" : "")} >
                                    <CDBSidebarMenuItem icon="user">직원관리</CDBSidebarMenuItem>
                                </NavLink>
                                <NavLink exact="true" to="/absences/qna" className={({ isActive }) => (isActive ? "activeClicked" : "")} >
                                    <CDBSidebarMenuItem icon="question">Q&A</CDBSidebarMenuItem>
                                </NavLink>

                                {/* <NavLink exact to="/hero404" target="_blank" activeClassName="activeClicked">
                                <CDBSidebarMenuItem icon="exclamation-circle">404 page</CDBSidebarMenuItem>
                                </NavLink> */}
                            </CDBSidebarMenu>
                        </CDBSidebarContent>
                    </CDBSidebar>
                </div>
                {/* <div className="sidebar" style={{float: "left", backgroundColor: "blue", height: "100%"}}>
                    {menus.map((menu, index) => {
                        return (
                        <Link to={menu.path} key={index}>
                            <SidebarItem menu={menu} isActive={pathName === menu.path ? true : false} />
                        </Link>
                        );
                    })}
                </div> */}
                {/* <Container className='p-4'>  
                    <Col md={3}>  
                        <ListGroup>  
                            <ListGroup.Item eventKey="1">
                                <Link className="text-decoration-none text-white" to="/absences">근무시간관리</Link>
                            </ListGroup.Item>  
                            <ListGroup.Item eventKey="2" onClick={itemClicked}>
                                <Link className="text-decoration-none" to="/absences/apprreq">결재요청관리</Link>
                            </ListGroup.Item>  
                            <ListGroup.Item eventKey="3">
                                <Link className="text-decoration-none" to="/absences/emp">직원관리</Link>
                            </ListGroup.Item>  
                            <ListGroup.Item eventKey="4">
                                <Link className="text-decoration-none" to="/absences/qna">Q&A</Link>
                            </ListGroup.Item>  
                            
                        </ListGroup>  
                    </Col>  
                </Container>   */}
                    
                
                <div style={{float: "left", padding: "40px 40px 40px 40px", flexGrow: "1",height: '90vh'}}>
                    <Outlet />
                </div>
            </div>
        </>
    );
};
  
export default AbsencesLayout;