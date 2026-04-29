import {baseUrl} from "../Singletons";
import {Suspense} from "solid-js/web";
import {createEffect, createResource, createSignal, For} from "solid-js";
import playlist from "./Playlist";
import {A} from "@solidjs/router";

class PlaylistBrowser{
	private readonly ApiUrl:string;
	constructor(url: string) {
		this.ApiUrl = url;
	}
	public async BrowsePlaylist(orderType: OrderType): Promise<Playlist[]>{
		const u = new URL("playlist-browse",this.ApiUrl);
		u.searchParams.set("ordertype", orderType.valueOf().toString())
		const res = await fetch(u);
		if(res.ok){
			return await res.json();
		}else{
			throw new Error(`Error fetching playlist: ${res.status} - ${res.statusText}`);
		}
	}
	public GetUrlForUuid(uuid:string): URL{
		const url = new URL("/playlist-tmb", this.ApiUrl);
		url.searchParams.set("asFile", String(true));
		url.searchParams.set("playlistUuid", uuid);
		return url;
	}
	public async GetUsernameFromUuid(uuid: string) : Promise<string>{
		const reqUrl = new URL("/userapi", this.ApiUrl);
		reqUrl.searchParams.set("uuid", uuid);
		reqUrl.searchParams.set("getName", String(true));
		const req = await fetch(reqUrl);
		if(req.ok){
			return await req.text()
		}
		throw new Error("服务器获取名称失败")
	}
}
interface Playlist{
	uuid:string;
	owner: string;
	title: string;
	content: string[];
}
enum OrderType{
	TimeDesc,
	TimeAsc,
	NameDesc,
	NameAsc,
}
const Username = (props: { uuid: string; api: PlaylistBrowser }) => {
	const [name] = createResource(() => props.api.GetUsernameFromUuid(props.uuid));
	return <Suspense fallback="Loading...">{name()}</Suspense>;
};
const PlaylistBrowserPage = ()=>{
	let api = new PlaylistBrowser(baseUrl.substring(0, baseUrl.lastIndexOf("/")));
	const [playlists,{refetch,mutate}] = createResource<Playlist[]>(async ()=> await api.BrowsePlaylist(OrderType.TimeDesc), {initialValue: []})
	createEffect(()=>{
		console.log(playlists())
	})
	return <>
		<div class={"flex mx-15 md:mx-30 mt-5  "}>
			<Suspense fallback={<div class={"justify-center  grow"} style={{ "align-items": "center"}}>loading</div>}>
				<div class={"justify-center  grow"} style={{ "align-items": "center"}} >
					<div class={"font-bold text-4xl"}>全部内容</div>
					<div class={"grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1"}>
						<For each={playlists()}>
							{
								(f)=>{

									return <>
										<A href={`/instrunet/playlist/${f.uuid}`} class={"m-3 rounded-xl p-3 bg-base-200 hover:bg-base-300 flex flex-row gap-3"}>
											<div class={"w-20 h-20 min-w-20 rounded-md my-auto border border-b border-base-content"} style={`background-image: url(${api.GetUrlForUuid(f.uuid).toString()}); background-size: cover; background-position: center;`}></div>
											<div class={"grow my-auto"}>
												<div class={"text-2xl"}>
													{f.title}
												</div>
												<hr class={"text-base-300/200"}/>
												<div class={"text-gray-500"}>
													由 <Username uuid={f.owner} api={api} /> 创建
												</div>
											</div>

										</A>
									</>
								}
							}
						</For>
					</div>


				</div>

			</Suspense>
		</div>

	</>
}

export default PlaylistBrowserPage;