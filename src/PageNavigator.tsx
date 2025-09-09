import type { Component } from 'solid-js';
import style from "./PageNavigator.module.css"


const PageNavigator: Component = () => {
  return <>
    <div class="hero bg-base-200 min-h-screen">
      <div class="hero-content ">
        <div class="max-w-screen">
          <h1 class="text-5xl font-bold py-10">AXCWG</h1>
          <div  class={"flex gap-4"}>
            <CardThisPage title={"伴奏网"} info={"AI支持的，免费无登录的伴奏分享网站"}/>
            <CardThisPage title={"语音转文字工具"} info={"“不大可用”于歌词类“带有旋律”的语音音频。"}/>
          </div>

        </div>
      </div>
    </div>
  </>
};
const CardThisPage = ({title, info}: {title:string, info: string})=> {
  return <div class={"card bg-base-100 shadow-sm min-w-100 " + style.card}>
    <div class={"card-body"}>
      <div class={"card-title"}>
        {title}
      </div>
      <p>
        {info}
      </p>
    </div>
  </div>
}

export default PageNavigator;
