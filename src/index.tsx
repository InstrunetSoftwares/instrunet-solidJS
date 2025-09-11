/* @refresh reload */
import {render} from 'solid-js/web';
import 'solid-devtools';

import './index.css';
import {Component, lazy} from "solid-js";
import {Route, Router} from "@solidjs/router";
import NavBar from "./Instrunet/Components/NavBar";
import Home from "./Instrunet/Home";

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
	throw new Error(
		'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
	);
}

const AXCWGIndex = lazy(() => import("./PageNavigator"))
const InstrunetIndex = lazy(() => import("./Instrunet/InstrunetIndex"))
const InstrunetQueuePage = lazy(() => import("./Instrunet/Queue"))
const InstrunetLogin = lazy(()=>import("./Instrunet/Login"))
render(() => {
	const GlobalNavBar = <NavBar/>;
	return <Router>
		<Route path={"/"} component={AXCWGIndex}/>
		<Route path={"/instrunet"} children={(() => {
			return <>
				<Route path="/" component={() => {
					return <>
						{GlobalNavBar}
						<InstrunetIndex/>
					</>
				}}></Route>
				<Route path={"/queue"} component={() => {
					return <>
						{GlobalNavBar}
						<InstrunetQueuePage/>
					</>
				}}>
				</Route>
				<Route path={"/login"} component={InstrunetLogin}>

				</Route>
				<Route path={"/home"} component={()=><>
					{GlobalNavBar}
					<Home/>
				</>}/>
			</>
		})()}/>


	</Router>
}, root!);
