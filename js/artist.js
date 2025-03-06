
let artistData = {};
let tracklistData = []; 


const artistId = 1306; 


const fetchArtistData = async (id) => {
    try {
        const response = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${id}`);
        if (!response.ok) {
            throw new Error("Errore nel recupero dei dati dell'artista");
        }
        artistData = await response.json(); 
        console.log("Dati dell'artista ricevuti:", artistData);
        
        
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

        
        renderTracklist();
    } catch (error) {
        console.error("Errore durante il fetch della tracklist:", error);
    }
};


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

    tracklistData.slice(0, 5).forEach((track, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td><img src="${track.album.cover_small}" alt="Album Cover" class="album-cover"></td>
                <td>${track.title}</td>
                <td>#${track.id}</td>
                <td>${Math.floor(track.duration / 60)}:${String(track.duration % 60).padStart(2, "0")}</td>
            </tr>
        `;
        trackList.innerHTML += row;
    });
};


fetchArtistData(artistId);
