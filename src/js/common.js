export const fetchCmmCd = () => {
    let queryStr = "";

    fetch(process.env.REACT_APP_API_HOST + "/ims/common/retrieveCmmCd" + queryStr).then((res) => res.json()).then((data) => {

    }).catch((error) => {
        console.log(error);
        alert(error);
    });
}