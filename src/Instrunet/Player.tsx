import {useSearchParams} from "@solidjs/router";
import {createEffect, createSignal, onMount, Show} from "solid-js";
import {baseUrl, Kind} from "../Singletons";
import {CgPlayButton, CgPlayPause, CgPlayPauseR} from "solid-icons/cg";
import {BsPause, BsPauseBtn, BsPlayBtn} from "solid-icons/bs";

interface PlayInfo {
	song_name: string,
	album_name: string,
	artist: string,
	kind: number
}

const PlayerComponent = ({url, songName: PlayInfo}: { url: string, songName?: PlayInfo | null | undefined }) => {
	interface PlayingInfo {
		timeFull?: number,
		timeNow?: number,
		volume?: number,
		playing?: boolean
	}

	const [playingInfo, setPlayingInfo] = createSignal<PlayingInfo>();
	const [lock, setLock] = createSignal(false);
	let audioElementRef: HTMLAudioElement | undefined;
	let progressRef: HTMLInputElement | undefined;

	createEffect(() => {
		console.log(playingInfo())
		console.log(audioElementRef)
	})
	onMount(() => {
		setPlayingInfo({
			...playingInfo(), playing: false, timeNow: 0, volume: 1
		})
	})
	return <>
		<div class={"card shadow-sm bg-base-100 w-full"}>
			<div class={"card-body w-full"}>

				<audio src={url} ref={audioElementRef} onLoadedData={(e) => {
					setPlayingInfo({
						...playingInfo(),
						timeFull: e.currentTarget.duration,
						volume: e.currentTarget.volume
					})
				}} onTimeUpdate={(e) => {
					setPlayingInfo({
						...playingInfo(),
						timeNow: e.currentTarget.currentTime,
					})
				}}/>
				<div class={"mx-auto  grid grid-cols-12 w-full"}>
					<div class={"col-span-11 flex flex-col justify-center"} style={{"align-items": "center"}}>
						<div class={"mb-2"}>
							<h4 class={"text-2xl  pl-5 font-bold text-center"}>{PlayInfo?.song_name}</h4>
							<span>{PlayInfo?.artist} - {PlayInfo?.album_name} - {Kind[PlayInfo?.kind]}</span>
						</div>
						<input ref={(progressRef)} type={"range"} min={0} max={playingInfo()?.timeFull} step={0.01}
							   value={lock() ? progressRef?.value : playingInfo()?.timeNow}
							   class={"range w-full mb-2"}
							   onMouseDown={() => {
								   setLock(true)
							   }}
							   ontouchstart={(e) => {
								   setLock(true)
							   }}
							   onMouseUp={(e) => {

								   setPlayingInfo({
									   ...playingInfo(),
									   timeNow: Number.parseInt(e.currentTarget.value)
								   })
								   if (playingInfo()) {
									   if (audioElementRef) {
										   audioElementRef.currentTime = Number.parseFloat(e.currentTarget.value);

									   }
								   }
								   setLock(false)
							   }}
							   ontouchend={(e) => {
								   setPlayingInfo({
									   ...playingInfo(),
									   timeNow: Number.parseInt(e.currentTarget.value)
								   })
								   if (playingInfo()) {
									   if (audioElementRef) {
										   audioElementRef.currentTime = Number.parseFloat(e.currentTarget.value);

									   }
								   }
							   }}
						/>

						<div class={"max-w-fit mx-auto pl-5"}>
							<button class={"btn btn-square block"} onClick={() => {
								if (playingInfo()?.playing) {
									audioElementRef?.pause();
									setPlayingInfo({
										...playingInfo(),
										playing: false
									})
								} else {
									audioElementRef?.play();
									setPlayingInfo({
										...playingInfo(), playing: true
									})
								}
							}}>{playingInfo()?.playing ? <CgPlayPause style={{width: "100%", height: "100%"}}/> :
								<CgPlayButton style={{width: "100%", height: "100%"}}/>}
							</button>
						</div>

					</div>
					<div class={"ml-5 col-span-1 flex justify-center "} style={{"align-items": "center"}}>
						<input class={"h-20 mx-0"} style={{"writing-mode": "vertical-lr", direction: "rtl",}}
							   type={"range"}
							   min={0} max={1} step={0.01}
							   value={playingInfo()?.volume} onInput={(e) => {
							setPlayingInfo({
								...playingInfo(), volume: Number.parseFloat(e.currentTarget.value)
							})
							if (audioElementRef) {
								audioElementRef.volume = Number.parseFloat(e.currentTarget.value);
							}
						}}/>
					</div>


				</div>
			</div>
		</div>
	</>
}
const Player = () => {


	const [params, setParams] = useSearchParams();
	const [playInfo, setPlayInfo] = createSignal<PlayInfo | null | undefined>(undefined);
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
	return <>
		<div class="hero bg-base-200 ">
			<div class="hero-content sm:[align-items:center]   h-[calc(100vh-4rem)] " style={{"align-items": "center"}}>
				<div class={"sm:max-w-[75vw]  min-w-full h-full"}>
					<Show when={playInfo()} keyed={true} fallback={playInfo() === undefined ? <><span
						class={"loading loading-spinner loading-xl"}></span></> : <><span></span></>}>
						<>
							<div class={"grid grid-cols-2 h-full "}>

								<div className={"h-full flex flex-col"} style={{"justify-content": "center"}}>
									<div>
										<div className={"mb-4  md:size-70 sm:size-50 lg:size-75 xl:size-120 size-30 mx-auto bg-center bg-contain"} style={{"background-repeat": "no-repeat","background-image": `url('${baseUrl}getAlbumCover?id=${params.play}`}}
											 />

									</div>
									<PlayerComponent url={baseUrl + params.play}
													 songName={playInfo()}></PlayerComponent>


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