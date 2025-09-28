import { BiRegularLeftArrowAlt } from "solid-icons/bi";
import { baseUrl, i18n, WebRoutes } from "../../Singletons";
import { Component, createSignal, JSX } from "solid-js";
import { FiMenu } from "solid-icons/fi";

const NavBar = ({Buttons}: {Buttons: JSX.Element}) => {
	interface UserInfo {
		uuid: string,
		username: string,
		email: string,
		avatar: Blob
	}

	const [userInfo, setUserInfo] = createSignal<UserInfo | undefined>();
	const [fetchDone, setFetchDone] = createSignal<Boolean>(false);
	fetch(baseUrl + "userapi", {
		method: "GET", credentials: "include", headers: {
			"Content-Type": "application/json",
		}
	}).then((response: Response) => {
		switch (response.status) {
			case 200:
				response.json().then((data) => {
					fetch(baseUrl + "avatar?uuid=" + data.uuid).then((r) => r.blob()).then(b => {
						setUserInfo({
							uuid: data.uuid, username: data.username, email: data.email, avatar: b
						})
						setFetchDone(true)

					})


				})
				break;
			case 500:
				localStorage.removeItem("uuid")
				setUserInfo(undefined);
				setFetchDone(true)
		}
	})

	return <div class="navbar px-5 bg-base-100  border-b-1 border-b-base-300 ">
		<div class="flex-none lg:hidden">
			<label for="my-drawer-3" aria-label="open sidebar" class="btn btn-square btn-ghost">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					class="inline-block h-6 w-6 stroke-current"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					></path>
				</svg>
			</label>
		</div>
		<div class="lg:block hidden">
			<a class="btn  text-xl btn-square" href={"/"}>
				<FiMenu size={"1.5rem"} />
			</a>
			{Buttons}
		</div>
		<div class={" flex justify-end grow"}>
			{
				fetchDone() ? userInfo() ?
					<a class={"btn-square rounded-xl"} href={WebRoutes.instruNet + "/home"}><img class={"inline-block size-10 rounded-xl"}
						src={URL.createObjectURL(userInfo()!.avatar)}></img></a> :
					<>
						<NavBarButtonInSig
							href={WebRoutes.instruNet + "/login"}>{i18n.General.LOGIN}</NavBarButtonInSig>
						<NavBarButtonInSig
							href={WebRoutes.instruNet + "/register"}>{i18n.General.REG}</NavBarButtonInSig>
					</> : null
			}

		</div>

	</div>
}
const NavBarButtonInSig = ({ children, href, className }: {
	children: any,
	href?: string | undefined,
	className?: string
}) => {
	const [bold, setBold] = createSignal(false);
	setInterval(() => {
		location.pathname === href && location.search === "" ? setBold(true) : setBold(false);
	}, 50)
	return <a href={href ?? ""} classList={{ ["btn"]: true, ["btn-md"]: true, ["btn-ghost"]: true, ["text-xl"]: true, ["font-bold"]: bold(), ["font-light"]: !bold() }} class={className ?? ""}

	>{children}</a>
}
const BunchOfButtons = () => {
	
	return <><NavBarButtonInSig href={WebRoutes.instruNet}>{i18n.Instrunet.TITLE}</NavBarButtonInSig>
		<NavBarButtonInSig href={WebRoutes.instruNet + "/search"}>{i18n.Instrunet.ALL}</NavBarButtonInSig>
		<NavBarButtonInSig href={WebRoutes.instruNet + "/queue"}>{i18n.Instrunet.QUEUE}</NavBarButtonInSig>
		<NavBarButtonInSig href={"mailto:xiey0@qq.com"}>{i18n.Instrunet.CONTACT}</NavBarButtonInSig>
		<NavBarButtonInSig className="text-error" href={"https://afdian.com/a/re_xiey0"}>{i18n.Instrunet.DONATE}</NavBarButtonInSig>
		<NavBarButtonInSig href={"https://andyxie.cn:5000/"}>{i18n.Instrunet.FORUM}</NavBarButtonInSig>
		<NavBarButtonInSig href={"https://github.com/InstrunetSoftwares"}>{i18n.Instrunet.GIT}</NavBarButtonInSig>
		<NavBarButtonInSig href={WebRoutes.instruNet + "/secret"}>{i18n.Instrunet.SECRET}</NavBarButtonInSig></>
}
export { NavBar, NavBarButtonInSig, BunchOfButtons };