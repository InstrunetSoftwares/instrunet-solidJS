import { useSearchParams } from "@solidjs/router";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import { baseUrl, Kind } from "../Singletons";
import { CgPlayButton, CgPlayForwards, CgPlayPause, CgPlayPauseR } from "solid-icons/cg";
import { BsFastForward, BsFastForwardBtnFill, BsForward, BsPause, BsPauseBtn, BsPlayBtn } from "solid-icons/bs";
import style from "./Player.module.css"
import { AiFillFastForward } from "solid-icons/ai";
import { TiMediaFastForward, TiMediaRewind } from "solid-icons/ti";
import PlayerComponent from "./Components/PlayerComponent";
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
	createEffect(()=>{
		setPlayUrl(baseUrl + params.play)
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
		<div class="hero bg-base-200 ">
			<div class="hero-content pt-20 overflow-y-scroll block sm:[align-items:center] sm:max-w-[85vw] sm:h-[calc(100vh-4rem)] " style={{ "align-items": "center", "scrollbar-width": "none" }}>
				<div class={""}>
					<Show when={playInfo()} keyed={true} fallback={playInfo() === undefined ? <><span
						class={"loading loading-spinner loading-xl"}></span></> : <><span></span></>}>
						<>
							<div class={"grid sm:grid-cols-2 gap-5 h-full "}>

								<div class={"h-full flex flex-col"} style={{ "justify-content": "center" }}>
									<div>
										<div class={style.CardAnimation + " mb-4  md:size-70 sm:size-50 lg:size-90 xl:size-120 size-30 mx-auto bg-center bg-contain"} style={{ "background-repeat": "no-repeat", "background-image": `url('${baseUrl}getAlbumCover?id=${params.play}` }}
										/>

									</div>
									<PlayerComponent url={playUrl}
										PlayInfo={playInfo}></PlayerComponent>


								</div>
								<div class={"max-h-[42rem] flex flex-col w-full rounded-2xl bg-base-100"}>
									<Show when={lyrics()} keyed={true} fallback={<></>}>
										<select class=" select w-full min-h-10" tabIndex={lrcIndex()} onInput={(e)=>{
											setLrcIndex(e.currentTarget.selectedIndex);
										}}>
											{lyrics()?.map((item, index) => {
												return <>
													<option>{item.title} - {item.album} - {item.artist}</option>
												</>
											})}
										</select>
									</Show>

									<div style={{ "scrollbar-width": "none" }} class="overflow-y-scroll grow text-center text-md max-h-[42rem] m-10 justify-center" innerHTML={lyrics() ? lyrics()![lrcIndex()].lyrics.replaceAll(new RegExp("\\[[^\\[\\]]*]", "g"), "").trim().replaceAll("\n", "<br/>") : undefined}>

									</div>
								</div>

							</div>
						</>

					</Show>
				</div>
			</div>
		</div>
	</>

}

export default Player