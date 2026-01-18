# Módulo HDFull para Sora App

Módulo personalizado para ver películas y series de HDFull.one en la app Sora.

## 📋 Contenido

- `hdfull-module.json` - Archivo de configuración del módulo
- `hdfull-script.js` - Script JavaScript para scraping y extracción de datos

## 🚀 Instalación

### Paso 1: Subir los archivos

Necesitas alojar los archivos en un servidor web público. Puedes usar:

- **GitHub Pages** (gratis)
- **Netlify** (gratis)
- **Vercel** (gratis)
- Cualquier hosting web

#### Opción A: GitHub Pages (Recomendado)

1. Crea un repositorio en GitHub
2. Sube los archivos `hdfull-module.json` y `hdfull-script.js`
3. Ve a Settings → Pages
4. Activa GitHub Pages
5. Tu URL será: `https://tu-usuario.github.io/nombre-repo/`

#### Opción B: Usar un Gist

1. Crea un Gist público en GitHub
2. Sube los archivos
3. Usa `https://gist.githubusercontent.com/tu-usuario/id-gist/raw/hdfull-script.js`

### Paso 2: Actualizar el módulo JSON

Edita `hdfull-module.json` y cambia esta línea:

```json
"scriptUrl": "https://tu-servidor.com/hdfull-script.js"
```

Por la URL real donde subiste el archivo JavaScript. Por ejemplo:

```json
"scriptUrl": "https://tu-usuario.github.io/hdfull-module/hdfull-script.js"
```

### Paso 3: Agregar el módulo a Sora

1. Abre la app **Sora** en tu iPhone/iPad
2. Ve a **Configuración** o **Settings**
3. Busca la opción **Módulos** o **Add Source**
4. Pega la URL de tu archivo `hdfull-module.json`
   - Ejemplo: `https://tu-usuario.github.io/hdfull-module/hdfull-module.json`
5. Presiona **Agregar** o **Add**

## 📱 Uso

Una vez instalado el módulo, podrás:

### Buscar contenido
- Usa la búsqueda de Sora
- El módulo buscará automáticamente en HDFull

### Explorar categorías
- **Películas** - Catálogo completo de películas
- **Series** - Catálogo completo de series
- **Películas Estreno** - Últimas películas agregadas
- **Películas Actualizadas** - Películas con nuevos enlaces
- **Últimos Episodios** - Episodios recién emitidos
- **Episodios Estreno** - Nuevos episodios

### Ver contenido
1. Selecciona una película o serie
2. Para series: elige temporada y episodio
3. Selecciona el servidor de reproducción
4. ¡Disfruta!

## ⚙️ Características

- ✅ Búsqueda de películas y series
- ✅ Exploración por categorías
- ✅ Información detallada (sinopsis, año, rating)
- ✅ Soporte para múltiples idiomas (ESP, LAT, SUB)
- ✅ Múltiples servidores de streaming
- ✅ Calidad HD/1080p
- ✅ Series con temporadas y episodios organizados

## 🔧 Solución de Problemas

### El módulo no aparece en Sora
- Verifica que la URL del JSON sea correcta y accesible
- Asegúrate de que el archivo esté en un servidor HTTPS
- Revisa que el formato JSON sea válido

### No se pueden reproducir los videos
- HDFull puede requerir autenticación
- Los enlaces pueden estar protegidos
- Algunos servidores pueden no ser compatibles con Sora

### Los enlaces no funcionan
- HDFull actualiza frecuentemente su estructura
- Es posible que necesites actualizar el script
- Verifica que HDFull esté accesible

## ⚠️ Notas Importantes

1. **Legalidad**: Este módulo es solo para fines educativos. Asegúrate de cumplir con las leyes de copyright de tu país.

2. **Actualizaciones**: HDFull puede cambiar su estructura web, lo que requeriría actualizar el script.

3. **Limitaciones**: 
   - Algunos videos pueden requerir cuenta en HDFull
   - Los enlaces externos dependen de servidores de terceros
   - La velocidad depende de tu conexión y el servidor

4. **Privacidad**: El módulo no recopila ningún dato personal. Todo el procesamiento se hace en tu dispositivo.

## 🛠️ Desarrollo

### Estructura del módulo

```javascript
// Funciones principales
HDFull.search(query)           // Buscar contenido
HDFull.getCategory(category)   // Obtener categoría
HDFull.getDetails(slug, type)  // Detalles de película/serie
HDFull.getSeasons(slug)        // Temporadas de serie
HDFull.getStreamLinks(...)     // Enlaces de reproducción
```

### Personalización

Puedes modificar el script para:
- Agregar más categorías
- Cambiar el parseo HTML
- Agregar filtros adicionales
- Modificar la calidad de video predeterminada

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Si encuentras bugs o quieres mejorar el módulo:
1. Reporta issues
2. Sugiere mejoras
3. Comparte tu versión modificada

## 📞 Soporte

Para problemas con:
- **El módulo**: Revisa este README
- **HDFull**: Contacta directamente con HDFull
- **Sora App**: Contacta al desarrollador de Sora

---

**Versión**: 1.0.0  
**Autor**: AimpexTy  
**Última actualización**: Enero 2026

## 📝 Changelog

### v1.0.0 (2026-01-18)
- Lanzamiento inicial
- Soporte para búsqueda de películas y series
- 6 categorías principales
- Parseo básico de enlaces de streaming
- Soporte multi-idioma (ESP, LAT, SUB)
