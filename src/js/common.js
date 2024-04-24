export const fetchCmmCd = (param, callbackFnc) => {
    fetch(process.env.REACT_APP_API_HOST + "/ims/common/getCdList?cdGrps=" + param).then((res) => res.json()).then((data) => {
        callbackFnc(data);        
    }).catch((error) => {
        console.log(error);
        alert(error);
    });
}