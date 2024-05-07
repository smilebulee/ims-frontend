import { useRef, useState, useEffect, useCallback} from "react";
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FaSearch } from 'react-icons/fa';
import { AgGridReact } from "ag-grid-react";
import InputGroup from 'react-bootstrap/InputGroup';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';


const Dept = () => {

    const [modalOpen, setModalOpen] = useState({
        first: false,
        second: false,
        third: false,
    })
    const [selectByDeptNm, setSelectByDeptNm] = useState('');

    const [inputData, setInpuData] = useState({
        deptCd: '',
        empGmId: '',
        empPrId: '',
        deptName: '',
        empGm: '',
        empPr: '',
        deptUseYn: '',
        rmks: '',
        regDate: '',
        regEmpNo: '',
        chgDate: '',
        chgEmpNo: '',
    });

    const [userNm,setUserNm] = useState('');
    const [selectedRow, setSelectedRow] = useState("");
    const [selectedUserInRow, setSelectedUserInRow] = useState("");
    const [rowData, setRowData] = useState([]);
    const [rowUserData, setRowUserData] = useState([]);
    const [guBun, setguBun] = useState({
        inputType: '',
        userId:'',
    });

    // 부서 컬럼 설정 onLoad
    const columnDefs = [
        {headerName:"부서코드", field:"deptCd", width:260},
        {headerName:"부서명", field:"deptName", width:260},
        {headerName:"사업부장명", field:"empGm", width:260},
        {headerName:"현장대리인", field:"empPr", width:260},
        {headerName:"비고", field:"rmks", width:520},
    ];

    useEffect((e)=> {
        // dept 데이터 가져오기
        findAll();       
    },[])

    // EnterKey
    const activeEnter = (e) => {
        if(e.key === "Enter") {
            if(e.target.name === 'deptNm') {
                deptSelectClickEvent();
            } else if (e.target.name === 'userNm') {
                empSelectClickEvent();
            }
        }
      }

    const handleDeptFormSubmit = (e) => {
        e.preventDefault();
        deptSelectClickEvent();;
    }

    const handleEmpFormSubmit = (e) => {
        e.preventDefault();
        empSelectClickEvent();
    }
    // 부서명 조회
    const deptSelectClickEvent = () => {

        axios.get(process.env.REACT_APP_API_HOST + "/ims/dept/deptSelect", {
            params:{selectByDeptNm}
        }).then(response => {
            setRowData(response.data);          
        }).catch(error => {
            console.log(error);
        })
    }

    // 부서 list 조회
    const findAll = () => {
        fetch(process.env.REACT_APP_API_HOST + "/ims/dept/findAll")
        .then((res) => res.json())
        .then((res) => {
            const formattData = res.map(item => ({
                ...item,
                regDate: formatDate(item.regDate),
                chgDate: formatDate(item.chgDate)
            }));
            setRowData(formattData);
        });
    }

    // 날짜를 yyyyMMdd 형식으로 변환하는 함수
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}${month}${day}`;
    }

    // Grid DoubleClick modifyModal
    const onRowDoubleClicked = () => {
        //rowData 담아주기
        setInpuData(selectedRow[0])
        handleModalOpen('third')
    }
    
    // 수정버튼 클릭 event
    const modifyClick = () => {
        axios.post(process.env.REACT_APP_API_HOST + "/ims/dept/deptModify", inputData).then(response => {
            setInpuData(response.data);   
            findAll();
            handleModalClose('third')
        }).catch(error => {
            console.log(error);
        })
    }

    //  First Modal
    // first Modal 등록버튼 event
    const deptNmRef = useRef(null);
    const empGmRef = useRef(null);
    const empPrRef = useRef(null);
    
    const saveDept = (e) => {
        e.preventDefault();
        if(inputData.deptName === "") {
            window.alert("부서명을 입력해주세요.");
            return deptNmRef.current.focus();
        }

        if(inputData.empGm === "") {
          window.alert("사업부장을 입력해주세요.");
          return empGmRef.current.focus();
        }

        if(inputData.empPr === "") {
          window.alert("현장대리인을 입력해주세요.");
          return empPrRef.current.focus();
        }

        if(window.confirm("등록하시겠습니까?")) {
            const data = {
              deptName: inputData.deptName,
              empPr: inputData.empGmId,
              empGm: inputData.empPrId,
              deptUseYn: 'Y',
              rmks: formatDate(new Date()) + "신규등록",
              regDate: formatDate(new Date()),
              regEmpNo: 'test',
              chgDate: formatDate(new Date()),
              chgEmpNo: 'test',              
            }
            console.log("data : ",data)
            axios.post(process.env.REACT_APP_API_HOST + "/ims/dept/save", data).then(function(response) {
              alert(response.data);
              findAll();
              handleModalClose("first");
            }).catch(function(error) {
                console.log(error);
            });
        }  
    }

    // ModalOpen
    const handleModalOpen = (step) => {
        setModalOpen((prev) => ({
            ...prev,
            [step]:true
        }))
    }
    // ModalClose
    const handleModalClose = (step) => {
        setModalOpen((prev) => ({
            ...prev,
            [step]:false
        }))
    }
    // inputData onChange
    const handleInputDataChange = (type, userId, userNm) => {
        setInpuData((prev) => ({
            ...prev,
            [type.userId]: userId,
            [type.inputType]: userNm,
        }))
    }

    // click Event
    const handleClick = (step) => {
        handleModalOpen(step)
        if(step === 'first'){
            onReset();
        } else {
            setUserNm('')
            setRowUserData([])
            setSelectedUserInRow('');
        }
    }

    // 초기화버튼 클릭시 
    const onReset = () => {
        setInpuData((prev) => ({
            ...prev,
            deptCd: '',
            deptName: '',
            empGm: '',
            empPr: '',
            rmks: '',
            regDate: '',
            regEmpNo: '',
            chgDate: '',
            chgEmpNo: '',
        }))
    }    

    // Second Modal
    // user 컬럼 설정
    const columnUserDefs= [
        {headerName:"이름", field:"userNm", width:150, checkboxSelection: true},
        {headerName:"ID", field:"userId", width:150},
        {headerName:"부서", field:"deptName", width:160},
    ]

    // second Modal -> first Modal data
    
    const selectSecondModal = () => {
        const selectedUser = selectedUserInRow[0];
        console.log("selectedUser : ", selectedUser)
        // userNm 값 변수 넣기
        handleInputDataChange(guBun,selectedUser?.userId, selectedUser?.userNm);
        console.log("guBun : ", guBun, selectedUser?.userId, selectedUser?.userNm);
        handleModalClose("second");
    }

    // 직원 조회 검색 클릭 event
    const empSelectClickEvent = (e) => {
        //  직원조회 검색
        axios.get(process.env.REACT_APP_API_HOST + "/ims/user/userSelect", {
            params:{userNm}
        }).then(response => {
            if(response.data.length === 1){
                handleInputDataChange(guBun,response.data[0].userId, response.data[0].userNm);
                handleModalClose("second");
            } else {
                setRowUserData(response.data);          
            }
        }).catch(error => {
            console.log(error);
        })
    }    

    const autoSizeAll = (param) => {
        const allColumnIds = ['titlNm', 'workInfo', 'prgsHist', 'remarks'];
        //gridColumnApi.getAllColumns().forEach(column => allColumnIds.push(column.colId));;
        param.columnApi.autoSizeColumns(allColumnIds, false);
    };
    return (
        <>
        <Stack gap={2} style={{ width: "100%",height:500}}>
            <div className="bg-light border rounded p-3">
                <Row>
                    <Col xs={4}>
                        <Form onSubmit={handleDeptFormSubmit}>
                            <InputGroup>
                                <Form.Label column xs={3} style={{margin: "auto"}}>부서명</Form.Label> 
                                <Form.Control type="text" name="deptNm" placeholder="부서명" onChange={e => setSelectByDeptNm(e.target.value)} value={selectByDeptNm} onKeyDown={e => activeEnter(e)}/>
                            </InputGroup>
                        </Form>
                    </Col>
                    <Col xs={8}>
                        <Button variant="btn btn-outline-success" style={{ float: "right", margin: "0px 5px 0px 5px", width: "100px" }} onClick={() => handleClick('first')}>부서등록</Button>
                        <Button variant="primary" style={{float:"right", margin:"0px 5px 0px 5px", width:"100px"}} onClick={deptSelectClickEvent}>조회</Button>
                    </Col>
                </Row>
            </div>
            <div className="ag-theme-alpine" style={{width: "100%"}}>
                {/* <DataGrid autoHeight rows={rows} columns={columns} pageSizeOptions={[5]} paginationMode="server" /> */}
                <AgGridReact columnDefs={columnDefs} rowData={rowData}
                             defaultColDef={{
                                sortable: true,
                                resizable:true}}                             
                             rowSelection={'single'}
                             onRowDataUpdated={autoSizeAll}
                             onRowDoubleClicked={onRowDoubleClicked}
                             onSelectionChanged={e => setSelectedRow(e.api.getSelectedRows())}
                             domLayout='autoHeight'    
                             pagination={true}
                             paginationPageSize={10}
                             rowStyle={{cursor: "pointer"}}
                            >
                </AgGridReact>
            </div>
        </Stack>
        <Modal show={modalOpen.first} >
            <Modal.Header>
                <Modal.Title >부서등록</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="mb-2" controlId="firstRow">
                    <Col></Col>
                    <Col xs={6} style={{color: "red"}}>* 는 필수 입력 항목입니다.</Col>
                </Row>
                <Form onSubmit={saveDept}>
                    <Form.Group as={Row} className="mb-3" controlId="secondRow">
                        <Form.Label column xs={4}><span style={{color: "red"}}>*</span>부서명</Form.Label>
                        <Col xs={7}>
                            <Form.Control type="text" name="deptName" ref={deptNmRef} placeholder="부서명" onChange={e => setInpuData(prev => ({...prev, deptName: e.target.value}))} value={inputData.deptName || ""}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="thirdRow">
                        <Form.Label column xs={4}><span style={{color: "red"}}>*</span>사업부장</Form.Label>
                        <Col xs={7}>    
                            <InputGroup>
                                <Form.Control type="text" name="empGm" ref={empGmRef} placeholder="사업부장" style={{background:"#E6E6E6"}} value={inputData.empGm || ""} readOnly/>
                                <InputGroup.Text style={{cursor:"pointer"}} onClick={() => handleClick('second', setguBun({inputType: "empGm", userId:"empGmId"}))}><FaSearch/></InputGroup.Text>
                            </InputGroup>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="fourthRow">
                        <Form.Label column xs={4}><span style={{color: "red"}}>*</span>현장대리인</Form.Label>
                        <Col xs={7}>
                            <InputGroup>
                                <Form.Control type="text" name="empPr" placeholder="현장대리인" ref={empPrRef} style={{background:"#E6E6E6"}} value={inputData.empPr || ""} readOnly/>
                                <InputGroup.Text style={{cursor:"pointer"}} onClick={() => handleClick('second', setguBun({inputType: "empPr",userId:"empPrId"}))}><FaSearch/></InputGroup.Text>
                           </InputGroup>
                        </Col>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" className="btn_register" onClick={saveDept}>등록</Button>
                <Button variant="secondary" className="btn_reset" onClick={onReset}>초기화</Button>
                <Button variant="secondary" className="btn_close" onClick={() => handleModalClose('first')}>닫기</Button>
            </Modal.Footer>
        </Modal>
        <Modal show={modalOpen.second}>
                <Modal.Header>
                    <Modal.Title >직원조회</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEmpFormSubmit}>
                        <Form.Group as={Row} className="mb-3" controlId="secondRow">
                            <Form.Label column xs={4}><span style={{ color: "red" }}>*</span>직원조회</Form.Label>
                            <Col xs={7}>
                                <InputGroup>
                                    <Form.Control type="text" name="userNm" placeholder="직원명" onChange={e => setUserNm(e.target.value)} value={userNm} onKeyDown={e => activeEnter(e)}/>
                                    <Button variant="secondary" className="btn_search" onClick={() => empSelectClickEvent()}>검색</Button>
                                </InputGroup>
                            </Col>
                        </Form.Group>
                    </Form>
                    <div className="ag-theme-alpine" style={{width: "100%"}}>
                        {/* <DataGrid autoHeight rows={rows} columns={columns} pageSizeOptions={[5]} paginationMode="server" /> */}
                        <AgGridReact columnDefs={columnUserDefs} rowData={rowUserData}
                                     defaultColDef={{
                                        sortable: true,
                                        resizable:true}}                             
                                     rowSelection={'single'}
                                     onSelectionChanged={e => setSelectedUserInRow(e.api.getSelectedRows())}
                                     domLayout='autoHeight'
                                     >
                        </AgGridReact>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" className="btn_select" onClick={selectSecondModal}>선택</Button>
                <Button variant="secondary" className="btn_close" onClick={() => handleModalClose('second')}>닫기</Button>
                </Modal.Footer>
        </Modal>
        <Modal show={modalOpen.third}>
                <Modal.Header>
                    <Modal.Title >부서정보 수정</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column xs={4}><span style={{color: "red"}}>*</span>부서코드</Form.Label>
                        <Col xs={7}>
                            <Form.Control type="text" name="deptCd" style={{background:"#E6E6E6"}} value={inputData.deptCd} readOnly/>
                            <span style={{fontSize:10, color: "red"}}> * 부서코드는 수정불가합니다</span>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column xs={4}><span style={{color: "red"}}>*</span>부서명</Form.Label>
                        <Col xs={7}>
                            <InputGroup>
                                <Form.Control type="text" onChange={e => setInpuData(prev => ({...prev, deptName: e.target.value}))} value={inputData.deptName}/>
                            </InputGroup>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column xs={4}><span style={{color: "red"}}>*</span>사업부장</Form.Label>
                        <Col xs={7}>
                            <InputGroup>
                                <Form.Control type="text" name="empGm" style={{background:"#E6E6E6"}} value={inputData.empGm}/>
                                <InputGroup.Text style={{cursor:"pointer"}} onClick={() => handleClick('second', setguBun({inputType: "empGm", userId:"empGmId"}))}><FaSearch/></InputGroup.Text>
                            </InputGroup>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column xs={4}><span style={{color: "red"}}>*</span>현장대리인</Form.Label>
                        <Col xs={7}>
                            <InputGroup>
                                <Form.Control type="text" name="empPr" style={{background:"#E6E6E6"}} value={inputData.empPr}/>
                                <InputGroup.Text style={{cursor:"pointer"}} onClick={() => handleClick('second', setguBun({inputType: "empPr",userId:"empPrId"}))}><FaSearch/></InputGroup.Text>
                            </InputGroup>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column xs={4}><span style={{color: "red"}}>*</span>사용여부</Form.Label>
                        <Col xs={7}>
                            <InputGroup>
                                <Form.Select placeholder="" name="deptUseYn" onChange={e => setInpuData(prev => ({...prev, deptUseYn: e.target.value}))} value={inputData.deptUseYn}>
                                <option value="Y">사용</option>
                                <option value="N">미사용</option>
                            </Form.Select>
                            </InputGroup>
                        </Col>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" className="btn_modify" onClick={modifyClick} >수정</Button>
                <Button variant="secondary" className="btn_close" onClick={() => handleModalClose('third')}>닫기</Button>
                </Modal.Footer>
        </Modal>
        </>
    );
};
  
export default Dept;