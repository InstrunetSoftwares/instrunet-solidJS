import { useParams, useSearchParams } from "@solidjs/router";
import { Accessor, createEffect, createSignal, Show } from "solid-js";
import { baseUrl, Kind } from "../Singletons";
import PlayerComponent from "./Components/PlayerComponent";
import { AiOutlineDelete } from "solid-icons/ai";

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
    const [searchParams, setSearchParams] = useSearchParams();
    const [playlistInfo, setPlaylistInfo] = createSignal<PlaylistInfo | null | undefined>(undefined);
    const [playlistName, setPlaylistName] = createSignal<string | null | undefined>(undefined);
    const [playlistOwner, setPlaylistOwner] = createSignal<string | null | undefined>(undefined);
    const [playlistSongInfo, setPlayListSongInfo] = createSignal<PlayInfo[] | null | undefined>(undefined);
    const [playCurrentSong, setPlayCurrentSong] = createSignal<PlayInfo | null>();
    const [playCurrentIndex, setPlayCurrentIndex] = createSignal<number>(0);
    const [playUrl, setPlayUrl] = createSignal<string>("");
    fetch(baseUrl + "playlist?playlistUuid=" + params.playlistuuid).then(res => {
        if (res.ok) {
            res.json().then(async (j) => {
                for (const element of (j as PlaylistInfo).content) {
                    let res = await fetch(baseUrl + "getsingle?id=" + element)
                    if (res.ok) {
                        let j = await res.json()
                        setPlayListSongInfo([...playlistSongInfo() ? playlistSongInfo()! : [], j])

                    }
                }
                if (searchParams.track) {
                    let parsed = Number.parseInt(searchParams.track as string);
                    console.log(parsed)
                    if (parsed < playlistSongInfo()!.length) {
                        setPlayCurrentIndex(parsed)
                    }
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
        if (playlistSongInfo()) {
            setPlayCurrentSong(playlistSongInfo()![playCurrentIndex()])
        }
    })
    fetch(baseUrl + "playlist-name?playlistuuid=" + params.playlistuuid).then(res => {
        if (res.ok) {
            res.text().then((j) => {
                setPlaylistName(j)
            })
        }
    })
    createEffect(() => {
        setPlayUrl(baseUrl + playlistInfo()?.content[playCurrentIndex()])
    })



    const Text = ({ number }: { number: Accessor<number> }) => {
        return <>{number()}</>
    }
    function spliceImmutable(array: any[], index: number, length: number): any[] {
        let arr = [...array]
        console.log(arr)
        arr.splice(index, length);
        console.log(arr)
        return arr;
    }


    return <>

        <Text number={playCurrentIndex} />


        <div class="mx-auto lg:max-w-250 max-w-100 mb-10   mt-10">
            <div class="grid grid-cols-1 lg:max-h-190 max-h-full lg:grid-cols-2 gap-2">
                <div>
                    <img class={"max-w-100 mx-auto mt-2"} src={baseUrl + "playlist-tmb?asFile=true&playlistuuid=" + params.playlistuuid} />
                    <div class="text-center text-2xl font-bold mt-2">
                        {
                            playlistName()
                        }
                    </div>
                    <div class="text-center">{playlistOwner()}</div>
                    <Show when={playlistInfo()} keyed={false} fallback={<>正在加载</>}>
                        <Show when={playlistSongInfo()} keyed={false} >
                            <PlayerComponent url={playUrl} onFinished={(e) => {
                                if (playCurrentIndex() === playlistSongInfo()!.length - 1) {
                                    setPlayCurrentIndex(0)
                                } else {
                                    setPlayCurrentIndex(playCurrentIndex() + 1)
                                }
                                setSearchParams({ track: playCurrentIndex() })


                            }} PlayInfo={playCurrentSong} />
                        </Show>
                    </Show>

                </div>
                <div class="max-h-full lg:max-h-170 lg:overflow-y-scroll">
                    <table class="table  table-sm w-full table-zebra border-2 border-base-content/10">
                        <thead>
                            <tr>
                                <td>封面</td>
                                <td>歌曲</td>
                                <td>专辑</td>
                                <td>艺术家</td>
                                <td>种类</td>
                                <td>操作</td>
                            </tr>
                        </thead>
                        <tbody>
                            <Show when={playlistSongInfo()} keyed={true}>
                                {
                                    playlistSongInfo()!.map((item, index) => {
                                        return <tr >
                                            <td onClick={() => {
                                                setPlayCurrentIndex(index)
                                            }}>{playlistInfo()?.content[index] ? <img class="lg:max-w-15 max-w-10" src={baseUrl + "getAlbumCover?id=" + playlistInfo()?.content[index]} /> : null} </td>
                                            <td onClick={() => {
                                                setPlayCurrentIndex(index)
                                            }}>{item.song_name}</td>
                                            <td onClick={() => {
                                                setPlayCurrentIndex(index)
                                            }}>{item.album_name}</td>
                                            <td onClick={() => {
                                                setPlayCurrentIndex(index)
                                            }}>{item.artist}</td>
                                            <td onClick={() => {
                                                setPlayCurrentIndex(index)
                                            }}>{Kind[item.kind]}</td>
                                            <td ><button class="btn bg-red-500" onClick={() => {
                                                setPlaylistInfo({
                                                    ...playlistInfo()!, content: spliceImmutable(playlistInfo()!.content, index, 1)
                                                })
                                                setPlayListSongInfo(spliceImmutable(playlistSongInfo()!, index, 1))
                                                let pli = playlistInfo();
                                                let plsi = playlistSongInfo();

                                            }}><AiOutlineDelete /></button></td>
                                        </tr>
                                    })
                                }
                            </Show>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </>
}
export default Playlist; 