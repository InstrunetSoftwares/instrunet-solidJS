import { useParams } from "@solidjs/router";
import { createEffect, createSignal, Show } from "solid-js";
import { baseUrl } from "../Singletons";
import PlayerComponent from "./Components/PlayerComponent";

const Playlist = () => {
    interface PlaylistInfo {
        owner: string, uuid: string, content: string[], private: string
    }
    interface PlayInfo {
        song_name: string,
        album_name: string,
        artist: string,
        kind: number
    }
    const params = useParams();
    const [playlistInfo, setPlaylistInfo] = createSignal<PlaylistInfo | null | undefined>(undefined);
    const [playlistName, setPlaylistName] = createSignal<string | null | undefined>(undefined);
    const [playlistOwner, setPlaylistOwner] = createSignal<string | null | undefined>(undefined);
    const [playlistSongInfo, setPlayListSongInfo] = createSignal<PlayInfo[] | null | undefined>(undefined);
    const [playCurrentIndex, setPlayCurrentIndex] = createSignal(0);
    fetch(baseUrl + "playlist?playlistUuid=" + params.playlistuuid).then(res => {
        if (res.ok) {
            res.json().then((j) => {
                for (const element of (j as PlaylistInfo).content) {
                    fetch(baseUrl + "getsingle?id=" + element).then(res => {
                        if (res.ok) {
                            res.json().then(j => {
                                setPlayListSongInfo([...playlistSongInfo() ? playlistSongInfo()! : [], j])
                                console.log(playlistSongInfo())
                            })
                        }
                    })
                }

                setPlaylistInfo(j)
                fetch(baseUrl + "userapi?getname=true&uuid=" + playlistInfo()?.owner).then((res) => {
                    if (res.ok) {
                        res.text().then(t => setPlaylistOwner(t))
                    }
                })
            })
        }
    })
    createEffect(() => {
        console.log(playlistInfo())
    })
    fetch(baseUrl + "playlist-name?playlistuuid=" + params.playlistuuid).then(res => {
        if (res.ok) {
            res.text().then((j) => {
                setPlaylistName(j)
            })
        }
    })


    console.log(params.playlistuuid)
    return <>
        <div class="mx-auto w-250 mt-10">
            <div class="grid grid-cols-2">
                <div>
                    <img class={"max-w-full"} src={baseUrl + "playlist-tmb?asFile=true&playlistuuid=" + params.playlistuuid} />
                    <div class="text-center text-xl">{playlistName()}</div>
                    <div class="text-center">{playlistOwner()}</div>
                    <Show when={playlistInfo()} keyed={true} fallback={<>正在加载</>}>
                        <PlayerComponent url={baseUrl + playlistInfo()?.content[playCurrentIndex()]} />
                    </Show>

                </div>
                <div>b</div>
            </div>
        </div>
    </>
}
export default Playlist; 