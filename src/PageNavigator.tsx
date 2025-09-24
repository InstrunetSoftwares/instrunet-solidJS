import type { Component } from 'solid-js';
import style from "./PageNavigator.module.css"
import {i18n, WebRoutes} from "./Singletons";
import {Navigate} from "@solidjs/router";


const PageNavigator: Component = () => {
  return <>
    <div class="hero bg-base-200 min-h-screen">
      <div class="hero-content ">
        <div class="max-w-screen">
          <h1 class="text-5xl font-bold py-10">AXCWG</h1>

          <div class={"grid grid-cols-1 sm:grid-cols-2 gap-4"}>
              <CardThisPage href={WebRoutes.instruNet} title={i18n.Instrunet.TITLE} info={i18n.Instrunet.DESC}/>

            {/*<CardThisPage href={WebRoutes.speechToText} title={i18n.STT.TITLE} info={i18n.STT.DESC}/>*/}
            <CardThisPage href={"https://andyxie.cn:5000"} title={i18n.Sanctuary.TITLE} info={i18n.Sanctuary.DESC}/>
            <CardThisPage href={WebRoutes.unlockMusic} title={i18n.MusicUnlock.TITLE} info={i18n.MusicUnlock.DESC}/>
            <CardThisPage href={"https://andyxie.cn:4001"} title={i18n.JustTalk.TITLE} info={i18n.JustTalk.DESC}/>

          </div>




        </div>
      </div>
    </div>
  </>
};
const CardThisPage = ({title, info, href}: {title:string, info: string, href?: string })=> {
  return <div onClick={()=>{

  }} class={"card bg-base-100 shadow-sm sm:max-w-100  " + style.card}>
    <div class={"card-body"}>
      <div class={"card-title"}>
        {title}
      </div>
      <p>
        {info}
      </p>
      <a class={"btn "} href={href ?? "/"}>{i18n.General.ACCESS}</a>
    </div>
  </div>
}

export default PageNavigator;
