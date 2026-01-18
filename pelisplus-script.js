// PelisPlus Module Script for Sora App
// Author: AimpexTy
// Version: 1.0.0

const PelisPlus = {
  baseUrl: 'https://ww3.pelisplus.to',
  
  /**
   * Buscar contenido en PelisPlus
   */
  async search(query) {
    try {
      const searchUrl = `${this.baseUrl}/search?s=${encodeURIComponent(query)}`;
      const html = await this.fetchHTML(searchUrl);
      return this.parseSearchResults(html);
    } catch (error) {
      console.error('Error en búsqueda PelisPlus:', error);
      return [];
    }
  },

  /**
   * Obtener categoría
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
        case 'genres-action':
          url = `${this.baseUrl}/genre/accion`;
          break;
        case 'genres-comedy':
          url = `${this.baseUrl}/genre/comedia`;
          break;
        case 'genres-drama':
          url = `${this.baseUrl}/genre/drama`;
          break;
        case 'trending':
          url = `${this.baseUrl}/peliculas-mas-vistas`;
          break;
        default:
          url = this.baseUrl;
      }
      
      const html = await this.fetchHTML(url);
      return this.parseContentList(html);
    } catch (error) {
      console.error('Error obteniendo categoría:', error);
      return [];
    }
  },

  /**
   * Obtener detalles
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
   * Obtener temporadas
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
    
    const items = doc.querySelectorAll('.Posters a, .TPostMv article, .item-post');
    
    items.forEach(item => {
      const link = item.tagName === 'A' ? item : item.querySelector('a');
      const img = item.querySelector('img');
      const titleEl = item.querySelector('.Title, h2, h3');
      
      const title = titleEl?.textContent?.trim() || img?.getAttribute('alt') || '';
      const thumbnail = img?.getAttribute('src') || img?.getAttribute('data-src') || '';
      const href = link?.getAttribute('href') || '';
      
      if (title && href) {
        const type = href.includes('/serie/') || href.includes('/series/') ? 'tv' : 'movie';
        const slug = href.split('/').filter(Boolean).pop();
        
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

  parseContentList(html) {
    return this.parseSearchResults(html);
  },

  /**
   * Parsear detalles de contenido
   */
  parseDetails(html, type) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const title = doc.querySelector('h1.Title, .title, h1')?.textContent?.trim() || '';
    const description = doc.querySelector('.Description, .synopsis, .overview')?.textContent?.trim() || '';
    const poster = doc.querySelector('.poster img, .TPMvCn img')?.getAttribute('src') || '';
    const year = doc.querySelector('.Year, .date')?.textContent?.trim() || '';
    const rating = doc.querySelector('.rating, .vote_average')?.textContent?.trim() || '';
    
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
   * Parsear temporadas de series
   */
  parseSeasons(html, slug) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const seasons = [];
    
    const seasonElements = doc.querySelectorAll('.season, .se-c');
    
    seasonElements.forEach((seasonEl, index) => {
      const seasonNumber = index + 1;
      const episodes = [];
      
      const episodeElements = seasonEl.querySelectorAll('.episodio, .Num, .episode');
      
      episodeElements.forEach((epEl, epIndex) => {
        const episodeNumber = epIndex + 1;
        const epTitle = epEl.querySelector('.Title')?.textContent?.trim() || `Episodio ${episodeNumber}`;
        
        episodes.push({
          episode: episodeNumber,
          title: epTitle,
          url: `${this.baseUrl}/serie/${slug}/temporada-${seasonNumber}/episodio-${episodeNumber}`
        });
      });
      
      if (episodes.length > 0) {
        seasons.push({
          season: seasonNumber,
          episodes: episodes
        });
      }
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
    const players = doc.querySelectorAll('iframe[src], .player iframe, [data-src]');
    
    players.forEach(player => {
      const src = player.getAttribute('src') || player.getAttribute('data-src');
      if (src) {
        links.push({
          url: src,
          quality: '1080p',
          language: 'ESP',
          server: this.getServerName(src)
        });
      }
    });
    
    // También buscar opciones de servidores
    const serverOptions = doc.querySelectorAll('.server-item, .player-option');
    serverOptions.forEach(option => {
      const dataUrl = option.getAttribute('data-url') || option.getAttribute('data-src');
      if (dataUrl) {
        links.push({
          url: dataUrl,
          quality: option.getAttribute('data-quality') || '1080p',
          language: option.getAttribute('data-lang') || 'ESP',
          server: option.textContent?.trim() || 'Server'
        });
      }
    });
    
    return links;
  },

  /**
   * Obtener nombre del servidor
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

// Exportar para Sora
if (typeof window !== 'undefined') {
  window.PelisPlusModule = PelisPlus;
}

// Compatibilidad con módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PelisPlus;
}
