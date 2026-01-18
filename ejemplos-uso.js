// Ejemplos de uso del módulo HDFull para Sora
// Estos son ejemplos de cómo Sora utilizará el módulo

// ============================================
// EJEMPLO 1: Buscar una película
// ============================================
async function ejemploBusqueda() {
  const resultados = await SoraHDFull.search("Batman");
  
  console.log("Resultados de búsqueda:", resultados);
  // Output esperado:
  // [
  //   {
  //     id: "batman-soul-of-the-dragon",
  //     title: "Batman: Alma del dragón",
  //     thumbnail: "https://hdfullcdn.cc/tthumb/130x190/movie_...",
  //     type: "movie",
  //     url: "https://www2.hdfull.one/pelicula/batman-soul-of-the-dragon"
  //   },
  //   ...
  // ]
}

// ============================================
// EJEMPLO 2: Obtener películas de una categoría
// ============================================
async function ejemploCategoria() {
  const peliculas = await SoraHDFull.getCategory("movies-premiere");
  
  console.log("Películas estreno:", peliculas);
  // Output: Lista de películas recién agregadas
}

// ============================================
// EJEMPLO 3: Obtener detalles de una película
// ============================================
async function ejemploDetallesPelicula() {
  const detalles = await SoraHDFull.getDetails("batman-soul-of-the-dragon", "pelicula");
  
  console.log("Detalles:", detalles);
  // Output esperado:
  // {
  //   title: "Batman: Alma del dragón",
  //   description: "En los años 70, Bruce Wayne...",
  //   poster: "https://hdfullcdn.cc/...",
  //   year: "2021",
  //   rating: "6.5",
  //   type: "movie"
  // }
}

// ============================================
// EJEMPLO 4: Obtener temporadas de una serie
// ============================================
async function ejemploSerie() {
  const temporadas = await SoraHDFull.getSeasons("the-vampire-diaries");
  
  console.log("Temporadas:", temporadas);
  // Output esperado:
  // [
  //   {
  //     season: 1,
  //     episodes: [
  //       { episode: 1, title: "Pilot", url: "..." },
  //       { episode: 2, title: "The Night of the Comet", url: "..." },
  //       ...
  //     ]
  //   },
  //   {
  //     season: 2,
  //     episodes: [...]
  //   },
  //   ...
  // ]
}

// ============================================
// EJEMPLO 5: Obtener enlaces de streaming de película
// ============================================
async function ejemploEnlacesPelicula() {
  const enlaces = await SoraHDFull.getStreamLinks("batman-soul-of-the-dragon", "pelicula");
  
  console.log("Enlaces de streaming:", enlaces);
  // Output esperado:
  // [
  //   {
  //     url: "https://servidor1.com/embed/...",
  //     quality: "1080p",
  //     language: "ESP",
  //     server: "servidor1"
  //   },
  //   {
  //     url: "https://servidor2.com/embed/...",
  //     quality: "720p",
  //     language: "LAT",
  //     server: "servidor2"
  //   },
  //   ...
  // ]
}

// ============================================
// EJEMPLO 6: Obtener enlaces de episodio de serie
// ============================================
async function ejemploEnlacesEpisodio() {
  const enlaces = await SoraHDFull.getStreamLinks(
    "the-vampire-diaries",  // slug de la serie
    "serie",                 // tipo
    1,                       // temporada 1
    1                        // episodio 1
  );
  
  console.log("Enlaces del episodio:", enlaces);
  // Output: Lista de servidores con sus enlaces
}

// ============================================
// EJEMPLO 7: Flujo completo - Buscar y reproducir
// ============================================
async function ejemploFlujoCompleto() {
  // 1. Buscar
  const resultados = await SoraHDFull.search("Vinland Saga");
  console.log("Encontrado:", resultados[0].title);
  
  // 2. Obtener detalles
  const detalles = await SoraHDFull.getDetails(resultados[0].id, "serie");
  console.log("Sinopsis:", detalles.description);
  
  // 3. Obtener temporadas
  const temporadas = await SoraHDFull.getSeasons(resultados[0].id);
  console.log("Temporadas disponibles:", temporadas.length);
  
  // 4. Obtener enlaces del primer episodio
  const enlaces = await SoraHDFull.getStreamLinks(
    resultados[0].id,
    "serie",
    1,  // Primera temporada
    1   // Primer episodio
  );
  console.log("Servidores disponibles:", enlaces.length);
  
  // 5. Reproducir el primer servidor
  console.log("Reproduciendo desde:", enlaces[0].server);
  // Aquí Sora reproduciría el video usando enlaces[0].url
}

// ============================================
// EJEMPLO 8: Categorías disponibles
// ============================================
const CATEGORIAS_DISPONIBLES = [
  "movies",           // Todas las películas
  "series",           // Todas las series
  "movies-premiere",  // Películas estreno
  "movies-updated",   // Películas actualizadas
  "episodes-latest",  // Últimos episodios emitidos
  "episodes-premiere" // Episodios estreno
];

async function ejemploExploracion() {
  // Explorar películas estreno
  const estrenos = await SoraHDFull.getCategory("movies-premiere");
  console.log(`${estrenos.length} películas estreno encontradas`);
  
  // Explorar últimos episodios
  const episodios = await SoraHDFull.getCategory("episodes-latest");
  console.log(`${episodios.length} episodios recientes encontrados`);
}

// ============================================
// EJEMPLO 9: Manejo de errores
// ============================================
async function ejemploManejoErrores() {
  try {
    const resultados = await SoraHDFull.search("película inexistente xyz123");
    
    if (resultados.length === 0) {
      console.log("No se encontraron resultados");
    } else {
      console.log(`Se encontraron ${resultados.length} resultados`);
    }
  } catch (error) {
    console.error("Error en la búsqueda:", error.message);
    // Manejar el error apropiadamente
  }
}

// ============================================
// EJEMPLO 10: Filtrar por idioma
// ============================================
async function ejemploFiltrarIdioma() {
  const slug = "batman-soul-of-the-dragon";
  const enlaces = await SoraHDFull.getStreamLinks(slug, "pelicula");
  
  // Filtrar solo enlaces en español
  const enlacesEspanol = enlaces.filter(e => e.language === "ESP");
  console.log("Enlaces en español:", enlacesEspanol.length);
  
  // Filtrar enlaces en latino
  const enlacesLatino = enlaces.filter(e => e.language === "LAT");
  console.log("Enlaces en latino:", enlacesLatino.length);
  
  // Filtrar enlaces con subtítulos
  const enlacesSubtitulos = enlaces.filter(e => e.language === "SUB");
  console.log("Enlaces con subtítulos:", enlacesSubtitulos.length);
}

// ============================================
// NOTAS DE USO
// ============================================

/*
NOTAS IMPORTANTES:

1. Todas las funciones son asíncronas (async/await)
2. Los resultados pueden variar según la disponibilidad en HDFull
3. Los slugs son los identificadores únicos (extraídos de las URLs)
4. Las URLs de streaming son enlaces a servidores externos
5. Algunos enlaces pueden requerir pasos adicionales (captcha, etc.)

MEJORES PRÁCTICAS:

1. Siempre usar try/catch para manejar errores
2. Verificar que los arrays no estén vacíos antes de acceder
3. Cachear resultados cuando sea posible para reducir peticiones
4. Respetar los límites de tasa (rate limiting) del servidor
5. Proporcionar feedback al usuario durante las operaciones

LIMITACIONES:

1. HDFull puede cambiar su estructura sin aviso
2. Algunos videos requieren autenticación
3. Los enlaces externos pueden caducar
4. La disponibilidad depende del servidor de HDFull
*/
