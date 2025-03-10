const endPoint ="https://striveschool-api.herokuapp.com/api/deezer/search?q=queen"

const albumEndPoint = "https://striveschool-api.herokuapp.com/api/deezer/Album"


const sectionHero = document.getElementById("heroHome")
const sectionlistAlbum = document.getElementById("listAlbum")




async function getAlbum() {
    try{
        const res = await fetch(endPoint)
        const json = await res.json()
        const data = await json.data

        console.log(data)
        filterAlbum(data)
        hero(data)

    }catch (err){
        console.log(err)
    }
    
}


function filterAlbum(album) {
    let listAlbum = [...album];


    const seen = new Set();

    const albumFiltered = listAlbum.filter(item => {

        if (!seen.has(item.album.id)) {
            seen.add(item.album.id)
            return true
        }
        return false
    });

    renderAlbums(albumFiltered)
}

function renderAlbums(list){
    sectionlistAlbum.innerHTML =""
    const listAlbum = list.map(el => createCard(el.album))
    
    sectionlistAlbum.append( ...listAlbum)

}


function createCard({title, cover, id}){
    let track = 0
    
    let col = createDiv()
    col.classList.add("col-12", "col-md-4","col-lg-3","col-xl-2", "mb-3", "pt-3", "pt-md-0")


    let divRowCard = createDiv()
    divRowCard.classList.add("row")

    let colImg =  document.createElement("a")
    colImg.classList.add("col-6", "col-md-12" )
    colImg.setAttribute("href", `album.html?q=${id}`)


    let image = document.createElement("img")
    image.setAttribute("src", cover)


    let colText =  createDiv()
    colText.classList.add("col", "col-md-12")

    let strAlbum = document.createElement("span")
    strAlbum.innerText ="ALBUM"


    let titleAlbum = document.createElement("p")
    titleAlbum.innerText = title
    titleAlbum.classList.add("mt-2")

    let colMobile = createDiv()
    colMobile.classList.add("col-12", "justify-content-between","align-items-center", "colMobile")


    let contIcon = createDiv()
    contIcon.classList.add( "p-2", "d-flex", "gap-3", "iconMobile")

    let likeIcon = document.createElement("button")
    likeIcon.innerHTML = "<i class='bi bi-heart'></i>"
    likeIcon.addEventListener("click", ()=>{
        
        likeIcon.querySelector("i"). classList.toggle("bi-heart-fill")
        likeIcon.classList.toggle("like")
        likeIcon.querySelector("i"). classList.toggle("bi-heart")
    })

    let menuIcon = document.createElement("button")
    menuIcon.innerHTML= '<i class="bi bi-three-dots-vertical"></i>'

    let contTrack = createDiv()
    contTrack.classList.add("d-flex", "gap-3", "align-items-center")

    let nTrack = document.createElement("span")
    nTrack.innerText = track + " brani"

    let buttonPlay = document.createElement("button")
    buttonPlay.classList.add("playAlbum")
    buttonPlay.innerHTML ='<i class="bi bi-play-fill"></i>'

    contTrack.append(nTrack, buttonPlay)
    contIcon.append(likeIcon, menuIcon)
    colMobile.append(contIcon, contTrack)
    colText.append(strAlbum, titleAlbum)
    colImg.appendChild(image)
    divRowCard.append(colImg, colText, colMobile)
    col.append(divRowCard)
    return col

}

function hero(albums){

    let array = [...albums]

    let count = Math.floor(Math.random()*array.length)
    console.log(count)
    
    let contImgHero = createDiv()
    contImgHero.classList.add("d-flex", "justify-content-center", "align-items-center", "ps-2", "pe-3","py-3")


    let imgHero = document.createElement("img")
    imgHero.setAttribute("src", albums[count].album.cover)

    let contInfoHero = createDiv()
    contInfoHero.classList.add("d-flex", "flex-column", "justify-content-center")


    let spanHero = document.createElement("span")
    spanHero.innerText = "ALBUM"
    spanHero.classList.add("spanHero")

    let titleHero = document.createElement("h2")
    titleHero.innerText = albums[count].album.title
    
    let artistHero = document.createElement("p")
    artistHero.innerText = albums[count].artist.name

    let txtHero = document.createElement("p")
    txtHero.innerText = `Ascolta il nuovo singolo dei ${albums[count].artist.name} `

    let contButtonHero = createDiv()
    contButtonHero.classList.add("d-flex", "gap-2", "mt-2")

    let btnPlayHero = document.createElement("button")
    btnPlayHero.innerText = "Play"
    btnPlayHero.classList.add("btnPlay")


    let btnSaveHero = document.createElement("button")
    btnSaveHero.innerText = "Salva"
    btnSaveHero.classList.add("btnSave")

    contButtonHero.append(btnPlayHero, btnSaveHero)
    contInfoHero.append(spanHero, titleHero, artistHero, txtHero, contButtonHero)
    contImgHero.appendChild(imgHero)

    sectionHero.append(contImgHero,contInfoHero)

}


function createDiv(){
    let div = document.createElement("div")
    return div
}




getAlbum()


