# Operaciones ANSA
## Contexto y estado actual del proyecto

> Este documento sirve como punto de continuidad del proyecto.
> Debe permitir que una persona o una IA pueda comprender el sistema,
> saber qué se ha desarrollado y continuar sin comenzar desde cero.

---

# 1. Nombre del proyecto

**Operaciones ANSA**

Subtítulo:

**Base de Conocimientos Integral**

---

# 2. Objetivo del proyecto

Construir una base de conocimiento inteligente orientada a información
de operaciones aeroportuarias.

El sistema debe permitir realizar preguntas en lenguaje natural y obtener
respuestas basadas exclusivamente en la documentación incorporada a la
Base de Conocimiento.

El sistema utiliza una arquitectura RAG:

**Retrieval-Augmented Generation**

La IA no debe responder utilizando conocimientos externos cuando la
información solicitada no se encuentre suficientemente respaldada por
la Base de Conocimiento.

---

# 3. Objetivos de aprendizaje

El proyecto también se utiliza para aprender progresivamente:

- Arquitectura de software.
- Backend.
- Node.js.
- JavaScript.
- Inteligencia Artificial aplicada.
- RAG.
- Embeddings.
- Búsqueda semántica.
- Modelos de lenguaje locales.
- Ollama.
- Git.
- GitHub.
- AWS.

El proyecto se desarrolla primero de manera local, pero se busca que
su arquitectura pueda evolucionar posteriormente hacia AWS.

---

# 4. Usuario inicial

Actualmente el sistema está pensado para uso personal.

Por el momento:

- No existe autenticación.
- No existe gestión de múltiples usuarios.
- El sistema funciona localmente.

Estas funcionalidades podrán incorporarse posteriormente.

---

# 5. Base de Conocimiento

Actualmente la Base de Conocimiento utiliza archivos Markdown `.md`.

Los documentos contienen información relacionada con operaciones
aeroportuarias.

Actualmente existen documentos del curso de Comunicación Aeronáutica,
entre ellos:

- Lección 1 La Comunicación.
- Lección 2 La Comunicación Aeronáutica.
- Lección 3 Indicativos.
- Lección 4 Radio Frecuencias.
- Lección 5 Pasos de la Comunicación.
- Lección 6 Consecuencias de una comunicación aeronáutica deficiente.

En el futuro también se pretende soportar documentos PDF.

---

# 6. Metadatos de documentos

Durante el desarrollo se comenzó a utilizar encabezado YAML en los
documentos Markdown para clasificarlos.

Ejemplo conceptual:

```yaml
---
id: IAM-CA-L01
titulo: La Comunicación
programa: Inspección de Área de Movimiento
curso: Comunicación Aeronáutica
leccion: 1
categoria: Curso
organizacion:
  - ANAC
area:
  - Operaciones Aeroportuarias
estado: Vigente
version: "1.0"
idioma: es
palabras_clave:
  - comunicación
  - comunicación efectiva
---
