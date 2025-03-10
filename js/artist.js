
let artistData = {};
let tracklistData = [];

const artistId = 763;


const audioPlayer = document.getElementById("audioPlayer");
const audioSource = document.getElementById("audioSource");
const playPauseBtn = document.getElementById("playPauseBtn");
const progressBar = document.getElementById("progressBar");
const volumeControl = document.getElementById("volumeControl");
const trackTitle = document.getElementById("trackTitle");
const trackArtist = document.getElementById("trackArtist");
const trackCover = document.getElementById("trackCover");
const currentTimeDisplay = document.getElementById("currentTime");
const trackDurationDisplay = document.getElementById("trackDuration");




const fetchArtistData = async (id) => {
    try {
        const response = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${id}`);
        if (!response.ok) {
            throw new Error("Errore nel recupero dei dati dell'artista");
        }
        artistData = await response.json();
        console.log("Dati dell'artista ricevuti:", artistData);

        
        // Aggiorniamo il nome dell'artista all'interno di <p class="artist-info">
        const artistInfoParagraph = document.querySelector(".artist-info");
        if (artistInfoParagraph) {
            artistInfoParagraph.innerHTML = `di <strong>${artistData.name}</strong>`; // Aggiunge il nome accanto a "di"
        }  
        
         // Aggiorniamo l'immagine dell'artista in trackCover
         const trackCover = document.getElementById("trackCover");
         if (trackCover) {
             trackCover.src = artistData.picture_big; // Usa l'immagine grande dell'artista
             trackCover.alt = `Cover di ${artistData.name}`;
         }       
        

        fetchTracklist(artistData.tracklist);


        renderArtistData();
    } catch (error) {
        console.error("Errore durante il fetch dell'artista:", error);
    }
};


const fetchTracklist = async (tracklistUrl) => {
    try {
        const response = await fetch(tracklistUrl);
        if (!response.ok) {
            throw new Error("Errore nel recupero della tracklist");
        }
        const data = await response.json();
        tracklistData = data.data;
        console.log("Top Tracce ricevute:", tracklistData);

        updateFirstTrackInfo();

        renderTracklist();
    } catch (error) {
        console.error("Errore durante il fetch della tracklist:", error);
    }
};

const updateFirstTrackInfo = () => {
    if (tracklistData.lenght > 0) {
        const firstTrack = tracklistData[0];

        const trackCover = document.getElementById("trackCover");
        if (trackCover) {
            trackCover.src = firstTrack.album.cover_big;
            trackCover.alt = `Cover di ${firstTrack.title}`;
        }

        document.getElementById("trackTitle").innerText = firstTrack.title;
        document.getElementById("trackArtist").innerText = firstTrack.artist;

    }
}

const renderArtistData = () => {
    if (!artistData || !artistData.id) {
        console.error("Nessun dato disponibile per l'artista");
        return;
    }


    document.querySelector(".hero").style.backgroundImage = `url(${artistData.picture_xl})`;
    document.querySelector(".hero h1").innerText = artistData.name;
    document.querySelector(".hero p").innerText = `${artistData.nb_fan.toLocaleString()} ascoltatori mensili`;


    const artistLogo = document.querySelector(".artist-logo");
    if (artistLogo) {
        artistLogo.src = artistData.picture;
        artistLogo.alt = `Foto di ${artistData.name}`;
    }
};


const renderTracklist = () => {
    const trackList = document.querySelector(".table tbody");
    trackList.innerHTML = "";

    tracklistData.slice(0, 20).forEach((track, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td><img src="${track.album.cover_small}" alt="Album Cover" class="album-cover"></td>
            <td>${track.title}</td>
            <td>#${track.id}</td>
            <td>${Math.floor(track.duration / 60)}:${String(track.duration % 60).padStart(2, "0")}</td>
        `;

        row.addEventListener("click", () => {
            playTrack(track);
        });
        trackList.appendChild(row);
    });
};

// Funzione per riprodurre una traccia e aggiorna playbar
const playTrack = (track) => {

    const audioPlayer = document.getElementById("audioPlayer");
    const audioSource = document.getElementById("audioSource");
    const trackTitle = document.getElementById("trackTitle");
    const trackArtist = document.getElementById("trackArtist");
    const trackCover = document.getElementById("trackCover");
    const playPauseBtn = document.getElementById("playPauseBtn");   

    audioSource.src = track.preview; // Usa l'URL della traccia da Deezer
    trackTitle.innerText = track.title;
    trackArtist.innerText = track.artist.name;
    trackCover.src = track.album.cover_small;


    audioPlayer.load();
    audioPlayer.play();
    playPauseBtn.innerHTML = '<i class="bi bi-pause-circle-fill"></i>';
};

// Aggiungiamo un event listener al bottone Play per riprodurre la prima traccia
document.getElementById("playBtn").addEventListener("click", () => {
    if (tracklistData.length > 0) {
        playTrack(tracklistData[0]); // Riproduce la prima traccia
    }
});


// Controllo Play/Pause
document.getElementById("playPauseBtn").addEventListener("click", () => {
    const audioPlayer = document.getElementById("audioPlayer");
    const playPauseBtn = document.getElementById("playPauseBtn");

    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.innerHTML = '<i class="bi bi-pause-circle-fill"></i>';
    } else {
        audioPlayer.pause();
        playPauseBtn.innerHTML = '<i class="bi bi-play-circle-fill"></i>';
    }
});

// Aggiorna la barra di avanzamento
audioPlayer.addEventListener("timeupdate", () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.value = progress;
    currentTimeDisplay.innerText = formatTime(audioPlayer.currentTime);
    trackDurationDisplay.innerText = formatTime(audioPlayer.duration);
});

// Controllo manuale della barra di avanzamento
progressBar.addEventListener("input", () => {
    audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
});

// Controllo del volume
volumeControl.addEventListener("input", () => {
    audioPlayer.volume = volumeControl.value;
});

// Funzione per formattare il tempo in MM:SS
const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
};



fetchArtistData(artistId);
