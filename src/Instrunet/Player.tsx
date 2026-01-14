import {useSearchParams} from "@solidjs/router";
import {createEffect, createSignal, Show} from "solid-js";
import {baseUrl, i18n, WebRoutes} from "../Singletons";
import style from "./Player.module.css"
import PlayerComponent from "./Components/PlayerComponent";
import {BsDownload} from "solid-icons/bs";
import {BiRegularDownArrow, BiRegularUpArrow} from "solid-icons/bi";

interface PlayInfo {
	songName: string,
	albumName: string,
	artist: string,
	kind: number
}


const Player = () => {

	interface LyricObject {
		album: string,
		artist: string,
		cover: string,
		id: string,
		lyrics: string,
		title: string
	}
	interface Comment{
		uuid:  string, content: string,  date: number, poster: string, master: string,
		posterUsername: string | undefined,  //POST Init.
		dateTime: Date | undefined //POST
	}
	const [params, setParams] = useSearchParams();
	const [lrcIndex, setLrcIndex] = createSignal(0);
	const [playInfo, setPlayInfo] = createSignal<PlayInfo | null | undefined>(undefined);
	const [lyrics, setLyrics] = createSignal<LyricObject[] | null | undefined>(null);
	const [playUrl, setPlayUrl] = createSignal<string>("");
	const [currentVote, setCurrentVote] = createSignal<number>(NaN);
	const [voted, setVoted] = createSignal<number>(0);
	const [comments, setComments] = createSignal<Comment[]>([]);
	const [commentContent, setCommentContent] = createSignal<string>("");
	const [pitch, setPitch] = createSignal<number>(0); 
	createEffect(() => {
		setPlayUrl(baseUrl + params.play)
	})
	createEffect(()=>{
		document.title = (playInfo()?.songName ?? "") + i18n.Instrunet.DOC_TITLE.END;
	})
	fetch(baseUrl + "api/community/getvote?uuid=" + params.play).then(res => {
		res.text().then(result => {
			setCurrentVote(Number.parseInt(result as string))
		})
	})
	fetch(baseUrl + "api/community/hasvoted?uuid=" + params.play, {
		credentials: "include"
	}).then(res => {
		res.text().then(result => {
			setVoted(Number.parseInt(result as string))
		})
	})
	fetch(baseUrl + "api/community/getComment?uuid=" + params.play).then(res => {
		res.json().then(res => {
			setComments(res)
			for (let i = 0; i < comments().length; i++){

				let comment = comments()[i];
				//Date
				let date = new Date(comment.date);

				fetch(baseUrl + "userapi?getname=true&uuid=" + comment.poster).then(res => res.text()).then((res) => {
					let newArr = [...comments()]
					newArr[i].posterUsername = res;
					newArr[i].dateTime = date;
					setComments(newArr);
				})
			}

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
					name: playInfo()?.songName, artist: playInfo()?.artist, albumName: playInfo()?.albumName
				}), headers: {
					"Content-Type": "application/json"
				}
			}).then(res => {
				if (res.ok) {
					res.json().then((j) => {
						setLyrics(j);
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
			<div
				class="hero-content pt-15 overflow-y-scroll block sm:[align-items:center] sm:max-w-[85vw] sm:h-[calc(100vh-4rem)] "
				style={{"align-items": "center", "scrollbar-width": "auto"}}>
				<div class={""}>
					<Show when={playInfo()} keyed={true} fallback={playInfo() === undefined ? <><span
						class={"loading loading-spinner loading-xl"}></span></> : <><span></span></>}>
						<>
							<div class={"grid sm:grid-cols-2 gap-5 h-full "}>

								<div class={"h-full flex flex-col"} style={{"justify-content": "center"}}>
									<div>
										<div
											class={style.CardAnimation + " mb-4  md:size-70 sm:size-50 lg:size-90 xl:size-120 size-30 mx-auto bg-center bg-contain"}
											style={{
												"background-repeat": "no-repeat",
												"background-image": `url('${baseUrl}getalbumcover?id=${params.play}`
											}}
										/>

									</div>
									<PlayerComponent autoplay={false} url={playUrl}
													 PlayInfo={playInfo}></PlayerComponent>


								</div>
								<div class={"max-h-[42rem] flex flex-col w-full rounded-2xl bg-base-100"}>
									<Show when={lyrics()} keyed={true} fallback={<></>}>
										<div class={"flex"}>
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
											{(lyrics() && lyrics()?.length != 0)?  <button class={"btn btn-primary"} onClick={() => {
												const blob = new Blob([lyrics()![lrcIndex()].lyrics], {type: "text/binary"});
												const url = URL.createObjectURL(blob);
												const a = document.createElement("a");
												a.href = url;
												a.download = (lyrics() && lyrics()?.length != 0 )? lyrics()![lrcIndex()].title + '.lrc' : "";
												document.body.appendChild(a);
												a.click();
												document.body.removeChild(a);
												URL.revokeObjectURL(url);
											}}><BsDownload/>{i18n.Instrunet.LRC}
											</button> : null}
										</div>

									</Show>

									<div style={{"scrollbar-width": "none"}}
										 class="overflow-y-scroll grow text-center text-md max-h-[42rem] m-10 justify-center"
										 innerHTML={lyrics() ? lyrics()![lrcIndex()].lyrics.replaceAll(new RegExp("\\[[^\\[\\]]*]", "g"), "").trim().replaceAll("\n", "<br/>") : undefined}>

									</div>
								</div>

							</div>


						</>

					</Show>
				</div>
				<div class="join w-full">
					<a class={"btn grow join-item  btn-primary mt-2"} href={baseUrl + `download?id=${params.play}`}>{i18n.General.DOWNLOAD}</a>
					<button class={"btn grow join-item  btn-primary mt-2"} popovertarget="pitched-download" style={{"anchor-name": "--pitched-anchor"} as any}>{i18n.Instrunet.PITCHING + i18n.General.DOWNLOAD}</button>
					<ul class="dropdown menu w-52 rounded-box bg-base-100 shadow-sm" popover={true} id="pitched-download" style={{"position-anchor": "--pitched-anchor"} as any}>
												<li>
													<div>
														<input class="w-full range" id="pitch-range-input" type="range" max={12} min={-12} step={0.5} oninput={(e)=>{
															setPitch(e.currentTarget.valueAsNumber)
														}}></input>
													<span id="indicator">{pitch()}</span>
													</div>
												</li>
												<li>
													<a class="btn btn-primary" href={`${baseUrl}${params.play}?pitch=${pitch()}`} onClick={(e)=>{
														e.currentTarget.innerHTML = "<div class='loading loading-spinner'></div>"
													}}>{i18n.General.DOWNLOAD}</a>
												</li>
					</ul>
				</div>
				<div class={"divider "}></div>

				<div class={"flex mt-2 gap-4"}>
					<div class={"flex flex-col text-center gap-2"}>
						<button class={"btn "}
								classList={{["btn-success"]: voted() === 1}}
								onClick={(e) => {
									if (localStorage.getItem("uuid")) {
										if (voted() === -1) {
											setCurrentVote(currentVote() + 2);
											fetch(baseUrl + "api/community/upvote", {
												method: "POST",
												credentials: "include",
												body: params.play as string,
											})
											setVoted(1)
										} else if (voted() === 1) {
											setCurrentVote(currentVote() - 1);
											fetch(baseUrl + "api/community/reset-vote", {
												method: "POST",
												body: params.play as string,
												credentials: "include"
											})
											setVoted(0)
										} else {
											setCurrentVote(currentVote() + 1)
											fetch(baseUrl + "api/community/upvote", {
												method: "POST",
												credentials: "include",
												body: params.play as string,
											})
											setVoted(1)
										}

									} else {
										let a = document.createElement("a");
										a.href = WebRoutes.instruNet + "/login";
										a.click()
									}

								}}><BiRegularUpArrow/></button>
						{currentVote()}
						<button class={"btn"} classList={{["btn-error"]: voted() === -1}} onClick={(e) => {
							if (localStorage.getItem("uuid")) {
								if (voted() === -1) {
									setCurrentVote(currentVote() + 1);
									fetch(baseUrl + "api/community/reset-vote", {
										method: "POST",
										body: params.play as string,
										credentials: "include"
									})
									setVoted(0)
								} else if (voted() === 1) {
									setCurrentVote(currentVote() - 2);
									fetch(baseUrl + "api/community/downvote", {
										method: "POST",
										body: params.play as string,
										credentials: "include"
									})
									setVoted(-1)
								} else {
									setCurrentVote(currentVote() - 1)
									fetch(baseUrl + "api/community/downvote", {
										method: "POST",
										body: params.play as string,
										credentials: "include"
									})
									setVoted(-1)
								}
							}

						}}><BiRegularDownArrow/></button>
					</div>
					<div class={"grow"}>
						<div class={"flex gap-2"}>
							<input onKeyDown={(e)=>{
								if(e.key === "Enter") {
									document.getElementById("send-comment")?.click()
								}
							}} class={"input grow"} onInput={(e)=>{
								setCommentContent(e.target.value)
							}} value={commentContent()} placeholder={i18n.General.COMMENT}/>
							<button id={"send-comment"} class={"btn btn-primary"} onClick={(e)=> {
								fetch(baseUrl + "api/community/postComment", {
									method: "POST",
									credentials: "include",
									headers: {
										"Content-Type": "application/json",
									}, body: JSON.stringify({
										content: commentContent(), master: params.play
									})
								}).then(res => {
									fetch(baseUrl + "userapi?getname=true&uuid="+localStorage.getItem('uuid'), {
										method: "get",
										credentials: "include",

									}).then(res => res.text()).then(data => {
										if (res.ok) {

											setComments([{
												content: commentContent(),
												uuid: null!, date: null!, poster: null!, master: null!, posterUsername:data, dateTime: new Date(Date.now())
											}, ...comments() ])
											setCommentContent("")
										}
									})

								})

							}} disabled={!localStorage.getItem("uuid")}>{localStorage.getItem("uuid") ? i18n.General.SEND : i18n.Instrunet.LOGIN_REQ}</button>
						</div>

						<div class={"divider "}></div>

						{comments().map((item, index) => {
							return <>
								<div>
									{item.posterUsername} @ {item.dateTime?.toLocaleString()}: {item.content}
								</div>
								<div class={"divider "}></div>


							</>
						})}
					</div>
				</div>
			</div>

		</div>

	</>

}

export default Player