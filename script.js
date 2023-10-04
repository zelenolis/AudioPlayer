const playlist = [
	{
		name: "Monkey Doo - People are strange",
		artist: "Monkey Doo",
		title: "People are strange",
		path: "assets/Monkey Doo - People are strange.mp3",
		cover: "assets/monkey.jpg"
	}, 
	{
		name: "Goymamba - Reggae life",
		artist: "Goymamba",
		title: "Reggae life",
		path: "assets/Goymamba - Reggae life.mp3",
		cover: "assets/goymamba.jpg"
	}, 
	{
		name: "Amor de Lejos - Romance language",
		artist: "Amor de Lejos",
		title: "Romance language",
		path: "assets/Amor de Lejos - Romance language.mp3",
		cover: "assets/amor.jpg"
	}]


// setting footer margins after loading page

window.addEventListener('load', (e) => {
	const playerFrame = document.querySelector('.player');
	const footer = document.querySelector('footer');
	const playerPosition = playerFrame.getBoundingClientRect();
	footer.style = `padding: 0 0 ${playerPosition.height}px 0;`;
});


let currentAudioCounter = 0; // serial number of song in playlist's array currently playing

const currentAudio = document.querySelector('#audio');
const progressSeek = document.querySelector('.player__progress'); //click to change the progress
const progressBar = document.querySelector(".player__progress_current"); //display progress of playing song
const playButton = document.querySelector('.player__play');
const playButtonImage = document.querySelector('.player__play_front');
playButton.addEventListener('click', togglePlay);
currentAudio.addEventListener("timeupdate", audioProgress);
currentAudio.addEventListener("ended", songEnded);
progressSeek.addEventListener("click", rewindProgress);


// Main function start and stop playing

function togglePlay() {
	if (currentAudio.paused) {
		changeTags();
		currentAudio.play();
		playButtonImage.src = "assets/pause.png";
	} else {
		currentAudio.pause();
		playButtonImage.src = "assets/play.png";
	}
};


// Change displayed in player song's tags

function changeTags() {
	const songArtist = document.querySelector('.player__artist');
	const songName = document.querySelector('.player__songname');
	songArtist.innerText = playlist[currentAudioCounter]["artist"];
	songName.innerText = playlist[currentAudioCounter]["title"];
	currentAudio.addEventListener("loadedmetadata", setAudioDuration);
}

function setAudioDuration() {
	const songDuration = document.querySelector('.player__progress_right');
	let remainder = Math.round(currentAudio.duration % 60);
	let songLength = Math.floor(currentAudio.duration / 60) + remainder / 100;
	songDuration.innerText = songLength.toFixed(2);
	currentAudio.removeEventListener("loadedmetadata", setAudioDuration);
}

// Progress of songs and audio bar

function audioProgress() {
	let audioLength = currentAudio.duration;
	let currentLength = currentAudio.currentTime;
	let progress = Math.round(currentLength * 100 / audioLength);
	progressBar.setAttribute(`style`,`width: ${progress}%`);

	const timeStamp = document.querySelector('.player__progress_left');
	let secs = Math.round(currentLength % 60);
	let minutes = Math.floor(currentLength / 60) + secs / 100;
	timeStamp.innerText = minutes.toFixed(2);
}

function songEnded() {
	playNext();
}

function rewindProgress(e) {
	let rect = e.target.getBoundingClientRect();
	let x = e.clientX - rect.left;
	let maxValue = getComputedStyle(progressSeek).width;
	let max = maxValue.slice(0, maxValue.length - 2)
	let percent = Math.round(x * 100 / +max);

	let audioLength = currentAudio.duration;
	let audioRewind = audioLength * percent / 100;
	currentAudio.currentTime = audioRewind;
}

