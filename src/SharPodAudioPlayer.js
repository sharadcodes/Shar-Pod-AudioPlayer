const template = document.createElement("template");
template.innerHTML = `
<link href="https://sharadcodes.github.io/Shar-Pod-AudioPlayer/src/shar_pod_audioplayer.css" rel="stylesheet" type="text/css">  
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
