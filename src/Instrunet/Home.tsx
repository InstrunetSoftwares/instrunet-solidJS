import { createEffect, createSignal, For, Show } from "solid-js";
import {baseUrl, immutableRemoveAt, Kind, WebRoutes} from "../Singletons";
import style from "./Home.module.css";
import {BiRegularCross, BiRegularImageAdd, BiSolidDownArrow, BiSolidLeftArrow, BiSolidRightArrow} from "solid-icons/bi";
import { createMediaQuery } from "@solid-primitives/media";
import {CgAdd, CgCross} from "solid-icons/cg";
import { TbError404 } from "solid-icons/tb";
import { FaSolidCross } from "solid-icons/fa";
import { FiDelete } from "solid-icons/fi";
import { TiDelete, TiUserDelete } from "solid-icons/ti";
import { RiSystemDeleteBackFill } from "solid-icons/ri";
import {AiOutlineDelete, AiTwotoneFileAdd} from "solid-icons/ai";
import {SiGodaddy} from "solid-icons/si";
const Home = () => {
	interface UserInfo {
		uuid: string, username: string, email: string
	}
	interface UploadedSongReceivePayload {
		uuid: string
	}
	interface UploadedSong {
		uuid: string, song_name: string, artist: string, album_name: string, kind: number
	}
	interface Playlist {
		owner: string, private: boolean, title: string, tmb: any, uuid: string, content: string[]
	}

	const [userInfo, setUserInfo] = createSignal<UserInfo>();
	const [uploadedSong, setUploadedSong] = createSignal<UploadedSong[] | undefined | null>([]);
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

	fetch(baseUrl + "getUploaded", {
		credentials: "include"
	}).then(async (res) => {
		if (res.ok) {
			let json = await res.json()

				for (const received of json as UploadedSongReceivePayload[]) {
					let res = await fetch(baseUrl + "getSingle?id=" + received.uuid)
					let json = await res.json(); 
							json.uuid = received.uuid;
							setUploadedSong([...uploadedSong() ? uploadedSong()! : [], json])
						
					
				

			}
		} else {
			setUploadedSong(null);
		}
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
				<table class={`table lg:table-md table-xs table-zebra border-2 border-base-content/10`}>
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
						<Show when={uploadedSong()} keyed={true} fallback={uploadedSong() === undefined ? <>
							<div class="loading loading-spinner loading-xl"></div>
						</> : <></>}><></>
							{uploadedSong() ? uploadedSong()!.map((item, index) => {
								return <tr classList={{ ["hidden"]: uploadedCollapsed() }}>

									<td>{item.song_name}</td>
									<td>{item.album_name}</td>
									<td>{item.artist}</td>
									<td>{Kind[item.kind]}</td>
									<td><button class="btn btn-sm  sm:btn-md bg-red-500" onClick={(e)=>{
										// Hilarious.
										if(e.target.innerHTML !=="确定？") {
											e.target.innerHTML = "确定？";
										}else {
											fetch(baseUrl+"delSong?uuid=" + item.uuid, {
												credentials: "include"
											}).then(res=>{
												if(res.ok){
													setUploadedSong(immutableRemoveAt(uploadedSong()!, index, 1))
												}
											})
										}
									}}>{small() ? <AiOutlineDelete/> :"删除" }</button></td>
								</tr>
							}) : null}
						</Show>

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