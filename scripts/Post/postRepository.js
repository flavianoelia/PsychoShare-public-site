//Mock, con una lista de posts harcodeados para ver algo en el front
const posts = [{
       imgOwner : "assets/imgwebp/veronicacontacts.webp",
       nameOwner: "Verónica Ramirez",
       description: "Hola a todos, Les traigo una excelente recomendación de lectura: 'El Arte de Sanar: Principios y Prácticas de la Psicología Clínica' del Dr. Alejandro Ríos. Este libro es perfecto para cualquiera que quiera entender cómo la psicología ayuda a las personas a superar el sufrimiento y encontrar bienestar. El Dr. Ríos explica las terapias y enfoques clínicos de forma clara y accesible. ¡Una lectura esencial para comprender el arte de la salud mental!",
       title : "El Arte de Sanar: Principios y Prácticas de la Psicología Clínica",
       authorship: "Dr. Alejandro Ríos",
       abstract: " En 'El Arte de Sanar', el Dr. Alejandro Ríos, un destacado psicólogo clínico, ofrece una guía exhaustiva y accesible sobre los fundamentos y las aplicaciones de la psicología clínica. Este libro profundiza en las diversas teorías y enfoques terapéuticos, desde la terapia cognitivo-conductual hasta las intervenciones psicodinámicas, proporcionando una comprensión clara de cómo los profesionales abordan el sufrimiento humano y fomentan el bienestar.",
       image : "assets/imgwebp/clinical_psychology_300x300.webp",
       countLike: 42
},
{
    imgOwner : "assets/imgwebp/constanzacontacts.webp",
       nameOwner: "Constanza Rodriguez",
       description: "Hola, compañeros. Estuve leyendo sobre el sobre el comportamiento de las personas en el trabajo. Me pareció muy relevante para todos nosotros que manejamos a veces tanta presión. ¿Qué les parece?",
       title : "Psicología Laboral – Comportamiento humano en el ámbito laboral",
       authorship: "Eduardo Rame (edición propia, publicada en Wikimedia Commons)",
       abstract: " Manual breve (5 páginas) que introduce la psicología del trabajo como ciencia aplicada. Describe cómo los procesos emocionales, cognitivos y físicos influyen en el ámbito laboral. Ideal para una visión general del comportamiento humano en el trabajo y su relevancia organizacional...",
       image : "assets/imgwebp/psicologiatrabajo.webp",
       countLike: 40   
},
{
        imgOwner : "assets/imgwebp/danielcontacts.webp",
       nameOwner: "Daniel Llanes",
       description: "¡Buenas! Descubrí un recurso clave: 'Psicología Educativa' de Julio Varela Barraza (con Grupo Autismo-ABA).Este manual es ideal para la formación, con 24 módulos prácticos. Cubre desde principios de análisis de conducta aplicados en el aula (observación, refuerzo, manejo de conductas) hasta casos prácticos sobre dinámicas, relación con familias y estrategias de inclusión",
       title : "Psicología Educativa – Julio Varela Barraza",
       authorship: "Julio Varela Barraza (y colaboración de Jorge Campo, Grupo Autismo-ABA)",
       abstract: "Este manual, pensado para formación de docentes de nivel básico y media, está organizado en 24 módulos didácticos.Primera parte (12 módulos): enfoques y principios conductuales aplicados a la enseñanza: observación, evaluación, refuerzo, técnicas de modelado y manejo de conductas.Segunda parte (12 módulos): casos prácticos sobre dinámicas en el aula, relaciones con familias, eventos institucionales (como uso de uniformes), estrategias para inclusión y manejo de la rotación docente.Combina teoría del análisis de conducta con sugerencias prácticas, útiles para entrenar docentes de forma efectiva y rígida.",
       image : "assets/imgwebp/psicologiatrabajo.webp",
       countLike: 41
}
]

//Aquí va la función fetch con el GET
function getPost(show) {
       return show(posts);
}