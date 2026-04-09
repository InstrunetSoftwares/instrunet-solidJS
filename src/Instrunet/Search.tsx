import { createEffect, createSignal, For } from "solid-js";
import {baseUrl, i18n, WebRoutes, white} from "../Singletons";
import style from "../PageNavigator.module.css"
import { useSearchParams } from "@solidjs/router";
import { Kind } from "../Singletons";
import {BsSearch} from "solid-icons/bs";
import {createMediaQuery, makeMediaQueryListener} from "@solid-primitives/media";

const Search = () => {

	let [perPage, setPerPage] = createSignal(50);

	interface Searched {
		uuid: string,
		song_name: string,
		album_name: string,
		artist: string,
		kind: number,
		spell: string
	}

	const [p, setP] = useSearchParams();
	const [searchInfo, setSearchInfo] = createSignal<Searched[] | null>(null)
	const [currentPage, setCurrentPage] = createSignal<number>(1);
	const [hide, setHide] = createSignal(false);
	document.title = i18n.Instrunet.SEARCH_TITLE.START+(p ? p.p ? p.p as string : i18n.Instrunet.SEARCH_TITLE.ZENBU : i18n.Instrunet.SEARCH_TITLE.ZENBU) + i18n.Instrunet.SEARCH_TITLE.END
	const status = createMediaQuery("(width >= 48rem)")
	let callback = (e: MediaQueryListEvent | { matches: boolean })=>{
		if(!e?.matches){
			setPerPage(20);
		}else{
			setPerPage(50)
		}
	};
	callback({matches: status()})

	makeMediaQueryListener("(width >= 48rem)", callback)
	createEffect(() => {
		setSearchInfo(null)
		fetch(baseUrl + "search_api", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ searchStr: p.p })
		}).then(res => {
			if (res.ok) {
				res.json().then(j => setSearchInfo(j))
			}
		})
	}, p)
	createEffect(() => {
		if (hide()) {
			refBottomBar!.style.bottom = "-72px"
		} else {
			refBottomBar!.style.bottom = "0"
		}
	}, hide())
	let refBottomBar: HTMLDivElement;
	let prevScrollTop = window.pageYOffset || document.documentElement.scrollTop;
	let prevScrollDirection = '';

	window.addEventListener('scroll', function () {
		const st = window.pageYOffset || document.documentElement.scrollTop;
		if (st > prevScrollTop && prevScrollDirection !== 'down') {
			// downscroll code here
			setHide(true);
			prevScrollDirection = 'down';
		}
		else if (st < prevScrollTop && prevScrollDirection !== 'up') {
			// upscroll code
			setHide(false);
			prevScrollDirection = 'up';
		}
		prevScrollTop = st <= 0 ? 0 : st; // for Mobile or negative scrolling
	}, false);

	return <>
		<div class={"mt-20 mb-20 flex flex-col gap-4"}>
			<div class={"flex gap-1 mx-auto "}>
				<input style={{"font-size": "16px"}} id={"search-input"} value={p.p}  class={"input grow "} onKeyDown={(e)=>{
					if(e.key === "Enter") {
						document.getElementById("search-anchor")?.click()
					}
				}}/>
				<a id={"search-anchor"} class={"btn"} onClick={()=> {
					const a = document.createElement("a");
					a.href = WebRoutes.instruNet + `/search?p=${(document.getElementById("search-input") as HTMLInputElement)?.value ?? p.p}`;
					document.body.appendChild(a);
					a.click();
				}


				}>
					{/*<BsSearch/> // Icon does not show. */}
					搜索
				</a>

			</div>

			{
				searchInfo() ?
					<>
						<div
							class={"grid md:grid-cols-2 grid-cols-1  gap-4  mx-auto max-w-11/12 md:max-w-3/4 xl:max-w-1/2 "}>
							{
								searchInfo()?.slice((currentPage() - 1) * perPage(), (currentPage()) * perPage()).map((item, index) => {


									return <a class={`card bg-base-200 ${style.card}`} href={WebRoutes.instruNet + "/player?play="+item.uuid}>


										<div class={"card-body flex flex-row"} style={{ "align-items": "center" }}>
											{
												<img class={"h-20 aspect-auto rounded-sm mx-auto"}
													 src={baseUrl + `getAlbumCover?id=${item.uuid}`} />
											}
											<div class={"grow ml-2"}>
												<div class={"card-title text-3xl"}>{item.song_name}</div>
												<div class={"divider mt-0 mb-0"}></div>
												<span>{item.album_name} - {item.artist} - {Kind[item.kind]}</span>
											</div>

										</div>


									</a>


								})
							}
						</div>
						<div ref={refBottomBar!} class={`fixed px-2 glass overflow-y-scroll min-w-screen max-w-screen  py-4 bottom-0 ${style["bottom-nav"]}`}>
							<div class={"mx-auto pl-3 pr-3 w-fit"}>
								<div class="join  mx-auto">
									{
										<For each={(() => {

											let numsOfPages = Math.trunc(searchInfo()?.length! / perPage()) + 1
											let arr: number[] = [];
											for (let i = 1; i <= numsOfPages; i++) {
												arr.push(i);
											}
											return arr
										})()}>
											{(item) => <button class="join-item btn btn-square" onClick={() => {
												setCurrentPage(item)
											}}>{item}</button>}
										</For>

									}

								</div>
							</div>

						</div>

					</> : <div class={"hero min-h-[calc(100vh-14rem)]"}>
						<div class={"hero-content"}>
							<div class={"loading loading-spinner loading-x scale-250"}></div>
						</div>
					</div>
			}
		</div>



	</>
}

export default Search;