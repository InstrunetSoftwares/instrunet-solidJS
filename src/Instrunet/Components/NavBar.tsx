import {BiRegularLeftArrowAlt} from "solid-icons/bi";
import {i18n, WebRoutes} from "../../Singletons";

const NavBar = ()=> {

	return <div class="navbar bg-base-100  border-b-1 border-b-base-300 ">
		<div >
			<a class="btn btn-ghost text-xl btn-square" onClick={()=>{
				history.back()
			}}>
				<BiRegularLeftArrowAlt size={"1.5rem"}/>
			</a>
			<a class="btn btn-ghost text-xl">{i18n.Instrunet.TITLE}</a>
			<NavBarButtonInSig href={WebRoutes.instruNet + "/search"}>{i18n.Instrunet.ALL}</NavBarButtonInSig>
			<NavBarButtonInSig href={WebRoutes.instruNet + "/queue"}>{i18n.Instrunet.QUEUE}</NavBarButtonInSig>
			<NavBarButtonInSig href={"mailto:xiey0@qq.com"}>{i18n.Instrunet.CONTACT}</NavBarButtonInSig>
			<NavBarButtonInSig href={"https://afdian.com/a/re_xiey0"}>{i18n.Instrunet.DONATE}</NavBarButtonInSig>
			<NavBarButtonInSig href={"https://andyxie.cn:5000/"}>{i18n.Instrunet.FORUM}</NavBarButtonInSig>
			<NavBarButtonInSig href={"https://github.com/AXCWG/instrunet-vite"}>{i18n.Instrunet.GIT}</NavBarButtonInSig>
			<NavBarButtonInSig href={WebRoutes.instruNet + "/secret"}>{i18n.Instrunet.SECRET}</NavBarButtonInSig>
		</div>
		<div class={" flex justify-end grow"}>
			<NavBarButtonInSig href={WebRoutes.instruNet + "/login"}>{i18n.General.LOGIN}</NavBarButtonInSig>
			<NavBarButtonInSig href={WebRoutes.instruNet + "/register"}>{i18n.General.REG}</NavBarButtonInSig>
		</div>

	</div>
}
const NavBarButtonInSig = ({children, href}: {children: Element | string, href?: string | undefined})=> {
	return <a href={href ?? ""} class="btn btn-md btn-ghost text-xl  font-light ">{children}</a>
}
export default NavBar;