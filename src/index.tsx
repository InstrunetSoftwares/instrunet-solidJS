/* @refresh reload */
import {render} from 'solid-js/web';
import 'solid-devtools';

import './index.css';
import App from './App';
import {lazy} from "solid-js";
import {Route, Router} from "@solidjs/router";

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
	throw new Error(
		'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
	);
}

const Main = lazy(() => import("./App"))
render(() => <Router>
	<Route path={"/"} component={Main}></Route>
</Router>, root!);
