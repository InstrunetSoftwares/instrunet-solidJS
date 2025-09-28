import {Component, createEffect, createSignal} from "solid-js";
import {BsSearch} from "solid-icons/bs";
import {baseUrl, i18n, Kind, WebRoutes} from "../Singletons";
import {parseBlob} from "music-metadata";
import style from "./InstrumentIndex.module.css"

const InstrunetIndex: Component = () => {
						document.title = "伴奏网 | InstruNet"

	function Upload() {
		setUploadDone(null);
		setUploadError(null);
		setUploading(true)
		if (!form().name || !form().name?.trim()) {
			setUploadError({
				message: "名称不可谓空。"
			});
			return;
		}
		if (!form().fileBinary) {
			setUploadError({
				message: "非法文件。"
			})
			return;
		}
		const formData = new FormData(); 
		for (let kV  of Object.entries(form())){
			formData.append(kV[0], kV[1])
			
		}
		fetch(baseUrl + "submit", {
			method: "POST",
			credentials: "include",
			body: formData,
		}).then(res => {
			if (res.ok) {
				setUploadDone("上传完成，请迈步“队列”页面")
			} else if (res.status === 500){
				setUploadError({
					message: "已在数据库中或队列中存在"
				})

			}else {
				setUploadError({
					message: `HTTP Error: ${res.status} ${res.statusText}`
				})
			}
				
		})

	}

	interface Form {
		albumCover: Blob | null,
		name: string | null,
		albumName: string | null,
		artist: string | null,
		link: string | null,
		fileBinary: Blob | null, 
		email: string | null,
		kind: number[]

	}

	interface UploadError {
		message: string,
	}

	const [form, setForm] = createSignal<Form>({
		albumCover: null,
		name: null,
		albumName: null,
		artist: null,
		link: null,
		fileBinary: null, 
		email: null,
		kind: [0]
	})
	interface NcmForm{
		id: string, kind: number[], email: string
	}
	const [uploadError, setUploadError] = createSignal<UploadError | null>(null);
	const [uploading, setUploading] = createSignal<boolean>(false);
	const [uploadDone, setUploadDone] = createSignal<string | null>(null);
	const [search, setSearch] = createSignal<string>("");
	const [ncmForm, setNcmForm] = createSignal<NcmForm>({
		id: "", kind: [0], email: ""
	})
	createEffect(() => {
		if (uploadError()) {
			setUploading(false)
		}
	}, [uploadError])
	createEffect(()=>{
		console.log(ncmForm())
	})

	let albumCoverRef: HTMLImageElement | undefined;
	let blink: HTMLSpanElement | undefined;
	setInterval(()=>{
		if(blink){
			blink.style.opacity = blink.style.opacity === "1" ? "0" : "1";
		}
	},450)

	// @ts-ignore
	return <>

		<div class={"sm:mx-30 mx-15 pb-10"}>


			{/* Upper Part */}

			<h1 class={"text-5xl mt-[35vh] font-light text-center  mb-5 "}><span class={"relative"}>{i18n.Instrunet.SLOGAN}<span ref={blink}
				class={`absolute right-[-1rem] ${style.blink}`}>_</span></span></h1>
			<div class={"flex md:max-w-1/2 max-w-full mx-auto flex-row gap-2"}>
				<input class={"input grow-1"} placeholder={i18n.General.SEARCH} value={search()} onInput={(e)=>{
					setSearch(e.target.value)
				}} onKeyDown={(e)=>{
					if(e.key === "Enter") {
						document.getElementById("search-anchor")?.click()
					}
				}}/>
				<a id={"search-anchor"} class={"btn btn-square"} href={WebRoutes.instruNet + `/search?p=${search()}`}><BsSearch/></a>
			</div>

			{/* Below Part */}
			<div class={"divider mt-[45vh] mb-10"}></div>
			<div class={"flex mx-auto flex-col sm:max-w-8/12 md:max-w-6/12"}>
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
				{
					uploadDone() ? <div class={"alert alert-success mb-5"} role={"alert"}>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current"
							 fill="none" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
						</svg>
						{uploadDone()!}
					</div> : null
				}

				<h1 class={"text-5xl font-bold"}>{i18n.General.UPLOAD}</h1>
				<div class="tabs tabs-box mt-5">
					<input type="radio" name="tab_upload_type" class="tab" aria-label="文件上传" defaultChecked={true}></input>
					<div class="tab-content border-base-300 p-6">
						<div class={"grid grid-cols-1  lg:grid-cols-2 gap-5 "}>
					<div class={"flex "} style={{"align-items": 'center'}}>
						<img ref={albumCoverRef} src={form().albumCover ?  URL.createObjectURL(form().albumCover!) : "" }
							 class={" bg-contain grow bg-no-repeat min-h-0 aspect-square max-w-1/2 sm:max-w-full border-1"}
							 classList={{["bg-base-100"]: true}}></img>

					</div>
					<div style={{padding: 0}} class={"sm:hero-content  gap-5 flex flex-col"}>
						<input id="file-input" type={"file"} class={"file-input min-w-full"} onChange={async (e) => {
							console.log((e.target.files![0]));
							let parsedInfo = await parseBlob(e.target.files![0], {
								skipCovers: false
							});
							if (parsedInfo.common.title?.trim()) {
								setForm({
									...form(), name: parsedInfo.common.title
								})
							} else {
								setForm({
									...form(), name: null,
								})
							}
							if (parsedInfo.common.artist?.trim()) {
								setForm({
									...form(), artist: parsedInfo.common.artist
								})
							} else {
								setForm({
									...form(), artist: null
								})
							}
							if (parsedInfo.common.album?.trim()) {
								setForm({...form(), albumName: parsedInfo.common.album})
							} else {
								setForm({
									...form(), albumName: null
								})
							}
							if (parsedInfo.common.picture) {
								if (parsedInfo.common.picture[0]) {
									let pic = new Blob([parsedInfo.common.picture[0].data as BlobPart], {type: "image/png"});
									const reader = new FileReader();
										setForm({
											...form(), albumCover: pic
										})
										

								}
							} else {
								setForm({
									...form(), albumCover: null
								})
								albumCoverRef?.classList.add("aspect-square");
								albumCoverRef?.classList.add("aspect-auto");
							}
							setUploading(true)
							setForm({
								...form(), fileBinary: e.target.files ? e.target.files[0] : null
							})
							setUploading(false); 


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
								...form(), kind: [parseInt(e.currentTarget.value)]
							})
						}} value={form().kind[0]}>
							{
								Kind.map((item, i) => {
									return <option value={i}>{item}</option>
								})
							}
						</select>
					</div>
				</div>
				<button onClick={Upload} disabled={uploading() && !uploadDone()}
						class={"btn btn-primary min-w-full mt-5"}>{uploading() && !uploadDone() ?
					<span class={"loading loading-spinner loading-md"}></span> : "上传"}</button>
					</div>
					<input type="radio" name="tab_upload_type" class="tab" aria-label="网易云上传"></input>
					<div class="tab-content border-base-300 p-6 ">
						<div class="flex flex-col gap-5">
						<input id="ncm_id" value={ncmForm().id ?? ""} oninput={(e)=>{
							setNcmForm({
								...ncmForm(), id: e.currentTarget.value
							})
						}} type="number" class=" input" placeholder="网易云ID"></input>
						<input id="email" value={ncmForm().email ?? ""} oninput={(e)=>{
							setNcmForm({
								...ncmForm(), email: e.currentTarget.value
							})
						}} class="input" placeholder="邮箱"></input>
						<select class={"select min-w-full"} value={ncmForm().kind[0]} onchange={(e)=>{
							setNcmForm({
								...ncmForm(), kind : [Number.parseInt(e.currentTarget.value)]
							})
						}}>
							{
								Kind.map((item, i) => {
									return <option value={i}>{item}</option>
								})
							}
						</select>
						<button onClick={()=>{
							setUploadDone(null);
							setUploadError(null);
							setUploading(true); 
							if (!ncmForm().id) {
								setUploadError({
									message: "ID不可为空"
								});
								return;
							}
							
							fetch(baseUrl + "ncm/url", {
								method: "POST",
								headers: {"Content-Type": "application/json"},
								credentials: "include",
								body: JSON.stringify({
									...ncmForm(), id: Number.parseInt(ncmForm().id)
								}),
							}).then(res => {
								if (res.ok) {
									setUploadDone("上传完成，请迈步“队列”页面")
								} else {
									setUploadError({
										message: `HTTP Error: ${res.status} ${res.statusText}`
									})
								}
							})
						}} disabled={uploading() && !uploadDone()}
						class={"btn btn-primary min-w-full mt-5"}>{uploading() && !uploadDone() ?
					<span class={"loading loading-spinner loading-md"}></span> : "上传"}</button>
						</div>
						
					</div>
				</div>
				
			</div>
		</div>


	</>
}


export default InstrunetIndex