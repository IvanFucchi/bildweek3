// Variabile globale per salvare i dati dell'artista
let artistData = {};
let tracklistData = []; // Variabile per salvare le tracce

// ID dell'artista (può essere modificato dinamicamente)
const artistId = 2252; // Cambialo dinamicamente se necessario

// Funzione per recuperare i dati dell'artista
const fetchArtistData = async (id) => {
    try {
        const response = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${id}`);
        if (!response.ok) {
            throw new Error("Errore nel recupero dei dati dell'artista");
        }
        artistData = await response.json(); // Salviamo i dati dell'artista
        console.log("Dati dell'artista ricevuti:", artistData);
        
        // Dopo aver ottenuto i dati dell'artista, facciamo la fetch delle tracce
        fetchTracklist(artistData.tracklist);
        
        // Renderizza la hero section
        renderArtistData(); 
    } catch (error) {
        console.error("Errore durante il fetch dell'artista:", error);
    }
};

// Funzione per recuperare la tracklist
const fetchTracklist = async (tracklistUrl) => {
    try {
        const response = await fetch(tracklistUrl);
        if (!response.ok) {
            throw new Error("Errore nel recupero della tracklist");
        }
        const data = await response.json();
        tracklistData = data.data; // Salviamo la lista delle tracce
        console.log("Top Tracce ricevute:", tracklistData);

        // Renderizza la tabella delle tracce
        renderTracklist();
    } catch (error) {
        console.error("Errore durante il fetch della tracklist:", error);
    }
};

// Funzione per aggiornare la Hero Section
const renderArtistData = () => {
    if (!artistData || !artistData.id) {
        console.error("Nessun dato disponibile per l'artista");
        return;
    }

    // Aggiorna la Hero Section
    document.querySelector(".hero").style.backgroundImage = `url(${artistData.picture_xl})`;
    document.querySelector(".hero h1").innerText = artistData.name;
    document.querySelector(".hero p").innerText = `${artistData.nb_fan.toLocaleString()} ascoltatori mensili`;

    // Aggiorna l'immagine dell'artista nella sezione info
    const artistLogo = document.querySelector(".artist-logo");
    if (artistLogo) {
        artistLogo.src = artistData.picture;
        artistLogo.alt = `Foto di ${artistData.name}`;
    }
};

// Funzione per aggiornare la Tabella delle Tracce
const renderTracklist = () => {
    const trackList = document.querySelector(".table tbody");
    trackList.innerHTML = ""; // Svuotiamo la tabella prima di riempirla

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

// Chiamata alla funzione con l'ID specificato
fetchArtistData(artistId);
