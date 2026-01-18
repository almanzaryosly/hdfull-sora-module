// HDFull Module Script for Sora App
// Author: AimpexTy
// Version: 1.0.0

const HDFull = {
  baseUrl: 'https://www2.hdfull.one',
  
  /**
   * Buscar contenido en HDFull
   * @param {string} query - Término de búsqueda
   * @returns {Array} Lista de resultados
   */
  async search(query) {
    try {
      const searchUrl = `${this.baseUrl}/buscar?q=${encodeURIComponent(query)}`;
      const html = await this.fetchHTML(searchUrl);
      return this.parseSearchResults(html);
    } catch (error) {
      console.error('Error en búsqueda:', error);
      return [];
    }
  },

  /**
   * Obtener lista de películas o series
   * @param {string} category - Categoría (movies, series, etc.)
   * @returns {Array} Lista de contenido
   */
  async getCategory(category) {
    try {
      let url;
      switch(category) {
        case 'movies':
          url = `${this.baseUrl}/peliculas`;
          break;
        case 'series':
          url = `${this.baseUrl}/series`;
          break;
        case 'movies-premiere':
          url = `${this.baseUrl}/peliculas-estreno`;
          break;
        case 'movies-updated':
          url = `${this.baseUrl}/peliculas-actualizadas`;
          break;
        case 'episodes-latest':
          url = `${this.baseUrl}/episodios`;
          break;
        default:
          url = `${this.baseUrl}`;
      }
      
      const html = await this.fetchHTML(url);
      return this.parseContentList(html);
    } catch (error) {
      console.error('Error obteniendo categoría:', error);
      return [];
    }
  },

  /**
   * Obtener detalles de una película o serie
   * @param {string} slug - Slug del contenido (ej: "batman-soul-of-the-dragon")
   * @param {string} type - Tipo (pelicula o serie)
   * @returns {Object} Detalles del contenido
   */
  async getDetails(slug, type = 'pelicula') {
    try {
      const url = `${this.baseUrl}/${type}/${slug}`;
      const html = await this.fetchHTML(url);
      return this.parseDetails(html, type);
    } catch (error) {
      console.error('Error obteniendo detalles:', error);
      return null;
    }
  },

  /**
   * Obtener temporadas y episodios de una serie
   * @param {string} slug - Slug de la serie
   * @returns {Array} Lista de temporadas con episodios
   */
  async getSeasons(slug) {
    try {
      const url = `${this.baseUrl}/serie/${slug}`;
      const html = await this.fetchHTML(url);
      return this.parseSeasons(html, slug);
    } catch (error) {
      console.error('Error obteniendo temporadas:', error);
      return [];
    }
  },

  /**
   * Obtener enlaces de streaming
   * @param {string} slug - Slug del contenido
   * @param {string} type - Tipo (pelicula o serie)
   * @param {number} season - Número de temporada (solo series)
   * @param {number} episode - Número de episodio (solo series)
   * @returns {Array} Lista de enlaces de streaming
   */
  async getStreamLinks(slug, type = 'pelicula', season = null, episode = null) {
    try {
      let url;
      if (type === 'serie' && season && episode) {
        url = `${this.baseUrl}/serie/${slug}/temporada-${season}/episodio-${episode}`;
      } else {
        url = `${this.baseUrl}/pelicula/${slug}`;
      }
      
      const html = await this.fetchHTML(url);
      return this.parseStreamLinks(html);
    } catch (error) {
      console.error('Error obteniendo enlaces:', error);
      return [];
    }
  },

  /**
   * Parsear resultados de búsqueda
   */
  parseSearchResults(html) {
    const results = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Buscar elementos de películas y series
    const items = doc.querySelectorAll('.home-thumb-item a, .flickr.item a');
    
    items.forEach(item => {
      const href = item.getAttribute('href');
      if (!href || !href.includes('hdfull.one')) return;
      
      const img = item.querySelector('img');
      const title = img?.getAttribute('original-title') || img?.getAttribute('alt') || '';
      const thumbnail = img?.getAttribute('src') || '';
      
      // Determinar tipo (película o serie)
      const type = href.includes('/pelicula/') ? 'movie' : 'tv';
      const slug = href.split('/').pop();
      
      if (title && slug) {
        results.push({
          id: slug,
          title: title,
          thumbnail: thumbnail,
          type: type,
          url: href
        });
      }
    });
    
    return results;
  },

  /**
   * Parsear lista de contenido
   */
  parseContentList(html) {
    return this.parseSearchResults(html);
  },

  /**
   * Parsear detalles de contenido
   */
  parseDetails(html, type) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const title = doc.querySelector('h1, .title')?.textContent?.trim() || '';
    const description = doc.querySelector('.synopsis, .description, p')?.textContent?.trim() || '';
    const poster = doc.querySelector('.poster img, .cover img')?.getAttribute('src') || '';
    const year = doc.querySelector('.year, .date')?.textContent?.trim() || '';
    const rating = doc.querySelector('.rating, .vote')?.textContent?.trim() || '';
    
    return {
      title,
      description,
      poster,
      year,
      rating,
      type: type === 'serie' ? 'tv' : 'movie'
    };
  },

  /**
   * Parsear temporadas de una serie
   */
  parseSeasons(html, slug) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const seasons = [];
    
    // Buscar elementos de temporadas
    const seasonElements = doc.querySelectorAll('.season, [class*="temporada"]');
    
    seasonElements.forEach((seasonEl, index) => {
      const seasonNumber = index + 1;
      const episodes = [];
      
      // Buscar episodios de esta temporada
      const episodeElements = seasonEl.querySelectorAll('.episode, [class*="episodio"]');
      
      episodeElements.forEach((epEl, epIndex) => {
        const episodeNumber = epIndex + 1;
        const epTitle = epEl.querySelector('.title')?.textContent?.trim() || `Episodio ${episodeNumber}`;
        
        episodes.push({
          episode: episodeNumber,
          title: epTitle,
          url: `${this.baseUrl}/serie/${slug}/temporada-${seasonNumber}/episodio-${episodeNumber}`
        });
      });
      
      seasons.push({
        season: seasonNumber,
        episodes: episodes
      });
    });
    
    return seasons;
  },

  /**
   * Parsear enlaces de streaming
   */
  parseStreamLinks(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const links = [];
    
    // Buscar iframes y enlaces de reproducción
    const playerLinks = doc.querySelectorAll('iframe[src], .player-link, [data-src]');
    
    playerLinks.forEach(link => {
      const src = link.getAttribute('src') || link.getAttribute('data-src');
      const quality = link.getAttribute('data-quality') || '1080p';
      const lang = link.getAttribute('data-lang') || 'ESP';
      
      if (src) {
        links.push({
          url: src,
          quality: quality,
          language: lang,
          server: this.getServerName(src)
        });
      }
    });
    
    return links;
  },

  /**
   * Obtener nombre del servidor desde URL
   */
  getServerName(url) {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace('www.', '').split('.')[0];
    } catch {
      return 'Unknown';
    }
  },

  /**
   * Fetch HTML desde una URL
   */
  async fetchHTML(url) {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'es-ES,es;q=0.9'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.text();
  }
};

// Exportar funciones principales para Sora
window.HDFull = HDFull;

// API para Sora
const SoraAPI = {
  search: (query) => HDFull.search(query),
  getCategory: (category) => HDFull.getCategory(category),
  getDetails: (slug, type) => HDFull.getDetails(slug, type),
  getSeasons: (slug) => HDFull.getSeasons(slug),
  getStreamLinks: (slug, type, season, episode) => HDFull.getStreamLinks(slug, type, season, episode)
};

// Registrar API global
if (typeof window !== 'undefined') {
  window.SoraHDFull = SoraAPI;
}
