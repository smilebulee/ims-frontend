import { Link, Outlet } from "react-router-dom";
import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarFooter,
    CDBSidebarHeader,
    CDBSidebarMenu,
    CDBSidebarMenuItem,
  } from 'cdbreact';
  import { NavLink } from 'react-router-dom';

const WeeklyreportLayout = () => {
    return (
        <div style={{display:"flex", flexDirection: "row", width: "100vw"}}>
            <div style={{ display: 'flex', height: '100vh', overflow: 'scroll initial', float:'left' }}>
                {/* https://www.devwares.com/blog/create-responsive-sidebar-in-react/ */}
                <CDBSidebar textColor="#fff" backgroundColor="#333">
                    <CDBSidebarContent className="sidebar-content">
                        <CDBSidebarMenu>
                            <NavLink exact="true" to="/weeklyreport" className={({ isActive }) => (isActive ? "activeClicked" : "")} >
                                <CDBSidebarMenuItem icon="table">주간보고관리</CDBSidebarMenuItem>
                            </NavLink>
                           
                        </CDBSidebarMenu>
                    </CDBSidebarContent>
                </CDBSidebar>
            </div>
            <div style={{float: "left", padding: "40px 40px 40px 40px", flexGrow: "1"}}>
                <Outlet />
            </div>
        </div>
    );
};
  
export default WeeklyreportLayout;