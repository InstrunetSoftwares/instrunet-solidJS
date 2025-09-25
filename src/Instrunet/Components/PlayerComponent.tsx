import {CgPlayPause, CgPlayButton} from "solid-icons/cg";
import {TiMediaRewind, TiMediaFastForward} from "solid-icons/ti";
import {createSignal, Accessor, JSX, createEffect} from "solid-js";
import {baseUrl, Kind} from "../../Singletons";
import {AiFillStepBackward, AiFillStepForward} from "solid-icons/ai";

interface PlayInfoInterface {
	song_name: string,
	album_name: string,
	artist: string,
	kind: number
}

const PlayerComponent = ({url, PlayInfo, onFinished, onNextPressed, onPreviousPressed, index, autoplay}: {
	url: Accessor<string>,
	PlayInfo: Accessor<PlayInfoInterface | null | undefined>,
	onFinished?: JSX.EventHandlerUnion<HTMLAudioElement, Event, JSX.EventHandler<HTMLAudioElement, Event>> | undefined,
	onNextPressed?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent, JSX.EventHandler<HTMLButtonElement, MouseEvent>> | undefined,
	onPreviousPressed?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent, JSX.EventHandler<HTMLButtonElement, MouseEvent>> | undefined,
	index?: Accessor<number>, autoplay?: boolean
}) => {
	interface PlayingInfo {
		timeFull?: number,
		timeNow?: number,
		volume?: number,
		playing?: boolean, loading?: boolean
	}

	const [playingInfo, setPlayingInfo] = createSignal<PlayingInfo>({
		playing: false, timeNow: 0, volume: 1, timeFull: 99999, loading: false
	});
	const [lock, setLock] = createSignal(false);

	let audioElementRef: HTMLAudioElement | undefined;
	let progressRef: HTMLInputElement | undefined;

    createEffect(()=>{
		if(index){
			index()
			setPlayingInfo((prev) => {
				return {
					...prev, loading: true
				}
			})
		}
	})
	createEffect(()=>{
		if(navigator.mediaSession){
			navigator.mediaSession.metadata = new MediaMetadata({
				title: PlayInfo()?.song_name, 
				artist: PlayInfo()?.artist, 
				album: PlayInfo()?.album_name, 
				artwork: [
					{
						src: baseUrl + "getalbumcover?id="+url().replace(baseUrl, ""), 
						sizes: "1000x1000", 
						type: "image/webp"
					}
				]
			})
		}
	})


	return <>

		<div class={"card shadow-xl bg-base-100 w-full"}>
			<div class={"card-body w-full"}>

				<audio autoplay={autoplay} src={url()} ref={audioElementRef} onLoadedData={(e) => {
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
				}} onplay={(e) => [
					setPlayingInfo({
						...playingInfo(), playing: true, loading: false
					})
				]} onpause={(e) => {
					setPlayingInfo({
						...playingInfo(), playing: false
					})
				}} onvolumechange={(e) => {
					setPlayingInfo({
						...playingInfo(), volume: e.currentTarget.volume
					})
				}} onEnded={onFinished}/>
				<div class={"mx-auto  grid grid-cols-12 w-full"}>
					<div class={"col-span-11 flex flex-col justify-center"} style={{"align-items": "center"}}>
						<div class={"mb-2"}>
							<h4 class={"text-2xl  pl-5 font-bold text-center"}>{PlayInfo()?.song_name}</h4>
							<span>{PlayInfo()?.artist} - {PlayInfo()?.album_name} - {Kind[PlayInfo()?.kind!]}</span>
						</div>
						<input classList={{["hidden"]: playingInfo().loading}} ref={(progressRef)} type={"range"} min={0} max={playingInfo()?.timeFull} step={0.01}
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
								   setLock(false)
							   }}
						/>

						<div class={"max-w-fit mx-auto flex pl-5 join"} classList={{["mt-8"]:playingInfo().loading}}>
							{onPreviousPressed ? <>
                                <button class="btn btn-square block" onClick={onPreviousPressed}>
                                    <AiFillStepBackward class="p-2" style={{width: "100%", height: "100%"}}/>
                                </button>
                            </> : null}
                            <button class="btn btn-square block" onClick={() => {
                                if (audioElementRef) {
                                    audioElementRef.currentTime -= 4;
                                }
                            }}>
                                <TiMediaRewind class="p-2" style={{width: "100%", height: "100%"}}/>
                            </button>
							<button class={"btn btn-square block"} onClick={() => {
								if (playingInfo()?.playing) {
									audioElementRef?.pause();
								} else {
									audioElementRef?.play();
								}
							}}>{playingInfo()?.playing ? <CgPlayPause style={{width: "100%", height: "100%"}}/> :
								<CgPlayButton style={{width: "100%", height: "100%"}}/>}
							</button>
							<button class="btn btn-square block" onClick={() => {
								if (audioElementRef) {
									audioElementRef.currentTime += 4;

								}
							}}><TiMediaFastForward class="p-2" style={{width: "100%", height: "100%"}}/></button>
                            {onNextPressed ? <>
                                <button class="btn btn-square block" onClick={onNextPressed}>
                                    <AiFillStepForward class="p-2" style={{width: "100%", height: "100%"}}/>
                                </button>
                            </> : null}
                        </div>

                    </div>
                    <div class={"ml-5 col-span-1 flex justify-center "} style={{"align-items": "center"}}>
                        <input class={"h-20 mx-0"} style={{"writing-mode": "vertical-lr", direction: "rtl",}}
							   type={"range"}
							   min={0} max={1} step={0.01}
							   value={playingInfo()?.volume} onInput={(e) => {
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

export default PlayerComponent; 