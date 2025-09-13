import {BiRegularLeftArrowAlt} from "solid-icons/bi";
import {baseUrl, i18n, WebRoutes} from "../../Singletons";
import {createSignal} from "solid-js";
import {FiMenu} from "solid-icons/fi";

const NavBar = () => {
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
				setUserInfo(undefined);
				setFetchDone(true)
		}
	})

	return <div class="navbar px-5 bg-base-100  border-b-1 border-b-base-300 ">
		<div>
			<a class="btn  text-xl btn-square" href={"/"}>
				<FiMenu size={"1.5rem"}/>
			</a>
			<NavBarButtonInSig href={WebRoutes.instruNet}>{i18n.Instrunet.TITLE}</NavBarButtonInSig>
			<NavBarButtonInSig href={WebRoutes.instruNet + "/search?p="}>{i18n.Instrunet.ALL}</NavBarButtonInSig>
			<NavBarButtonInSig href={WebRoutes.instruNet + "/queue"}>{i18n.Instrunet.QUEUE}</NavBarButtonInSig>
			<NavBarButtonInSig href={"mailto:xiey0@qq.com"}>{i18n.Instrunet.CONTACT}</NavBarButtonInSig>
			<NavBarButtonInSig href={"https://afdian.com/a/re_xiey0"}>{i18n.Instrunet.DONATE}</NavBarButtonInSig>
			<NavBarButtonInSig href={"https://andyxie.cn:5000/"}>{i18n.Instrunet.FORUM}</NavBarButtonInSig>
			<NavBarButtonInSig href={"https://github.com/AXCWG/instrunet-vite"}>{i18n.Instrunet.GIT}</NavBarButtonInSig>
			<NavBarButtonInSig href={WebRoutes.instruNet + "/secret"}>{i18n.Instrunet.SECRET}</NavBarButtonInSig>
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
const NavBarButtonInSig = ({children, href, className}: {
	children: any,
	href?: string | undefined,
	className?: string
}) => {
	const [bold, setBold] = createSignal(false);
	setInterval(()=>{
		// console.log(location.pathname)
		location.pathname === href && location.search === "" ? setBold(true) : setBold(false);
	}, 50)


	return <a href={href ?? ""} classList={{["btn"]: true, ["btn-md"]: true, ["btn-ghost"]: true, ["text-xl"]: true, ["font-bold"]: bold(), ["font-light"]: !bold()}} class={className??""}

	>{children}</a>
}
export default NavBar;