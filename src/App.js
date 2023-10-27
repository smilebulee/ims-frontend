import { Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Layout from './layout/Layout';
import AbsencesLayout from './layout/AbsencesLayout';
import WeeklyreportLayout from './layout/WeeklyreportLayout';
import Worktime from './pages/Worktime';
import ApprReq from './pages/ApprReq';
import Emp from './pages/Emp';
import QnA from './pages/QnA';
import Weeklyreport from './pages/Weeklyreport';
import WeeklyreportDetail from './pages/WeeklyreportDetail';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="/absences" element={<AbsencesLayout />} >
                    <Route caseSensitive path="worktime" element={<Worktime />} />
                    <Route caseSensitive path="apprreq" element={<ApprReq />} />
                    <Route caseSensitive path="emp" element={<Emp />} />
                    <Route caseSensitive path="qna" element={<QnA />} />
                </Route>
                <Route path="/weeklyreport" element={<WeeklyreportLayout />} >
                    <Route index element={<Weeklyreport />} />
                    <Route path="detail" element={<WeeklyreportDetail />}/>
                </Route>        
            </Route>
          
        </Routes>
    );
};

export default App;