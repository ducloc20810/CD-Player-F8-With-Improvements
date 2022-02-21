const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "MY_MP3_PLAYER";

const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const player = $(".player");
const playlist = $(".playlist");
const progress = $(".progress");
const progressValue = $(".progress");

const durationTimeElement = $(".duration-Time");
const currentTimeElement = $(".current-Time");

const playBtn = $(".btn-toggle-play");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const volumeBlock = $(".volume");
const volumeBar = $(".volume__control");
const volumeIconNormal = $(".volume__icon--normal");
const volumeIconMute = $(".volume__icon--mute");
const formatTime = (second) => {
  const newSecond = Math.floor(second);

  const minutes = Math.floor(newSecond / 60);
  let seconds = newSecond % 60;

  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return `${minutes}:${seconds}`;
};

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  prevSongTime: 0,
  volume: 50,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

  setConfig(key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },

  songs: [
    {
      name: "Gieo quẻ",
      singer: "Hoàng Thuỳ Linh",
      path: "https://c1-ex-swe.nixcdn.com/NhacCuaTui1025/GieoQue-HoangThuyLinhDen-7125031.mp3?st=HwktJUabY9_PuIWDKc-H4A&e=1645410282&download=true",
      image:
        "https://avatar-nct.nixcdn.com/song/2021/12/31/5/e/3/2/1640937980335.jpg",
    },
    {
      name: "Ghé qua",
      singer: "Dick, Tofu, PC",
      path: "https://c1-ex-swe.nixcdn.com/NhacCuaTui955/GheQua-DickTofuPC-5308038.mp3?st=ZChVSU_AokuDaOqWi-DPAg&e=1645247892&download=true",
      image:
        "https://avatar-nct.nixcdn.com/singer/avatar/2019/05/23/7/e/0/0/1558593090238.jpg",
    },
    {
      name: "Sống cho hết đời thanh xuân",
      singer: "Bạn có tài mà",
      path: "https://c1-ex-swe.nixcdn.com/NhacCuaTui1009/SongChoHetDoiThanhXuan31-BanCoTaiMa-6895737.mp3?st=yRWnlypU8O16zfSLxPxBog&e=1645172765&download=true",
      image:
        "https://avatar-nct.nixcdn.com/song/2020/12/25/a/d/0/1/1608883809621.jpg",
    },
    {
      name: "6h chill",
      singer: "Bạn có tài mà",
      path: "https://c1-ex-swe.nixcdn.com/NhacCuaTui1007/6hChill-DickRonPhanXamChucHyKeyVNKhoMe-6836679.mp3?st=9pi9TtTFXhIwPUe2iTAezA&e=1645420306&download=true",
      image:
        "https://avatar-nct.nixcdn.com/song/2020/11/22/f/0/8/5/1606027761339.jpg",
    },
    {
      name: "Sống cho hết đời thanh xuân 2",
      singer: "Bạn có tài mà, Tây Nguyên Sound",
      path: "https://c1-ex-swe.nixcdn.com/NhacCuaTui993/SongChoHetDoiThanhXuan2-BCTMTNS-6176212.mp3?st=C2gxoo5xOtwNEuLHfMAidg&e=1645420386&download=true",
      image:
        "https://avatar-nct.nixcdn.com/song/2019/12/13/7/0/e/8/1576229989609.jpg",
    },

    {
      name: "Dù anh có đứng lại",
      singer: "JustaTee, Big Daddy",
      path: "https://c1-ex-swe.nixcdn.com/NhacCuaTui922/DuAnhCoDungLai-JustaTeeBigDaddy-4406546.mp3?st=S37JcXSX46fZGougw1Aagw&e=1645134724&download=true",
      image:
        "https://avatar-nct.nixcdn.com/song/2017/12/06/8/d/5/c/1512531826989.jpg",
    },
  ],

  //   Render function
  render() {
    const htmls = this.songs
      .map(
        (song, index) =>
          ` <div class="song ${
            index === this.currentIndex ? "active" : ""
          }" id=${index}>
          <div
            class="thumb"
            style="
              background-image: url('${song.image}');
            "
          ></div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>`
      )
      .join("");
    playlist.innerHTML = htmls;
  },

  //   Handle Event Function
  handleEvent() {
    const cdWidth = cd.offsetWidth;
    const _this = this;

    // Quay/ Dừng đĩa
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, //10s
      iterations: Infinity,
    });

    cdThumbAnimate.pause();

    // Khi người dùng scroll
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      const newCDWidth = cdWidth - scrollTop;

      cd.style.width = newCDWidth > 0 ? newCDWidth + "px" : 0;
      cd.style.opacity = newCDWidth / cdWidth;
    };

    // Bật / Tắt repeat
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      this.classList.toggle("active", _this.isRepeat);

      _this.setConfig("isRepeat", _this.isRepeat);
    };

    // Khi người dùng bấm nút play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else audio.play();
    };

    // Khi người dùng bấm nút bài tiếp theo
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      progress.value = 0;
      audio.play();

      _this.scrollToActiveSong();
    };

    // Khi người dùng bấm nút bài trước đó
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      progress.value = 0;
      audio.play();

      _this.scrollToActiveSong();
    };

    // Xử lí trộn bài hát
    randBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randBtn.classList.toggle("active", _this.isRandom);

      _this.setConfig("isRandom", _this.isRandom);
    };

    // Khi bài hát được play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // Khi bài hát bị pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // Khi tua
    progress.oninput = function () {
      this.style.backgroundSize = this.value + "% 100%";
      audio.currentTime = Math.floor((this.value * audio.duration) / 100);
    };

    // Khi bài hát đang play
    audio.ontimeupdate = function () {
      const currentTime = this.currentTime;
      const percent = Math.floor((currentTime * 100) / audio.duration);
      if (audio.duration) {
        progress.value = percent;
        progress.style.backgroundSize = percent + "% 100%";
      }

      const renderTime = formatTime(currentTime);
      currentTimeElement.innerText = renderTime;
    };

    // Kiểm tra nếu audio sẵn sàng để chạy
    audio.oncanplay = function () {
      const duration = formatTime(this.duration);
      durationTimeElement.innerText = duration;

      if (_this.prevSongTime) {
        this.currentTime = _this.prevSongTime;
        _this.prevSongTime = 0;
      }

      this.volume = _this.volume / 100;
    };

    // Chuyển bài khi bài hát hiện tại kết thúc
    audio.onended = function () {
      if (_this.isRepeat) _this.loadCurrentSong();
      else if (_this.isRandom) _this.playRandomSong();
      else _this.nextSong();
      progress.value = 0;
      audio.play();
    };

    // Xử lí lắng nghe click vào playlist
    playlist.onclick = function (e) {
      const clickSong = e.target.closest(".song:not(.active)");
      const clickOption = e.target.closest(".option");
      if (clickSong || clickOption) {
        // Xử lí khi bấm vào song
        if (clickSong && !clickOption) {
          _this.currentIndex = clickSong.id;
          _this.loadCurrentSong();
          audio.play();
          return;
        }

        // Xử lí khi bấm vào option
        if (clickOption) {
        }
      }
    };

    // Xử lí khi người dùng refresh hoặc đóng trang
    window.onbeforeunload = function () {
      _this.setConfig("currentIndex", _this.currentIndex);
      _this.setConfig("prevSongTime", audio.currentTime);
    };

    // Xử lí thay đổi âm lượng
    volumeBar.oninput = function () {
      audio.volume = this.value / 100;

      _this.setConfig("volume", this.value);
    };

    // Mute âm lượng
    volumeIconNormal.onclick = function () {
      _this.volume = 0;
      audio.volume = _this.volume / 100;
      volumeBlock.classList.toggle("mute", !_this.volume);
      volumeBar.value = 0;
      _this.setConfig("volume", _this.volume);
    };

    // UnMute âm lượng
    volumeIconMute.onclick = function () {
      _this.volume = 50;
      audio.volume = _this.volume / 100;
      volumeBlock.classList.toggle("mute", !_this.volume);
      volumeBar.value = 50;
      _this.setConfig("volume", _this.volume);
    };
  },

  defineProperties() {
    // this.currentSong = this.songs[this.currentIndex];

    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  nextSong() {
    this.currentIndex =
      this.currentIndex === this.songs.length - 1 ? 0 : ++this.currentIndex;

    this.loadCurrentSong();
    this.render();
  },

  prevSong() {
    this.currentIndex =
      this.currentIndex === 0 ? this.songs.length - 1 : --this.currentIndex;

    this.loadCurrentSong();
    this.render();
  },

  playRandomSong() {
    const temp = this.currentIndex;
    const minRepeatTime = this.songs.reduce((min, song) => {
      return song.repeatTime < min ? song.repeatTime : min;
    }, this.songs[0].repeatTime);

    do {
      this.currentIndex = Math.floor(Math.random() * this.songs.length);
    } while (
      this.currentIndex === temp ||
      this.currentSong.repeatTime > minRepeatTime
    );

    this.loadCurrentSong();
    this.render();
  },

  loadCurrentSong() {
    heading.innerText = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.currentSong.path;

    const currentSong = document.querySelector(
      `.playlist .song[id = "${this.currentIndex}"]`
    );

    if (this.currentSong?.repeatTime) {
      this.currentSong.repeatTime++;
    } else {
      Object.defineProperty(this.currentSong, "repeatTime", {
        value: 1,
        writable: true,
      });
    }

    const activeSong = document.querySelector(`.playlist .active`);
    currentSong.classList.toggle("active");

    if (activeSong) activeSong.classList.toggle("active");
  },

  scrollToActiveSong() {
    const activeSong = $(".song.active");
    // console.log(isInViewPort(activeSong));
    setTimeout(() => {
      activeSong.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 200);
    if (isInViewPort(activeSong)) {
      setTimeout(() => {
        window.scrollTo({
          top: activeSong.offsetTop,
          behavior: "smooth",
        });
      }, 200);
    }
  },

  loadConfig() {
    this.isRandom = this.config.isRandom || false;
    this.isRepeat = this.config.isRepeat || false;

    this.currentIndex = this.config.currentIndex || 1;
    this.prevSongTime = this.config.prevSongTime || 0;
    this.volume = this.config.volume || 50;
  },

  //   Main function
  start() {
    // Tải lại config
    this.loadConfig();

    //  Định nghĩa thuộc tính cho object getter
    this.defineProperties();

    // Định nghĩa các event
    this.handleEvent();

    // Render playlist
    this.render();

    // Tải bài hát hiện tại vào UI
    this.loadCurrentSong();

    repeatBtn.classList.toggle("active", this.isRepeat);
    randBtn.classList.toggle("active", this.isRandom);
    volumeBar.value = this.volume;
  },
};

function isInViewPort(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
app.start();
