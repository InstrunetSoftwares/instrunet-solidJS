import {NavBar} from "./Components/NavBar";

const UpdateLog = ()=>{
	return <>
		<div class={"mx-100"}>
			<div class={"text-6xl mt-5"}>更新日志</div>
			<hr class={"mt-3 mb-6 text-gray-500"}/>
			<p class={"mb-3"}>对用户有意义的更新内容将出现在这里。</p>
			<br/>
			<div class={"text-3xl"}>2026.04.29</div>
			<hr class={"text-gray-700 mt-3 mb-6"}/>
			<p style={{"white-space": "preserve"}}>
				新增：歌单浏览器。<br/>
				请看屏幕上菜单进入歌单浏览器页面<br/>
				当前功能未开发完全
			</p>
			<br/>
			<div class={"text-3xl"}>2026.04.25</div>
			<hr class={"text-gray-700 mt-3 mb-6"}/>
			<p style={{"white-space": "preserve"}}>
				新增：「下载歌单」功能，保存为CUE文件。<br/>
				<s>即将新增：歌单浏览</s>
			</p>
			<br/>
			<div class={"text-3xl"}>2026.02.03</div>
			<hr class={"text-gray-700 mt-3 mb-6"}/>
			<p style={{"white-space": "preserve"}}>新增：「仅提取和声」模式;<br/>
				即将新增：网易云上传模式;<br/>
				&#9;&#9;意义在于：<br/>
				&#9;&#9;&#9;&#9;可直接上传在网易云音乐中下载完毕的ncm文件格式进行处理，跳过一些繁琐的步骤。
			</p>
		</div>
	</>;
}

export default UpdateLog;