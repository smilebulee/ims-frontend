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

const Emp = () => {

    const [selectedRow, setSelectedRow] = useState("");
    const [rowData, setRowData] = useState([]);
    const [rowUserData, setRowUserData] = useState([]);
    const [userNm, setUserNm] = useState('');
    const [selectedUserInRow, setSelectedUserInRow] = useState("");
    const [modalOpen, setModalOpen] = useState({
        first: false,
        third: false,
    })
    const [buttonTextId, setButtonTextId] = useState('중복확인');
    const [buttonTextNm, setButtonTextNm] = useState('중복확인');
    const [modifyNm, setModifyNm] = useState('성명 재설정');
    const [isReadOnly, setIsReadOnly] = useState(true);  // readOnly 상태를 관리하는 state 추가

    const userIdRef = useRef(null);
    const passwordRef = useRef(null);
    const userNmRef = useRef(null);
    const userNmDetailRef = useRef(null);
    const jobStrtTmRef = useRef(null);
    const jobEndTmRef = useRef(null);
    const authGrpCdRef = useRef(null);
    const deptCdRef = useRef(null);
    const selfPrYnRef = useRef(null);
    const userStatusCdRef = useRef(null);

    // 직원 전체 데이터 가져오기
    useEffect((e)=> {
        findAll();
    },[])


    // 직원 list 조회
    const findAll = () => {
        fetch(process.env.REACT_APP_API_HOST + "/ims/emp/findAll")
        .then((res) => res.json())
        .then((res) => {
            const formattData = res.map(item => ({
                ...item,
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
    
    const [inputData, setInputData] = useState({
        userId: '',
        authGrpCd: '',
        deptCd: '',
        userNm: '',
        password: '',
        userStatusCd: '',
        email: '',
        empGm: '',
        empPr: '',
        regDate: '',
        regUser: '',
        jobStrtTm: '',
        jobEndTm: '',
        selfPrYn: '',
        cdNm: ''
    });

    // EnterKey
    const activeEnter = (e) => {
        if(e.key === "Enter") {
            empSelectClickEvent();
        }
      }

    const handleEmpFormSubmit = (e) => {
        e.preventDefault();
        empSelectClickEvent();
    }

    // 직원명 조회
    const empSelectClickEvent = () => {
        axios.get(process.env.REACT_APP_API_HOST + "/ims/emp/userNm", {
            params:{userNm}
        }).then(response => {
            setRowData(response.data);
            console.log(response.data);
        }).catch(error => {
            console.log(error);
        })
    };

    // 직원 컬럼 설정 onLoad
    const columnDefs = [
        {headerName:"직원ID", field:"userId", width:260},
        {headerName:"직원명", field:"userNm", width:260},
        {headerName:"권한그룹코드", field:"authGrpCd", width:260},
        {headerName:"부서명", field:"deptName", width:260},
        {headerName:"비고", field:"cdNm", width:520},
    ];

    // 해당 직원이 퇴직일 경우에만 직원 list에 표시
    const modifiedRowData = rowData.map(row => ({
        ...row,
        cdNm: row.cdNm === "퇴직" ? row.cdNm : ""
    }));


    const autoSizeAll = (param) => {
        const allColumnIds = ['titlNm', 'workInfo', 'prgsHist', 'remarks'];
        param.columnApi.autoSizeColumns(allColumnIds, false);
    };

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
        onReset();
    }

    // <직원등록> 팝업 오픈
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

    // [초기화] 클릭
    // <직원등록> 시 select를 따로 안할 시 첫번째 option 값으로 자동등록 (authGrpCd, deptCd, jobStrtTm, jobEndTm, selfPrYn)
    const onReset = () => {
        debugger;
        setInputData((prev) => ({
            ...prev,
            userId: '',
            authGrpCd: 'ADMIN', 
            deptCd: '03',
            userNm: '',
            password: '',
            userStatusCd: '',
            email: '',
            empGm: '',
            empPr: '',
            regDate: '',
            regUser: '',
            jobStrtTm: '07:00',
            jobEndTm: '16:00',
            selfPrYn: 'Y',
            cdNm: ''
        }))

        // <직원등록> 팝업 창 close 시 ID button 문구 및 readOnly 해제, 입력창 background-color 원래대로 변경
        if (buttonTextId === 'ID 재설정') {
            setButtonTextId('중복확인');
            userIdRef.current.readOnly = false;
            userIdRef.current.style = 'initial';
        }

        // <직원등록> 팝업 창 close 시 성명 button 문구 및 readOnly 해제, 입력창 background-color 원래대로 변경
        if (buttonTextNm === '성명 재설정') {
            setButtonTextNm('중복확인');
            userNmRef.current.readOnly = false;
            userNmRef.current.style = 'initial';
        }

        // <직원정보 수정> 팝업 창 close 시 성명 button 문구 변경
        debugger;
        setModifyNm('성명 재설정');

    }   

    /* ============== 직원등록 START ============== */
    const saveEmp = (e) => {
        e.preventDefault();
        if(inputData.userId === "") {
            window.alert("ID를 입력해주세요.");
            return userIdRef.current.focus();
        }

        if(inputData.password === "") {
          window.alert("비밀번호를 입력해주세요.");
          return passwordRef.current.focus();
        }

        if(inputData.userNm === "") {
          window.alert("성명을 입력해주세요.");
          return userNmRef.current.focus();
        }

        if(inputData.jobStrtTm === "") {
            window.alert("업무시작시간을 선택해주세요.");
            return jobStrtTmRef.current.focus();
        }

        if(inputData.jobEndTm === "") {
            window.alert("업무종료시간을 선택해주세요.");
            return jobEndTmRef.current.focus();
        }

        if(inputData.authGrpCd === "") {
            window.alert("권한을 선택해주세요.");
            return authGrpCdRef.current.focus();
        }

        if(inputData.deptCd === "") {
            window.alert("부서를 선택해주세요.");
            return deptCdRef.current.focus();
        }

        if(inputData.selfPrYn === "") {
            window.alert("셀프승인여부를 선택해주세요.");
            return selfPrYnRef.current.focus();
        }
        
        // 비밀번호 validation check
        if (!/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,12}$/.test(inputData.password)) {
            alert('비밀번호는 영문, 숫자로 4~12자로 입력해주세요.');
            return passwordRef.current.focus();
        }

        if(window.confirm("등록하시겠습니까?")) {
            
            const data = {
                userId: inputData.userId,
                password: inputData.password,
                userNm: inputData.userNm,
                jobStrtTm: inputData.jobStrtTm,
                jobEndTm: inputData.jobEndTm,
                authGrpCd : inputData.authGrpCd,
                deptCd : inputData.deptCd,
                selfPrYn : inputData.selfPrYn,
                regUser: 'test', // 등록직원
            };
            console.log("data : ",data);
            axios.post(process.env.REACT_APP_API_HOST + "/ims/emp/insertEmp", data)
                .then(function(response) {
                    alert("직원등록이 완료되었습니다.");
                    findAll();
                    handleModalClose("first");
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    }
    /* ============== 직원등록 END ============== */

    // Grid DoubleClick modifyModal
    const onRowDoubleClicked = () => {
        //rowData 담아주기
        setInputData(selectedRow[0])
        handleModalOpen('third')
    }

    // 수정버튼 클릭 event
    const modifyClick = () => {
debugger;
        if(window.confirm("수정하시겠습니까?")) {
            
            const data = {
                userId: inputData.userId,
                password : inputData.password,
                userNm : inputData.userNm,
                jobStrtTm: inputData.jobStrtTm,
                jobEndTm: inputData.jobEndTm,
                authGrpCd : inputData.authGrpCd,
                deptCd : inputData.deptCd,
                selfPrYn : inputData.selfPrYn,
                userStatusCd : inputData.userStatusCd,
                updUser: 'test', // 수정직원
            };
            console.log("data : ",data);
            axios.post(process.env.REACT_APP_API_HOST + "/ims/emp/modifyEmp", data)
                .then(function(response) {
                    alert("직원수정이 완료되었습니다.");
                    findAll();
                    handleModalClose("third");
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    }

    /* ============== ID 중복확인 START ============== */
    const checkIdDuplicate = async () => {
        try {
            if (!inputData.userId) {
                alert('ID를 입력하세요.');
                return;
            }
            const url = `${process.env.REACT_APP_API_HOST}/ims/emp/check-userId/${inputData.userId}`;
            const response = await axios.get(url);
            const data = response.data;
            console.log(data)
            if (data) {
                alert('이미 사용중인 ID입니다.');
            } else {
                if (!/^[a-zA-Z0-9]{4,12}$/.test(inputData.userId)) {
                    alert('직원 ID는 4 ~ 12자의 영문 또는 숫자로 입력해주세요.');
                    return;
                }
                alert('사용 가능한 ID입니다.');
                userIdRef.current.readOnly = true;
                userIdRef.current.style.backgroundColor = '#dddddd';
                // 중복확인 버튼의 텍스트를 ID 재설정으로 변경
                setButtonTextId('ID 재설정');
            }
        } catch (error) {
            console.error('Error checking duplicate:', error);
            alert('중복 확인 중 오류가 발생했습니다.');
        }
    }

    const handleIdButtonClick = () => {
        if (buttonTextId === 'ID 재설정') {
            setButtonTextId('중복확인');
            userIdRef.current.readOnly = false;
            userIdRef.current.style = 'initial';
        } else {
            checkIdDuplicate();
        }
    }
    /* ============== ID 중복확인 END ============== */

    /* ============== 등록 창 내에서 성명 중복확인 START ============== */
    const checkNmDuplicate = async () => {
        debugger;
        try {
            if (!inputData.userNm) {
                alert('성명을 입력하세요.');
                return;
            }
            const url = `${process.env.REACT_APP_API_HOST}/ims/emp/check-userNm/${inputData.userNm}`;
            const response = await axios.get(url);
            const data = response.data;
            console.log(data)
            if (data) {
                alert('이미 사용중인 성명입니다.\n성명+숫자로 재입력해주세요.\n(예: 홍길동1, 홍길동2)');
            } else {
                if (!/^.{2,}$/.test(inputData.userNm)) {
                    alert('직원 성명은 두 글자 이상 입력해 주세요.');
                    return;
                }
                alert('사용 가능한 성명입니다.');
                userNmRef.current.readOnly = true;
                userNmRef.current.style.backgroundColor = '#dddddd';
                setButtonTextNm('성명 재설정');
            }
        } catch (error) {
            alert('중복 확인 중 오류가 발생했습니다.');
        }
    }

    /* ============== 상세 창 내에서 성명 중복확인 START ============== */
    const detailCheckNmDuplicate = async () => {
        debugger;
        try {
            if (!inputData.userNm) {
                alert('성명을 입력하세요.');
                return;
            }
            const url = `${process.env.REACT_APP_API_HOST}/ims/emp/check-userNm/${inputData.userNm}`;
            const response = await axios.get(url);
            const data = response.data;
            console.log(data)
            if (data) {
                alert('이미 사용중인 성명입니다.\n성명+숫자로 재입력해주세요.\n(예: 홍길동1, 홍길동2)');
            } else {
                if (!/^.{2,}$/.test(inputData.userNm)) {
                    alert('직원 성명은 두 글자 이상 입력해 주세요.');
                    return;
                }
                
                alert('사용 가능한 성명입니다.');
            }
        } catch (error) {
            alert('중복 확인 중 오류가 발생했습니다.');
        }
    }

    const handleNmButtonClick = () => {
        debugger;
        if (buttonTextNm === '성명 재설정' ) {
            setButtonTextNm('중복확인');
            userNmRef.current.readOnly = false;
            userNmRef.current.style.backgroundColor = '#ffffff';
        } else {
            checkNmDuplicate();
            
        }
    }
    /* ============== 등록 창 내에서 성명 중복확인 END ============== */

    /* ============== 직원 삭제 START ============== */
    const deleteClick = async () => {
        const userId = inputData.userId; // Replace with your logic to get the userId
        console.log(userId)

        if (!userId) {
            alert('User ID is required');
            return;
        }

        const confirmed = window.confirm("삭제하시겠습니까?");
        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_HOST}/ims/emp/${inputData.userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                alert("삭제되었습니다.");
                handleModalClose('third'); // 모달창 close
                findAll(); // 직원 list reload
            } else {
                alert("삭제하는 데 실패했습니다.");
            }
        } catch (error) {
            console.error('Error:', error);
            alert('error');
        }
    };
    /* ============== 직원 삭제 END ============== */

    // 수정 팝업 내 성명 재설정 버튼을 누를 시
    const nmModifyClick = () => {
        debugger;
        if(modifyNm == "성명 재설정") {
            setModifyNm('중복확인');
            setIsReadOnly(false);  // 버튼 클릭 시 readOnly 해제
            userNmDetailRef.current.style.backgroundColor = '#ffffff';
        } else if (modifyNm == "중복확인") {
            setModifyNm('성명 재설정');
            setIsReadOnly(true);

            // 중복확인 함수
            //detailCheckNmDuplicate();

            debugger;
            if(detailCheckNmDuplicate()) {
                userNmDetailRef.current.style.backgroundColor = '#E6E6E6';
            }
            
        }
    }

    // 수정 팝업 내 [재조회] 버튼 누를 시
    const reloadClick = () => {
        
    }

    return (
        <>
            <Stack gap={2} style={{ width: "100%",height:500}}>
                <div className="bg-light border rounded p-3">
                    <Row>
                        <Col xs={4}>
                            <Form onSubmit={handleEmpFormSubmit}>
                                <InputGroup>
                                    <Form.Label column xs={3} style={{margin: "auto"}}>직원명</Form.Label> 
                                    <Form.Control type="text" name="userNm" placeholder="직원명" onChange={e => setUserNm(e.target.value)} value={userNm}/>
                                </InputGroup>
                            </Form>
                        </Col>
                        <Col xs={8}>
                            <Button variant="btn btn-outline-success" style={{ float: "right", margin: "0px 5px 0px 5px", width: "100px" }} onClick={() => handleClick('first')}>직원등록</Button>
                            <Button variant="primary" style={{float:"right", margin:"0px 5px 0px 5px", width:"100px"}} onClick={empSelectClickEvent}>조회</Button>
                        </Col>
                    </Row>
                </div>
                <div className="ag-theme-alpine" style={{width: "100%"}}>
                    <AgGridReact columnDefs={columnDefs} rowData={modifiedRowData}
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
                <Modal.Title >직원등록</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="mb-2" controlId="firstRow">
                    <Col></Col>
                    <Col xs={6} className="text-end" style={{color: "red", fontSize: '10px'}}>* 는 필수 입력 항목입니다.</Col>
                </Row>
                <Form onSubmit={saveEmp}>
                    <Form.Group as={Row} className="mb-3" controlId="secondRow">
                        <Form.Label column xs={4}><span style={{ color: "red" }}>*</span>ID</Form.Label>
                        <Col xs={7}>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    name="userId"
                                    ref={userIdRef}
                                    placeholder="ID"
                                    onChange={e => setInputData(prev => ({ ...prev, userId: e.target.value }))}
                                    value={inputData.userId || ""}
                                />
                                <Button variant="primary" onClick={handleIdButtonClick}>{buttonTextId}</Button>
                            </InputGroup>
                            <p style={{ fontSize: '10px', color: '#A6A6A6' }}> {">"} ID는 영문, 숫자로 4~12자로 입력해주세요.</p>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="thirdRow">
                        <Form.Label column xs={4}><span style={{ color: "red" }}>*</span>비밀번호</Form.Label>
                        <Col xs={7}>
                            <InputGroup>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    ref={passwordRef}
                                    placeholder="비밀번호"
                                    autoComplete="new-password"
                                    onChange={e => setInputData(prev => ({ ...prev, password: e.target.value }))}
                                    value={inputData.password || ""}
                                />
                            </InputGroup>
                            <p style={{ fontSize: '10px', color: '#A6A6A6' }}> {">"} 비밀번호는 영문, 숫자로 4~12자로 입력해주세요.</p>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="fourthRow">
                        <Form.Label column xs={4}><span style={{color: "red"}}>*</span>성명</Form.Label>
                        <Col xs={7}>    
                        <InputGroup>
                                <Form.Control
                                    type="text"
                                    name="userNm"
                                    ref={userNmRef}
                                    autoComplete="new-name"
                                    placeholder="성명"
                                    onChange={e => setInputData(prev => ({ ...prev, userNm: e.target.value }))}
                                    value={inputData.userNm || ""}
                                />
                                <Button variant="primary" onClick={handleNmButtonClick}>{buttonTextNm}</Button>
                            </InputGroup>
                            <p style={{ fontSize: '10px', color: '#A6A6A6' }}> {">"} 동일한 성명이 선등록되어있을 경우 성명+숫자로 입력해주세요. (예: 홍길동1, 홍길동2)</p>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="fifthhRow">
                        <Form.Label column xs={4}><span style={{color: "red"}}>*</span>근무시간</Form.Label>
                        <Col xs={7}>    
                            <InputGroup>
                                {/* jobStrtTm selectBox */}
                                <Form.Select name="jobStrtTm" ref={jobStrtTmRef} onChange={e => setInputData(prev => ({...prev, jobStrtTm: e.target.value}))} value={inputData.jobStrtTm || ""}>
                                    {[...Array(5).keys()].map(hour => {
                                        const currentHour = hour + 7;
                                        const hourString = currentHour.toString().padStart(2, '0');
                                        if (currentHour === 11) {
                                            return (
                                                <option key={hourString} value={`${hourString}:00`}>{`${hourString}:00`}</option>
                                            );
                                        }
                                        return (
                                            <>
                                                <option key={`${hourString}00`} value={`${hourString}:00`}>{`${hourString}:00`}</option>
                                                <option key={`${hourString}30`} value={`${hourString}:30`}>{`${hourString}:30`}</option>
                                            </>
                                        );
                                    })}
                                </Form.Select>
                                <Form.Select name="jobEndTm" ref={jobEndTmRef} onChange={e => setInputData(prev => ({...prev, jobEndTm: e.target.value}))} value={inputData.jobEndTm || ""}>
                                    {[...Array(12).keys()].map(hour => {
                                        const currentHour = hour + 16;
                                        const hourString = currentHour.toString().padStart(2, '0');
                                        if (currentHour <= 18) {
                                            return (
                                                <>
                                                    <option key={`${hourString}00`} value={`${hourString}:00`}>{`${hourString}:00`}</option>
                                                    <option key={`${hourString}30`} value={`${hourString}:30`}>{`${hourString}:30`}</option>
                                                </>
                                            );
                                        } else if (currentHour === 19) {
                                            return (
                                                <option key={hourString} value={`${hourString}:00`}>{`${hourString}:00`}</option>
                                            );
                                        }
                                        return null;
                                    })}
                                </Form.Select>
                            </InputGroup>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="sixthRow">
                        <Form.Label column xs={4}><span style={{color: "red"}}>*</span>권한</Form.Label>
                        <Col xs={7}>
                            <InputGroup>
                                <Form.Select name="authGrpCd" ref={authGrpCdRef} onChange={e => setInputData(prev => ({...prev, authGrpCd: e.target.value}))} value={inputData.authGrpCd || ""}>
                                    <option value="ADMIN">관리자</option>
                                    <option value="USER">일반사용자</option>
                                </Form.Select>
                            </InputGroup>
                        </Col>
                   </Form.Group>
                   <Form.Group as={Row} className="mb-3" controlId="seventhRow">
                        <Form.Label column xs={4}><span style={{color: "red"}}>*</span>부서</Form.Label>
                        <Col xs={7}>    
                            <InputGroup>
                                <Form.Select name="deptCd" ref={deptCdRef} onChange={e => setInputData(prev => ({...prev, deptCd: e.target.value}))} value={inputData.deptCd || ""}>
                                    <option value="03">디스플레이팀</option>
                                    <option value="04">실트론팀</option>
                                    <option value="05">경영지원실</option>
                                    <option value="06">전자이노텍팀</option>
                                    <option value="10">제조서비스팀</option>
                                    <option value="11">SF개발팀</option>
                                    <option value="12">첨단소재팀</option>
                                    <option value="14">DX이행팀</option>
                                    <option value="15">석유화학팀</option>
                                    <option value="18">DX서비스팀</option>
                                    <option value="19">SE개발팀1</option>
                                    <option value="20">SE개발팀2</option>
                                    <option value="21">SE개발팀</option>
                                    <option value="91">제조서비스_2</option>
                                    <option value="92">제조서비스_3</option>
                                    <option value="93">제조서비스_4</option>
                                    <option value="94">제조서비스_5</option>
                                    <option value="95">제조서비스제조서_6</option>
                                    <option value="98">연구개발팀</option>
                                    <option value="99">DX전략팀</option>
                                </Form.Select>
                            </InputGroup>
                        </Col>
                   </Form.Group>
                   <Form.Group as={Row} className="mb-3" controlId="seventhRow">
                        <Form.Label column xs={4}><span style={{color: "red"}}>*</span>셀프승인</Form.Label>
                        <Col xs={7}>    
                            <InputGroup>
                                <Form.Select name="selfPrYn" ref={selfPrYnRef} onChange={e => setInputData(prev => ({...prev, selfPrYn: e.target.value}))} value={inputData.selfPrYn || ""}>
                                    <option value="Y">Y</option>
                                    <option value="N">N</option>
                                </Form.Select>
                            </InputGroup>
                        </Col>
                   </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" className="btn_register" onClick={saveEmp}>등록</Button>
                <Button variant="secondary" className="btn_reset" onClick={onReset}>초기화</Button>
                <Button variant="secondary" className="btn_close" onClick={() => handleModalClose('first')}>닫기</Button>
            </Modal.Footer>
        </Modal>

        <Modal show={modalOpen.third}>
                <Modal.Header>
                    <Modal.Title >직원정보 수정</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="mb-2" controlId="firstRow">
                        <Col></Col>
                        <Col xs={6} className="text-end" style={{color: "red", fontSize: '10px'}}>* 는 필수 입력 항목입니다.</Col>
                    </Row>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column xs={4}><span style={{color: "red"}}>*</span>ID</Form.Label>
                        <Col xs={7}>
                            <Form.Control type="text" name="userId" style={{background:"#E6E6E6"}} value={inputData.userId} readOnly/>
                            <p style={{fontSize:10, color: "#A6A6A6"}}> {">"} ID는 수정불가능합니다. 수정필요시 삭제 후 재등록 해야합니다. (단, 이전기록 사용불가)</p>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column xs={4}><span style={{color: "red"}}>*</span>비밀번호</Form.Label>
                        <Col xs={7}>
                        <InputGroup>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    ref={passwordRef}
                                    placeholder="비밀번호"
                                    autoComplete="new-password"
                                    onChange={e => setInputData(prev => ({ ...prev, password: e.target.value }))}
                                    value={inputData.password || ""}
                                />
                            </InputGroup>
                            <p style={{fontSize:10, color: "#E6E6E6"}}> {">"} 비밀번호는 영문, 숫자로 4~12자로 입력해주세요.</p>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column xs={4}><span style={{color: "red"}}>*</span>성명</Form.Label>
                        <Col xs={7}>
                        <InputGroup>
                            <Form.Control 
                                type="text" 
                                name="userNm" 
                                ref={userNmDetailRef}
                                value={inputData.userNm} 
                                style={{background:"#E6E6E6"}}
                                readOnly={isReadOnly}  // readOnly 상태를 state로 제어
                                onChange={(e) => setInputData({ ...inputData, userNm: e.target.value })}  // 입력값 변경 시 state 업데이트
                            />
                            <Button variant="primary" onClick={nmModifyClick}>{modifyNm}</Button>
                        </InputGroup>
                            <p style={{ fontSize: '10px', color: '#A6A6A6' }}> {">"} 동일한 성명이 선등록되어있을 경우 성명+숫자로 입력해주세요. (예: 홍길동1, 홍길동2)</p>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column xs={4}><span style={{color: "red"}}>*</span>근무시간</Form.Label>
                        <Col xs={7}>    
                            <InputGroup>
                                {/* jobStrtTm selectBox */}
                                <Form.Select name="jobStrtTm" ref={jobStrtTmRef} onChange={e => setInputData(prev => ({...prev, jobStrtTm: e.target.value}))} value={inputData.jobStrtTm || ""}>
                                    {[...Array(5).keys()].map(hour => {
                                        const currentHour = hour + 7;
                                        const hourString = currentHour.toString().padStart(2, '0');
                                        if (currentHour === 11) {
                                            return (
                                                <option key={hourString} value={`${hourString}:00`}>{`${hourString}:00`}</option>
                                            );
                                        }
                                        return (
                                            <>
                                                <option key={`${hourString}00`} value={`${hourString}:00`}>{`${hourString}:00`}</option>
                                                <option key={`${hourString}30`} value={`${hourString}:30`}>{`${hourString}:30`}</option>
                                            </>
                                        );
                                    })}
                                </Form.Select>
                                <Form.Select name="jobEndTm" ref={jobEndTmRef} onChange={e => setInputData(prev => ({...prev, jobEndTm: e.target.value}))} value={inputData.jobEndTm || ""}>
                                    {[...Array(12).keys()].map(hour => {
                                        const currentHour = hour + 16;
                                        const hourString = currentHour.toString().padStart(2, '0');
                                        if (currentHour <= 18) {
                                            return (
                                                <>
                                                    <option key={`${hourString}00`} value={`${hourString}:00`}>{`${hourString}:00`}</option>
                                                    <option key={`${hourString}30`} value={`${hourString}:30`}>{`${hourString}:30`}</option>
                                                </>
                                            );
                                        } else if (currentHour === 19) {
                                            return (
                                                <option key={hourString} value={`${hourString}:00`}>{`${hourString}:00`}</option>
                                            );
                                        }
                                        return null;
                                    })}
                                </Form.Select>
                            </InputGroup>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column xs={4}><span style={{color: "red"}}>*</span>권한</Form.Label>
                        <Col xs={7}>    
                            <InputGroup>
                                <Form.Select name="authGrpCd" ref={authGrpCdRef} onChange={e => setInputData(prev => ({...prev, authGrpCd: e.target.value}))} value={inputData.authGrpCd || ""}>
                                    <option value="ADMIN">관리자</option>
                                    <option value="USER">일반사용자</option>
                                </Form.Select>
                            </InputGroup>
                        </Col>
                   </Form.Group>
                   <Form.Group as={Row} className="mb-3" controlId="seventhRow">
                        <Form.Label column xs={4}><span style={{color: "red"}}>*</span>부서</Form.Label>
                        <Col xs={7}>    
                            <InputGroup>
                                <Form.Select name="authGrpCd" ref={deptCdRef} onChange={e => setInputData(prev => ({...prev, deptCd: e.target.value}))} value={inputData.deptCd || ""}>
                                    <option value="03">디스플레이팀</option>
                                    <option value="04">실트론팀</option>
                                    <option value="05">경영지원실</option>
                                    <option value="06">전자이노텍팀</option>
                                    <option value="10">제조서비스팀</option>
                                    <option value="11">SF개발팀</option>
                                    <option value="12">첨단소재팀</option>
                                    <option value="14">DX이행팀</option>
                                    <option value="15">석유화학팀</option>
                                    <option value="18">DX서비스팀</option>
                                    <option value="19">SE개발팀1</option>
                                    <option value="20">SE개발팀2</option>
                                    <option value="21">SE개발팀</option>
                                    <option value="91">제조서비스_2</option>
                                    <option value="92">제조서비스_3</option>
                                    <option value="93">제조서비스_4</option>
                                    <option value="94">제조서비스_5</option>
                                    <option value="95">제조서비스제조서_6</option>
                                    <option value="98">연구개발팀</option>
                                    <option value="99">DX전략팀</option>
                                </Form.Select>
                            </InputGroup>
                        </Col>
                   </Form.Group>
                   <Form.Group as={Row} className="mb-3">
                        <Form.Label column xs={4}><span style={{color: "red"}}>*</span>셀프승인</Form.Label>
                        <Col xs={7}>    
                        <InputGroup>
                            <Form.Select 
                                name="selfPrYn" 
                                ref={selfPrYnRef} 
                                onChange={e => setInputData(prev => ({...prev, selfPrYn: e.target.value}))} 
                                value={inputData.selfPrYn || ""}
                            >
                                {inputData.selfPrYn === "Y" ? (
                                    <>
                                        <option value="Y">Y</option>
                                        <option value="N">N</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="N">N</option>
                                        <option value="Y">Y</option>
                                    </>
                                )}
                            </Form.Select>
                        </InputGroup>
                        </Col>
                   </Form.Group>
                   <Form.Group as={Row} className="mb-3">
                        <Form.Label column xs={4}><span style={{color: "red"}}>*</span>재직여부</Form.Label>
                        <Col xs={7}>    
                            <InputGroup>
                                <Form.Select name="userStatusCd" ref={userStatusCdRef} onChange={e => setInputData(prev => ({...prev, userStatusCd: e.target.value}))} value={inputData.userStatusCd || ""}>
                                    <option value="2">재직</option>
                                    <option value="1">퇴직</option>
                                </Form.Select>
                            </InputGroup>
                            <p style={{ fontSize: '10px', color: '#A6A6A6' }}> {">"} 퇴사한 직원의 경우, '퇴직'을 선택해주세요.</p>
                        </Col>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className="btn_modify" onClick={modifyClick} >수정</Button>
                    <Button variant="secondary" className="btn_reload" onClick={reloadClick} >재조회</Button>
                    <Button variant="secondary" className="btn_delete" onClick={deleteClick} >삭제</Button>
                    <Button variant="secondary" className="btn_close" onClick={() => handleModalClose("third")}>닫기</Button>
                </Modal.Footer>
        </Modal>
        </>
    );
};
  
export default Emp;