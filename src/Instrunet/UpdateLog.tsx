import {NavBar} from "./Components/NavBar";

const UpdateLog = ()=>{
	return <>
		<div class={"mx-100"}>
			<div class={"text-6xl mt-5"}>更新日志</div>
			<hr class={"mt-3 mb-6 text-gray-500"}/>
			<p class={"mb-3"}>对用户有意义的更新内容将出现在这里。</p>
			<div class={"text-3xl"}>2025.02.03</div>
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