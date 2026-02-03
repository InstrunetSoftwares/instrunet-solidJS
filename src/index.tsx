/* @refresh reload */
import {render, Suspense} from 'solid-js/web';
import 'solid-devtools';

import './index.css';
import { Component, lazy } from "solid-js";
import { Route, Router } from "@solidjs/router";
import { BunchOfButtons, NavBar } from "./Instrunet/Components/NavBar";

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
	throw new Error(
		'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
	);
}

const AXCWGIndex = lazy(() => import("./PageNavigator"))
const InstrunetIndex = lazy(async ()=> {
	return import("./Instrunet/InstrunetIndex")
})
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
const UpdateLog = lazy(() => import("./Instrunet/UpdateLog"))
render(() => {
	const SharedButtons = <BunchOfButtons/>;
	const GlobalNavBar = <NavBar Buttons={SharedButtons}/>
	const LoadingScreen = ({fullHeight}: { fullHeight?:boolean })=> {
		return <div class={`hero bg-base-200 ${fullHeight ?"min-h-[100vh]" : "min-h-[calc(100vh-4rem)]"} `}>
			<div class="hero-content text-center">
				<div class="max-w-md">
					<span class={"loading w-15 loading-spinner"}></span>
				</div>
			</div>
		</div>
	}
	const Wrapper = ({Content, Navbar}: { Content: Component, Navbar :boolean }) => {
		return <>
			<div class="drawer">
				<input id="my-drawer-3" type="checkbox" class="drawer-toggle"/>
				<div class="drawer-content flex flex-col">
					{Navbar ? GlobalNavBar : null}
					<Suspense fallback={<LoadingScreen fullHeight={!Navbar}/>}>
						<Content/>
					</Suspense>
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
		<Route path={"/"} component={AXCWGIndex}/>
		<Route path={"/instrunet"} children={(() => {
			return <>
				<Route path="/" component={() => {
					return <Wrapper Content={InstrunetIndex} Navbar={true}/>
				}}></Route>
				<Route path={"/queue"} component={() => {
					return <Wrapper Content={InstrunetQueuePage} Navbar={true}/>
				}}>
				</Route>
				<Route path={"/login"} component={(() => {
					return <Wrapper Content={InstrunetLogin} Navbar={false}/>
				})}>

				</Route>
				<Route path={"/logout"} component={() => {
					return <Wrapper Content={InstrunetLogout} Navbar={false}/>
				}}/>
				<Route path={"/register"} component={(() => {

					return <Wrapper Content={Register} Navbar={false}/>
				})}/>
				<Route path={"/home"} component={() => {
					return <>
						<Wrapper Content={InstrunetHome} Navbar={true}/>
					</>
				}}/>
				<Route path={"/search"} component={() => <>
					<Wrapper Content={InstrunetSearch} Navbar={true}/>
				</>}></Route>
				<Route path={"/player"} component={() =>
					<Wrapper Content={InstrunetPlayer} Navbar={true}/>
				}></Route>
				<Route path={"/playlist/:playlistuuid"} component={() => <Wrapper Content={InstrunetPlaylist} Navbar={true}/>}/>
				<Route path={"/secret"} component={()=><Wrapper Content={SecretPage} Navbar={false}/>}/>
				<Route path={"/updatelog"} component={()=><>
				<Wrapper Content={UpdateLog} Navbar={true}/>
				</>}/>
			</>
		})()}/>
		<Route path={"/unlock-music"} component={() => <Wrapper Content={UnlockMusic} Navbar={false}/>}/>


	</Router>
}, root!);
