const URL = "https://japceibal.github.io/japflix_api/movies-data.json";
let movies = [];

document.addEventListener("DOMContentLoaded", function () {

    fetch(URL)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            movies = data;
        })
        .catch(function (err) {
            console.log("error:", err);
        });

    let btnBuscar = document.getElementById("btnBuscar");
    let inputBuscar = document.getElementById("inputBuscar");
    let lista = document.getElementById("lista");

    let offcanvas = document.getElementById("movieOffcanvas");
    let offcanvasTitle = document.getElementById("offcanvasTitle");
    let offcanvasBody = document.getElementById("offcanvasBody");
    let bsOffcanvas = new bootstrap.Offcanvas(offcanvas);

    btnBuscar.addEventListener("click", function () {

        let texto = inputBuscar.value.toLowerCase().trim();
        lista.innerHTML = "";

        if (texto === "") return;

        let filtradas = [];

        // filtro a mano
        for (let i = 0; i < movies.length; i++) {
            let peli = movies[i];
            let titulo = peli.title.toLowerCase();
            let tagline = peli.tagline ? peli.tagline.toLowerCase() : "";
            let overview = peli.overview ? peli.overview.toLowerCase() : "";

            let coincide = false;

            if (titulo.indexOf(texto) !== -1) coincide = true;
            if (tagline.indexOf(texto) !== -1) coincide = true;
            if (overview.indexOf(texto) !== -1) coincide = true;

            // géneros
            for (let j = 0; j < peli.genres.length; j++) {
                let g = peli.genres[j].name.toLowerCase();
                if (g.indexOf(texto) !== -1) {
                    coincide = true;
                }
            }

            if (coincide) filtradas.push(peli);
        }

        if (filtradas.length === 0) {
            lista.innerHTML = `
                <li class="list-group-item bg-dark text-light text-center">
                    No se encontraron resultados
                </li>`;
            return;
        }

        for (let i = 0; i < filtradas.length; i++) {
            let movie = filtradas[i];

            let item = document.createElement("li");
            item.classList.add("list-group-item", "bg-dark", "text-light", "d-flex", "justify-content-between", "align-items-center");
            item.style.cursor = "pointer";

            let taglineTxt = movie.tagline ? movie.tagline : "";

            item.innerHTML = `
                <div>
                    <h5>${movie.title}</h5>
                    <p class="text-muted m-0">${taglineTxt}</p>
                </div>
                <div>${crearEstrellasViejo(movie.vote_average)}</div>
            `;

            item.addEventListener("click", function () {

                offcanvasTitle.textContent = movie.title;

                // géneros a mano
                let generosTxt = "";
                for (let g = 0; g < movie.genres.length; g++) {
                    generosTxt += movie.genres[g].name;
                    if (g < movie.genres.length - 1) generosTxt += " - ";
                }

                let anio = movie.release_date.split("-")[0];

                offcanvasBody.innerHTML = `
                    <p>${movie.overview}</p>
                    <p class="text-muted">${generosTxt}</p>

                    <div class="dropdown mt-3">
                        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            Más info
                        </button>
                        <ul class="dropdown-menu">
                            <li><span class="dropdown-item"><strong>Año:</strong> ${anio}</span></li>
                            <li><span class="dropdown-item"><strong>Duración:</strong> ${movie.runtime} min</span></li>
                            <li><span class="dropdown-item"><strong>Presupuesto:</strong> $${movie.budget.toLocaleString()}</span></li>
                            <li><span class="dropdown-item"><strong>Ganancias:</strong> $${movie.revenue.toLocaleString()}</span></li>
                        </ul>
                    </div>
                `;
                bsOffcanvas.show();
            });

            lista.appendChild(item);
        }
    });
});

function crearEstrellasViejo(vote) {
    let estrellas = Math.round(vote / 2);
    let html = "";

    for (let i = 1; i <= 5; i++) {
        if (i <= estrellas) {
            html += '<i class="fa fa-star checked"></i>';
        } else {
            html += '<i class="fa fa-star-o checked"></i>';
        }
    }
    return html;
}
