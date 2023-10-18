(g => { var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window; b = b[c] || (b[c] = {}); var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams, u = () => h || (h = new Promise(async (f, n) => { await (a = m.createElement("script")); e.set("libraries", [...r] + ""); for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]); e.set("callback", c + ".maps." + q); a.src = `https://maps.${c}apis.com/maps/api/js?` + e; d[q] = f; a.onerror = () => h = n(Error(p + " could not load.")); a.nonce = m.querySelector("script[nonce]")?.nonce || ""; m.head.append(a) })); d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)) })({
    key: "",
    v: "beta",
});

//site em que peguei a função: https://pt.martech.zone/calculate-great-circle-distance/#:~:text=A%20maneira%20simples%20de%20calcular,%C3%A9%20conhecido%20como%20Dist%C3%A2ncia%20euclidiana.
function getDistanceBetweenPoints(latitude1, longitude1, latitude2, longitude2, unit = 'miles') {
    let theta = longitude1 - longitude2;
    let distance = 60 * 1.1515 * (180 / Math.PI) * Math.acos(
        Math.sin(latitude1 * (Math.PI / 180)) * Math.sin(latitude2 * (Math.PI / 180)) +
        Math.cos(latitude1 * (Math.PI / 180)) * Math.cos(latitude2 * (Math.PI / 180)) * Math.cos(theta * (Math.PI / 180))
    );
    if (unit == 'miles') {
        return Math.round(distance, 2);
    } else if (unit == 'kilometers') {
        return Math.round(distance * 1.609344, 2);
    }
}



let map;
async function initMap(pontos, divmapa, listapai) {

    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerView } = await google.maps.importLibrary("marker");

    listapai = document.getElementById(listapai)
    divmapa = document.getElementById(divmapa)


    map = new Map(divmapa, {
        zoom: 16,
        center: pontos[0].coordenadas,
        mapId: "DEMO_MAP_ID",
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
    });

    const infowindow = []
    pontos.map((umPonto, i) => {
        const rowlista = document.createElement("li")
        rowlista.classList.add("list-group-item", "list-group-item-action")
        rowlista.innerHTML = `
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${umPonto.nome}</h5>
        </div>
        <p class="mb-1">${umPonto.endereco}</p>
        <small>${umPonto.descricao}</small>
        `
        listapai.appendChild(rowlista)

        if (i == 0) { rowlista.classList.add("active") }

        const makericon = document.createElement("img")
        makericon.src = ("img/map.png")
        makericon.style.width = "50px"
        makericon.style.height = "auto"
        const marker = new AdvancedMarkerView({
            map: map,
            position: umPonto.coordenadas,
            content: makericon,
            collisionBehavior: "REQUIRED_AND_HIDES_OPTIONAL"

        });




        infowindow[i] = new google.maps.InfoWindow({
            content: `
                <div class="p-0 m-0 text-dark">
                    <h4 class=" p-0 m-0">Tech Pass</h4>
                    <p class=" p-0 m-0">ponto de recarga em ${umPonto.bairro}</p>
                </div>
            `,
            ariaLabel: "Tech Pass",
        });

        rowlista.addEventListener("click", () => {

            const distancia = getDistanceBetweenPoints(map.getCenter().lat(), map.getCenter().lng(), umPonto.coordenadas.lat, umPonto.coordenadas.lng, "kilometers")

            let zoom, transicaoS
            if (distancia > 9) {
                zoom = 12
                transicaoS = 800
            } else {
                zoom = 14
                transicaoS = 500
            }


            map.setZoom(zoom)
            window.setTimeout(() => {
                map.panTo(umPonto.coordenadas);
                map.setZoom(15)
            }, transicaoS);


            infowindow.map((elem) => {
                if (elem == infowindow[i]) {
                    window.setTimeout(() => {
                        elem.open({
                            anchor: marker,
                            map, 
                        });
                    }, transicaoS+200)
                } else {
                    elem.close()
                }
            })


            for (li of [...listapai.querySelectorAll("li")]) {
                if (li == rowlista) {
                    rowlista.classList.add("active")
                } else {
                    li.classList.remove("active")
                }
            }
        })



    })



}


initMap(
    [
        {
            nome: "paia",
            endereco: "502 R. Dr. Pérsio Brasil Arruda.",
            descricao: "Ponto de recarga da Tech Pass",
            bairro: "umBairroQualquer",
            coordenadas: { lat: -23.6384809, lng: -45.4461392 }
        },
        {
            nome: "paia2",
            endereco: "502 R. Dr. Pérsio Brasil Arruda.",
            descricao: "Ponto de recarga da Tech Pass",
            bairro: "umBairroQualquer",
            coordenadas: { lat: -23.6042504, lng: -45.3488857 }
        },
        {
            nome: "paia3",
            endereco: "502 R. Dr. Pérsio Brasil Arruda.",
            descricao: "Ponto de recarga da Tech Pass",
            bairro: "umBairroQualquer",
            coordenadas: { lat: -23.6070944, lng: -45.354988 }
        },
    ],
    divmapa = "divmapa",
    listapai = "lista-de-pontos"
)

