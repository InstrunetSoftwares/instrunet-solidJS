import { baseUrl, WebRoutes } from "../Singletons";

const Logout = ()=>{
    fetch(baseUrl+"logout", {
        credentials: "include"
    }).then(res=>{
        if(res.ok){
            window.location.href = WebRoutes.instruNet
        }
    })
    return <></>
}

export default Logout; 