function addMusic(input) {
	for (let i = 0; i < input.files.length; i++) {
		let fType = input.files[i].name.slice(input.files[i].name.length - 4, input.files[i].name.length);
		if (fType !== ".mp3") {continue;}

		let obj = {};

		// reading tags
		jsmediatags.read(input.files[i], {
			onSuccess: function(tag) {
				obj["artist"] = tag["tags"]["artist"];
				obj["title"] = tag["tags"]["title"];
				obj["name"] = tag["tags"]["artist"] + ' - ' + tag["tags"]["title"];
				obj["path"] = URL.createObjectURL(input.files[i]);
				
				const { data, format } = tag.tags.picture;
				let base64String = "";
				for (let k = 0; k < data.length; k++) {
					base64String += String.fromCharCode(data[k]);
				}

				obj["cover"] = `data:${data.format};base64,${window.btoa(base64String)}`;

				playlist.push(obj);

			},
			onError: function(error) {
				console.log(`Error: ${error}`);
				addMusicWithoutTags(input.files[i]);
			}
		});

	}
}

function addMusicWithoutTags(element) {
	let obj = {};
	obj["artist"] = 'Unknown Artist';
	obj["title"] = 'Unknown Title';
	obj["name"] = 'Unknown Artist - Unknown Title';
	obj["path"] = URL.createObjectURL(element);
	playlist.push(obj);
}


// random on-off
const random = document.querySelector(".player__control_random");
random.addEventListener("click", randomOn);

function randomOn() {
	random.classList.contains("opacity") ? random.classList.remove("opacity") : random.classList.add("opacity");
}

// next and previous songs controls
const nextSong = document.querySelector(".player__next");
const previousSong = document.querySelector(".player__previous");
nextSong.addEventListener("click", playNext);
previousSong.addEventListener("click", playPrevious);

function playNext() {
	if (random.classList.contains("opacity")) {
		currentAudioCounter +=1;
		if (currentAudioCounter > playlist.length - 1) {
			currentAudioCounter = 0;
		}

		//
		// select this if playlist was uploaded
		//
		// currentAudio.src = URL.createObjectURL(playlist[currentAudioCounter]);

		currentAudio.src = playlist[currentAudioCounter]["path"];
		addCover(currentAudioCounter);

		togglePlay();
	} else {
		let rnd = Math.round(Math.random() * playlist.length);

		//
		// select this if playlist was uploaded
		//
		//currentAudio.src = URL.createObjectURL(playlist[rnd]);

		currentAudio.src = playlist[rnd]["path"];
		addCover(rnd);

		console.log(`random number from forward: ${rnd}`);
		togglePlay();
	}
}

function playPrevious() {
	if (random.classList.contains("opacity")) {
		currentAudioCounter -=1;
		if (currentAudioCounter < 0) {
			currentAudioCounter = playlist.length - 1;
		}

		//
		// select this if playlist was uploaded
		//
		// currentAudio.src = URL.createObjectURL(playlist[currentAudioCounter]);

		currentAudio.src = playlist[currentAudioCounter]["path"];
		addCover(currentAudioCounter);

		togglePlay();
	} else {
		let rnd = Math.round(Math.random() * playlist.length);

		//
		// select this if playlist was uploaded
		//
		//currentAudio.src = URL.createObjectURL(playlist[rnd]);

		currentAudio.src = playlist[rnd]["path"];
		addCover(rnd);

		console.log(`random number from back: ${rnd}`);
		togglePlay();
	}
}

// adding album cover to player 

function addCover(num) {
	const playerCover = document.querySelector(".player__cover");

	if (playlist[num]["cover"]) {
		playerCover.src = playlist[num]["cover"];
	} else {
		let rnd = 1 + Math.round(Math.random() * 4); // Making random 1-5 number. 
		                                             //If song hasnt their cover there is five images available for replacement
		playerCover.src = `assets/cover${rnd}.jpeg`;
	}
}


// Playlist menu open

const playListMenu = document.querySelector('.player__control_list');
const playlistOpen = document.querySelector('.player__playlist');
const playlistClose = document.querySelector('.player__playlist_close');
playListMenu.addEventListener('click', playListMenuOpen);
playlistClose.addEventListener('click', playListMenuClose);


