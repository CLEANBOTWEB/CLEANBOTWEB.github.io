# CLEANBOT - Proyecto de Integración Escolar (TIC 4° Año A)

**Colegio Fasta San Vicente de Paúl**  
**Integrantes:** Camila Parize, Olivia Andreacchio y Estefanía Pérez  
**Materia:** Tecnologías de la Información y Comunicación (Nodal Robótica)

---

## 📌 Descripción del Proyecto
Sitio web interactivo para concientizar sobre el desborde de residuos en las calles y presentar a **CLEANBOT**, una solución de robótica comunitaria desarrollada con placas **BBC micro:bit** y sensores ultrasónicos **HC-SR04** para monitorear en tiempo real la capacidad de los cestos de basura barriales y alertar por radiofrecuencia a los recolectores de residuos.

---

## 📂 Estructura de Archivos

```
trabajo integrador cami p estefi y oli/
│
├── index.html                  # Estructura semántica, pestañas, carrusel y comentarios
├── style.css                   # Diseño con la paleta exacta de Canva (verde salvia, serif editorial)
├── script.js                   # Lógica interactiva (tabs, simulador de cesto, carrusel, comentarios)
│
├── assets/
│   └── images/
│       ├── cleanbot_contenedor_alerta.jpg     # Foto Cleanbot en contenedor barrial con alerta radial
│       ├── cleanbot_tacho_alerta.jpg          # Foto Cleanbot en cesto urbano con alerta a camión
│       ├── cleanbot_prototipo_laboratorio.jpg # Foto real del prototipo físico en el laboratorio
│       ├── cleanbot_diy_preview.svg           # Diagrama técnico para la sección "PROBA HACERME!"
│       └── cleanbot_receiver_preview.svg      # Esquema de Robot 2 (micro:bit receptor con LED)
│
└── README.md                   # Documentación y guía del proyecto
```

---

## ✨ Características Principales Implementadas

1. **Fiel al Diseño de Canva:**
   - **Color de fondo:** Verde salvia pastel (`#cedbb8`), respetando exactamente el tono del Canva.
   - **Título principal:** `CLEANBOT` en tipografía serif editorial elegante (Playfair Display) en color negro / verde bosque muy oscuro (`#101c13`).
   - **Pestañas interactivas:** `Problemática`, `Solución` y `Componentes` estructuradas como en el boceto, con transiciones fluidas y accesibilidad de teclado.

2. **Contenido Pedagógico Completo (del Documento 1):**
   - **Problemática:** Articulación de los 3 lineamientos (*Ecología Integral*, *Salud Comunitaria* y *Superación de la Pobreza Estructural*), impacto sanitario, fuentes de noticias verificadas (La Nación, Conclusión, RT) y a quién ayuda.
   - **Solución:** Explicación técnica del sistema emisor-receptor, enlaces oficiales a los proyectos MakeCode de Robot 1 y Robot 2, y reflexiones a futuro (IA y sensores de olores).
   - **Componentes:** Los 8 componentes electrónicos con su justificación técnica, especificaciones y filtro interactivo (*Robot 1*, *Robot 2* o *Todos*).

3. **Simulador Interactivo en Vivo:**
   - Permite deslizar una barra para variar el nivel de basura del cesto y ver cómo varía la distancia ultrasónica (de 50 cm a 4 cm).
   - Si la distancia es menor a 10 cm, se activa automáticamente la alerta visual en la matriz de LEDs virtuales de la micro:bit receptora simulando la transmisión de radio.

4. **Carrusel de Fotos (`FOTOS`):**
   - Carrusel interactivo con las 3 fotografías oficiales del proyecto:
     1. **Alerta en Contenedor Barrial:** Monitoreo en contenedor de gran porte con transmisión de señal al camión recolector.
     2. **Prevención en Cesto Urbano:** Detección en cestos de vereda y aviso en tiempo real al personal de limpieza.
     3. **Prototipo Real en Laboratorio:** Fotografía auténtica del hardware ensamblado en clase por Camila, Olivia y Estefanía (micro:bit, shield, HC-SR04 y portapilas).
   - Encuadre adaptativo (aspect-ratio 16:10 y centrado óptico para preservar todos los HUDs y componentes).
   - Controles de foto anterior / siguiente, puntos indicadores, contador dinámico (`1 de 3`), rotación automática con pausa en hover y visualizador modal a pantalla completa (lightbox con zoom).

5. **Apartado `PROBA HACERME!:` (Instructivo Oficial de Armado):**
   - Incorpora el documento oficial completo de 3 páginas confeccionado por Camila, Olivia y Estefanía:
     - **1. Introducción y Propósito:** Funcionamiento por ultrasonido y radiofrecuencia.
     - **2. Componentes y Materiales:** Lista de la Unidad Emisora (Robot 1) y Unidad Receptora (Robot 2).
     - **3. Paso 1 - Montaje Mecánico:** Fijación de la protoboard, sensor HC-SR04 y shield de expansión.
     - **4. Paso 2 - Cableado Emisor:** Tabla pin a pin detallada (VCC 3V, GND, Trig P0, Echo P1, alimentación).
     - **5. Paso 3 - Conexiones Receptor:** micro:bit v2 por micro USB y matriz LED integrada.
     - **6. Paso 4 - Carga y Programación MakeCode:** Enlaces directos a los proyectos MakeCode de Robot 1 y Robot 2 con lógica de radio grupo y umbral < 10 cm.
     - **7. Paso 5 - Pruebas y Validación:** Verificación de alerta al recolector.
   - Incluye visor modal a pantalla completa, índice navegable con scroll suave y estilos de impresión limpios (`@media print`) para guardar en PDF con formato de documento profesional.

6. **Pie de Página y Redes Sociales:**
   - Línea de créditos: *Creadoras: Camila Parize, Olivia Andreacchio y Estefanía Pérez*.
   - Iconos SVG interactivos para Instagram, WhatsApp, TikTok y X.

7. **Sección de Comentarios (`¿Qué te pareció "cleanbot"?`):**
   - Formulario para dejar nombre, valoración con 1 a 5 estrellas y opinión.
   - Sistema de persistencia en `localStorage` (los comentarios se guardan en el navegador y no se borran al recargar).
   - Contador de comentarios y botón de *"Me gusta"* funcional.
   - Incluye 3 comentarios realistas precargados (docente, compañeros y vecinos).

---

## 🚀 Cómo Abrir y Probar el Proyecto

1. Abrir la carpeta del proyecto en **Visual Studio Code**.
2. Hacer click derecho sobre `index.html` y seleccionar **"Open with Live Server"** (o simplemente hacer doble click sobre `index.html` para abrirlo en cualquier navegador web como Google Chrome, Edge o Firefox).
3. Todo el código funciona 100% de manera local sin necesidad de instalar librerías externas.
