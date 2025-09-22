import { useSearchParams } from "@solidjs/router";
import { createEffect, createSignal, Show } from "solid-js";
import { baseUrl } from "../Singletons";
import style from "./Player.module.css"
import PlayerComponent from "./Components/PlayerComponent";
import {BsDownload} from "solid-icons/bs";
import {BiRegularDownArrow, BiRegularUpArrow} from "solid-icons/bi";
interface PlayInfo {
	song_name: string,
	album_name: string,
	artist: string,
	kind: number
}


const Player = () => {

	interface LyricObject {
		album: string, artist: string, cover: string, id: string, lyrics: string, title: string
	}
	const [params, setParams] = useSearchParams();
	const [lrcIndex, setLrcIndex] = createSignal(0);
	const [playInfo, setPlayInfo] = createSignal<PlayInfo | null | undefined>(undefined);
	const [lyrics, setLyrics] = createSignal<LyricObject[] | null | undefined>(null);
	const [playUrl, setPlayUrl ] = createSignal<string>("");
	const [currentVote, setCurrentVote] = createSignal<number>(NaN);
	createEffect(()=>{
		setPlayUrl(baseUrl + params.play)
	})
	fetch(baseUrl + "api/community/getvote?uuid="+params.play).then(res=>{
		res.text().then(result=>{
			setCurrentVote(Number.parseInt(result as string))
		})
	})
	createEffect(() => {
		fetch(baseUrl + `getSingle?id=${params.play}`).then(res => {
			if (res.ok) {
				res.json().then(data => {
					setPlayInfo(data)
				})
			} else {
				setPlayInfo(null)
			}
		})
	}, [params]);
	createEffect(() => {
		if (playInfo()) {
			fetch(baseUrl + `lyric`, {
				method: "POST", body: JSON.stringify({
					name: playInfo()?.song_name, artist: playInfo()?.artist, albumName: playInfo()?.album_name
				}), headers: {
					"Content-Type": "application/json"
				}
			}).then(res => {
				if (res.ok) {
					res.json().then((j) => {
						setLyrics(JSON.parse(j));
						console.log(lyrics())
					})
				} else {
					setLyrics(null);
				}
			})
		}

	})
	return <>
		<div className="hero bg-base-200 ">
			<div
				className="hero-content pt-15 overflow-y-scroll block sm:[align-items:center] sm:max-w-[85vw] sm:h-[calc(100vh-4rem)] "
				style={{"align-items": "center", "scrollbar-width": "auto"}}>
				<div className={""}>
					<Show when={playInfo()} keyed={true} fallback={playInfo() === undefined ? <><span
						class={"loading loading-spinner loading-xl"}></span></> : <><span></span></>}>
						<>
							<div className={"grid sm:grid-cols-2 gap-5 h-full "}>

								<div className={"h-full flex flex-col"} style={{"justify-content": "center"}}>
									<div>
										<div
											className={style.CardAnimation + " mb-4  md:size-70 sm:size-50 lg:size-90 xl:size-120 size-30 mx-auto bg-center bg-contain"}
											style={{
												"background-repeat": "no-repeat",
												"background-image": `url('${baseUrl}getAlbumCover?id=${params.play}`
											}}
										/>

									</div>
									<PlayerComponent autoplay={false} url={playUrl}
													 PlayInfo={playInfo}></PlayerComponent>


								</div>
								<div className={"max-h-[42rem] flex flex-col w-full rounded-2xl bg-base-100"}>
									<Show when={lyrics()} keyed={true} fallback={<></>}>
										<div className={"flex"}>
											<select class="grow select w-full min-h-10" tabIndex={lrcIndex()}
													onInput={(e) => {
														setLrcIndex(e.currentTarget.selectedIndex);
													}}>
												{lyrics()?.map((item, index) => {
													return <>
														<option>{item.title} - {item.album} - {item.artist}</option>
													</>
												})}
											</select>
											<button className={"btn btn-primary"} onClick={() => {
												const blob = new Blob([lyrics()![lrcIndex()].lyrics], {type: "text/binary"});
												const url = URL.createObjectURL(blob);
												const a = document.createElement("a");
												a.href = url;
												a.download = lyrics()![lrcIndex()].title + '.lrc';
												document.body.appendChild(a);
												a.click();
												document.body.removeChild(a);
												URL.revokeObjectURL(url);
											}}><BsDownload/>歌词
											</button>
										</div>

									</Show>

									<div style={{"scrollbar-width": "none"}}
										 className="overflow-y-scroll grow text-center text-md max-h-[42rem] m-10 justify-center"
										 innerHTML={lyrics() ? lyrics()![lrcIndex()].lyrics.replaceAll(new RegExp("\\[[^\\[\\]]*]", "g"), "").trim().replaceAll("\n", "<br/>") : undefined}>

									</div>
								</div>

							</div>


						</>

					</Show>
				</div>
				<div className={"divider "}></div>
				<a className={"btn w-full btn-primary"} href={baseUrl + params.play}>下载</a>
				<div className={"flex mt-2"}>
					<div className={"flex flex-col text-center gap-2"}>
						<button className={"btn btn-success"} onClick={(e)=>{
							setCurrentVote(currentVote()+1)
							e.currentTarget.disabled = true;
						}}><BiRegularUpArrow/></button>
						{currentVote()}
						<button className={"btn btn-error"} onClick={(e)=>{
							setCurrentVote(currentVote()-1)
							e.currentTarget.disabled = true;
						}}><BiRegularDownArrow/></button>
					</div>
					<div className={"grow"}>

					</div>
				</div>
			</div>

		</div>

	</>

}

export default Player