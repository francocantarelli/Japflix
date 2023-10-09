document.addEventListener("DOMContentLoaded", () => {
  const inputBuscar = document.getElementById("inputBuscar");
  const buttonBuscar = document.getElementById("btnBuscar");
  const listaPeliculas = document.getElementById("lista");
  let cantidadPeliculasEncontradas = 0;

  const contenedorInfo = document.createElement("div");
  contenedorInfo.classList.add(
    "container",
    "mt-3",
    "border",
    "p-3",
    "ayuda"
  );
  contenedorInfo.style.display = "none"; // Oculta el contenedor al principio

  fetch("https://japceibal.github.io/japflix_api/movies-data.json")
    .then((response) => response.json())
    .then((data) => {
      const peliculasData = data;
      function mostrarPeliculas(query) {
        listaPeliculas.innerHTML = "";
        const peliculasFiltradas = peliculasData.filter((peliculas) => {
          const { title, genres, tagline, overview } = peliculas;
          const buscarCaracteristica = query;
          return (
            title.includes(buscarCaracteristica)
            || genres.find((genero) => genero.name.toLowerCase() === buscarCaracteristica.toLowerCase())
            || tagline.toLowerCase().includes(buscarCaracteristica)
            || overview.toLowerCase().includes(buscarCaracteristica)
          );
        }
        );

        peliculasFiltradas.forEach((peliculas) => {
          const divPeliculas = document.createElement("div");
          divPeliculas.classList.add("peliculas");
          divPeliculas.addEventListener("click", () => {
            funcionDeChiara(peliculas);
          });
          divPeliculas.innerHTML = `
            <h2>${peliculas.title}</h2>
            <p>${peliculas.tagline}</p>
            <p>Calificacion:<span class="estrellas-color"> ${peliculas.vote_average} - ${obtenerEstrellas(peliculas.vote_average)}</span></p>
            <hr>`;
          listaPeliculas.appendChild(divPeliculas);
        });


        cantidadPeliculasEncontradas = peliculasFiltradas.length;
        document.getElementById("numberOfQuerys").innerHTML = "Cantidad de resultados: " + cantidadPeliculasEncontradas;
      }
      function yearDate(date){
        const year = date.release_date.split('-')
        return year[0]
      }
        
      function funcionDeChiara(pelicula) {
        let generos = "";
        pelicula.genres.map((genero, index) => {
          generos = generos + genero.name + " ";
        });
        contenedorInfo.innerHTML = ` 
              <h2>${pelicula.title}</h2>
                <p>${pelicula.overview}</p>
                <p><strong>Géneros:</strong> ${generos}</p>
                <div class="dropdown">
                  <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Mas información
                </button>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">Year : ${yearDate(pelicula)}</a></li>
                    <li><a class="dropdown-item" href="#">Runtime : ${pelicula.runtime} mins</a></li>
                    <li><a class="dropdown-item" href="#">Budget : $${pelicula.budget}</a></li>
                    <li><a class="dropdown-item" href="#">Revenue : $${pelicula.revenue}</a></li>
                  </ul>
                </div>
              `;

        contenedorInfo.style.display = "block";
        const hola = document.getElementById("hola")
        const main = document.getElementById("MyTitle");
        main.insertBefore(contenedorInfo, hola);
        }

      function obtenerEstrellas(rating) {
        const newRating = rating / 2;
        const estrellasColoreadas = Math.floor(newRating); // estrellas doradas
        const  estrellasSinColorear = 5 - estrellasColoreadas;
        const calificado = `<i class="fa-regular fa-star"></i>`;
        const sinCalificar = `<i class="fa-solid fa-star"></i>`;
        
        let resultado = ""
        resultado += sinCalificar.repeat(estrellasColoreadas) + calificado.repeat(estrellasSinColorear);
      
        return resultado;
      }

      buttonBuscar.addEventListener("click", () => {
        const buscarTermino = inputBuscar.value.trim();
        if (buscarTermino) {
          mostrarPeliculas(buscarTermino);
        }
      });
    });
});
