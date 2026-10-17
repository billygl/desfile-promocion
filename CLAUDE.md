# Desfile y barra de la promoción (Greens 2037)

Simulación 3D + planos del desfile y la barra de las olimpiadas del Colegio María Alvarado.
Publicada en https://greens2037.website/desfile/

## Reglas

- **Privacidad:** este repo es público. Solo códigos de familia de 2 o 3 letras (AO, AmB, AnB…). Nunca nombres, apellidos, teléfonos ni correos en `src/`, `index.html` ni commits. Antes de cada commit:
  `grep -i -E "jes[uú]s|miriam|patty|france|franklin|estela|kathya|dino|gilmer|tania|anap|bernal|@gmail" src/desfile.html` debe salir vacío (en `index.html` puede haber falsos positivos dentro de las imágenes en base64).
- Los nombres reales viven en un `.json` privado fuera del repo (`olimpiadas/nombres-desfile.json`) que se importa en la página (Configuración avanzada → Nombres). Nunca lo copies al repo.
- No usar la herramienta Artifact: solo archivos locales y este despliegue.
- Móvil sin scroll horizontal: probar a ~375 px antes de publicar.
- Roles fijos: Águila = papá de AnB; coreografía = papá de CV; canto = papá de MG. Todas las cosas las llevan papás y mamás; los niños no cargan nada. Las 6 misses (2 por sección K1, K2, K3) van siempre adelante.

## Estructura

- `src/desfile.html`: el código que se edita (HTML + three.js r128).
- `build.py`: genera `index.html` incrustando `mapa.jpg`, `banner.jpg` y `escudo.png`. Con `--home` copia la página al sitio.
- La ruta por defecto está en `DEFAULT_ROUTE` (píxeles del plano); la escala es 0.135 m/px (contorno del colegio en OpenStreetMap).

## Despliegue (dos repos)

Necesita esta estructura de carpetas:

```
<raíz>/olimpiadas/parade           ← billygl/desfile-promocion (este repo)
<raíz>/lhs_directory/home-site     ← billygl/greens2037-home (sitio greens2037.website)
```

Si en esta computadora solo está clonado este repo, falta el del sitio (es privado; necesita `gh auth login` con la cuenta billygl):

```
git clone https://github.com/billygl/greens2037-home.git ../../lhs_directory/home-site
```

(o clónalo donde quieras y usa `python build.py --home <ruta-a-home-site>`).

1. `git pull` en los dos repos antes de empezar (se trabaja desde más de una computadora).
2. Editar `src/desfile.html`.
3. `python build.py --home`
4. Commit y push en `parade`; luego commit y push de `desfile/index.html` en `home-site`.
5. Comprobar en https://greens2037.website/desfile/ (Ctrl+F5).

La hoja de respaldo en Google Sheets y el archivo de nombres se generan desde `lhs_directory` (token y entorno de Python locales, no están en git); hacerlo desde la computadora que los tenga.
