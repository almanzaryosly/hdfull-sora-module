// Repelis Module Script for Sora App
// Author: AimpexTy
// Version: 1.0.0

const Repelis = {
  baseUrl: 'https://repelis24.co',
  
  /**
   * Buscar contenido en Repelis
   */
  async search(query) {
    try {
      const searchUrl = `${this.baseUrl}/search/${encodeURIComponent(query)}`;
      const html = await this.fetchHTML(searchUrl);
      return this.parseSearchResults(html);
    } catch (error) {
      console.error('Error en búsqueda Repelis:', error);
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
        case 'movies-premiere':
          url = `${this.baseUrl}/estrenos`;
          break;
        case 'trending':
          url = `${this.baseUrl}/tendencias`;
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
   * Parsear resultados
   */
  parseSearchResults(html) {
    const results = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const items = doc.querySelectorAll('.movie-item, .item, article');
    
    items.forEach(item => {
      const link = item.querySelector('a');
      const img = item.querySelector('img');
      const title = img?.getAttribute('alt') || link?.getAttribute('title') || '';
      const thumbnail = img?.getAttribute('src') || img?.getAttribute('data-src') || '';
      const href = link?.getAttribute('href') || '';
      
      if (title && href) {
        const type = href.includes('/serie/') ? 'tv' : 'movie';
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

  parseDetails(html, type) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    return {
      title: doc.querySelector('h1, .title')?.textContent?.trim() || '',
      description: doc.querySelector('.description, .synopsis, p')?.textContent?.trim() || '',
      poster: doc.querySelector('.poster img, .cover img')?.getAttribute('src') || '',
      year: doc.querySelector('.year, .date')?.textContent?.trim() || '',
      rating: doc.querySelector('.rating, .vote')?.textContent?.trim() || '',
      type: type === 'serie' ? 'tv' : 'movie'
    };
  },

  parseStreamLinks(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const links = [];
    
    const players = doc.querySelectorAll('iframe, .player-option, [data-src]');
    
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
    
    return links;
  },

  getServerName(url) {
    try {
      return new URL(url).hostname.replace('www.', '').split('.')[0];
    } catch {
      return 'Unknown';
    }
  },

  async fetchHTML(url) {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
        'Accept': 'text/html'
      }
    });
    return await response.text();
  }
};

// Exportar para Sora
if (typeof window !== 'undefined') {
  window.RepelisModule = Repelis;
}
