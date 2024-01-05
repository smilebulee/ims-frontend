import { Form, Row, Col, Button, Stack } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineFileDownload } from "react-icons/md";
import axios from "axios";

const WeeklyreportDetail= () => {
  const navigate = useNavigate();
  const location = useLocation();
  const title = location.state != null ? location.state.title : "";
  const rowInfo = location.state != null ? location.state.data : "";
  const fileName = location.state != null ? location.state.attachFileName : "";

  const moveWrite = () => {
      navigate("/weeklyreport/write", {
        state: {
          title: "주간보고 수정",
          data: rowInfo,
          attachFileName: fileName,
        }
      });
  }

  const downloadFile = async () => {
    await axios.get(process.env.REACT_APP_API_HOST + "/ims/report/weekly/download", {
      params: {
        seq: rowInfo.seq,
        reportDt: rowInfo.reportDt,
        mailId: rowInfo.mailId
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

  return (
      <>
        <Stack gap={4}>
          <h3>{title}</h3>
          
          <div className="bg-light border rounded p-3">
            <Form>
              <Form.Group as={Row} className="mb-2 border-bottom" controlId="firstRow">
                <Form.Label column xs={1} className="border-end rounded">사업부</Form.Label>
                <Col xs={2}>
                  <Form.Control plaintext readOnly name="upDeptNm" defaultValue={rowInfo.upDeptNm || ""} />
                </Col>

                <Form.Label column xs={1} className="border-start border-end rounded">팀</Form.Label>
                <Col xs={2}>
                  <Form.Control plaintext readOnly name="deptNm" defaultValue={rowInfo.deptNm || ""} />
                </Col>

                <Form.Label column xs={1} className="border-start border-end rounded">담당자</Form.Label>
                <Col xs={2}>
                  <Form.Control plaintext readOnly name="empNm" defaultValue={rowInfo.empNm || ""} />
                </Col>
              </Form.Group>
              
              <Form.Group as={Row} className="mb-2 border-bottom" controlId="secondRow">
                <Form.Label column xs={1} className="border-end rounded">업무단위</Form.Label>
                <Col xs={2}>
                  <Form.Control plaintext readOnly name="workUnit" defaultValue={rowInfo.workUnit || ""} />
                </Col>

                <Form.Label column xs={1} className="border-start border-end rounded">진행상태</Form.Label>
                <Col xs={2}>
                  <Form.Control plaintext readOnly name="prgsStus" defaultValue={rowInfo.prgsStus || ""} />
                </Col>

                <Form.Label column xs={1} className="border-start border-end rounded">구  분</Form.Label>
                <Col xs={2}>
                  <Form.Control plaintext readOnly name="workDivs" defaultValue={rowInfo.workDivs || ""} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-2 align-items-center border-bottom" controlId="thirdRow">
                <Form.Label column xs={1} className="border-end rounded">프로젝트/<br/>과제명</Form.Label>
                <Col xs={8}>
                  <Form.Control plaintext readOnly name="titlNm" defaultValue={rowInfo.titlNm || ""} />
                </Col>

                {/* <Form.Label column xs={1}>파트</Form.Label>
                <Col xs={2}>
                  <Form.Control type="text" placeholder="" name="workPart" value={workPart || ""} onChange={e => setWorkPart(e.target.value)} />
                </Col> */}
              </Form.Group>

              <Form.Group as={Row} className="mb-2 border-bottom" controlId="fourthRow">
                <Form.Label column xs={1} className="border-end rounded">계  획</Form.Label>
                <Col xs={8}>
                  <Form.Control plaintext readOnly name="workPlan" defaultValue={rowInfo.workPlan || ""} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-2 border-bottom" controlId="fourthRow">
                <Form.Label column xs={1} className="border-end rounded">실  적</Form.Label>
                <Col xs={8}>
                  <Form.Control plaintext readOnly name="workInfo" defaultValue={rowInfo.workInfo || ""} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-2 align-items-center border-bottom" controlId="fifthRow">
                <Form.Label column xs={1} className="border-end rounded">계획시작일자</Form.Label>
                <Col xs={2}>
                  <Form.Control plaintext readOnly defaultValue={rowInfo.schedStartDt || ""} name="schedStartDt" max={new Date('2999-12-31 23:59:59').toISOString().split('T')[0]} />
                </Col> 

                <Form.Label column xs={1} className="border-start border-end rounded">계획종료일자</Form.Label>                 
                <Col xs={2}>
                  <Form.Control plaintext readOnly defaultValue={rowInfo.schedEndDt || ""} name="schedEndDt" max={new Date('2999-12-31 23:59:59').toISOString().split('T')[0]} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-2 border-bottom" controlId="sixthRow">
                <Form.Label column xs={1} className="border-end rounded">조정일자</Form.Label>                 
                <Col xs={2}>
                  <Form.Control plaintext readOnly name="adjustDt" defaultValue={rowInfo.adjustDt || ""} max={new Date('2999-12-31 23:59:59').toISOString().split('T')[0]} />
                </Col>

                <Form.Label column xs={1} className="border-start border-end rounded">조정사유</Form.Label>                 
                <Col xs={5}>
                  <Form.Control plaintext readOnly name="adjustRsn" defaultValue={rowInfo.adjustRsn || ""} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-2 border-bottom" controlId="seventhRow">
                <Form.Label column xs={1} className="border-end rounded">완료일자</Form.Label>                 
                <Col xs={2}>
                  <Form.Control plaintext readOnly name="fnshDt" defaultValue={rowInfo.fnshDt || ""} max={new Date('2999-12-31 23:59:59').toISOString().split('T')[0]}/>
                </Col>

                <Form.Label column xs={1} className="border-start border-end rounded">진행내역</Form.Label>                 
                <Col xs={5}>
                  <Form.Control plaintext readOnly name="prgsHist" defaultValue={rowInfo.prgsHist || ""} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-2 border-bottom" controlId="eightRow">
                <Form.Label column xs={1} className="border-end rounded">첨부파일</Form.Label>
                <Col xs={8}>
                    {fileName && 
                    <>
                      {fileName} &nbsp;
                      <MdOutlineFileDownload size={"30px"} style={{cursor: "pointer"}} onClick={() => downloadFile()} />
                    </>
                  }
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-2" controlId="nineRow">
                <Form.Label column xs={1} className="border-end rounded">비 고</Form.Label>                 
                <Col xs={8}>
                  <Form.Control plaintext readOnly name="remarks" defaultValue={rowInfo.remarks || ""} />
                </Col>

                <Col className="mt-5">
                  <Link className="btn btn-danger" style={{float:"right", margin:"0px 5px 0px 5px"}} to="/weeklyreport">목록으로</Link>
                  <Button variant="primary" style={{float:"right", margin:"0px 5px 0px 5px"}} onClick={moveWrite}>수 정</Button> 
                </Col>
              </Form.Group>
            </Form>     
          </div>
        </Stack>
      </>
  );
};

export default WeeklyreportDetail;