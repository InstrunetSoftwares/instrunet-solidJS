import { createEffect, createSignal } from "solid-js";
import style from "./Mixer.module.css"
import { animate, createDraggable, spring } from 'animejs';
import { BsList, BsListColumns, BsListOl, BsMenuApp, BsMenuButton, BsMenuDown } from "solid-icons/bs";
const Mixer = () => {
	const TaskWindow = ()=>{
		const [extended, setExtended] = createSignal(false) ;
		const TaskInterface = () => {
			return <div class="m-9 h-full relative">
				<h1 class="text-xl font-bold">任务</h1>
				<div class=" absolute bottom-18 right-0 left-0 top-13 p-5 bg-base-300  rounded-2xl ">s</div>
			</div>; 
		}
		
		return (
			
			<div onClick={(e)=>{
				animate('.square', {
				    
					ease: extended() ? spring({ bounce: 0.15, duration: 300 }) : spring({ bounce: 0.30, duration: 500 }), 
					width: extended() ? "4rem" :  "500px", height: extended() ? "4rem" : "500px"
				});
				setExtended(!extended())
				}} style={{width:  "4rem", height:  "4rem"}} classList={{ ["flex flex-row justify-center items-center"]: !extended()}} class={" square shadow-2xl rounded-4xl select-none fixed right-10 bottom-10 bg-base-200"}>
				{extended() ?<TaskInterface/>: <BsList class="w-7 h-7"/>}
			</div>
		)
	}
	return <>
<TaskWindow/>
	</>;
}

export default Mixer;