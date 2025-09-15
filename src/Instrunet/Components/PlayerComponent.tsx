import { CgPlayPause, CgPlayButton } from "solid-icons/cg";
import { TiMediaRewind, TiMediaFastForward } from "solid-icons/ti";
import { createSignal, createEffect, onMount } from "solid-js";
import { Kind } from "../../Singletons";

interface PlayInfo {
	song_name: string,
	album_name: string,
	artist: string,
	kind: number
}

const PlayerComponent = ({ url,  PlayInfo }: { url: string, PlayInfo?: PlayInfo | null | undefined }) => {
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
		<div class={"card shadow-xl bg-base-100 w-full"}>
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
				}} />
				<div class={"mx-auto  grid grid-cols-12 w-full"}>
					<div class={"col-span-11 flex flex-col justify-center"} style={{ "align-items": "center" }}>
						<div class={"mb-2"}>
							<h4 class={"text-2xl  pl-5 font-bold text-center"}>{PlayInfo?.song_name}</h4>
							<span>{PlayInfo?.artist} - {PlayInfo?.album_name} - {Kind[PlayInfo?.kind!]}</span>
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

						<div class={"max-w-fit mx-auto flex pl-5 join"}>
							<button class="btn btn-square block" onClick={() => {
								setPlayingInfo({
									...playingInfo(), timeNow: playingInfo()?.timeNow! - 4,
								})
								if (audioElementRef) {
									audioElementRef.currentTime -= 4;

								}
							}}><TiMediaRewind class="p-2" style={{ width: "100%", height: "100%" }} /></button>
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
							}}>{playingInfo()?.playing ? <CgPlayPause style={{ width: "100%", height: "100%" }} /> :
								<CgPlayButton style={{ width: "100%", height: "100%" }} />}
							</button>
							<button class="btn btn-square block" onClick={() => {
								setPlayingInfo({
									...playingInfo(), timeNow: playingInfo()?.timeNow! + 4,
								})
								if (audioElementRef) {
									audioElementRef.currentTime += 4;

								}
							}}><TiMediaFastForward class="p-2" style={{ width: "100%", height: "100%" }} /></button>

						</div>

					</div>
					<div class={"ml-5 col-span-1 flex justify-center "} style={{ "align-items": "center" }}>
						<input class={"h-20 mx-0"} style={{ "writing-mode": "vertical-lr", direction: "rtl", }}
							type={"range"}
							min={0} max={1} step={0.01}
							value={playingInfo()?.volume} onInput={(e) => {
								setPlayingInfo({
									...playingInfo(), volume: Number.parseFloat(e.currentTarget.value)
								})
								if (audioElementRef) {
									audioElementRef.volume = Number.parseFloat(e.currentTarget.value);
								}
							}} />
					</div>


				</div>
			</div>
		</div>
	</>
}

export default PlayerComponent; 