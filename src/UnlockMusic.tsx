import {baseUrl} from "./Singletons";

const UnlockMusic = ()=>{
	return <>
		<div class={"md:max-w-250 mt-10 mx-auto max-w-full"}>
			<h1 class={"text-7xl"}>音乐解锁</h1>
			<div><a class={"link link-info"} href={"https://git.unlock-music.dev/um/web"}>Unlock Music项目</a></div>
			<div>部分解锁需旧版本 网易云全版本可用 <a class={"link link-info"} href={baseUrl + "api/decrypter/qqm"}>QQ音乐旧版本Windows下载</a></div>
			<div>状态：<div id={"status"}>等待上传。</div></div>
			<input class={" file-input"} type={"file"} onchange={(e)=>{
				e.target.disabled = true;
				let statusReport = document.getElementById("status")!;
				statusReport.innerText = "上传中";
				if(!e.target.files || !e.target.files[0]){
					statusReport.innerText = "失败：内部错误；请联系网站站主。"
					e.target.disabled = false;
					return;
				}
				const fileReader = new FileReader();
				fileReader.onloadend = ()=> {
					fetch(baseUrl + "api/decrypter/decrypterSubmit", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							fileInDataUrl : fileReader.result,
							fileName: e.target.files![0].name
						})
					}).then(res => {
						if(res.ok){
							statusReport.innerText = "成功"
							e.target.disabled = false;
						}else{
							res.text().then(data => {
								statusReport.innerText = "失败：" + data
								e.target.disabled = false;
							})
						}
					})
				}
				fileReader.readAsDataURL(e.target.files[0]);
				statusReport.innerText = "正在上传……";


			}}/>
		</div>
	</>
}

export default UnlockMusic;