# Shar-Pod-AudioPlayer
An open source web component for your daily podcast needs.
> Developer: [Sharad Raj](https://github.com/sharadcodes/)

## UI 
![Shar Pod Audio Player Snap](https://sharadcodes.github.io/Shar-Pod-AudioPlayer/screenshots/1.png)

## [Live Demo](https://sharadcodes.github.io/Shar-Pod-AudioPlayer/example/)

## USAGE

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Shar Pod Audio Player Web Component Example</title>
    
    <!-- Include the script -->
    <script src="https://sharadcodes.github.io/Shar-Pod-AudioPlayer/src/SharPodAudioPlayer.js" async></script>
    
  </head>
  <body>
    
    <!-- add the tag with all attributes -->
    <shar-audio
      audio-title="codingINDIAN podacsts | Episode 9"
      audio-subtitle="The Great COBOL Crunch"
      artwork="https://avatars1.githubusercontent.com/u/36638057?s=460&u=b7ea83b7f3172f4517c653cefd5d0713853561b2&v=4"
      src="./audios/on_and_on.mp3"
    ></shar-audio>
    
  </body>
</html>

```
