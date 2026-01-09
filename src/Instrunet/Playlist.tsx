import {useParams, useSearchParams} from "@solidjs/router";
import {createEffect, createResource, createSignal, JSX, Show} from "solid-js";
import {baseUrl, i18n, immutableInsertBefore, immutableRemoveAt, Kind} from "../Singletons";
import PlayerComponent from "./Components/PlayerComponent";
import {AiOutlineDelete} from "solid-icons/ai";
import {CgClose} from "solid-icons/cg";
import {VsInsert} from "solid-icons/vs";
import {BsSearch} from "solid-icons/bs";
import {Suspense} from "solid-js/web";


const Playlist = () => {
	interface PlaylistInfo {
		owner: string,
		playlistuuid: string,
		content: PlayInfo[],
		private: string,
		title: string,
		ownerName: string
	}

	interface PlayInfo {
		songName: string,
		albumName: string,
		artist: string,
		kind: number, uuid:string
	}

	interface InsertInfo {
		a?: number,
		beforeB?: number,
		inserting: boolean
	}

	const params = useParams();
	const [searchParams, setSearchParams] = useSearchParams();
	// const [playlistInfo, setPlaylistInfo] = createSignal<PlaylistInfo | null | undefined>(undefined);
	const [playlistInfo, {mutate, refetch}] = createResource(async ()=>{
		const res = await fetch(baseUrl + "playlist?playlistUuid=" + params.playlistuuid)
			if (res.ok) {
				const j = await res.json()
					console.log(j)

					if (searchParams.track) {
						let parsed = Number.parseInt(searchParams.track as string);
						console.log(parsed)
						if (parsed < j.content!.length) {
							setPlayCurrentIndex(parsed)
						}
					}
				return j as PlaylistInfo;
		}})

	const [playlistInsertInfo, setPlaylistInsertInfo] = createSignal<InsertInfo>({
		inserting: false
	})
	const [playCurrentSong, setPlayCurrentSong] = createSignal<PlayInfo | null>();
	const [playCurrentIndex, setPlayCurrentIndex] = createSignal<number>(0);
	const [playUrl, setPlayUrl] = createSignal<string>("");
	const [popOpened, setPopOpened] = createSignal<boolean>(false);


	createEffect(() => {
		if (playlistInfo()) {
			setPlayCurrentSong(playlistInfo()!.content![playCurrentIndex()])
		}
	})

	createEffect(() => {
		setPlayUrl(baseUrl + playlistInfo()?.content[playCurrentIndex()].uuid)
	})
	createEffect(()=>{
		document.title = i18n.Instrunet.DOC_TITLE.START + playlistInfo()?.title + i18n.Instrunet.DOC_TITLE.END
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
		if (playlistInfo()) {
			if (playCurrentIndex() >= playlistInfo()!.content!.length) {
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
							<td>{i18n.Instrunet.SONG_NAME}</td>
							<td>{i18n.Instrunet.ALBUM_NAME}</td>
							<td>{i18n.Instrunet.ARTIST}</td>
							<td>{i18n.Instrunet.KIND_SELF}</td>
						</tr>
						</thead>
						<tbody>
						{searched().map((item, index) => {
							return <tr onClick={() => {
								const value = (() => {
									let arr = [...playlistInfo()!.content!];
									arr.push({
										songName: item.song_name,
										albumName: item.album_name,
										kind: item.kind,
										artist: item.artist, uuid: item.uuid
									});
									return {...playlistInfo()!, content: arr};
								})();
								fetch(baseUrl + "upload-playlist", {
									method: "POST", credentials: "include", headers: {
										"Content-Type": "application/json"
									}, body:  JSON.stringify(value)
								}).then(()=>{
									mutate(value)
								})

								setPopOpened(false)

							}}>
								<td>{item.song_name}</td>
								<td>{item.album_name}</td>
								<td>{item.artist}</td>
								<td>{i18n.Instrunet.KIND[item.kind]}</td>

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
					<div class={"lg:w-100 lg:h-100 w-50 h-50 border-1 mx-auto mt-2 bg-no-repeat bg-contain bg-center"}
						 style={{"background-image": `url('${baseUrl + "playlist-tmb?asFile=true&playlistuuid=" + params.playlistuuid}')`}}
						 onClick={(e) => {
							 if (playlistInfo()?.owner === localStorage.getItem("uuid")) {
								 let anInput = document.createElement("input");
								 anInput.type = "file";
								 anInput.accept = "image/*"
								 anInput.onchange = () => {
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
						playlistInfo()?.owner === localStorage.getItem("uuid") ? <input onfocusout={(e) => {

								const value = {
									...playlistInfo()!, title: e.target.value
								};
								fetch(baseUrl + "upload-playlist", {
									method: "POST", credentials: "include", headers: {
										"Content-Type": "application/json"
									}, body: JSON.stringify(value)
								}).then(()=>{
									mutate(value)
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
					<Show when={playlistInfo()} keyed={false} fallback={<>{i18n.General.LOADING}</>}>
						<Show when={playlistInfo()?.content} keyed={false}>
							<PlayerComponent autoplay={true} onPreviousPressed={() => {
								if (playCurrentIndex() === 0) {
									setPlayCurrentIndex(playlistInfo()!.content.length - 1)
								} else {
									setPlayCurrentIndex(playCurrentIndex() - 1)
								}
								ParamHook()
							}} url={playUrl} onFinished={(e) => {
								if (playCurrentIndex() === playlistInfo()!.content.length - 1) {
									setPlayCurrentIndex(0)
								} else {
									setPlayCurrentIndex(playCurrentIndex() + 1)
								}
								ParamHook()


							}} onNextPressed={() => {
								if (playCurrentIndex() === playlistInfo()!.content!.length - 1) {
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
						<button class={"btn btn-error w-full mb-3"} onClick={(e) => {
							if (e.currentTarget.innerText === i18n.General.DEL_CONFIRM) {
								fetch(baseUrl + "remove-playlist", {
									method: "POST",
									credentials: "include",
									headers: {
										"Content-Type": "application/json"
									},
									body: JSON.stringify({
										playlistuuid: params.playlistuuid,
									})
								}).then(res => {
										if (res.ok) {
											window.history.back();
										}
									}
								)
							}else {
								e.currentTarget.innerText = i18n.General.DEL_CONFIRM
							}
						}}>{i18n.General.DEL}
						</button>
						<table class="table  table-sm w-full border-2 border-base-content/10">
							<thead>
							<tr>
								<td class={"lg:table-cell hidden"}>{i18n.Instrunet.COVER}</td>
								<td>{i18n.Instrunet.SONG_NAME}</td>
								<td>{i18n.Instrunet.ALBUM_NAME}</td>
								<td>{i18n.Instrunet.ARTIST}</td>
								<td>{i18n.Instrunet.KIND_SELF}</td>
								{playlistInfo()?.owner === localStorage.getItem("uuid") ? <td>{i18n.General.ACTION}</td> : null}

							</tr>
							</thead>
							<tbody>

							{
								playlistInfo()?.content ? playlistInfo()!.content.map((item, index) => {
									return <tr classList={{["bg-base-300"]: playCurrentIndex() === index}}
											   class={"hover:bg-base-200"}>
										<td class={"lg:table-cell hidden"} onClick={() => {
											setPlayCurrentIndex(index)
										}}>{playlistInfo()?.content[index] ?
											<div class="lg:w-15 lg:h-15 w-10 h-10 border-1 bg-center bg-contain" style={{
												"background-image": `url('${baseUrl + "getAlbumCover?id=" + playlistInfo()?.content[index].uuid}')`,
												"background-repeat": "no-repeat"
											}}>
											</div> : null} </td>
										<td onClick={() => {
											setPlayCurrentIndex(index)
											ParamHook()
										}}>{item.songName}</td>
										<td onClick={() => {
											setPlayCurrentIndex(index)
											ParamHook()

										}}>{item.albumName}</td>
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
												const value = {...playlistInfo()!, content: immutableRemoveAt(playlistInfo()!.content, index, 1)};
												fetch(baseUrl + "upload-playlist", {
													method: "POST", credentials: "include", headers: {
														"Content-Type": "application/json"
													}, body: JSON.stringify(value)
												}).then(()=> mutate(value))


											}}><AiOutlineDelete/></button>
											{
												playlistInsertInfo().inserting ?
													<button class={"btn btn-primary btn-square"} onClick={(e) => {
														setPlaylistInsertInfo({
															...playlistInsertInfo(), beforeB: index, inserting: false
														})

														const value = {...playlistInfo()!, content: immutableInsertBefore(playlistInfo()!.content, playlistInsertInfo().a!, playlistInsertInfo().beforeB!)
														};
														fetch(baseUrl + "upload-playlist", {
															method: "POST", credentials: "include", headers: {
																"Content-Type": "application/json"
															}, body: JSON.stringify(value)
														}).then(()=>{
															mutate(value);
														})
													}}>{i18n.General.FRONT}</button> :
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