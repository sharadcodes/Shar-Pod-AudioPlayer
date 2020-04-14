const template = document.createElement("template");
template.innerHTML = `
<style>
* {
    padding: 0;
    margin: 0;
    font-family: monospace;
    outline: none !important;
    --webkit-touch-callout: none !important;
    -webkit-user-select: none !important;
    -khtml-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
    -webkit-tap-highlight-color: transparent;
    user-select: none !important;
}
h4{
    color: #ababab;
    font-weight: 400;
    font-size: 16px;
}
h2{
    font-size: 25px;
    color: #323232;
}
#shar-audio {
    display: flex;
    background: white;
    padding: 15px;
    box-shadow: 0px 1px 5px 0px rgba(0,0,0,0.2);
}
#left {
    max-height: 220px;
    max-width: 220px
}
img{
    height: 220px;
}
#right{
    display: grid;
    grid-template-rows: auto 0fr;
    flex: 1;
    padding-left: 20px;
}
#audio-player-div{
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    grid-gap: 20px;
}
#btn-play-pause{
    width: 65px;
    height: 65px;
    border-radius: 100%;
    border: none;
    background: #323232;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}
#audio-bar-wrapper{
    height: 20px;
    background: lightgrey;
    width: 100%;
    cursor: pointer;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: stretch;
}
#audio-bar-slider{
    height: 20px;
    background: #323232;
    width: 0%;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
}
#audio-bar-mouse-slider{
    height: 20px;
    background: #808080;
    width: 0%;
    visibility: hidden;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
}
#audio-bar-wrapper:hover #audio-bar-mouse-slider{
    visibility: visible;
}
#time-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 24px;
}
#audio-current-time {
    background: #fdf279;
    padding: 2px;
    font-size: 10px;
    border-radius: 3px;
    color: black;
}
#audio-full-time{
    background: white;
    padding: 2px;
    font-size: 10px;
    border-radius: 3px;
}
@media screen and (max-width: 650px){
    #shar-audio{
        display: flex;
        flex-direction: column-reverse;
        justify-content: center;
        align-items: stretch;
    }
    #left {
        max-width: 100% !important;
    }
    h4{
        font-size: 12px;
    }
    h2{
        font-size: 16px;
    }
    img{
        width: 80px;
        height: 80px;      
        float: right;
        border-radius: 100%;
    }
    #right{
        padding-left: 0px;
    }
    #audio-player-div{
        margin-top: 10px;
    }
}
</style>

<div id="shar-audio">

    <div id="left">
        <img />
    </div>

    <div id="right">
        <div id="titles">
            <h4></h4>
            <h2></h2>
        </div>
        <div id="audio-player-div">
            <button id="btn-play-pause">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="50px" height="50px"><path d="M8 5v14l11-7z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
            </button>
            <div id="audio-bar-wrapper">
                <div id="audio-bar-slider"></div>
                <div id="audio-bar-mouse-slider"></div>
                <div id="time-wrapper">
                    <div id="audio-current-time">00:00</div>
                    <div id="audio-full-time">00:00</div>
                </div>
            </div>
        </div>
    </div>  
</div>
<audio/>
`;

class SharAudio extends HTMLElement {
  constructor() {
    super();
    this.playAudio = false;

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.querySelector("h4").innerText = this.getAttribute(
      "audio-title"
    );
    this.shadowRoot.querySelector("h2").innerText = this.getAttribute(
      "audio-subtitle"
    );
    this.shadowRoot.querySelector("audio").src = this.getAttribute("src");
    this.shadowRoot.querySelector("img").src = this.getAttribute("artwork");
  }

  connectedCallback() {
    this.shadowRoot
      .querySelector("#btn-play-pause")
      .addEventListener("click", () => {
        this.togglePlay();
      });
    this.shadowRoot
      .querySelector("#audio-bar-wrapper")
      .addEventListener("mousemove", (e) => {
        this.shadowRoot.querySelector(
          "#audio-bar-mouse-slider"
        ).style.width = `${Math.floor(
          ((e.x + 1 - e.target.getBoundingClientRect().left) /
            parseFloat(
              this.shadowRoot.querySelector("#audio-bar-wrapper").clientWidth
            )) *
            100
        )}%`;
      });
    this.shadowRoot
      .querySelector("#audio-bar-wrapper")
      .addEventListener("click", (e) => {
        const bar_per =
          ((e.x + 1 - e.target.getBoundingClientRect().left) /
            parseFloat(
              this.shadowRoot.querySelector("#audio-bar-wrapper").clientWidth
            )) *
          100;
        this.shadowRoot.querySelector("audio").currentTime =
          (bar_per * this.shadowRoot.querySelector("audio").duration) / 100;
        this.shadowRoot.querySelector(
          "#audio-bar-slider"
        ).style.width = `${Math.floor(
          ((e.x + 1 - e.target.getBoundingClientRect().left) /
            parseFloat(
              this.shadowRoot.querySelector("#audio-bar-wrapper").clientWidth
            )) *
            100
        )}%`;
      });

    this.shadowRoot
      .querySelector("audio")
      .addEventListener("timeupdate", () => {
        this.shadowRoot.querySelector(
          "#audio-current-time"
        ).innerText = SharAudio.readableDuration(
          this.shadowRoot.querySelector("audio").currentTime
        );
      });
    this.shadowRoot
      .querySelector("audio")
      .addEventListener("loadedmetadata", () => {
        this.shadowRoot.querySelector(
          "#audio-full-time"
        ).innerText = SharAudio.readableDuration(
          this.shadowRoot.querySelector("audio").duration
        );
      });
  }

  togglePlay() {
    this.playAudio = !this.playAudio;
    if (this.playAudio) {
      const audio_tag = this.shadowRoot.querySelector("audio");
      const audio_btn = this.shadowRoot.querySelector("button");
      const slider = this.shadowRoot.querySelector("#audio-bar-slider");
      audio_btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="50px" height="50px"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>`;
      audio_btn.style.backgroundColor = "#fff";
      audio_btn.style.border = "2px solid black";
      audio_tag.play();
      audio_tag.ontimeupdate = function () {
        slider.style.width = `${SharAudio.readableWidth(
          audio_tag.currentTime,
          audio_tag.duration
        )}%`;
      };
    } else {
      const audio_tag = this.shadowRoot.querySelector("audio");
      const audio_btn = this.shadowRoot.querySelector("button");
      audio_tag.pause();
      audio_btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="50px" height="50px"><path d="M8 5v14l11-7z"/><path d="M0 0h24v24H0z" fill="none"/></svg>`;
      audio_btn.style.backgroundColor = "#323232";
      audio_btn.style.border = "none";
      audio_tag.addEventListener("ontimeupdate", (event) => {
        console.log("OK");
      });
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
