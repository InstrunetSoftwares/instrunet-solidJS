import {useParams, useSearchParams} from "@solidjs/router";
import {createEffect, createSignal, JSX, Show} from "solid-js";
import {baseUrl, immutableInsertBefore, immutableRemoveAt, Kind} from "../Singletons";
import PlayerComponent from "./Components/PlayerComponent";
import {AiOutlineDelete} from "solid-icons/ai";
import {CgClose} from "solid-icons/cg";
import {VsInsert} from "solid-icons/vs";
import {BsSearch} from "solid-icons/bs";

const Playlist = () => {
	interface PlaylistInfo {
		owner: string,
		playlistuuid: string,
		content: string[],
		private: string,
		title: string,
		ownerName: string
	}

	interface PlayInfo {
		song_name: string,
		album_name: string,
		artist: string,
		kind: number
	}

	interface InsertInfo {
		a?: number,
		beforeB?: number,
		inserting: boolean
	}

	const params = useParams();
	const [searchParams, setSearchParams] = useSearchParams();
	const [playlistInfo, setPlaylistInfo] = createSignal<PlaylistInfo | null | undefined>(undefined);
	const [playlistSongInfo, setPlayListSongInfo] = createSignal<PlayInfo[]>([]);
	const [playlistInsertInfo, setPlaylistInsertInfo] = createSignal<InsertInfo>({
		inserting: false
	})
	const [playCurrentSong, setPlayCurrentSong] = createSignal<PlayInfo | null>();
	const [playCurrentIndex, setPlayCurrentIndex] = createSignal<number>(0);
	const [playUrl, setPlayUrl] = createSignal<string>("");
	const [popOpened, setPopOpened] = createSignal<boolean>(false);
	fetch(baseUrl + "playlist?playlistUuid=" + params.playlistuuid).then(res => {
		if (res.ok) {
			res.json().then(async (j) => {
				console.log(j)
				for (const element of (j as PlaylistInfo).content) {
					let res = await fetch(baseUrl + "getsingle?id=" + element)
					if (res.ok) {
						let j = await res.json()
						setPlayListSongInfo([...playlistSongInfo() ? playlistSongInfo()! : [], j])

					}
				}
				if (searchParams.track) {
					let parsed = Number.parseInt(searchParams.track as string);
					console.log(parsed)
					if (parsed < playlistSongInfo()!.length) {
						setPlayCurrentIndex(parsed)
					}
				}


				setPlaylistInfo(j)

			})
		}
	})
	createEffect(() => {
		if (playlistSongInfo()) {
			setPlayCurrentSong(playlistSongInfo()![playCurrentIndex()])
		}
	})

	createEffect(() => {
		setPlayUrl(baseUrl + playlistInfo()?.content[playCurrentIndex()])
	})




	function ParamHook() {
		setSearchParams({
			track: playCurrentIndex()
		})
	}

	createEffect(() => {
		if (popOpened()) {
			document.body.style.overflowY = "hidden";
		} else {
			document.body.style.overflowY = "auto";
		}
	})
	createEffect(() => {
		if (playlistSongInfo()) {
			if (playCurrentIndex() >= playlistSongInfo()!.length) {
				setPlayCurrentIndex(0)
			}
		}

	})
	const SearchPopOver: () => JSX.Element = () => {

		interface SearchedContent {
			uuid: string,
			song_name: string,
			album_name: string,
			artist: string,
			kind: number,
			spell: string
		}

		const [searched, setSearched] = createSignal<SearchedContent[]>([]);

		let inputRef: HTMLInputElement | undefined;
		let searchQueue: {
			prom: Promise<any>, canceller: AbortController
		}[] = [];
		createEffect(() => {
			console.log(searched())
		})
		return <div
			class={"drop-shadow-2xl  lg:w-200 md:w-[75vw] w-[95vw] left-0 right-0 mx-auto h-[100vh] fixed p-5 z-50 "}
			classList={{["hidden"]: !popOpened()}}>
			<div class="w-full h-full bg-base-300 p-5 rounded-md flex flex-col">
				<div class="flex flex-row-reverse mb-2">
					<button class="btn btn-ghost btn-square p-2" onClick={() => {
						setPopOpened(false)
					}}><CgClose class="w-full h-full"/></button>
				</div>
				<label class="input w-full">
					<span class="label p-2"><BsSearch class="w-full h-full"/></span>
					<input ref={inputRef} type="text" onInput={(e) => {
						if (e.currentTarget.value.trim()) {
							const ac = new AbortController();

							searchQueue.push({
								prom: (async ({signal}: { signal: AbortSignal }) => {

									let res = (await fetch(baseUrl + "search_api", {
										method: "POST",
										headers: {
											"Content-Type": "application/json"
										},
										body: JSON.stringify({
											searchStr: e.target.value
										}), signal: signal
									}));
									if (res.ok && !signal.aborted) {
										let j = (await res.json())
										console.log("j")
										if (j.length && !signal.aborted) {
											if (j.length >= 1000 && !signal.aborted) {
												(j as any[]).splice(1000);
											}
										}
										setSearched(j)

									}
								})({signal: ac.signal}), canceller: ac
							})
							if (searchQueue.length > 1) {

								searchQueue[0].canceller.abort();
								searchQueue.shift()

							}
						}


					}}></input>

				</label>
				<div class="overflow-y-scroll grow">
					<table class="table max-w-full table-fixed wrap-anywhere">
						<thead>
						<tr>
							<td>歌名</td>
							<td>专辑</td>
							<td>艺术家</td>
							<td>种类</td>
						</tr>
						</thead>
						<tbody>
						{searched().map((item, index) => {
							return <tr onClick={() => {
								setPlaylistInfo({
									...playlistInfo()!, content: (() => {
										let arr = [...playlistInfo()!.content];
										arr.push(item.uuid);
										return arr;
									})()
								})
								setPlayListSongInfo((() => {
									let arr = [...playlistSongInfo()!];
									arr.push({
										song_name: item.song_name,
										album_name: item.album_name,
										kind: item.kind,
										artist: item.artist
									});
									return arr
								})())
								fetch(baseUrl + "upload-playlist", {
									method: "POST", credentials: "include", headers: {
										"Content-Type": "application/json"
									}, body: JSON.stringify(playlistInfo())
								})
								setPopOpened(false)

							}}>
								<td>{item.song_name}</td>
								<td>{item.album_name}</td>
								<td>{item.artist}</td>
								<td>{Kind[item.kind]}</td>

							</tr>
						})}
						</tbody>
					</table>
				</div>


			</div>
		</div>

	}
	return <>


		<SearchPopOver/>

		<div class="mx-auto lg:max-w-250 max-w-100 mb-10   mt-10">
			<div class="grid grid-cols-1 lg:max-h-190 max-h-full lg:grid-cols-2 gap-2">
				<div class="flex flex-col justify-center">
					<div  class={"lg:w-100 lg:h-100 w-50 h-50 border-1 mx-auto mt-2 bg-no-repeat bg-contain bg-center"} style={{"background-image": `url('${baseUrl + "playlist-tmb?asFile=true&playlistuuid=" + params.playlistuuid}')`}}
						 onClick={(e) => {
							 if (playlistInfo()?.owner === localStorage.getItem("uuid")) {
								 let anInput = document.createElement("input");
								 anInput.type = "file";
								 anInput.accept = "image/*"
								 anInput.oninput = () => {
									 console.log(playlistInfo())
									 if (anInput.files && anInput.files[0]) {
										 const reader = new FileReader();
										 reader.readAsDataURL(anInput.files[0])
										 reader.onloadend = () => {
											 fetch(baseUrl + "upload-playlist-thumbnail", {
												 method: "POST", headers: {
													 "Content-Type": "application/json"
												 }, credentials: "include", body: JSON.stringify({
													 playlistuuid: playlistInfo()?.playlistuuid, dataUri: reader.result
												 })
											 }).then((res) => {
												 if (res.ok) {
													 (e.target as HTMLDivElement).style.backgroundImage = `url('${reader.result! as string}')`
												 }
											 })
										 }
									 }
								 }
								 anInput.click();
							 }


						 }}></div>
					{
						playlistInfo()?.owner === localStorage.getItem("uuid") ? <input oninput={(e) => {

								fetch(baseUrl + "upload-playlist", {
									method: "POST", credentials: "include", headers: {
										"Content-Type": "application/json"
									}, body: JSON.stringify({
										...playlistInfo()!, title: e.target.value
									})
								})
							}} type="text" class="text-center text-2xl font-bold mt-2"
																						value={playlistInfo()?.title}></input> :
							<div class="text-center text-2xl font-bold mt-2">
								{
									playlistInfo()?.title
								}
							</div>
					}

					<div class="text-center">{playlistInfo()?.ownerName}</div>
					<Show when={playlistInfo()} keyed={false} fallback={<>正在加载</>}>
						<Show when={playlistSongInfo()} keyed={false}>
							<PlayerComponent autoplay={true} onPreviousPressed={() => {
								if (playCurrentIndex() === 0) {
									setPlayCurrentIndex(playlistSongInfo()!.length - 1)
								} else {
									setPlayCurrentIndex(playCurrentIndex() - 1)
								}
								ParamHook()
							}} url={playUrl} onFinished={(e) => {
								if (playCurrentIndex() === playlistSongInfo()!.length - 1) {
									setPlayCurrentIndex(0)
								} else {
									setPlayCurrentIndex(playCurrentIndex() + 1)
								}
								ParamHook()


							}} onNextPressed={() => {
								if (playCurrentIndex() === playlistSongInfo()!.length - 1) {
									setPlayCurrentIndex(0)
								} else {
									setPlayCurrentIndex(playCurrentIndex() + 1)
								}
								ParamHook()
							}} PlayInfo={playCurrentSong} index={playCurrentIndex}/>
						</Show>
					</Show>

				</div>
				<div class="max-h-full lg:max-h-170 lg:overflow-y-scroll">
					<table class="table  table-sm w-full border-2 border-base-content/10">
						<thead>
						<tr>
							<td class={"lg:table-cell hidden"}>封面</td>
							<td>歌曲</td>
							<td>专辑</td>
							<td>艺术家</td>
							<td>种类</td>
							{playlistInfo()?.owner === localStorage.getItem("uuid") ? <td>操作</td> : null}

						</tr>
						</thead>
						<tbody>

						{
							playlistSongInfo() ? playlistSongInfo()!.map((item, index) => {
								return <tr classList={{["bg-base-300"]: playCurrentIndex() === index}}
										   class={"hover:bg-base-200"}>
									<td class={"lg:table-cell hidden"} onClick={() => {
										setPlayCurrentIndex(index)
									}}>{playlistInfo()?.content[index] ?
										<div class="lg:w-15 lg:h-15 w-10 h-10 border-1 bg-center bg-contain" style={{"background-image": `url('${baseUrl + "getAlbumCover?id=" + playlistInfo()?.content[index]}')`, "background-repeat": "no-repeat"}}>
										</div> : null} </td>
									<td onClick={() => {
										setPlayCurrentIndex(index)
										ParamHook()
									}}>{item.song_name}</td>
									<td onClick={() => {
										setPlayCurrentIndex(index)
										ParamHook()

									}}>{item.album_name}</td>
									<td onClick={() => {
										setPlayCurrentIndex(index)
										ParamHook()

									}}>{item.artist}</td>
									<td onClick={() => {
										setPlayCurrentIndex(index)
										ParamHook()

									}}>{Kind[item.kind]}</td>
									{playlistInfo()?.owner === localStorage.getItem("uuid") ? <td>
										<button class="btn bg-red-500 btn-square" onClick={() => {
											setPlaylistInfo({
												...playlistInfo()!,
												content: immutableRemoveAt(playlistInfo()!.content, index, 1)
											})
											setPlayListSongInfo(immutableRemoveAt(playlistSongInfo()!, index, 1))
											fetch(baseUrl + "upload-playlist", {
												method: "POST", credentials: "include", headers: {
													"Content-Type": "application/json"
												}, body: JSON.stringify(playlistInfo())
											})


										}}><AiOutlineDelete/></button>
										{
											playlistInsertInfo().inserting ?
												<button class={"btn btn-primary btn-square"} onClick={(e) => {
													setPlaylistInsertInfo({
														...playlistInsertInfo(), beforeB: index, inserting: false
													})
													setPlaylistInfo({
														...playlistInfo()!,
														content: immutableInsertBefore(playlistInfo()!.content, playlistInsertInfo().a!, playlistInsertInfo().beforeB!)
													})
													setPlayListSongInfo(immutableInsertBefore(playlistSongInfo()!, playlistInsertInfo().a!, playlistInsertInfo().beforeB!))
													fetch(baseUrl + "upload-playlist", {
														method: "POST", credentials: "include", headers: {
															"Content-Type": "application/json"
														}, body: JSON.stringify(playlistInfo())
													})
												}}>前</button> :
												<button class={"btn btn-square"} onClick={(e) => {
													setPlaylistInsertInfo({
														...playlistInsertInfo(), a: index, inserting: true
													})
												}}><VsInsert/></button>
										}

									</td> : null}


								</tr>
							}) : null
						}
						{
							playlistInfo()?.owner === localStorage.getItem("uuid") ? <tr>
								<td colspan={6} class={"text-center"} onClick={() => {
									setPopOpened(true)
								}}>+
								</td>
							</tr> : null
						}

						</tbody>
					</table>
				</div>
			</div>
		</div>
	</>
}

export default Playlist; 