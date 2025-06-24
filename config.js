const CONFIG = {
  
  QUOTE_API: {
    URL: "https://proxy.cors.sh/https://zenquotes.io/api/random",
    CORS_KEY: "temp_7c201c5c26ab9d7b4bccd139fd69f264",  
    FALLBACK_QUOTES: [
      ["Breathe in calm, breathe out stress.", "Anonymous"],
      ["The present moment is filled with joy and happiness.", "Thich Nhat Hanh"]
    ]
  },
  SOUND_API: {
    URL: "https://freesound.org/apiv2/search/text/",
    KEY: "Pr7NCwLpTPXtPHQoHjevJNk9D54WKMOgtPDxl31f",  
    FALLBACK_SOUNDS: ["audio4.mp3", "audio1.mp3", "audio2.mp3","audio3.mp3"]
  },
  VIDEO_API: {
    URL: "https://api.pexels.com/videos/search",
    KEY: "LheAUrfMJy1dTZjpYmMnNqc8EZI8vXPHP4RAUmmctzTSdEqqqPBCP6tz",  
    FALLBACK_VIDEOS: ["video0.mp4", "video1.mp4", "video2.mp4","video3.mp4","video4.mp4","video5.mp4"]
  },
  END_QUOTE:{
    QUOTES:[ "One moment.One win ✨💛🌿"
    ,"Breathe in: confidence 💨 Breathe out: doubt 🙌"
    ,"Your moment of peace was felt 🌼 The world thanks you."
    ,"What a beautiful pause you just took 🕊️"
    ,"And just like that… the storm inside softened 🌈",
     "You gave your mind a moment to breathe. Well done 🌞.",
 "That wasn’t just one moment, it was a gift to yourself🌸.",
 "You are calm. You are capable. You are enough 🌞 🌈 .",
 "You planted a seed of peace — let it grow 🌿",
"Your peace is powerful. Let it guide your day✨ "
]
  }
};
export default CONFIG