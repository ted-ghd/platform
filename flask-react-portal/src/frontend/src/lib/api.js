import axios from 'axios';

export function createPvc(param){
    return axios({
        method: 'post',
        url : 'http://10.10.48.175:5000/createPvc',
        data: param
    })
}
export function getResources(param) {
    return axios({
        method: 'post',
        url : 'http://10.10.48.175:5000/quotas',
        data: param
    })
}

export function deletePod(param){
    return axios({
        method: 'post',
        url : 'http://10.10.48.175:5000/deletePod',
        data: param
    })
}
export function getLogin(param) {
    return axios({
        method: 'post',
        url : 'http://10.10.48.175:5000/autoLogin',
        data: param
    })
}
export function getBaseImageList() {

    return axios.get(`http://10.10.48.175:5000/getBaseImageList`)
}
export function getGitLabList(param) {
    console.log(param)

    return axios({
        method: 'post',
        url : 'http://10.10.48.175:5000/getGitLabList',
        data: param
    })
}
export function getIntegration(param) {
    console.log(param)

    return axios({
        method: 'post',
        url : 'http://10.10.48.175:5000/getInteg',
        data: param
    })
}
export function doIntegrationSave(param) {
    console.log("doIntegrationSave")
    console.log(param)

    return axios({
        method: 'post',
        url : 'http://10.10.48.175:5000/integrations',
        data: param
    })
    
}
export function doRancherLogin(param){
    console.log(param)
    return axios({
        method: 'post',
        url : 'http://10.10.48.175:5000/generate_k8s',
        data: param
    })
}
export function doLogin(param){
    
    /*return axios.get(`http://10.10.48.175:5000/login/${param.id}`)*/

    return axios({
        method: 'post',
        url : 'http://10.10.48.175:5000/login',
        data: param
    })

}
export function getImages(param){
    console.log(param)
    return axios({
        method: 'post',
        url : 'http://10.10.48.175:5000/images',
        data: param
    })

}
export function getVolumes(param){
    console.log(param)
    return axios({
        method: 'post',
        url : 'http://10.10.48.175:5000/volumes',
        data: param
    })

}

export function getIngresses(param){
    console.log(param)
    return axios({
        method: 'post',
        url : 'http://10.10.48.175:5000/ingresses',
        data: param
    })

}

export function getDeploys(param){
  
    console.log(param)
    return axios({
        method: 'post',
        url : 'http://10.10.48.175:5000/deploys',
        data: param
    })

}
export function getBuilds(param) {
  //return axios.get(`http://10.10.48.175:5000/builds?namespace=${namespace}`);

  return axios({
        method: 'post',
        url : 'http://10.10.48.175:5000/buildList',
        data: param
    })

}

export function insertExams(param) {
   
   console.log("insertExams");
   console.log(param)


    return axios({
        method: 'post',
        url: 'http://10.10.48.175:5000/builds',
        data: param
    })
}

export function insertDeploys(param) {

    console.log("insertDeploys");
   console.log(param)
    return axios({
        method: 'post',
        url: 'http://10.10.48.175:5000/deps',
        data: param
    })
}

export function submitCi(param) {

    console.log("submitCi")
    console.log(param)

    return axios({
        method: 'post',
        url : 'http://10.10.48.175:5000/submitCi',
        data: param
    })
}

export function submitCd(param) {

    console.log("submitCd")
    console.log(param)

    return axios({
        method: 'post',
        url : 'http://10.10.48.175:5000/submitCd',
        data: param
    })
}

export function updateDeploy(param) {
    console.log("updateDeploy")
    console.log(param)
    return axios({

        method: 'post',
        url : 'http://10.10.48.175:5000/updateDeploy',
        data : param
    })
}

export function updateBuild(param) {
    console.log("updateBuild");
    console.log(param)

    return axios({

        method: 'post',
        url : 'http://10.10.48.175:5000/updateBuild',
        data : param
    })
}

export function getBuild(id='') {
    return axios.get(`http://10.10.48.175:5000/build/${id}`);
}
 
export function getDeps(param) {
    //return axios.get(`http://10.10.48.175:5000/deps`);

    return axios({

        method: 'post',
        url : 'http://10.10.48.175:5000/depList',
        data : param
    })
}
