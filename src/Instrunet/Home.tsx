import {createEffect, createResource, createSignal, For} from "solid-js";
import {baseUrl, Kind, WebRoutes} from "../Singletons";
import {BiSolidDownArrow, BiSolidLeftArrow} from "solid-icons/bi";
import {createMediaQuery} from "@solid-primitives/media";
import {AiOutlineDelete} from "solid-icons/ai";
import {Suspense} from "solid-js/web";

const Home = () => {
	interface UserInfo {
		uuid: string, username: string, email: string
	}

	interface Playlist {
		owner: string, private: boolean, title: string, uuid: string, content: string[]
	}

	const [userInfo, setUserInfo] = createSignal<UserInfo>();
	const [uploadedCollapsed, setUploadedCollapsed] = createSignal<boolean>(localStorage.getItem("uploadedCollapsed") ? localStorage.getItem("uploadedCollapsed") === "true" : false);
	const [uploadedPlaylist, setUploadedPlaylist] = createSignal<Playlist[] | null | undefined>(undefined);
	const small = createMediaQuery("(max-width: 40rem)")

	fetch(baseUrl + "playlist-owned", {
		method: "POST", credentials: "include"
	}).then(res => {
		if (res.ok) {
			res.json().then((json) => {
				setUploadedPlaylist(json);
			})
		} else {
			setUploadedPlaylist(null)
		}
	})
	const ListSongs =  ()=>{
		interface UploadedSongReceivePayload {
			uuid: string
		}
		interface UploadedSong {
			uuid: string, songName: string, artist: string, albumName: string, kind: number
		}

		const [uploadedSong, {mutate, refetch}] = createResource<UploadedSong[] | undefined | null>(async ()=>{
			let returnData: UploadedSong[] | null = [];
			let res = await fetch(baseUrl + "get-uploaded-with-meta", {
				credentials: "include"
			})
			if (res.ok) {
				returnData = await res.json();
			} else {
				returnData = null;
			}
			return returnData;

		});

		return <>
			<Suspense fallback={<tr>
				<td colspan={5} class={"text-center"} classList={{ ["hidden"]: uploadedCollapsed() }}  ><span class={"loading loading-xl loading-spinner"}></span></td>
			</tr>}>
				<For each={uploadedSong()}>
					{(item, index) => {
						return <tr class={"cursor-pointer hover:bg-base-200"} classList={{ ["hidden"]: uploadedCollapsed() }} >

							<td onClick={()=>{
								const a = document.createElement("a");
								a.href = WebRoutes.instruNet + "/player?play="+item.uuid
								document.body.appendChild(a);
								a.click()
							}}>{item.songName}</td>
							<td onClick={()=>{
								const a = document.createElement("a");
								a.href = WebRoutes.instruNet + "/player?play="+item.uuid
								document.body.appendChild(a);
								a.click()
							}}>{item.albumName}</td>
							<td onClick={()=>{
								const a = document.createElement("a");
								a.href = WebRoutes.instruNet + "/player?play="+item.uuid
								document.body.appendChild(a);
								a.click()
							}}>{item.artist}</td>
							<td onClick={()=>{
								const a = document.createElement("a");
								a.href = WebRoutes.instruNet + "/player?play="+item.uuid
								document.body.appendChild(a);
								a.click()
							}}>{Kind[item.kind]}</td>
							<td><button class="btn btn-sm  sm:btn-md bg-red-500" onClick={(e)=>{
								// Hilarious.
								if(e.target.innerHTML !=="确定？") {
									e.target.innerHTML = "确定？";
								}else {
									const spinner = document.createElement("span");
									spinner.className = "loading loading-spinner";
									e.currentTarget.innerHTML = "";
									e.currentTarget.appendChild(spinner);
									fetch(baseUrl+"delSong?uuid=" + item.uuid, {
										credentials: "include"
									}).then(res=>{
										if(res.ok){
											refetch()
										}
									})
								}
							}}>{small() ? <AiOutlineDelete/> :"删除" }</button></td>
						</tr>
					}}
				</For>
			</Suspense>
		</>;
	}

	fetch(baseUrl + "userapi", {
		method: "GET", credentials: "include"
	}).then(res => {
		if (res.ok) {
			res.json().then((j) => {
				setUserInfo(j)
			})
		} else {
			window.location.href = WebRoutes.instruNet + "/login"
		}

	})
	createEffect(() => {
		localStorage.setItem("uploadedCollapsed", uploadedCollapsed() ? "true" : "false")
	})


	createEffect(()=>{
		document.title = userInfo()?.username + "的个人主页 | 伴奏网"
	})

	return <>

		<div class="md:w-150 gap-5 flex flex-col max-w-[100vw] mt-20 lg:w-250  mx-auto">
			<div class="flex sm:mx-0 mx-5" >
				{
				 userInfo() ? <img id={"avatar"} class="w-20 inline rounded-xl" src={baseUrl + "avatar?uuid=" + userInfo()?.uuid} /> : null

				}
				<div class="flex flex-col justify-center ml-5">
					<h4 class="text-2xl">
						{userInfo()?.username}
					</h4>
					<div>
						{userInfo()?.email}
					</div>
				</div>
				<div class="grow"></div>
				<div class="flex flex-col justify-center">
					<div class="flex gap-2 sm:flex-row flex-col">
						<button class="btn" on:click={(e)=>{
							const input = document.createElement("input");
							input.onchange = (e) => {
								console.log(input.files);
								if(!input.files || !input.files[0]) {
									return;
								}
								const reader = new FileReader();
								reader.onloadend = (event) => {
									fetch(baseUrl + "uploadavatar", {
										method: "POST",
										credentials: "include",
										body: reader.result
									}).then(res=>{
										if(res.ok) {
											(document.getElementById("avatar") as HTMLImageElement).src = reader.result as string;
										}
									})
								}
								reader.readAsDataURL(input.files[0]);
							}
							input.type = "file";
							input.accept = "image/*";
							input.click();

						}}>更改头像</button><a class="btn" href={WebRoutes.instruNet + "/logout"} >登出</a>
					</div>
				</div>
			</div>
			<div >
				<table class={`table lg:table-md table-xs  border-2 border-base-content/10`}>
					<thead>
						<tr>
							<td colspan={5} class="" onClick={() => setUploadedCollapsed(!uploadedCollapsed())}><div class="flex"><div>{uploadedCollapsed() ? "展开" : "收缩"}</div><div class="grow "></div><div class="">{uploadedCollapsed() ? <BiSolidLeftArrow class="h-full" /> : <BiSolidDownArrow class="h-full" />}</div></div></td>

						</tr>
						<tr>

							<td>歌名</td>
							<td>专辑</td>
							<td>艺术家</td>
							<td>种类</td>
							<td>操作</td>
						</tr>
					</thead>
					<tbody>


					<ListSongs/>

					</tbody>
				</table>
			</div>

			<div class="flex bg-base-200 rounded-xl p-5 h-35 gap-3">
				<For each={uploadedPlaylist()}>
					{item => {
						return <>
							<a href={WebRoutes.instruNet + "/playlist/"+item.uuid}>
								<img src={baseUrl + "playlist-tmb?asFile=true&playlistuuid=" + item.uuid} class=" h-20 border-1" />
								<div class="text-sm text-center mt-2">{item.title}</div>
							</a>

						</>
					}}
				</For>
				<div onClick={()=>{
					fetch(baseUrl + "create-playlist", {
						method: "GET", credentials: "include",
					}).then(res=>{
						if(res.ok){
							res.text().then(text => {
								let a =  document.createElement("a");
								a.href = WebRoutes.instruNet + "/playlist/" + text;
								a.click()
							})
						}

					})
				}}>
					<div class={"h-20 w-20 p-0 m-0 flex text-xl flex-col text-center justify-center border-1 select-none"}>+</div>
				</div>
			</div>


		</div>
	</>
}

export default Home;