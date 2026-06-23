import {baseUrl, dataURLtoBlob} from "./Singletons";

const UnlockMusic = ()=>{
	document.title = "音乐解锁 | 伴奏网"
	return <>
		<div class={"md:max-w-250 mt-10 mx-auto max-w-full"}>
			<h1 class={"text-7xl"}>音乐解锁</h1>
			<div>经过修改已经完全可用（仅限制于下载速度）。</div>
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


				statusReport.innerText = "正在上传……";
				const formData = new FormData();
				formData.append("file", e.target.files[0])
				fetch(baseUrl + "api/decrypter/decrypterSubmit", {
					method: "POST",
					body: formData
				}).then(res => {
					if(res.ok){
						statusReport.innerText = "成功，正在下载……"
						res.blob().then(o=> {
							let a = new HTMLAnchorElement()
							a.href = URL.createObjectURL(o)
							document.body.append(a)
							a.click()
						})
					}else{
						res.text().then(data => {
							statusReport.innerText = "失败：" + data
							e.target.disabled = false;
						})
					}
				})


			}}/>
		</div>
	</>
}

export default UnlockMusic;