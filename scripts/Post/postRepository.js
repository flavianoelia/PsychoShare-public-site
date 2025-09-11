// Mock, con una lista de posts harcodeados para ver algo en el front
const posts = [
    {
        imgOwner : "assets/imgwebp/veronicacontacts.webp",
        nameOwner: "Verónica Ramirez",
        description: "Hola a todos, Les traigo una excelente recomendación de lectura: 'El Arte de Sanar: Principios y Prácticas de la Psicología Clínica' del Dr. Alejandro Ríos...",
        title : "El Arte de Sanar: Principios y Prácticas de la Psicología Clínica",
        authorship: "Dr. Alejandro Ríos",
        abstract: "En 'El Arte de Sanar', el Dr. Alejandro Ríos ofrece una guía exhaustiva sobre los fundamentos y aplicaciones de la psicología clínica...",
        image : "assets/imgwebp/clinical_psychology_300x300.webp",
        countLike: 42,
        comments: [
            {
                imgOwner: "assets/imgwebp/danielcontacts.webp",
                nameOwner: "Daniel Llanes",
                text: "Muy recomendable, lo leí el año pasado y me ayudó mucho."
            },
            {
                imgOwner: "assets/imgwebp/flavia.webp",
                nameOwner: "Flavia Pérez",
                text: "Me encantó cómo explica la terapia cognitivo-conductual."
            },
            {
                imgOwner: "assets/imgwebp/aloe.webp",
                nameOwner: "Aloe Bordone",
                text: "Lo tengo pendiente, ¡gracias por recordármelo!"
            }
        ]
    },
    {
        imgOwner : "assets/imgwebp/constanzacontacts.webp",
        nameOwner: "Constanza Rodriguez",
        description: "Hola, compañeros. Estuve leyendo sobre el comportamiento de las personas en el trabajo...",
        title : "Psicología Laboral – Comportamiento humano en el ámbito laboral",
        authorship: "Eduardo Rame (edición propia, publicada en Wikimedia Commons)",
        abstract: "Manual breve (5 páginas) que introduce la psicología del trabajo como ciencia aplicada...",
        image : "assets/imgwebp/psicologiatrabajo.webp",
        countLike: 40,
        comments: [
            {
                imgOwner: "assets/imgwebp/veronicacontacts.webp",
                nameOwner: "Verónica Ramirez",
                text: "Muy claro y conciso, ideal para repasar conceptos básicos."
            },
            {
                imgOwner: "assets/imgwebp/danielcontacts.webp",
                nameOwner: "Daniel Llanes",
                text: "Lo usé para una presentación y me sirvió un montón."
            }
        ]
    },
    {
        imgOwner : "assets/imgwebp/danielcontacts.webp",
        nameOwner: "Daniel Llanes",
        description: "¡Buenas! Descubrí un recurso clave: 'Psicología Educativa' de Julio Varela Barraza...",
        title : "Psicología Educativa – Julio Varela Barraza",
        authorship: "Julio Varela Barraza (Grupo Autismo-ABA)",
        abstract: "Este manual está organizado en 24 módulos didácticos...",
        image : "assets/imgwebp/psicologiatrabajo.webp",
        countLike: 41,
        comments: [
            {
                imgOwner: "assets/imgwebp/constanzacontacts.webp",
                nameOwner: "Constanza Rodriguez",
                text: "¡Excelente aporte! Muy útil para docentes."
            }
        ]
    }
]


function getPost(show) {
    return show(posts);
}
