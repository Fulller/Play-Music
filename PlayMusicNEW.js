let $ = document.querySelector.bind(document)
let $$ = document.querySelectorAll.bind(document)
let web = document.documentElement

let player = $('.player')
let playList = $('.playlist')
let cd = $('.cd')
let heading = $('header h2')
let cdThumb = $('.cd-thumb')
let audio = $('#audio')
let repeatBTN = $('.btn-repeat')
let prevBTN = $('.btn-prev')
let playBTN = $('.btn-toggle-play')
let nextBTN = $('.btn-next')
let randomBTN = $('.btn-random')
let progress = $('#progress')
let nowTime = $('#nowtime')
let maxTime = $('#maxtime')
let volume = $('#volume')
let volumeValue = $('#volume-value')

const app = {
    currentIndex: 4,
    isPlay: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
          name: "Bạc Phận",
          singer: "Jack & KayKem",
          path: "./ListAudio/bac_phan.mp3",
          image: "./Thumbnail/bac_phan.jfif"
        },
        {
          name: "Blingding Light",
          singer: "The Weetken",
          path: "./ListAudio/blinding_lights.mp3",
          image:"./Thumbnail/blingding_lights.jfif"
        },
        {
          name: "Chạy ngay đi",
          singer: "Sơn Tùng MTP",
          path: "./ListAudio/chay_ngay_di.mp3",
          image: "./Thumbnail/chay_ngay_di.jfif"
        },
        {
          name: "IceMan",
          singer: "Sol7 & MCK",
          path: "./ListAudio/iceman.mp3",
          image:"./Thumbnail/iceman.jfif"
        },
        {
          name: "Hồng Nhan",
          singer: "Jack",
          path: "./ListAudio/jack_hong_nhan.mp3",
          image: "./Thumbnail/hong_nhan.jfif"
        },
        {
            name: "Nguyên team đi vào hết",
            singer: "Binz",
            path: "./ListAudio/nguyen_team_di_vao_het.mp3",
            image: "./Thumbnail/nguyen_team.jfif"
        },
        {
            name: "Born this way",
            singer: "Vannda",
            path: "./ListAudio/born.mp3",
            image: "./Thumbnail/born.webp"
          },
          {
            name: "Khmer Blood",
            singer: "Vannda",
            path: "./ListAudio/khmer_blood.mp3",
            image:"./Thumbnail/khmre_blood.webp"
          },
          {
            name: "MaMa",
            singer: "Vannda",
            path: "./ListAudio/mama.mp3",
            image: "./Thumbnail/mama.webp"
          },
          {
            name: "Queen Bee",
            singer: "Vannda",
            path: "./ListAudio/queen_bee.mp3",
            image:"./Thumbnail/queen_bee.webp"
          },
          {
            name: "Skull",
            singer: "Vannda",
            path: "./ListAudio/skull.mp3",
            image: "./Thumbnail/skull.webp"
          },
          {
              name: "Young Man",
              singer: "Vannda",
              path: "./ListAudio/young_man.mp3",
              image: "./Thumbnail/young_man.webp"
          },
          {
            name: "Bên trên tầng lầu",
            singer: "Tân dung Tăng",
            path: "./ListAudio/bentrentanglau.mp3",
            image: "./Thumbnail/bentrentanglau.webp"
        },
    ],
    defineProperties: function (){
        Object.defineProperty(this, 'currentSong', {
            get: function (){
                return this.songs[this.currentIndex]
            }
        })
    },
    render: function (){
        let htmls = this.songs.map((song,index)=>{
            return `
            <div class="song ${index === this.currentIndex ? 'active': ''}" data-index="${index}">
            <div class="thumb" style="background-image: url(${song.image})">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            </div>
            `
        })
        playList.innerHTML = htmls.join('')
    },
    loadCurrenSong: function (){
        heading.innerText = this.currentSong.name
        cdThumb.style.backgroundImage= `url(${this.currentSong.image})`
        audio.src = this.currentSong.path

    },
    loadTime: function (){
        let secondNow = Math.floor(audio.currentTime % 60)
        let minuteNow = Math.floor(audio.currentTime / 60)
        if(secondNow < 10 ){
            nowTime.innerText = `${minuteNow}:0${secondNow}`
        }else{
            nowTime.innerText = `${minuteNow}:${secondNow}`
        }
        let secondMax = Math.floor(audio.duration % 60)
        let minuteMax = Math.floor(audio.duration / 60)
        if(secondMax < 10 ){
            maxTime.innerText = `${minuteMax}:0${secondMax}`
        }else{
            maxTime.innerText = `${minuteMax}:${secondMax}`
        }
    },
    handleEvent: function (){
        const thumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'},
        ],
        {
            duration: 3000,
            iterations: Infinity
        }
        )
        thumbAnimate.pause()
        const widthCd = cd.offsetWidth
        document.onscroll = function (){
            let webScrollTop = web.scrollTop
            if(webScrollTop > 200){
                webScrollTop = 200
            }else if (webScrollTop < 0){
                webScrollTop = 0
            }
            let newWidthCd = widthCd - webScrollTop
            cd.style.width = newWidthCd+'px'
        }
        playBTN.onclick = function (){
            if(app.isPlay){
                audio.pause()
            }else{
                audio.play()
            }
        }
        audio.onplay = function (){
            app.isPlay = true
            thumbAnimate.play()
            player.classList.add('playing')
        }
        audio.onpause = function (){
            app.isPlay = false
            player.classList.remove('playing')
            thumbAnimate.pause()
        }
        nextBTN.onclick = function (){
            if(app.isRandom){
                app.randomSong()
            }else{
                app.nextSong()
            }
        }
        prevBTN.onclick = function (){
            if(app.isRandom){
                app.randomSong()
            }else{
                app.prevSong()
            }
        }
        progress.oninput = function (e){
            let percentValue = e.target.value / 100 * audio.duration
            audio.currentTime = percentValue
        }
        audio.ontimeupdate = function (){
            let percentTime = audio.currentTime / audio.duration * 100
            progress.value = percentTime
            app.loadTime()
        }
        randomBTN.onclick = function (){
            if(app.isRandom){
                randomBTN.classList.remove('active')
                app.isRandom = false
            }else{
                randomBTN.classList.add('active')
                app.isRandom = true
            }
        }
        repeatBTN.onclick = function (){
            if(app.isRepeat){
                app.isRepeat = false
                repeatBTN.classList.remove('active')
            }else{
                app.isRepeat = true
                repeatBTN.classList.add('active')
            }
        }
        audio.onended = function (){
            if(app.isRepeat){
                audio.play()
            }else{
                nextBTN.click()
            }
        }
        playList.onclick = function (e){
            const songNode = e.target.closest('.song:not(.active)')
            
            if(songNode){
                app.currentIndex = Number(songNode.dataset.index)
                app.loadCurrenSong()
                audio.play()
                app.render()
            }
        }
        volume.oninput = function (e){
            audio.volume = e.target.value/100
        }
        audio.onvolumechange = function (){
            volumeValue.innerText = Math.ceil(audio.volume*100)
        }
        web.onkeyup = function (e){
            switch(e.which){
                case 32: playBTN.click();break;
                case 37: audio.currentTime = audio.currentTime-10;break;
                case 38: prevBTN.click();break;
                case 39: audio.currentTime = audio.currentTime+10;break;
                case 40: nextBTN.click();break;
                case 48: audio.currentTime =  Math.floor(audio.duration*0/10);break;
                case 49: audio.currentTime =  Math.floor(audio.duration*1/10);break;
                case 50: audio.currentTime =  Math.floor(audio.duration*2/10);break;
                case 51: audio.currentTime =  Math.floor(audio.duration*3/10);break;
                case 52: audio.currentTime =  Math.floor(audio.duration*4/10);break;
                case 53: audio.currentTime =  Math.floor(audio.duration*5/10);break;
                case 54: audio.currentTime =  Math.floor(audio.duration*6/10);break;
                case 55: audio.currentTime =  Math.floor(audio.duration*7/10);break;
                case 56: audio.currentTime =  Math.floor(audio.duration*8/10);break;
                case 57: audio.currentTime =  Math.floor(audio.duration*9/10);break;
            }
        }
    },
    nextSong: function (){
        app.currentIndex++ 
        if(app.currentIndex > app.songs.length){
            app.currentIndex = 0
        }
        app.render()
        app.loadCurrenSong()
        audio.play()
    },
    prevSong: function (){
        app.currentIndex--
        if(app.currentIndex < 0 ){
            app.currentIndex = app.songs.length
        }
        app.render()
        app.loadCurrenSong()
        audio.play()
    },
    randomSong: function (){
        let randomValue
        do{
            randomValue = Math.floor(Math.random()*app.songs.length)
        }while(randomValue === app.currentIndex)
        this.currentIndex = randomValue
        app.loadCurrenSong()
        app.render()
        audio.play()
    },
    start: function () {
        this.defineProperties()
        this.render()
        this.loadCurrenSong()
        this.handleEvent()
    }
}
app.start()