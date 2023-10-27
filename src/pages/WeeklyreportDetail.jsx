import { useEffect, useState } from "react";
import { Form, Row, Col, Button, Stack } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const WeeklyreportDetail= () => {
  const [reportDt, setReportDt] = useState();
  const [mailId, setMailId] = useState();
  const [upDeptNm, setUpDeptNm] = useState();
  const [deptNm, setDeptNm] = useState();
  const [empNm, setEmpNm] = useState();
  const [seq, setSeq] = useState();
  const [workUnit, setWorkUnit] =  useState();
  const [prgsStus, setPrgsStus] = useState();
  const [workDivs, setWorkDivs] = useState();
  const [titlNm, setTitlNm] = useState();
  const [workPart, setWorkPart] = useState();
  const [workInfo, setWorkInfo] = useState();
  const [schedStartDt, setSchedStartDt] = useState();
  const [schedEndDt, setSchedEndDt] = useState();
  const [adjustDt, setAdjustDt] = useState();
  const [adjustRsn, setAdjustRsn] = useState();
  const [fnshDt, setFnshDt] = useState();
  const [prgsHist, setPrgsHist] = useState();
  const [remarks, setRemarks] = useState();

  const navigate = useNavigate();
  const location = useLocation();

  const [isModify, setIsModify] = useState();
  
  useEffect(() => {
    const rowInfo = {...location.state.data};
    console.log(rowInfo);
    const dateFormat = dateStr => dateStr.length == 8 ? dateStr.substr(0, 4) + "-" + dateStr.substr(4, 2) + "-" + dateStr.substr(6, 2) : "";

    if(Object.keys(rowInfo).length != 0) {
      setReportDt(rowInfo.reportDt);
      setMailId(rowInfo.mailId);
      setUpDeptNm(rowInfo.upDeptNm);
      setDeptNm(rowInfo.deptNm);
      setEmpNm(rowInfo.empNm);
      setSeq(rowInfo.seq);
      setWorkUnit(rowInfo.workUnit);
      setPrgsStus(rowInfo.prgsStus);
      setWorkDivs(rowInfo.workDivs);
      setTitlNm(rowInfo.titlNm);
      setWorkPart(rowInfo.workPart);
      setWorkInfo(rowInfo.workInfo);
      setSchedStartDt(dateFormat(rowInfo.schedStartDt+""));
      setSchedEndDt(dateFormat(rowInfo.schedEndDt+""));
      setAdjustDt(dateFormat(rowInfo.adjustDt+""));
      setAdjustRsn(rowInfo.adjustRsn);
      setFnshDt(dateFormat(rowInfo.fnshDt+""));
      setPrgsHist(rowInfo.prgsHist);
      setRemarks(rowInfo.remarks);
      setIsModify(true);
    }
    else {
      const today = new Date();
      setReportDt(today.getFullYear() + String(today.getMonth()+1).padStart(2, "0") + today.getDate());
      setMailId("test@test.com");
      setUpDeptNm("");
      setDeptNm("");
      setEmpNm("");
      setSeq("");
      setWorkUnit("일간");
      setPrgsStus("진행중");
      setWorkDivs("SI");
      setTitlNm("");
      setWorkPart("");
      setWorkInfo("");
      setSchedStartDt("");
      setSchedEndDt("");
      setAdjustDt("");
      setAdjustRsn("");
      setFnshDt("");
      setPrgsHist("");
      setRemarks("");
      setIsModify(false);
    }
  }, [location.state.data]);

  const saveReport = e => {
    e.preventDefault();

    const data = {
      reportDt: reportDt,
      mailId: mailId,
      upDeptNm: upDeptNm,
      deptNm: deptNm,
      empNm: empNm,
      seq: seq,
      workUnit: workUnit,
      prgsStus: prgsStus,
      workDivs: workDivs,
      titlNm: titlNm,
      workPart: workPart,
      workInfo: workInfo,
      schedStartDt: schedStartDt.replace(/-/g, ""),
      schedEndDt: schedEndDt.replace(/-/g, ""),
      adjustDt: adjustDt.replace(/-/g, ""),
      adjustRsn: adjustRsn,
      fnshDt: fnshDt.replace(/-/g, ""),
      prgsHist: prgsHist,
      remarks: remarks
    }

    // axios.post("http://localhost:8080/ims/report/weekly/add", null, {
    //   params: {
    //     upDeptNm: upDeptNm
    //   }
    axios.post("http://localhost:8080/ims/report/weekly/save", {
      ...data
    }).then(function(response) {
      alert(response.data);
      navigate("/weeklyreport");
    }).catch(function(error) {
      console.log(error);
    });
  }

  return (
      <>
        <Stack gap={4}>
          <h3>{location.state.title}</h3>
          
          <div className="bg-light border rounded p-3">
            <Form onSubmit={saveReport}>
              <Form.Group as={Row} className="mb-2" controlId="firstRow">
                <Form.Label column xs={1}>사업부</Form.Label>
                <Col xs={2}>
                  <Form.Control type="text" placeholder="" name="upDeptNm" value={upDeptNm || ""} onChange={e => setUpDeptNm(e.target.value)} />
                </Col>

                <Form.Label column xs={1}>팀</Form.Label>
                <Col xs={2}>
                  <Form.Control type="text" placeholder="" name="deptNm" value={deptNm || ""} onChange={e => setDeptNm(e.target.value)} />
                </Col>

                <Form.Label column xs={1}>담당자</Form.Label>
                <Col xs={2}>
                  <Form.Control type="text" placeholder="" name="empNm" value={empNm || ""} onChange={e => setEmpNm(e.target.value)} />
                </Col>
              </Form.Group>
              
              <Form.Group as={Row} className="mb-2" controlId="secondRow">
                <Form.Label column xs={1}>업무단위</Form.Label>
                <Col xs={2}>
                  <Form.Select placeholder="" name="workUnit" value={workUnit} onChange={e => setWorkUnit(e.target.value)} >
                    <option value="일간">일간</option>
                    <option value="주간">주간</option>
                    <option value="회의">회의</option>
                    <option value="휴가">휴가</option>
                  </Form.Select>
                </Col>

                <Form.Label column xs={1}>진행상태</Form.Label>
                <Col xs={2}>
                  <Form.Select placeholder="" name="prgsStus" value={prgsStus} onChange={e => setPrgsStus(e.target.value)} >
                    <option value="진행중">진행중</option>
                    <option value="완료">완료</option>
                    <option value="조정">조정</option>
                  </Form.Select>
                </Col>

                <Form.Label column xs={1}>구분</Form.Label>
                <Col xs={2}>
                  <Form.Select placeholder="" name="workDivs" value={workDivs} onChange={e => setWorkDivs(e.target.value)} >
                    <option value="SI">SI</option>
                    <option value="SM">SM</option>
                    <option value="스쿼드">스쿼드</option>
                  </Form.Select>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-2 align-items-center" controlId="thirdRow">
                <Form.Label column xs={1}>프로젝트/과제명</Form.Label>
                <Col xs={5}>
                  <Form.Control type="text" placeholder="" name="titlNm" value={titlNm || ""} onChange={e => setTitlNm(e.target.value)} />
                </Col>

                <Form.Label column xs={1}>파트</Form.Label>
                <Col xs={2}>
                  <Form.Control type="text" placeholder="" name="workPart" value={workPart || ""} onChange={e => setWorkPart(e.target.value)} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-2" controlId="fourthRow">
                <Form.Label column xs={1}>진행업무</Form.Label>
                <Col xs={8}>
                  <Form.Control type="text" placeholder="" name="workInfo" value={workInfo || ""} onChange={e => setWorkInfo(e.target.value)} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-2 align-items-center" controlId="fifthRow">
                <Form.Label column xs={1}>계획시작일자</Form.Label>
                <Col xs={2}>
                  <Form.Control type="date" placeholder="YYYY-MM-DD" value={schedStartDt || ""} name="schedStartDt" max={new Date('2999-12-31 23:59:59').toISOString().split('T')[0]} onChange={e => setSchedStartDt(e.target.value)} />
                </Col> 

                <Form.Label column xs={1}>계획종료일자</Form.Label>                 
                <Col xs={2}>
                  <Form.Control type="date" placeholder="YYYY-MM-DD" value={schedEndDt || ""} name="schedEndDt" max={new Date('2999-12-31 23:59:59').toISOString().split('T')[0]} onChange={e => setSchedEndDt(e.target.value)} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-2" controlId="sixthRow">
                <Form.Label column xs={1}>조정일자</Form.Label>                 
                <Col xs={2}>
                  <Form.Control type="date" placeholder="YYYY-MM-DD" name="adjustDt" value={adjustDt || ""} max={new Date('2999-12-31 23:59:59').toISOString().split('T')[0]} disabled={!isModify} onChange={e => setAdjustDt(e.target.value)} />
                </Col>

                <Form.Label column xs={1}>조정사유</Form.Label>                 
                <Col xs={5}>
                  <Form.Control type="text" placeholder="" name="adjustRsn" value={adjustRsn || ""} disabled={!isModify} onChange={e => setAdjustRsn(e.target.value)} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-2" controlId="seventhRow">
                <Form.Label column xs={1}>완료일자</Form.Label>                 
                <Col xs={2}>
                  <Form.Control type="date" placeholder="YYYY-MM-DD" name="fnshDt" value={fnshDt || ""} max={new Date('2999-12-31 23:59:59').toISOString().split('T')[0]} disabled={!isModify} onChange={e => setFnshDt(e.target.value)} />
                </Col>

                <Form.Label column xs={1}>진행내역</Form.Label>                 
                <Col xs={5}>
                  <Form.Control type="text" placeholder="" name="prgsHist" value={prgsHist || ""} onChange={e => setPrgsHist(e.target.value)} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-2" controlId="eighthRow">
                <Form.Label column xs={1}>비 고</Form.Label>                 
                <Col xs={8}>
                  <Form.Control type="text" placeholder="" name="remarks" value={remarks || ""} onChange={e => setRemarks(e.target.value)} />
                </Col>

                <Col>
                  <Link className="btn btn-danger" style={{float:"right", margin:"0px 5px 0px 5px"}} to="/weeklyreport">취 소</Link>
                  <Button variant="primary" style={{float:"right", margin:"0px 5px 0px 5px"}} type="submit">등 록</Button> 
                </Col>
              </Form.Group>
            </Form>     
          </div>
        </Stack>
      </>
  );
};

export default WeeklyreportDetail;