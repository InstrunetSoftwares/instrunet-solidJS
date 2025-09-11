import {Component, createEffect, createSignal} from "solid-js";
import {BsSearch} from "solid-icons/bs";
import {Kind} from "../Singletons";
import {parseBlob} from "music-metadata";

const InstrunetIndex: Component = () => {
	function Upload() {
		setUploadError(null);
		if(!form().name){
			setUploadError({
				message: "Name cannot be empty. "
			});
		}
	}

	interface Form {
		albumCover: string | null,
		name: string | null,
		albumName: string | null,
		artist: string | null,
		link: string | null,
		file: string,
		email: string | null,
		kind: number

	}
	interface UploadError{
		message: string,
	}
	const [form, setForm] = createSignal<Form>({
		albumCover: null,
		name: null,
		albumName: null,
		artist: null,
		link: null,
		file: "",
		email: null,
		kind: 0
	})
	const [uploadError, setUploadError] = createSignal<UploadError | null>(null);
	createEffect(() => {
		console.log(form())
	}, [form])
	let albumCoverRef: HTMLImageElement | undefined;

	return <>

		<div class={"sm:mx-30 mx-15 pb-10"}>


			{/* Upper Part */}
			<h1 class={"text-5xl font-light text-center mt-[35vh] mb-5"}>听点什么？</h1>
			<div class={"flex md:max-w-1/2 max-w-full mx-auto flex-row gap-2"}>
				<input class={"input grow-1"} placeholder={"搜索"}/>
				<button class={"btn btn-square"}><BsSearch/></button>
			</div>

			{/* Below Part */}
			<div class={"divider mt-[45vh] mb-10"}></div>
			<div class={"flex mx-auto flex-col sm:max-w-6/12"}>
				{
					uploadError() ? <div class={"alert alert-error mb-5"} role={"alert"}>
						<svg xmlns="http://www.w3.org/2000/svg"
							 class="h-6 w-6 shrink-0 stroke-current" fill="none"
							 viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
						</svg>
						<span>{uploadError()!.message}</span>
					</div> : null
				}

				<h1 class={"text-5xl font-bold"}>上传</h1>
				<div class={"grid grid-cols-1  md:grid-cols-2 gap-5 mt-5"}>
					<div class={"flex "} style={{"align-items": 'center'}}>
						<img ref={albumCoverRef} src={form().albumCover ?? ""}
							 class={" bg-contain grow bg-no-repeat min-h-0 aspect-square max-w-1/2 sm:max-w-full border-1"}
							 classList={{["bg-base-100"]: true}}></img>

					</div>
					<div style={{padding: 0}} class={"sm:hero-content  gap-5 flex flex-col"}>
						<input type={"file"} class={"file-input min-w-full"} onChange={async (e) => {
							console.log((e.target.files![0]));
							let parsedInfo = await parseBlob(e.target.files![0], {
								skipCovers: false
							});
							console.log(parsedInfo);
							if (parsedInfo.common.title?.trim()) {
								setForm({
									...form(), name: parsedInfo.common.title
								})
							}else {
								setForm({
									...form(), name: null,
								})
							}
							if (parsedInfo.common.artist?.trim()) {
								setForm({
									...form(), artist: parsedInfo.common.artist
								})
							}else {
								setForm({
									...form(), artist: null
								})
							}
							if (parsedInfo.common.album?.trim()) {
								setForm({...form(), albumName: parsedInfo.common.album})
							}else{
								setForm({
									...form(), albumName: null
								})
							}
							if(parsedInfo.common.picture) {
								if(parsedInfo.common.picture[0]) {
									let pic = new Blob([parsedInfo.common.picture[0].data as BlobPart], {type: "image/png"});
									const reader = new FileReader();
									reader.readAsDataURL(pic);
									reader.onloadend = ()=> {
										setForm({
											...form(), albumCover: reader.result!.toString()
										})
										albumCoverRef?.classList.remove("aspect-square");
										albumCoverRef?.classList.add("aspect-auto");

										console.log(reader.result);
									}

								}
							}else {
								setForm({
									...form(), albumCover: null
								})
								albumCoverRef?.classList.add("aspect-square");
								albumCoverRef?.classList.add("aspect-auto");
							}

						}}/>
						<input class={"input min-w-full"} value={form().name ?? ""} onInput={(e) => {
							setForm({
								...form(), name: !e.currentTarget.value ? null : e.currentTarget.value
							})
						}} onChange={() => {
							setForm({
								...form(), name: form().name ? !form().name!.trim() ? null : form().name!.trim() : null
							})
						}} placeholder={"歌曲名称"}/>
						<input class={"input min-w-full"} value={form().albumName ?? ""} onInput={(e) => {
							setForm({
								...form(), albumName: !e.currentTarget.value ? null : e.currentTarget.value
							})
						}} placeholder={"专辑名称"} onChange={() => {
							setForm({
								...form(),
								albumName: form().albumName ? !form().albumName!.trim() ? null : form().albumName!.trim() : null
							})
						}}/>
						<input class={"input min-w-full"} value={form().artist ?? ""} onInput={(e) => {
							setForm({
								...form(), artist: !e.currentTarget.value ? null : e.currentTarget.value
							})
						}} placeholder={"歌手名称"} onChange={() => {
							setForm({
								...form(),
								artist: form().artist ? !form().albumName!.trim() ? null : form().artist!.trim() : null
							})
						}}/>
						<select class={"select min-w-full"} onChange={(e) => {
							setForm({
								...form(), kind: parseInt(e.currentTarget.value)
							})
						}} value={form().kind}>
							{
								Kind.map((item, i) => {
									return <option value={i}>{item}</option>
								})
							}
						</select>
					</div>
				</div>
				<button onClick={Upload} class={"btn btn-primary min-w-full mt-5"}>上传</button>
			</div>
		</div>


	</>
}


export default InstrunetIndex