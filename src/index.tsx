/* @refresh reload */
import {render} from 'solid-js/web';
import 'solid-devtools';

import './index.css';
import {lazy} from "solid-js";
import {Route, Router} from "@solidjs/router";

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
	throw new Error(
		'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
	);
}

const InstrunetIndex = lazy(() => import("./PageNavigator"))
render(() => <Router>
	<Route path={"/instrunet"}>
		<Route path="/" component={InstrunetIndex}></Route>
	</Route>
</Router>, root!);
