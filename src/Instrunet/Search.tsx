import {createEffect, createSignal} from "solid-js";
import {baseUrl, white} from "../Singletons";
import style from "../PageNavigator.module.css"
import {useSearchParams} from "@solidjs/router";

const Search = () => {


	const PER_PAGE_CONST = 50;

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
	const [searchError, setSearchError] = createSignal<string>();
	const [currentPage, setCurrentPage] = createSignal<number>(1);
	const [pageNumArr, setPageNumArr] = createSignal<number[]>([]);
	const [hide, setHide] = createSignal(false);

	createEffect(()=>{
		setSearchInfo(null)
		fetch(baseUrl + "search_api", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({searchStr: p.p})
		}).then(res => {
			if (res.ok) {
				res.json().then(j => setSearchInfo(j))
			} else {
				setSearchError(`${res.status} ${res.statusText}`)
			}
		})
	}, p)

	createEffect(() => {
		let numsOfPages = Math.trunc(searchInfo()?.length / PER_PAGE_CONST) + 1
		let arr: number = [];
		for (let i = 1; i <= numsOfPages; i++) {
			arr.push(i);
		}
		setPageNumArr(arr);
	}, [searchInfo])
	createEffect(()=>{
		if(hide()){
			refBottomBar.style.bottom = "-72px"
		}else{
			refBottomBar.style.bottom = "0"
		}
	}, hide())
	let refBottomBar: HTMLDivElement ;
	let prevScrollTop = window.pageYOffset || document.documentElement.scrollTop;
	let prevScrollDirection = '';

	window.addEventListener('scroll', function() {
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

	// TODO ALBUM COVER SYSTEM HAS TO BE CHANGED COMPLETELY. THIS IS HORSESHIT. HOW TF DID I WROTE THIS WITH OUT ASKING MYSELF?
	return <>

		{
			searchInfo() ?
				<>
					<div
						class={"mt-20 mb-20 grid md:grid-cols-2 grid-cols-1  gap-4 mx-5 md:mx-auto md:max-w-3/4 xl:max-w-1/2 mx-4"}>
						{
							searchInfo()?.slice((currentPage()-1)*PER_PAGE_CONST, (currentPage())*PER_PAGE_CONST).map((item, index) => {


								return <div class={`card bg-base-200 ${style.card}`}>


									<div className={"card-body flex flex-row"}>
										{
											<img class={"size-20 rounded-sm"}
												 src={baseUrl + `getAlbumCover?id=${item.uuid}`}/>
										}
										<div class={"grow ml-2"}>
											<div className={"card-title text-3xl"}>{item.song_name}</div>
											<div className={"divider mt-0 mb-0"}></div>
											<span>{item.album_name} - {item.artist}</span>
										</div>

									</div>


								</div>


							})
						}
					</div>
					<div ref={refBottomBar}  class={`fixed px-2 glass overflow-scroll min-w-screen max-w-screen  py-4 bottom-0 ${style["bottom-nav"]}`}>
						<div class={"mx-auto w-fit"}>
							<div className="join  mx-auto">
								{
									<For each={(() => {

										let numsOfPages = Math.trunc(searchInfo()?.length / PER_PAGE_CONST) + 1
										let arr: number = [];
										for (let i = 1; i <= numsOfPages; i++) {
											arr.push(i);
										}
										return arr
									})()}>
										{(item) => <button className="join-item btn btn-square" onClick={()=>{
											setCurrentPage(item)
										}}>{item}</button>}
									</For>

								}

							</div>
						</div>

					</div>

				</> : <div class={"hero min-h-[calc(100vh-4rem)]"}>
					<div class={"hero-content"}>
						<div class={"loading loading-spinner loading-x scale-250"}></div>
					</div>
				</div>
		}


	</>
}

export default Search;