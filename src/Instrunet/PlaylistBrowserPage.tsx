import {baseUrl} from "../Singletons";
import {Suspense} from "solid-js/web";
import {createEffect, createResource} from "solid-js";
import playlist from "./Playlist";

class PlaylistBrowser{
	private ApiUrl:string;
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
const PlaylistBrowserPage = ()=>{
	let api = new PlaylistBrowser(baseUrl.substring(0, baseUrl.lastIndexOf("/")));
	const [playlists,{refetch,mutate}] = createResource<Playlist[]>(async ()=> await api.BrowsePlaylist(OrderType.TimeDesc), {initialValue: []})
	createEffect(()=>{
		console.log(playlists())
	})
	return <>
		<Suspense fallback={<>loading</>}>
			<>
				{playlists().map((playlist: Playlist)=><>
					{playlist.title}
				</>)}
			</>
		</Suspense>
	</>
}

export default PlaylistBrowserPage;