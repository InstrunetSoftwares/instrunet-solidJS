import {createSignal} from "solid-js";
import {baseUrl} from "../Singletons";

const SecretPage = () => {
	const [id, setId] = createSignal(Number());
	return (<>
		<div class={"mx-auto max-w-2/3"}>

			<div class={"text-5xl"}>
				网易云
			</div>
			<section>
				注：只能下VIP歌曲中非付费的歌。<br/>
				究竟怎么判断，你下载看看。如果无法下载除了id输入错误就是付费歌曲。<br/>
				不要再来评论区和私信找我。
			</section>
			<label for={"id"}>id: </label><input class={"input"} value={id()} onChange={(event) => {
			try {
				Number.parseInt(event.target.value)
				setId(Number.parseInt(isNaN(Number.parseInt(event.target.value))  ? "0": event.target.value)
				)

			} catch { /* empty */
			}
		}} id={"id"} type={"text"}/><br/>
			<button class={"btn btn-primary"} onClick={async ()=>{
				window.location.href =  baseUrl + "api/NcmStuff/DownloadMusic?id="+id()
			}}>下载</button >
		</div>
	</>)
}
export default SecretPage;