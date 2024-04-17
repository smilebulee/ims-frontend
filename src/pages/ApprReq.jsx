import { useRef, useState, forwardRef } from "react";
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { AgGridReact } from "ag-grid-react";
import Pagination from 'react-bootstrap/Pagination';
import Modal from 'react-bootstrap/Modal';
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from 'axios';
import * as XLSX from 'xlsx';

import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "react-datepicker/dist/react-datepicker.css";

import '../css/ims.css';
import { fetchCmmCd } from '../js/common';
import { useEffect } from "react";

const ApprReq = () => {
    const dateFormatter = (dateStr) => {
        if(dateStr == null || dateStr === '') return '';
        return dateStr.substring(0, 4) + '-' + dateStr.substring(4, 6) + '-' + dateStr.substring(6);
    };
    const columnDefs = [
        {headerName:"구분", field:"apvlReqDivs", width:120, pinned: 'left', cellRenderer: (data) => { return dateFormatter(data.value);}},
        {headerName:"기안일", field:"wrkDt", width:100, cellRenderer: (data) => { return dateFormatter(data.value);}},
        {headerName:"연차일", field:"deptNm", width:150},        
        {headerName:"반차일", field:"empNm", width:100, cellRenderer: (data) => { return dateFormatter(data.value);}},
        {headerName:"기안자", field:"reqNm", width:100},        
        {headerName:"결재상태", field:"aprvStus", width:100},
        {headerName:"결재자", field:"aprvNm", width:100},
        {headerName:"요청사유", field:"reqRsn", width:300}        
    ];
    const [draftMonth, setDraftMonth] = useState(new Date());

    const [rowData, setRowData] = useState([]);
    const [show, setShow] = useState(false);
    const showModal = () => setShow(true);
    const closeModal = () => setShow(false);

    const [options, setOptions] = useState([{cd:"", cdNm:"전체"},{cd:"1", cdNm:"진행중"},{cd:"2", cdNm:"완료"}]);

    const getList = (e) => {        
        e.preventDefault();

        setOptions([{cd:"", cdNm:"전체"},{cd:"1", cdNm:"진행중"},{cd:"2", cdNm:"완료"},{cd:"3", cdNm:"test"}]);

        
    };

    const autoSizeAll = (param) => {            
        const allColumnIds = ['titlNm', 'workInfo', 'prgsHist', 'remarks'];        
        param.columnApi.autoSizeColumns(allColumnIds, false);        
    };  

    // onLoad
    useEffect(() => {
        //fetchCmmCd();
    }, []);

    return (
        <Stack gap={2} style={{width:"100%"}}>
            <div className="bg-light border rounded p-3">
                <Form onSubmit={getList}>
                    <Form.Group as={Row} className="mb-2" controlId="firstRow">
                        <Form.Label column xs={1}>기안월</Form.Label>
                        <Col xs={2}>                            
                            <DatePicker selected={draftMonth}                                
                                showMonthYearPicker
                                dateFormat="yyyy년 MM월"
                                locale={ko}
                                onChange={(date) => setDraftMonth(date)}
                                customInput={
                                    <Form.Control type="text" placeholder="yyyy년 MM월" name="upDeptNm"/>
                                }
                                showIcon
                                toggleCalendarOnIconClick
                                />
                        </Col>
                        <Form.Label column xs={1}>부서</Form.Label>
                        <Col xs={2}>                            
                            <Form.Select placeholder="" name="prgsStus">                                
                                <option value="">전체</option>
                                <option value="진행중">진행중</option>
                                <option value="완료">완료</option>
                                <option value="조정">조정</option>
                            </Form.Select>
                        </Col>
                        <Col xs={6}>
                            <Button variant="primary" style={{float:"right", margin:"0px 5px 0px 5px", width:"100px"}} type="submit">조회</Button>
                            <Button variant='btn btn-outline-success' style={{float:"right", margin:"0px 5px 0px 5px", width:"100px"}}>연차등록</Button>
                            <Button variant="btn btn-outline-success" style={{float:"right", margin:"0px 5px 0px 5px", width:"110px"}}>연장근무품의</Button>
                            <Button variant='btn btn-outline-success' style={{float:"right", margin:"0px 5px 0px 5px", width:"100px"}}>결재승인</Button>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-2" controlId="secondRow">
                        <Form.Label column xs={1}>기안자</Form.Label>
                        <Col xs={2}>
                            <Form.Control type="text" placeholder="" name="upDeptNm"/>
                        </Col>
                        <Form.Label column xs={1}>결재상태</Form.Label>
                        <Col xs={2}>                            
                            <Form.Select placeholder="" name="prgsStus">
                                {
                                    options.map((option, index) => {
                                        return (<option value={option.cd}>{option.cdNm}</option>)
                                    })
                                }
                            </Form.Select>
                        </Col>
                    </Form.Group>
                </Form>
            </div>
            <div className="ag-theme-alpine" style={{width: '100%'}}>                
                <AgGridReact columnDefs={columnDefs} rowData={rowData}
                             defaultColDef={{
                                sortable: true,
                                resizable:true}}                             
                             rowSelection={'multiple'}
                             rowMultiSelectWithClick={true}                            
                             domLayout='autoHeight'
                            >

                </AgGridReact>
            </div>


        </Stack>        
    );
};
  
export default ApprReq;