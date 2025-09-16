# Explicación del Esquema de Colores - PsychoShare

## Resumen
Este documento explica el significado y uso de los colores en el sitio web de PsychoShare, especialmente los colores **rosa**, **azul** y el uso de tonos neutros en la interfaz de usuario.

## Esquema de Colores Principal

### 🌸 Colores Rosa/Rosado
- **Color principal**: `#b58d93` y `#b48d92`
- **Uso**: Este es el color principal de la marca PsychoShare
- **Función**: 
  - Botones principales de acción
  - Elementos destacados
  - Botones de envío (submit)
  - Acciones principales como "Me gusta", "Comentar", "PDF"
- **Significado**: Representa la identidad visual de la plataforma, sugiere calidez y accesibilidad en el ámbito de la psicología

### 🔵 Colores Azul
- **Color secundario**: `#8ea0bf` y `#8fa0bf`
- **Uso**: Color de interacción y estados hover
- **Función**:
  - Estados hover (cuando pasas el mouse sobre botones)
  - Elementos secundarios
  - Fondos informativos (`#a5b7d4`)
- **Significado**: Transmite confianza, profesionalismo y estabilidad, apropiado para una plataforma académica

### 🟢 Verde
- **Estado actual**: No se encontró un color verde específico en el esquema actual
- **Posible implementación futura**: Podría usarse para:
  - Estados de éxito (confirmaciones)
  - Notificaciones positivas
  - Elementos de validación

## Paleta de Colores Completa

```css
:root {
    --color-primary: #b48d92;        /* Rosa principal */
    --color-accent: #d6938a;         /* Rosa acento */
    --color-ui-background: #a597a1;  /* Fondo UI */
    --color-secondary: #8fa0bf;      /* Azul secundario */
    --color-info-background: #a5b7d4; /* Fondo informativo azul */
    --color-highlight: #ef9d7f;      /* Resaltado naranja */
    --color-highlight-soft: #fcb08c;  /* Resaltado suave */
    --color-text-main: #333333;      /* Texto principal */
    --color-text-light: #ffffff;     /* Texto claro */
    --color-background-main: #f8f9fb; /* Fondo principal */
    --color-background-card: #ffffff; /* Fondo de tarjetas */
    --color-border: #e0e0e0;         /* Bordes */
}
```

## Uso en la Interfaz

### Botones y Acciones
- **Rosa** (`#b58d93`): Botones primarios, acciones principales
- **Azul** (`#8ea0bf`): Estados hover, acciones secundarias
- **Grises**: Elementos neutros, placeholders, bordes

### Estados de Interacción
1. **Estado normal**: Rosa para elementos activos
2. **Estado hover**: Transición a azul para feedback visual
3. **Estado inactivo**: Grises para elementos deshabilitados

## ¿Los Colores Están Pidiendo Hacer Algo?

### Sí, los colores tienen propósitos específicos:

1. **Rosa indica acción principal**: 
   - "Haz clic aquí para la acción más importante"
   - Guía la atención del usuario hacia acciones clave

2. **Azul indica interactividad**:
   - "Este elemento es interactivo"
   - Confirma que el usuario puede interactuar con el elemento

3. **Grises indican información pasiva**:
   - Contenido informativo sin acción requerida
   - Elementos de soporte visual

## Implementación Técnica

Los colores se implementan mediante:
- Variables CSS en `_global.css`
- Clases específicas en `custom.css`
- Estados hover definidos para feedback visual
- Consistencia en todos los componentes de la interfaz

## Recomendaciones

1. **Mantener consistencia**: Usar siempre rosa para acciones principales
2. **Contraste adecuado**: Los colores elegidos tienen buen contraste para accesibilidad
3. **Feedback visual**: El cambio rosa→azul en hover mejora la experiencia de usuario
4. **Posible expansión**: Considerar agregar verde para estados de éxito en futuras versiones

---

*Este documento explica el sistema de colores actual de PsychoShare. Los colores no solo son decorativos, sino que guían la interacción del usuario y comunican la jerarquía de acciones en la plataforma.*