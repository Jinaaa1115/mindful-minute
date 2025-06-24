import CONFIG from './config.js'
let sessionHistory = JSON.parse(localStorage.getItem("sessionHistory")) || []
 
let quote = ''
let author = ''

async function fetchQuote() {
  try {
    
    const res = await fetch(CONFIG.QUOTE_API.URL, {
      headers: {
        'x-cors-api-key': CONFIG.QUOTE_API.CORS_KEY,
      }
    });
    const data = await res.json()
    console.log(data)
    let index = data[0]
    quote = index.q
    author = index.a
    return [quote, author]
    
  } catch (e) {
    const fallback=CONFIG.QUOTE_API.FALLBACK_QUOTES
    quote = fallback[Math.floor(Math.random()*fallback.length)][0]
    author = fallback[Math.floor(Math.random()*fallback.length)][1]
    return [quote, author]
  }
  
}
async function displayQuote() {
  let quoteData = await fetchQuote()
  console.log(quoteData)
  document.getElementById("quote").innerText = `"${quoteData[0]}"`
  document.getElementById("author").innerText = `- ${quoteData[1]}`
}

function startMainContainer() {
  document.getElementById("container").style.display = "none"
  document.getElementById("sessionlog").style.display="none"
  document.getElementById("main-container").style.display = "flex"
  displayQuote()
}
function openContainer(){
  document.getElementById("main-container").style.display="none"
  document.getElementById("sessionlog").style.display="none"
  document.getElementById("container").style.display="flex"
  displayQuote()
}
function formatTime(seconds){
  const min=Math.floor(seconds/60)
  const sec=seconds%60
  return `${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
}
function showPreviousSessions(){
  filterSessions("all")
 const allButton = document.querySelector('.filter-btn:nth-child(1)')
filterSessions("all", allButton)
}
function filterSessions(type,btn=null){
  document.getElementById("sessionlog").style.display="flex"
    const log = document.getElementById("sessionlogs")
  document.getElementById("container").style.display = "none"
  document.getElementById("main-container").style.display = "none"
  
  
   
  const history = JSON.parse(localStorage.getItem("sessionHistory")) || []
  document.querySelectorAll(".filter-btn").forEach(button=>{
    button.classList.remove("bg-orange-400","text-white")
    button.classList.add("bg-gray-200")
  })
  if(btn){
    btn.classList.remove("bg-gray-200")
    btn.classList.add("bg-orange-400","text-white")
  }
   const filtered=type==="all"?history:history.filter(s=>s.status===type)
   log.innerHTML=""
  if (filtered.length === 0) {
    log.style.display="flex"
    log.style.alignItems="center";
    log.style.justifyContent="center"
    log.innerHTML = `<p>No ${type.toLowerCase()} sessions found</p>`
    return
  }
  //${session.status==='skipped'? 'bg-red-200':'bg-green-200'}
  filtered.forEach((session, i) => {
    const timeset = formatTime(session.timeset)
    const timeUsed = formatTime(session.timeelapsed)
    log.innerHTML += `
   <div class="mb-2 p-2 bg-white rounded shadow  ">
   <strong>Session ${i+1}</strong>-${session.date}<br>
   Set Time: ${timeset}<br>
   Status: <strong class="${session.status==='skipped'? 'text-red-500':'text-green-500'}"> ${session.status}</strong><br>
   ${session.status==="skipped"?`Time before skipped: ${timeUsed}`:""}
   </div>`
  })
  updatePieChart()
}
function clearHistory(){
  if(confirm("Are you sure want to delete all session history?")){
    localStorage.removeItem("sessionHistory")
    sessionHistory=[]
    document.getElementById("sessionlog").innerHTML=`<p>History cleared.</p>`
    updatePieChart()
  }
}
document.getElementById("setTimer").addEventListener("click", () => {
  document.getElementById("settimer-container").style.display = "flex"
  document.getElementById("main-container").classList.add("disabled")
})
let totalSeconds = 0

function setTheMinutes() {
  let minuteInput = document.getElementById("minute-input").value
  const parts = minuteInput.split(":")
  if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
    alert("Please enter time MM:SS format")
    return
  }
  if(parts[0]=="00"&&parts[1]=="00"){
    alert("please enter proper time")
    return
  }
  const minutes = parseInt(parts[0])
  const seconds = parseInt(parts[1])
  totalSeconds = minutes * 60 + seconds
  console.log(totalSeconds)
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  document.getElementById("settimer-container").style.display = "none"
  document.getElementById("main-container").classList.remove("disabled")
  const display = document.getElementById("minute")
  display.textContent = ''
  display.textContent = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`
  
}
 
const audio = document.getElementById("player") 

async function playSound() {
 
  const soundArr = ["relaxing", "music"]
  const soundtype = soundArr[Math.floor(Math.random() * soundArr.length)]
  if (totalSeconds === 0) totalSeconds = 60
  const minDuration = totalSeconds - 10
  const maxDuration = totalSeconds + 10
  try {
    if (!navigator.onLine) throw new Error("Offline");
    const res = await fetch(`${CONFIG.SOUND_API.URL}?query=${soundtype}&filter=duration:[${minDuration} TO ${maxDuration}]&fields=id,name,previews&token=${CONFIG.SOUND_API.KEY}`)
    const data = await res.json()
    if (data.results.length === 0) {
      alert("No sounds found")
      return
    }
    const sound = data.results[Math.floor(Math.random() * data.results.length)]
     
    audio.src = sound.previews['preview-hq-mp3']
    audio.play()
    console.log("Now playing: ", sound.name)
  } catch (e) {
    const fallback = CONFIG.SOUND_API.FALLBACK_SOUNDS[
  Math.floor(Math.random() * CONFIG.SOUND_API.FALLBACK_SOUNDS.length)
];
    audio.src=`audios/${fallback}`
    audio.play()
    console.error("Fetching faulty sound: ",fallback )
  }
}
 
