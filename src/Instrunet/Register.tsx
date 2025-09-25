import {createSignal} from "solid-js";
import {baseUrl, i18n, WebRoutes} from "../Singletons";
import {BiRegularLeftArrowAlt} from "solid-icons/bi";

const Register = () => {
	document.title = "注册 | 伴奏网"
	enum PageStatus {
		FIRST_LOAD, LOGGING, ERROR, SUCCESS
	}

	const [pageStatus, setPageStatus] = createSignal<PageStatus>(PageStatus.FIRST_LOAD);
	const [form, setForm] = createSignal<{
		email: string
		username: string,
		password: string
	}>({
		username: "", password: "", email: ""
	});
	return <div class={"hero  bg-base-200 min-h-screen"}>
		<div class={"hero-content sm:min-w-auto min-w-full"}>
			<div class={"flex flex-col gap-5 min-w-full"}>
				<h1 class={"text-5xl font-bold"}>{i18n.General.REG}</h1>
				<div class={"card bg-base-100 w-full max-w-sm sm:min-w-100 min-w-full shrink-0 shadow-2xl"}>
					<div class={"card-body"}>
						<fieldset class={"fieldset"}>
							{
								pageStatus() === PageStatus.SUCCESS ?
									<div role="alert" class="alert alert-success">
										<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current"
											 fill="none" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
												  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
										</svg>
										<span>{i18n.General.INFO_REG_SUCCESS}</span>
									</div> : pageStatus() === PageStatus.ERROR ?
										<div role="alert" class="alert alert-error">
											<svg xmlns="http://www.w3.org/2000/svg"
												 class="h-6 w-6 shrink-0 stroke-current" fill="none"
												 viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
													  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
											</svg>
											<span>{i18n.General.INFO_REG_ERROR}</span>
										</div> :null
							}
							<a class={"btn btn-ghost btn-square"} onClick={() => {
								history.back()
							}}>
								<BiRegularLeftArrowAlt size={"2rem"}/>

							</a>
							<label class={"label"}>{i18n.General.USERNAME}</label>
							<input class={"input min-w-full"} onChange={(e) => {
								setForm({
									...form(), username: e.target.value
								})
							}} value={form().username} placeholder={i18n.General.USERNAME}/>
							<label class={"label"}>{i18n.General.EMAIL}</label>
							<input class={"input min-w-full"} onChange={(e) => {
								setForm({
									...form(), email: e.target.value
								})
							}} value={form().email} placeholder={i18n.General.OPTIONAL}/>
							<label class={"label"}>{i18n.General.PASSWORD}</label>
							<input onKeyDown={(e)=>{
								if(e.key === "Enter"){
									document.getElementById("register-button")!.click()
								}

							}} onInput={(e)=>{
								setForm({
									...form(), password: e.currentTarget.value
								})
							}}  value={form().password} class={"input min-w-full"} placeholder={i18n.General.PASSWORD}
								   type="password"/>
							<button id={"register-button"} class={"btn btn-primary mt-3"} disabled={pageStatus() === PageStatus.LOGGING}
									onClick={async () => {
										setPageStatus(PageStatus.LOGGING);
										let response = await fetch(baseUrl + "register", {
											method: "POST",
											body: JSON.stringify({
												username: form().username,
												password: form().password,
												email: form().email ? form().email : null
											}),
											headers: {
												"Content-Type": "application/json"
											},
											credentials: "include"
										})
										if (response.ok) {
											setPageStatus(PageStatus.SUCCESS)
											response.json().then(data => {
												localStorage.setItem("uuid", data.uid)
												setTimeout(()=>{
													window.location.replace(WebRoutes.instruNet)
												}, 1000)
											})

										} else {
											setPageStatus(PageStatus.ERROR)
										}
										console.log(response.json())
									}}>{pageStatus() === PageStatus.LOGGING ?
								<span class="loading loading-spinner loading-md"></span>
								: i18n.General.LOGIN}</button>
						</fieldset>
					</div>
				</div>
			</div>

		</div>
	</div>
}
export default Register