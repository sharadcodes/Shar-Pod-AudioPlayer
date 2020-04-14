const template = document.createElement("template");
template.innerHTML = `
<style>
.shar-audio * {
    font-family: "Roboto";
    padding: 0;
    margin: 0;
}
.shar-audio {
    background-color: #fff;
    padding: 20px;
    display: grid;
    grid-template-columns: auto 6fr; 
}
.shar-audio img{
    max-width: 180px ;
    min-width: 180px;
    max-height: 180px;
    min-height: 180px;
}
.shar-audio h4{
    color: #808080;
    font-size: 14px;
    font-weight: 300;
    letter-spacing: 2px;
}
.shar-audio h2{
    color: #323232;
    font-size: 20px;
    margin-top: 2px;
    font-weight: 500;
}
.shar-audio .right{
    padding-left: 20px;
    position: relative;
}
.audio-player-div{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin-left: 20px;
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 20px;
    justify-content: space-between;
    align-items: center;
}
#btn-play-pause{
    color: #fff;
    border-radius: 100%;
    background-color: #323232;
    outline: none;
    border: none;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    height: 80px !important;
    width: 80px !important;
}
#audio-bar-wrapper{
    position: realtive;
    background-color: lightgrey;
    width: 100%;
    height: 20px;
    cursor: pointer;
}
#audio-bar-slider{
    position: realtive;
    left: 0;
    top: 0;
    bottom: 0;
    background-color: #323232;
    width: 0%;
    height: 20px;
    z-index: 100;
}
#audio-bar-mouse-slider{
    position: relative;
    left: 0;
    top: 0;
    bottom: 0;
    background-color: transparent;
    border-right: 2px solid red;
    width: 0%;
    height: 20px;
    z-index: 200;
    margin-top: -20px;
    visibility: hidden;
}
#audio-current-time{
    position: relative;
    left: 0;
    top: 0;
    font-size: 10px;
    background: rgba(253,242,128,.95);
    border-radius: 3px;
    padding: 4px;
    display: inline-block;
}
#audio-full-time{
    position: absolute;
    right: 0;
    top: 0;
    font-size: 10px;
    margin-top: 52px;
    border-radius: 3px;
    padding: 4px;
    display: inline-block;
}
#audio-bar-wrapper:hover #audio-bar-mouse-slider {
    visibility: visible;
}
@media screen and (max-width: 650px){
    .shar-audio{
        display: grid;
        grid-template-rows: auto auto;
        grid-template-columns: none;
    }
}
</style>

<div class="shar-audio">
<img />
<div class="right">
        <h4></h4>
        <h2></h2>
        <div class="audio-player-div">
            <button id="btn-play-pause">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="50px" height="50px"><path d="M8 5v14l11-7z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
            </button>
            <div id="audio-bar-wrapper">
                <div id="audio-bar-slider"></div>
                <div id="audio-bar-mouse-slider"></div>
                <div id="audio-current-time">00:00</div>
                <div id="audio-full-time">00:00</div>
            </div>
            <audio/>
        </div>
    </div>
</div>
`;

class SharAudio extends HTMLElement {
  constructor() {
    super();
    this.playAudio = false;

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.querySelector("h4").innerText = this.getAttribute("audio-title");
    this.shadowRoot.querySelector("h2").innerText = this.getAttribute("audio-subtitle");
    this.shadowRoot.querySelector("audio").src = this.getAttribute("src");
    this.shadowRoot.querySelector("img").src = this.getAttribute("artwork");
  }

  connectedCallback() {
    this.shadowRoot.querySelector("#btn-play-pause").addEventListener("click", () => {
      this.togglePlay();
    });
    this.shadowRoot.querySelector('#audio-bar-wrapper').addEventListener("mousemove", (e) => {
        this.shadowRoot.querySelector('#audio-bar-mouse-slider').style.width = `${Math.floor(((e.x + 1 - e.target.getBoundingClientRect().left) / parseFloat(this.shadowRoot.querySelector('#audio-bar-wrapper').clientWidth)) * 100)}%`
    });
    this.shadowRoot.querySelector('#audio-bar-wrapper').addEventListener("click", (e) => {
        const bar_per = (e.x + 1 - e.target.getBoundingClientRect().left) / parseFloat(this.shadowRoot.querySelector('#audio-bar-wrapper').clientWidth) * 100
        this.shadowRoot.querySelector('audio').currentTime = bar_per * this.shadowRoot.querySelector('audio').duration / 100;
    })
    this.shadowRoot.querySelector("audio").addEventListener("timeupdate", () => {
        this.shadowRoot.querySelector("#audio-current-time").innerText = SharAudio.readableDuration(this.shadowRoot.querySelector("audio").currentTime);
    })
    this.shadowRoot.querySelector("audio").addEventListener("loadedmetadata", () => {
        this.shadowRoot.querySelector("#audio-full-time").innerText = SharAudio.readableDuration(this.shadowRoot.querySelector("audio").duration);
    })
  }

  togglePlay() {
    this.playAudio = !this.playAudio;
    if (this.playAudio) {
      const audio_tag = this.shadowRoot.querySelector("audio");
      const audio_btn = this.shadowRoot.querySelector("button");
      const slider    = this.shadowRoot.querySelector("#audio-bar-slider");
      audio_btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="50px" height="50px"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>`
      audio_tag.play();
      audio_tag.ontimeupdate = function () { 
          slider.style.width = `${SharAudio.readableWidth(audio_tag.currentTime, audio_tag.duration)}%`;
      }
    } else {
      const audio_tag = this.shadowRoot.querySelector("audio");
      const audio_btn = this.shadowRoot.querySelector("button");
      audio_tag.pause();
      audio_btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="50px" height="50px"><path d="M8 5v14l11-7z"/><path d="M0 0h24v24H0z" fill="none"/></svg>`
      audio_tag.addEventListener("ontimeupdate", (event)=>{console.log("OK");})
    }
  }


  static readableDuration(seconds) {
    let sec = Math.floor(seconds);
    let min = Math.floor(sec / 60);
    min = min >= 10 ? min : "0" + min;
    sec = Math.floor(sec % 60);
    sec = sec >= 10 ? sec : "0" + sec;
    return min + ":" + sec;
  }
  
  static readableWidth(seconds, duration) {
    const current = Math.floor(seconds);
    return (current / duration) * 100;
  }
  
  static percentageToSeconds(percentage, duration) {
    return (percentage * duration) / 100;
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector("audio").removeEventListener();
  }
}
window.customElements.define("shar-audio", SharAudio);
