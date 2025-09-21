import {useParams, useSearchParams} from "@solidjs/router";
import {createEffect, createSignal, Show} from "solid-js";
import {baseUrl, Kind} from "../Singletons";
import PlayerComponent from "./Components/PlayerComponent";
import {AiOutlineDelete, AiOutlineSwap} from "solid-icons/ai";
import {CgInsertBefore} from "solid-icons/cg";
import {VsInsert} from "solid-icons/vs";

const Playlist = () => {
	interface PlaylistInfo {
		owner: string,
		uuid: string,
		content: string[],
		private: string,
		title: string[],
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
	const [playlistSongInfo, setPlayListSongInfo] = createSignal<PlayInfo[] | null | undefined>(undefined);
	const [playlistInsertInfo, setPlaylistInsertInfo] = createSignal<InsertInfo>({
		inserting: false
	})
	const [playCurrentSong, setPlayCurrentSong] = createSignal<PlayInfo | null>();
	const [playCurrentIndex, setPlayCurrentIndex] = createSignal<number>(0);
	const [playUrl, setPlayUrl] = createSignal<string>("");
	fetch(baseUrl + "playlist?playlistUuid=" + params.playlistuuid).then(res => {
		if (res.ok) {
			res.json().then(async (j) => {
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


	function immutableRemoveAt(array: any[], index: number, length: number): any[] {
		let arr = [...array]
		console.log(arr)
		arr.splice(index, length);
		console.log(arr)
		return arr;
	}

	function immutableChangeOrder(array: any[], a: number, b: number) {

		let arr = [...array];
		let objA = arr[a];
		arr[a] = arr[b];
		arr[b] = objA;
		return arr;
	}
	function immutableInsertBefore(array:any[], index: number, target: number){
		let arr = [...array]
		arr.splice(index, 1);
		arr.splice(target,0,array[index]);
		return arr;
	}

	return <>


		<div class="mx-auto lg:max-w-250 max-w-100 mb-10   mt-10">
			<div class="grid grid-cols-1 lg:max-h-190 max-h-full lg:grid-cols-2 gap-2">
				<div>
					<img class={"lg:max-w-100 max-w-50 mx-auto mt-2"}
						 src={baseUrl + "playlist-tmb?asFile=true&playlistuuid=" + params.playlistuuid}/>
					<div class="text-center text-2xl font-bold mt-2">
						{
							playlistInfo()?.title
						}
					</div>
					<div class="text-center">{playlistInfo()?.ownerName}</div>
					<Show when={playlistInfo()} keyed={false} fallback={<>正在加载</>}>
						<Show when={playlistSongInfo()} keyed={false}>
							<PlayerComponent onPreviousPressed={() => {
								if (playCurrentIndex() === 0) {
									setPlayCurrentIndex(playlistSongInfo()!.length - 1)
								} else {
									setPlayCurrentIndex(playCurrentIndex() - 1)
								}
								setSearchParams({track: playCurrentIndex()})
							}} url={playUrl} onFinished={(e) => {
								if (playCurrentIndex() === playlistSongInfo()!.length - 1) {
									setPlayCurrentIndex(0)
								} else {
									setPlayCurrentIndex(playCurrentIndex() + 1)
								}
								setSearchParams({track: playCurrentIndex()})


							}} onNextPressed={() => {
								if (playCurrentIndex() === playlistSongInfo()!.length - 1) {
									setPlayCurrentIndex(0)
								} else {
									setPlayCurrentIndex(playCurrentIndex() + 1)
								}
								setSearchParams({track: playCurrentIndex()})
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
						<Show when={playlistSongInfo()} keyed={true}>
							{
								playlistSongInfo()!.map((item, index) => {
									return <tr classList={{["bg-base-300"]: playCurrentIndex() === index}}>
										<td class={"lg:table-cell hidden"} onClick={() => {
											setPlayCurrentIndex(index)
										}}>{playlistInfo()?.content[index] ? <img class="lg:max-w-15 max-w-10"
																				  src={baseUrl + "getAlbumCover?id=" + playlistInfo()?.content[index]}/> : null} </td>
										<td onClick={() => {
											setPlayCurrentIndex(index)
										}}>{item.song_name}</td>
										<td onClick={() => {
											setPlayCurrentIndex(index)
										}}>{item.album_name}</td>
										<td onClick={() => {
											setPlayCurrentIndex(index)
										}}>{item.artist}</td>
										<td onClick={() => {
											setPlayCurrentIndex(index)
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
															...playlistInfo()!, content: immutableInsertBefore(playlistInfo()!.content, playlistInsertInfo().a!, playlistInsertInfo().beforeB!)
														})
														setPlayListSongInfo(immutableInsertBefore(playlistSongInfo()!, playlistInsertInfo().a!, playlistInsertInfo().beforeB!))
													}}>前</button> :
													<button class={"btn btn-square"} onClick={(e) => {
														setPlaylistInsertInfo({
															...playlistInsertInfo(), a: index, inserting: true
														})
													}}><VsInsert/></button>
											}

										</td> : null}


									</tr>
								})
							}
							<tr>
								<td colspan={6} class={"text-center"}>+</td>
							</tr>
						</Show>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</>
}
export default Playlist; 