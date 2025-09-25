import { baseUrl, WebRoutes } from "../Singletons";

const Logout = ()=>{
    					document.title = "正在登出 | 伴奏网"

    fetch(baseUrl+"logout", {
        credentials: "include"
    }).then(res=>{
        if(res.ok){
            localStorage.removeItem("uuid")
            window.location.href = WebRoutes.instruNet
        }
    })
    return <></>
}

export default Logout; 