function playListMenuOpen() {
	const menuLength = document.querySelector(".player__control");
	const menuRect = menuLength.getBoundingClientRect();

	playlistOpen.style.cssText = `
	height: ${menuRect.bottom - menuRect.top}px;
	width: ${menuRect.right - menuRect.left}px;
	`;
	playlistClose.classList.remove('nodisplay');
	songsList();
}

// Playlist menu close

function playListMenuClose() {
	const menuLength = document.querySelector(".player__control");
	const menuRect = menuLength.getBoundingClientRect();

	playlistOpen.style.cssText = `
	height: ${menuRect.bottom - menuRect.top}px;
	width: 0;
	transition: 0.5s;
	`;

	removePlayFrom()
	const songs = document.querySelector('.songs_list');
	songs.innerHTML = '';
	playlistClose.classList.add('nodisplay');
}

// adding songs list to playlist menu when opened

function songsList() {
	const songs = document.querySelector('.songs_list');
	const fragment = document.createDocumentFragment();

	for (let i = 0; i < playlist.length; i++) {
		const li = document.createElement("li");
		const img = document.createElement("img");
		img.src = 'assets/delete.png';
		img.classList.add("player__playlist_delete");
		li.textContent = playlist[i].name;
		li.classList.add(`song__number`);
		li.setAttribute("index", i);
		li.appendChild(img);
		fragment.appendChild(li);
	}
	songs.appendChild(fragment);

	playlistHighlight();
	startPlayFrom();
}

// add interactive to songs in playlist

function startPlayFrom() {
	const allSongs = document.querySelectorAll('.song__number');
	allSongs.forEach((e) => e.addEventListener('click', playFrom));
}
function removePlayFrom() {
	const allSongs = document.querySelectorAll('.song__number');
	allSongs.forEach((e) => e.removeEventListener('click', playFrom));
}

function playFrom(event) {
	//player__playlist_delete
	if (event.target.classList.contains('player__playlist_delete')) {
		del = this.getAttribute("index");
		deleteFromPlaylist(del);
		return;
	}
	currentAudioCounter = +this.getAttribute("index");

	currentAudio.src = playlist[currentAudioCounter]["path"];
	addCover(currentAudioCounter);

	playlistHighlight();
	togglePlay();
}

// highlighting current song in playlist

function playlistHighlight() {
	const allSongs = document.querySelectorAll('.song__number');
	allSongs.forEach((e) => e.classList.remove('songs_list_playing'));
	allSongs[currentAudioCounter].classList.add('songs_list_playing');
}

// Delete from playlist 
function deleteFromPlaylist(del) {
	playlist.splice(del, 1);
	if (currentAudioCounter === del) {
		currentAudioCounter -=1;
		if (currentAudioCounter < 0) {
			currentAudioCounter = 0;
		}
	}
	let deleted = document.querySelector(`[index="${del}"]`);
	removePlayFrom();
	deleted.remove();
	changeSongsIndex();
	startPlayFrom();
}

// Change song Indexes after deleting

function changeSongsIndex() {
	const allSongs = document.querySelectorAll('.song__number');
	for (let i = 0; i < allSongs.length; i++) {
		allSongs[i].setAttribute("index", i);
	}
}


// FAQ OPEN - CLOSE

const faqLogo = document.querySelector('.faqLogo');
const faq = document.querySelector('.faq')
faq.addEventListener('click', faqOpen);
faqLogo.addEventListener('click', faqOpen);

function faqOpen() {
	const faq = document.querySelector('.faq')
	faq.classList.toggle('faq__opened');
}

// Tags is here : https://github.com/aadsm/jsmediatags

var jsmediatags = window.jsmediatags;

function readTags() {
	console.log("here!");
	jsmediatags.read(currentAudio.src, {
  onSuccess: function(tag) {
    console.log(tag);
  },
  onError: function(error) {
    console.log(error);
  }
});
}
