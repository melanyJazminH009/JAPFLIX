const URL = "https://japceibal.github.io/japflix_api/movies-data.json";
let movies = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch(URL)
    .then(response => response.json())
    .then(data => {
      movies = data;
    })
    .catch(error => console.error("Error al cargar los datos:", error));

  const btnBuscar = document.getElementById("btnBuscar");
  const inputBuscar = document.getElementById("inputBuscar");
  const lista = document.getElementById("lista");

  const offcanvas = document.getElementById("movieOffcanvas");
  const offcanvasTitle = document.getElementById("offcanvasTitle");
  const offcanvasBody = document.getElementById("offcanvasBody");
  const bsOffcanvas = new bootstrap.Offcanvas(offcanvas);

  btnBuscar.addEventListener("click", () => {
    const searchText = inputBuscar.value.trim().toLowerCase();
    lista.innerHTML = "";

    if (searchText === "") return;

    const filtradas = movies.filter(movie =>
      movie.title.toLowerCase().includes(searchText) ||
      movie.tagline.toLowerCase().includes(searchText) ||
      movie.overview.toLowerCase().includes(searchText) ||
      movie.genres.some(g => g.name.toLowerCase().includes(searchText))
    );

    if (filtradas.length === 0) {
      lista.innerHTML = `<li class="list-group-item bg-dark text-light text-center">No se encontraron resultados</li>`;
      return;
    }

    filtradas.forEach(movie => {
      const item = document.createElement("li");
      item.classList.add("list-group-item", "bg-dark", "text-light", "d-flex", "justify-content-between", "align-items-center");
      item.style.cursor = "pointer";

      item.innerHTML = `
        <div>
          <h5>${movie.title}</h5>
          <p class="text-muted m-0">${movie.tagline || ""}</p>
        </div>
        <div>${crearEstrellas(movie.vote_average)}</div>
      `;

      item.addEventListener("click", () => {
        offcanvasTitle.textContent = movie.title;
        offcanvasBody.innerHTML = `
          <p>${movie.overview}</p>
          <p class="text-muted">${movie.genres.map(g => g.name).join(" - ")}</p>
          <div class="dropdown mt-3">
            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
              Más info
            </button>
            <ul class="dropdown-menu">
              <li><span class="dropdown-item"><strong>Año:</strong> ${movie.release_date.split("-")[0]}</span></li>
              <li><span class="dropdown-item"><strong>Duración:</strong> ${movie.runtime} min</span></li>
              <li><span class="dropdown-item"><strong>Presupuesto:</strong> $${movie.budget.toLocaleString()}</span></li>
              <li><span class="dropdown-item"><strong>Ganancias:</strong> $${movie.revenue.toLocaleString()}</span></li>
            </ul>
          </div>
        `;
        bsOffcanvas.show();
      });

      lista.appendChild(item);
    });
  });
});

function crearEstrellas(vote) {
  const stars = Math.round(vote / 2);
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += i <= stars
      ? `<i class="fa fa-star checked"></i>`
      : `<i class="fa fa-star-o checked"></i>`;
  }
  return html;
}
