
let artistData = {};


const fetchArtistData = async (id) => {
    try {
        const response = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${id}`);
        if (!response.ok) {
            throw new Error("Errore nel recupero dei dati dell'artista");
        }
        artistData = await response.json();
        console.log("Dati dell'artista ricevuti:", artistData);
        renderArtistData();
    } catch (error) {
        console.error("Errore durante il fetch:", error);
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
    // document.querySelector("artist-logo me-3").style.backgroundImage = `url(${artistData.picture_small})`

    const trackList = document.querySelector(".table tbody");
    trackList.innerHTML = "";


    
    fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${artistData.id}/top?limit=5`)
        .then(response => response.json())
        .then(data => {
            console.log("Top 5 Tracce ricevute:", data);
            data.data.forEach((track, index) => {
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
        })
        .catch(error => console.error("Errore nel recupero delle tracce:", error));
};


fetchArtistData(2252);
