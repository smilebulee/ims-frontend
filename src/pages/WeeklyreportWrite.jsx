import { useEffect, useState, useRef } from "react";
import { Form, Row, Col, Button, Stack } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { MdOutlineFileDownload, MdDelete } from "react-icons/md";
import axios from "axios";

const WeeklyreportDetail= () => {
  const [reportDt, setReportDt] = useState();
  const [mailId, setMailId] = useState();
  const [upDeptNm, setUpDeptNm] = useState();
  const [deptNm, setDeptNm] = useState();
  const [empNm, setEmpNm] = useState();
  const [seq, setSeq] = useState(0);
  const [workUnit, setWorkUnit] =  useState();
  const [prgsStus, setPrgsStus] = useState();
  const [workDivs, setWorkDivs] = useState();
  const [titlNm, setTitlNm] = useState();
  const [workPart, setWorkPart] = useState();
  const [workPlan, setWorkPlan] = useState();
  const [workInfo, setWorkInfo] = useState();
  const [schedStartDt, setSchedStartDt] = useState();
  const [schedEndDt, setSchedEndDt] = useState();
  const [adjustDt, setAdjustDt] = useState();
  const [adjustRsn, setAdjustRsn] = useState();
  const [fnshDt, setFnshDt] = useState();
  const [prgsHist, setPrgsHist] = useState();
  const [remarks, setRemarks] = useState();
  const [fileName, setFileName] = useState();
  const [file, setFile] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const [isModify, setIsModify] = useState();

  const upDeptNmRef = useRef(null);
  const deptNmRef = useRef(null);
  const empNmRef = useRef(null);
  const schedStartDtRef = useRef(null);
  const schedEndDtRef = useRef(null);

  useEffect(() => {
    const rowInfo = {...location.state.data};
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
      setWorkPlan(rowInfo.workPlan);
      setWorkInfo(rowInfo.workInfo);
      setSchedStartDt(dateFormat(rowInfo.schedStartDt+""));
      setSchedEndDt(dateFormat(rowInfo.schedEndDt+""));
      setAdjustDt(dateFormat(rowInfo.adjustDt+""));
      setAdjustRsn(rowInfo.adjustRsn);
      setFnshDt(dateFormat(rowInfo.fnshDt+""));
      setPrgsHist(rowInfo.prgsHist);
      setRemarks(rowInfo.remarks);
      setIsModify(true);
      setFileName(location.state.attachFileName);
    }
    else {
      const today = new Date();
      setReportDt(today.getFullYear() + String(today.getMonth()+1).padStart(2, "0") + String(today.getDate()).padStart(2, "0"));
      setMailId(location.state.email != null ? location.state.email : "");
      setUpDeptNm("");
      setDeptNm("");
      setEmpNm("");
      setSeq(0);
      setWorkUnit("일간");
      setPrgsStus("진행중");
      setWorkDivs("SI");
      setTitlNm("");
      setWorkPart("");
      setWorkPlan("");
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

  const dateValid = () => {
    if(schedStartDt !== "" && schedEndDt !== "" && schedStartDt > schedEndDt) {
      window.alert("계획 시작일이 종료일보다 이 후 입니다. 다시 한번 확인 후 입력해주세요.");
      return false;
    }

    if(schedStartDt !== "" && schedEndDt !== "" && adjustDt !== "") {
      if(schedStartDt > adjustDt) {
        window.alert("조정일이 계획 시작일보다 이 전 입니다. 다시 한번 확인 후 입력해주세요.");
        return false;
      }

      if(adjustDt > schedEndDt) {
        window.alert("조정일이 계획 종료일보다 이 후 입니다. 다시 한번 확인 후 입력해주세요.");
        return false;
      }
    }

    if(schedStartDt !== "" && schedEndDt !== "" && fnshDt !== "") {
      if(fnshDt < schedEndDt) {
        window.alert("완료일이 계획 종료일보다 이 전 입니다. 다시 한번 확인 후 입력해주세요.");
        return false;
      }

      if(adjustDt !== "" && fnshDt < adjustDt) {
        window.alert("완료일이 조정일보다 이 전 입니다. 다시 한번 확인 후 입력해주세요.");
        return false;
      }
    }

    return true;
  }
  
  const saveReport = e => {
    e.preventDefault();

    const formData  = new FormData();

    if(!isModify && upDeptNm === "") {
      window.alert("사업부를 입력해주세요.");
      return upDeptNmRef.current.focus();
    }

    if(!isModify && deptNm === "") {
      window.alert("팀을 입력해주세요.");
      return deptNmRef.current.focus();
    }

    if(!isModify && empNm === "") {
      window.alert("담당자를 입력해주세요.");
      return empNmRef.current.focus();
    }

    if(!isModify && schedStartDt === "") {
      window.alert("계획 시작일자를 입력해주세요.");
      return schedStartDtRef.current.focus();
    }

    if(!isModify && schedEndDt === "") {
      window.alert("계획 종료일자를 입력해주세요.");
      return schedEndDtRef.current.focus();
    }

    if(!dateValid()) {
      return false;
    }

    if(window.confirm(isModify ? "수정하시겠습니까?" : "작성하시겠습니까?")) {
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
        workPlan: workPlan,
        workInfo: workInfo,
        schedStartDt: schedStartDt.replace(/-/g, ""),
        schedEndDt: schedEndDt.replace(/-/g, ""),
        adjustDt: adjustDt.replace(/-/g, ""),
        adjustRsn: adjustRsn,
        fnshDt: fnshDt.replace(/-/g, ""),
        prgsHist: prgsHist,
        remarks: remarks,
        uploadYn: "N"
      }

      formData.append("data", new Blob([JSON.stringify(data)], {type: "application/json"}));
      Array.from(file).forEach(file => {
        formData.append("file", file);
      });
  
      // axios.post("http://localhost:8080/ims/report/weekly/add", null, {
      //   params: {
      //     upDeptNm: upDeptNm
      //   }
      axios.post(process.env.REACT_APP_API_HOST + "/ims/report/weekly/save", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }).then(function(response) {
        alert(response.data);
        navigate("/weeklyreport");
      }).catch(function(error) {
        console.log(error);
      });
    }
  }

  const downloadFile = async () => {
    await axios.get(process.env.REACT_APP_API_HOST + "/ims/report/weekly/download", {
      params: {
        seq: seq,
        reportDt: reportDt,
        mailId: mailId
      },
      responseType: "blob"
    }).then(function(response) {
      let blob = new Blob([response.data], { type: response.headers['content-type'] });
      const fileObjectUrl = window.URL.createObjectURL(blob);
      const filename = decodeURI(response.headers["content-disposition"].split("filename=")[1].replace(/['"]/g, "").slice(0, -1));

      let link = document.createElement('a');
      link.href = fileObjectUrl;
      link.target = '_self';
      link.setAttribute("download", filename);
      link.click()
      link.remove();
      window.URL.revokeObjectURL(fileObjectUrl);
    }).catch(function(error) {
      console.log(error);
    });
  }

  const deleteFile = () => {
    if(window.confirm("삭제하시겠습니까?")) {
      axios.post(process.env.REACT_APP_API_HOST + "/ims/report/weekly/deleteAttachFile", null, {
        params: {
          seq: seq,
          reportDt: reportDt,
          mailId: mailId
        }
      }).then(function(response) {
        if(response.status === 200) {
          setFileName("");
        }
      }).catch(function(error) {
        console.log(error);
      });
    }
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
                  <Form.Control type="text" placeholder="" name="upDeptNm" ref={upDeptNmRef} value={upDeptNm || ""} disabled={isModify} onChange={e => setUpDeptNm(e.target.value)} />
                </Col>

                <Form.Label column xs={1}>팀</Form.Label>
                <Col xs={2}>
                  <Form.Control type="text" placeholder="" name="deptNm" ref={deptNmRef} value={deptNm || ""} disabled={isModify} onChange={e => setDeptNm(e.target.value)} />
                </Col>

                <Form.Label column xs={1}>담당자</Form.Label>
                <Col xs={2}>
                  <Form.Control type="text" placeholder="" name="empNm" ref={empNmRef} value={empNm || ""} disabled={isModify} onChange={e => setEmpNm(e.target.value)} />
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

                <Form.Label column xs={1}>구  분</Form.Label>
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
                <Col xs={8}>
                  <Form.Control type="text" placeholder="" name="titlNm" value={titlNm || ""} onChange={e => setTitlNm(e.target.value)} />
                </Col>

                {/* <Form.Label column xs={1}>파트</Form.Label>
                <Col xs={2}>
                  <Form.Control type="text" placeholder="" name="workPart" value={workPart || ""} onChange={e => setWorkPart(e.target.value)} />
                </Col> */}
              </Form.Group>

              <Form.Group as={Row} className="mb-2" controlId="fourthRow">
                <Form.Label column xs={1}>계  획</Form.Label>
                <Col xs={8}>
                  <Form.Control type="text" placeholder="" name="workPlan" value={workPlan || ""} onChange={e => setWorkPlan(e.target.value)} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-2" controlId="fourthRow">
                <Form.Label column xs={1}>실  적</Form.Label>
                <Col xs={8}>
                  <Form.Control type="text" placeholder="" name="workInfo" value={workInfo || ""} onChange={e => setWorkInfo(e.target.value)} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-2 align-items-center" controlId="fifthRow">
                <Form.Label column xs={1}>계획시작일자</Form.Label>
                <Col xs={2}>
                  <Form.Control type="date" placeholder="YYYY-MM-DD" ref={schedStartDtRef} value={schedStartDt || ""} disabled={isModify} name="schedStartDt" max={new Date('2999-12-31 23:59:59').toISOString().split('T')[0]} onChange={e => setSchedStartDt(e.target.value)} />
                </Col> 

                <Form.Label column xs={1}>계획종료일자</Form.Label>                 
                <Col xs={2}>
                  <Form.Control type="date" placeholder="YYYY-MM-DD" ref={schedEndDtRef} value={schedEndDt || ""} disabled={isModify} name="schedEndDt" max={new Date('2999-12-31 23:59:59').toISOString().split('T')[0]} onChange={e => setSchedEndDt(e.target.value)} />
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
                  <Form.Control type="date" placeholder="YYYY-MM-DD" name="fnshDt" value={fnshDt || ""} max={new Date('2999-12-31 23:59:59').toISOString().split('T')[0]} onChange={e => setFnshDt(e.target.value)} />
                </Col>

                <Form.Label column xs={1}>진행내역</Form.Label>                 
                <Col xs={5}>
                  <Form.Control type="text" placeholder="" name="prgsHist" value={prgsHist || ""} onChange={e => setPrgsHist(e.target.value)} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-2" controlId="eightRow">
                <Form.Label column xs={1}>첨부파일</Form.Label>
                <Col xs={8}>
                  <Form.Control type="file" name="attachFile" onChange={e => setFile(e.target.files)}/>
                    {fileName && 
                    <>
                    <div style={{height: "10px"}}></div>
                    {fileName} &nbsp;
                    <MdOutlineFileDownload size={"30px"} style={{cursor: "pointer"}} onClick={() => downloadFile()} />
                    <MdDelete size={"30px"} style={{cursor: "pointer"}} onClick={deleteFile} />
                    </>
                  }
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-2" controlId="nineRow">
                <Form.Label column xs={1}>비 고</Form.Label>                 
                <Col xs={8}>
                  <Form.Control type="text" placeholder="" name="remarks" value={remarks || ""} onChange={e => setRemarks(e.target.value)} />
                </Col>

                <Col>
                  <Button variant="danger" style={{float:"right", margin:"0px 5px 0px 5px"}} onClick={() => navigate(-1)}>{!isModify ? "목록으로" : "취 소"}</Button>
                  <Button variant="primary" style={{float:"right", margin:"0px 5px 0px 5px"}} type="submit">{!isModify ? "작  성" : "수  정"}</Button> 
                </Col>
              </Form.Group>
            </Form>     
          </div>
        </Stack>
      </>
  );
};

export default WeeklyreportDetail;