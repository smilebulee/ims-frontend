import { useRef, useState } from "react";
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FaSearch } from 'react-icons/fa';
import InputGroup from 'react-bootstrap/InputGroup';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';


const Dept = () => {

    const [show, setShow] = useState(false);
    const [showSecond, setSecondShow] = useState(false);
    const [color, setColor] = useState('red');
    const [deptNm, setDeptNm] = useState('');
    const [businessManager, setBusinessManager] = useState('');
    const [agentManger, setAgentManger] = useState('');
    const [userNm,setUserNm] = useState('');
    const [userList, setUserList] = useState([]);

    // 부서등록버튼 클릭시 modal
    const showModal = () => setShow(true);
    const closeModal = () => setShow(false);

    // 이중모달 구현
    const showSecondModal = () => setSecondShow(true);
    const closeSecondModal = (e) => {
        setSecondShow(false);
        setUserNm('');
    }

    // 초기화버튼 클릭시 
    const onReset = (e) => {
       setDeptNm('');
       setBusinessManager('');
       setAgentManger('');

    }

    const [options, setOptions] = useState([{cd:"", cdNm:"전체"},{cd:"1", cdNm:"진행중"},{cd:"2", cdNm:"완료"}]);
    // submit시 
    const getList = (e) => {        
        e.preventDefault();

        setOptions([{cd:"", cdNm:"전체"},{cd:"1", cdNm:"진행중"},{cd:"2", cdNm:"완료"},{cd:"3", cdNm:"test"}]);

    };

    // 직원 조회 검색 클릭 event
    const empSelectClickEvent = (e) => {
        e.preventDefault()

        
        //  직원조회 검색 
        axios.get(process.env.REACT_APP_API_HOST + "/ims/user/userSelect", {
            params:{userNm}
        }).then(response => {
            closeSecondModal();
            
            // List 형식
            console.log(response.data);
            console.log(userNm);
            setUserList(response.data);
            
        }).catch(error => {
            console.log(error);
        })
    }

    return (
        <>
        <Stack gap={2} style={{ width: "100%"}}>
            <div className="bg-light border rounded p-3">
                <Form onSubmit={getList}>
                    <Form.Group as={Row} className="mb-1" controlId="firstRow">
                        <Col xs={1}>
                            <Button variant="btn btn-outline-success" style={{ float: "right", margin: "0px 5px 0px 5px", width: "100px" }} onClick={showModal}>부서등록</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </div>
        </Stack>
        <Modal show={show} onHide={closeModal}>
            <Modal.Header>
                <Modal.Title >부서등록</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="mb-2" controlId="firstRow">
                    <Col></Col>
                    <Col xs={6} style={{color}}>* 는 필수 입력 항목입니다.</Col>
                </Row>
                <Form onSubmit={getList}>
                    <Form.Group as={Row} className="mb-3" controlId="secondRow">
                        <Form.Label column xs={4}><span style={{color}}>*</span>부서명</Form.Label>
                        <Col xs={7}>
                            <Form.Control type="text" name="deptNm" placeholder="부서명" onChange={e => setDeptNm(e.target.value)} value={deptNm}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="thirdRow">
                        <Form.Label column xs={4}><span style={{color}}>*</span>사업부장</Form.Label>
                        <Col xs={7}>
                            <InputGroup>
                                <Form.Control type="text" name="businessManager" placeholder="사업부장" style={{background:"#E6E6E6"}} value={userList.find(e => e.userNm === userNm)?.userNm} readOnly/>
                                <InputGroup.Text style={{cursor:"pointer"}} onClick={showSecondModal}><FaSearch/></InputGroup.Text>
                            </InputGroup>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="fourthRow">
                        <Form.Label column xs={4}><span style={{color}}>*</span>현장대리인</Form.Label>
                        <Col xs={7}>
                            <InputGroup>
                                <Form.Control type="text" name="agentManger" placeholder="현장대리인" style={{background:"#E6E6E6"}} value={userList.find(e => e.userNm === userNm)?.userNm} readOnly/>
                                <InputGroup.Text style={{cursor:"pointer"}} onClick={showSecondModal}><FaSearch/></InputGroup.Text>
                           </InputGroup>
                        </Col>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" className="btn_close" onClick={closeModal}>등록</Button>
                <Button variant="secondary" className="btn_close" onClick={onReset}>초기화</Button>
                <Button variant="secondary" className="btn_close" onClick={closeModal}>닫기</Button>
            </Modal.Footer>
        </Modal>
        <Modal show={showSecond} onHide={closeSecondModal}>
                <Modal.Header>
                    <Modal.Title >직원조회</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={getList}>
                        <Form.Group as={Row} className="mb-3" controlId="secondRow">
                            <Form.Label column xs={4}><span style={{color}}>*</span>직원조회</Form.Label>
                            <Col xs={7}>
                                <InputGroup>
                                    <Form.Control type="text" name="userNm" placeholder="직원명" onChange={e => setUserNm(e.target.value)} value={userNm}/>
                                    <Button variant="secondary" className="btn_close" onClick={empSelectClickEvent}>검색</Button>
                                </InputGroup>
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" className="btn_close" onClick={closeSecondModal}>닫기</Button>
                </Modal.Footer>
        </Modal>
        </>
    );
};
  
export default Dept;