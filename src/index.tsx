/* @refresh reload */
import { render } from 'solid-js/web';
import 'solid-devtools';

import './index.css';
import { Component, lazy } from "solid-js";
import { Route, Router } from "@solidjs/router";
import { BunchOfButtons, NavBar, NavBarButtonInSig } from "./Instrunet/Components/NavBar";
import { FiMenu } from 'solid-icons/fi';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
	throw new Error(
		'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
	);
}

const AXCWGIndex = lazy(() => import("./PageNavigator"))
const InstrunetIndex = lazy(() => import("./Instrunet/InstrunetIndex"))
const InstrunetQueuePage = lazy(() => import("./Instrunet/Queue"))
const InstrunetLogin = lazy(() => import("./Instrunet/Login"))
const InstrunetSearch = lazy(() => import("./Instrunet/Search"))
const InstrunetPlayer = lazy(() => import("./Instrunet/Player"))
const InstrunetHome = lazy(() => import("./Instrunet/Home"))
const InstrunetLogout = lazy(()=> import ("./Instrunet/Logout"))
const InstrunetPlaylist = lazy(()=>import("./Instrunet/Playlist"))
const UnlockMusic = lazy(()=>import("./UnlockMusic"))
const Register = lazy(()=>import("./Instrunet/Register"));
const SecretPage =  lazy(() => import("./Instrunet/SecretPage"))
render(() => {
	const SharedButtons = <BunchOfButtons />;
	const GlobalNavBar = <NavBar Buttons={SharedButtons} />

	const Wrapper = ({ Content }: { Content: Component }) => {
		return <>
			<div class="drawer">
				<input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
				<div class="drawer-content flex flex-col">
					{GlobalNavBar}
					<Content />
				</div>
				<div class="drawer-side">
					<label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"></label>
					<ul class="menu bg-base-200 min-h-full w-80 p-4">
						<a class="btn btn-ghost text-xl font-medium" href={"/"}>
										菜单
									</a>
						<BunchOfButtons/>
					</ul>
				</div>
			</div>
		</>
	}

	return <Router>
		<Route path={"/"} component={AXCWGIndex} />
		<Route path={"/instrunet"} children={(() => {
			return <>
				<Route path="/" component={() => {
					return <Wrapper Content={InstrunetIndex} />
				}}></Route>
				<Route path={"/queue"} component={() => {
					return <Wrapper Content={InstrunetQueuePage} />}}>
				</Route>
				<Route path={"/login"} component={(()=>{
					return InstrunetLogin})()}>

				</Route>
				<Route path={"/logout"} component={(()=>{
					return InstrunetLogout})()}/>
				<Route path={"/register"} component={(()=>{
					
					return Register})()}/>
				<Route path={"/home"} component={() => {
					return <>
					<Wrapper Content={InstrunetHome} />
				</>}} />
				<Route path={"/search"} component={() => <>
					<Wrapper Content={InstrunetSearch} />
				</>}></Route>
				<Route path={"/player"} component={() =>
					<Wrapper Content={InstrunetPlayer} />
				}></Route>
				<Route path={"/playlist/:playlistuuid"} component={()=><Wrapper Content={InstrunetPlaylist}/>}/>
				<Route path={"/secret"} component={SecretPage}/>
			</>
		})()} />
		<Route path={"/unlock-music"} component={UnlockMusic}/>



	</Router>
}, root!);