const video = document.getElementById("video")

async function playVideo() {
   const query = ["nature", "calm", "rain", "ocean", "sea", "mountain"]
  try {
    if (!navigator.onLine) throw new Error("Offline");
    const res = await fetch(`${CONFIG.VIDEO_API.URL}?query=${query[Math.floor(Math.random()*query.length)]}&orientation=landscape&per_page=20`, {
      headers: {
        Authorization: CONFIG.VIDEO_API.KEY
      }
    })
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
    const videoData = await res.json()
    const videoFile = videoData.videos[Math.floor(Math.random() * videoData.videos.length)].video_files.find(v => v.quality === "hd" || v.quality === "sd" || v.quality === null)
    //if(!videoFile) throw new Error("No suitable video found")
    const videoUrl = videoFile.link
     
    video.src = videoUrl
    video.muted = true
    video.loop = true
    await video.play()
  } catch (e) {
    const v= CONFIG.VIDEO_API.FALLBACK_VIDEOS[Math.floor(Math.random()*CONFIG.VIDEO_API.FALLBACK_VIDEOS.length)]
    video.src=`videos/${v}`
    video.muted=true
    video.loop=true
    video.play()
    console.error("Error loading video", e)
  }
}
let timerInterval
let totalSecs
let sessionStartTime

function startMeditation() {
  document.getElementById("main-container").style.display = "none"
  document.getElementById("sessionlog").style.display="none"
  document.getElementById("meditation-container").style.display = "flex"
  clearInterval(timerInterval)
  totalSecs = totalSeconds
  if (totalSecs === 0) totalSecs = 60
  sessionStartTime = Date.now()
  playSound()
  playVideo()
  updateTimerDisplay(totalSecs)
  timerInterval = setInterval(() => {
    totalSecs--
    if (totalSecs < 0) {
      clearInterval(timerInterval)
      saveSession(totalSeconds,"completed",totalSeconds)
      endMeditation()
      return
    }
    updateTimerDisplay(totalSecs)
  }, 1000)
}

function updateTimerDisplay(secondsLeft) {
  const hours = Math.floor(secondsLeft / 3600)
  const minutes = Math.floor((secondsLeft % 3600) / 60)
  const seconds = secondsLeft % 60
  document.getElementById("showtimer").innerText = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`
}

function skipSession() {
  clearInterval(timerInterval)
  const timeElapsed = Math.floor((Date.now() - sessionStartTime) / 1000)
  saveSession(totalSeconds, "skipped", timeElapsed)
  
  const audio = document.getElementById("player");
  if (audio) audio.pause();
  const video = document.getElementById("video");
  if (video) video.pause();
  
  document.getElementById("meditation-container").style.display = "none";
  document.getElementById("container").style.display = "flex";
}

function endMeditation() {
  document.getElementById("showtimer").innerText = "00:00:00"
  const audio = document.getElementById("player")
  if (audio) audio.pause()
  const video = document.getElementById("video")
  if (video) video.pause()
  document.getElementById("meditation-container").style.display = "none"
  document.getElementById("sessionlog").style.display="none"
  document.getElementById("top-bar").style.display="none"
 document.getElementById("background").style.display="none"
   
//  document.getElementById("background").play()
const quoteContainer=document.getElementById("end-quote")
const endQuote=CONFIG.END_QUOTE.QUOTES[Math.floor(Math.random()*CONFIG.END_QUOTE.QUOTES.length)]
quoteContainer.innerText=endQuote
quoteContainer.style.transition="0.3s ease-in-out"
  document.getElementById("complete-meditation-container").style.display = "flex"
  
  setTimeout(() => {
    document.getElementById("complete-meditation-container").style.display = "none"
    document.getElementById("background").style.display="flex"
    document.getElementById("background").play()
    document.getElementById("top-bar").style.display="flex"
    document.getElementById("container").style.display = "flex"
    
  }, 5000)
}

function saveSession(timeset, status, timeelapsed) {
  const session = {
    timeset,
    status,
    timeelapsed,
    date: new Date().toLocaleString()
  }
  sessionHistory.push(session)
  localStorage.setItem("sessionHistory", JSON.stringify(sessionHistory))
}
let chartInstance
function updatePieChart() {
   const history=JSON.parse(localStorage.getItem("sessionHistory"))||[]
   const completed=history.filter(s=>s.status==="completed").length
   const skipped=history.filter(s=>s.status==="skipped").length
   const ctx=document.getElementById("progressChart").getContext("2d")
   if(chartInstance) chartInstance.destroy()
   chartInstance=new Chart(ctx,{
     type:'pie',
     data:{
       labels:['Completed','Skipped'],
       datasets:[
         {
           data:[completed,skipped],
           backgroundColor:['#4ade80','#f87171']
         }
       ]
     },
     options:{
       responsive:false,
       plugins:{
         legend:{
           position:'bottom'
         }
       }
     }
  } )
}
 
 window.startMainContainer = startMainContainer;
window.openContainer = openContainer;
window.showPreviousSessions = showPreviousSessions;
window.filterSessions = filterSessions;
window.clearHistory = clearHistory;
window.setTheMinutes = setTheMinutes;
window.startMeditation = startMeditation;
window.skipSession = skipSession;