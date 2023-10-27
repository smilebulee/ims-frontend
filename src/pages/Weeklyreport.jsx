import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { useRef, useState } from "react";
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Pagination from 'react-bootstrap/Pagination';
import Modal from 'react-bootstrap/Modal';
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from 'axios';


const Weeklyreport = () => {    
    // const rows = [
    //     { id: 1, col1: 'Hello', col2: 'World', col3: 'World ddddddddddddddddddd' },
    //     { id: 2, col1: 'DataGridPro', col2: 'is Awesome', col3: 'World eeeeeeeeeeeeeee' },
    //     { id: 3, col1: 'MUI', col2: 'is Amazing', col3: 'World qqqqqqqqqqqqqqqqqq' },
    //   ];

    //   const columns = [
    //     { field: 'col1', headerName: 'Column 1', width: 150 },
    //     { field: 'col2', headerName: 'Column 2', width: 150 },
    //     { field: 'col3', headerName: 'Column 3', width: 300 },
    //   ];
    const dateFormatter = (dateStr) => {
        if(dateStr == null || dateStr === '') return '';
        return dateStr.substring(0, 4) + '-' + dateStr.substring(4, 6) + '-' + dateStr.substring(6);
    };
    const columnDefs = [
        {headerName:"보고일", field:"reportDt", width:120, pinned: 'left', cellRenderer: (data) => { return dateFormatter(data.value);}},
        {headerName:"사업부", field:"upDeptNm", width:100, pinned: 'left'},
        {headerName:"팀", field:"deptNm", width:100, pinned: 'left'},
        // {headerName:"메일ID", field:"mailId", width:100, pinned: 'left'},
        {headerName:"담당자", field:"empNm", width:90, pinned: 'left'},
        {headerName:"순번", field:"seq", width:70},
        {headerName:"업무단위", field:"workUnit", width:100},
        {headerName:"진행상태", field:"prgsStus", width:100},
        {headerName:"구분", field:"workDivs", width:70},
        {headerName:"프로젝트/과제명", field:"titlNm", width:200},
        {headerName:"파트", field:"workPart", width:70},
        {headerName:"진행업무", field:"workInfo", width:300},
        {headerName:"계획시작일자", field:"schedStartDt", width:120, cellRenderer: (data) => { return dateFormatter(data.value);}},
        {headerName:"계획종료일자", field:"schedEndDt", width:120, cellRenderer: (data) => { return dateFormatter(data.value);}},
        {headerName:"조정일자", field:"adjustDt", width:120, cellRenderer: (data) => { return dateFormatter(data.value);}},
        {headerName:"조정사유", field:"adjustRsn", width:150},
        {headerName:"완료일자", field:"fnshDt", width:120, cellRenderer: (data) => { return dateFormatter(data.value);}},
        {headerName:"진행내역", field:"prgsHist", width:150},
        {headerName:"비고", field:"remarks", width:150},
    ];

    
    const [rowData, setRowData] = useState([]);
    // const [gridApi, setGridApi] = useState(null);
    // const [gridColumnApi, setGridColumnApi] = useState(null);
    const [pageList, setPageList] = useState([]);

    const [upDeptNm, setUpDeptNm] = useState('');
    const [deptNm, setDeptNm] = useState('');
    const [empNm, setEmpNm] = useState('');
    const [prgsStus, setPrgsStus] = useState('');
    const [workDivs, setWorkDivs] = useState('');
    const [startDt, setStartDt] = useState('');
    const [endDt, setEndDt] = useState('');

    const [show, setShow] = useState(false);

    const showModal = () => setShow(true);
    const closeModal = () => setShow(false);

    const [searchParams] = useSearchParams();
    const queryList = [...searchParams];

    const navigate = useNavigate();
    
    const getList = (e) => {       
        console.log(e);
        e.preventDefault();

        if(searchParams.get('authCd') == null || (searchParams.get('authCd') != 'ADMIN' && searchParams.get('authCd') != 'USER')){
            alert('권한정보가 없습니다.');
            return false;
        }

        if(searchParams.get('authCd') == 'USER' && searchParams.get('email') == null){
            alert('계정정보가 없습니다.');
            return false;
        }
            
        fetchData(1);       
    };

    const fetchData = (page) => {
        // e.preventDefault();
        // const formData = new FormData(e.target),
        //         formDataObj = Object.fromEntries(formData.entries());
        // var keys = Object.keys(formDataObj);       
        // var queryStr = "?";
        // for(var i = 0; i < keys.length; i++){
        //     if(i > 0) queryStr += "&";
        //     queryStr += keys[i] + "=" + formDataObj[keys[i]];
        // }
        
        let queryStr = "?upDeptNm=" + upDeptNm
                     + "&deptNm=" + deptNm
                     + "&empNm=" + empNm
                     + "&prgsStus=" + prgsStus
                     + "&workDivs=" + workDivs
                     + "&startDt=" + startDt.replace(/-/gi, "")
                     + "&endDt=" + endDt.replace(/-/gi, "")
                     + "&page=" + page
                     + "&authCd=" + searchParams.get('authCd')
                     + "&email=" + searchParams.get('email');
        // 112.220.26.195
        fetch("http://112.220.26.195:8080/ims/report/weekly/list" + queryStr).then((res) => res.json()).then((data) => {
            console.log(data);
            setRowData(data.content);

            let active = data.pageable.pageNumber + 1;
            let items = [];
            let totalPage = data.totalPages;
            let startPage = Math.floor((active - 1) / 5) * 5 + 1;
            let endPage = startPage + 5 - 1;
            if(endPage > totalPage) endPage = totalPage;

            console.log("현재 페이지 : " + active);
            console.log("전체 페이지 : " + totalPage);
            console.log("시작 페이지 : " + (Math.floor((active - 1) / 5) * 5 + 1));
            console.log("종료 페이지 : " + endPage);
            console.log((active - 1) / 5)
            

            if(active > startPage){
                items.push(
                    <Pagination.Prev onClick={() => fetchData(active - 1)} />,
                );
            }
            for (let number = startPage; number <= endPage; number++) {
                //onClick={() => fetchData(number)}
                items.push(
                    <Pagination.Item key={number} active={number === active} onClick={() => fetchData(number)} >      
                        {number}
                    </Pagination.Item>,
                );
            }
            if(active < totalPage){
                items.push(
                    <Pagination.Next onClick={() => fetchData(active + 1)} />
                );
            }
            console.log("============= items", items);
            console.log("rowData ===> ", rowData);
            setPageList(items);

        }).catch((error) => {
            console.log(error);
            alert(error);
        });       
    }; 
    
    // const onGridReady = (params) => {
    //     console.log("=============", params.columnApi);
    //     setGridApi(params.api);
    //     setGridColumnApi(params.columnApi);    
    // };

    const autoSizeAll = (param) => {  
        console.log("grid param ", param)       
        const allColumnIds = ['titlNm', 'workInfo', 'prgsHist', 'remarks'];
        //gridColumnApi.getAllColumns().forEach(column => allColumnIds.push(column.colId));;
        param.columnApi.autoSizeColumns(allColumnIds, false);
        
    };

    const excelUpload = (e) => {        
        const fileList = e.target.files;
        const formData  = new FormData();
        for(let i = 0;i < fileList.length;i++){
            formData.append("files", fileList[i]);
        }
        
        fetch("http://112.220.26.195:8080/ims/report/weekly/upload", {
            method: 'POST',
            body: formData,

        }).then((res) => res.json()).then((data) => {
            closeModal();
            alert("저장 되었습니다.");            
            fetchData(1);
        }).catch((error) => {
            console.log(error);
            alert(error);
            closeModal();
        });  
    };

    const addReportPage = e => {
        navigate("/weeklyreport/detail", {
            state: {
                title: "주간보고 작성"
            }
        })
    }

    const modifyReportPage= e => {
        navigate("/weeklyreport/detail", {
            state: {
                title: "주간보고 수정",
                data: e.data,
            }
        });
    }

    const [selectedRow, setSelectedRow] = useState("");
    const deleteRow = () => {
        if(selectedRow.length == 0) {
            alert("삭제할 항목을 선택한 후 진행해주세요.");
            return true;
        }
        else {
            if(window.confirm("삭제하시겠습니까?")) {
                const seq = selectedRow.map(row => row.seq);
    
                axios.post("http://localhost:8080/ims/report/weekly/delete", {
                    seq: seq
                }).then(data => {
                    alert("삭제 되었습니다.");
                    fetchData(1);
                }).catch(error => {
                    console.log(error);
                });
            }
        }
    }

    return (
        <>
        <Stack gap={2} style={{width:"100%"}}>
            <div className="bg-light border rounded p-3">
                <Form onSubmit={getList}>
                    <Form.Group as={Row} className="mb-2" controlId="firstRow">
                        <Form.Label column xs={1}>사업부</Form.Label>
                        <Col xs={2}>
                            <Form.Control type="text" placeholder="" name="upDeptNm" onChange={e => setUpDeptNm(e.target.value)} />
                        </Col>
                        <Form.Label column xs={1}>진행상태</Form.Label>
                        <Col xs={2}>
                            {/* <Form.Control type="text" placeholder="" name="prgsStus" onChange={e => setPrgsStus(e.target.value)} /> */}
                            <Form.Select placeholder="" name="prgsStus" onChange={e => setPrgsStus(e.target.value)}>
                                <option value="">전체</option>
                                <option value="진행중">진행중</option>
                                <option value="완료">완료</option>
                                <option value="조정">조정</option>
                            </Form.Select>
                        </Col>
                        <Col xs={5}>
                            <Button variant="btn btn-outline-danger" style={{float:"right", margin:"0px 5px 0px 5px"}} onClick={deleteRow}>삭  제</Button>
                            <Button variant="btn btn-outline-primary" style={{float:"right", margin:"0px 5px 0px 5px"}} onClick={showModal}>업로드</Button>
                            <Button variant='btn btn-outline-primary' style={{float:"right", margin:"0px 5px 0px 5px"}} onClick={addReportPage}>작  성</Button>
                            <Button variant="primary" style={{float:"right", margin:"0px 5px 0px 5px"}} type="submit">조  회</Button>                    
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-2" controlId="secondRow">
                        <Form.Label column xs={1}>팀</Form.Label>
                        <Col xs={2}>
                            <Form.Control type="text" placeholder="" name="deptNm" onChange={e => setDeptNm(e.target.value)} />
                        </Col>
                        <Form.Label column xs={1}>구분</Form.Label>
                        <Col xs={2}>
                            {/* <Form.Control type="text" placeholder="" name="workDivs" onChange={e => setWorkDivs(e.target.value)} /> */}
                            <Form.Select placeholder="" name="workDivs" onChange={e => setWorkDivs(e.target.value)}>
                                <option value="">전체</option>
                                <option value="SI">SI</option>
                                <option value="SM">SM</option>
                                <option value="스쿼드">스쿼드</option>
                            </Form.Select>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="" controlId="thirdRow">
                        <Form.Label column xs={1}>담당자</Form.Label>
                        <Col xs={2}>
                            <Form.Control type="text" placeholder="" name="empNm" onChange={e => setEmpNm(e.target.value)} />
                        </Col>
                        <Form.Label column xs={1}>보고일</Form.Label>
                        <Col xs={2}>
                            <Form.Control type="date" placeholder="YYYY-MM-DD" name="startDt" max={new Date('2999-12-31 23:59:59').toISOString().split('T')[0]} onChange={e => setStartDt(e.target.value)} />
                        </Col> 
                        <Col xs={"auto"}>~</Col>                   
                        <Col xs={2}>
                            <Form.Control type="date" placeholder="YYYY-MM-DD" name="endDt" max={new Date('2999-12-31 23:59:59').toISOString().split('T')[0]} onChange={e => setEndDt(e.target.value)} />
                        </Col>
                    </Form.Group>

                </Form>
            </div>
            <div className="ag-theme-alpine" style={{width: '100%'}}>
                {/* <DataGrid autoHeight rows={rows} columns={columns} pageSizeOptions={[5]} paginationMode="server" /> */}
                <AgGridReact columnDefs={columnDefs} rowData={rowData} 
                             defaultColDef={{
                                sortable: true,
                                resizable:true}} 
                            //  onGridReady={onGridReady}
                             onRowDataUpdated={autoSizeAll}
                             onRowDoubleClicked={modifyReportPage}
                             rowSelection={'multiple'}
                             rowMultiSelectWithClick={true}
                             onSelectionChanged={e => setSelectedRow(e.api.getSelectedRows())}
                            //  serverSideDatasource={getList}
                            //  pagination={true}
                            //  paginationPageSize={2}
                            //  rowModelType={'serverSide'}
                             domLayout='autoHeight'
                            >

                </AgGridReact>
            </div>
            <div className='d-flex justify-content-center'>
                <Pagination>{pageList}</Pagination>
            </div>
        </Stack>
        <Modal show={show} onHide={closeModal} >
            <Modal.Header>
                <Modal.Title>엑셀 업로드</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Control type="file" name="uploadFiles" multiple="true" accept=".xlsx" onChange={excelUpload} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" className="btn_close" onClick={closeModal}>닫기</Button>
            </Modal.Footer>
        </Modal>   
        </>
    );
};
  
export default Weeklyreport;
