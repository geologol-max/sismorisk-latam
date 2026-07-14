import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
// Usar PORT dinámico para compatibilidad con Hostinger VPS, Cloud Run, Railway, etc.
const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(express.json({ limit: "1mb" }));

// Rate Limiter para endpoints de IA — Protección contra abuso y costos descontrolados de API
const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Ventana de 15 minutos
  max: 20,                    // Máximo 20 solicitudes por IP por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Demasiadas solicitudes de generación de reportes. Por favor espere 15 minutos e intente nuevamente.",
  },
});

// Inicialización diferida del cliente Gemini para evitar errores catastróficos en arranque
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("La variable de entorno GEMINI_API_KEY no está configurada.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Endpoint de salud
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// API Endpoint para generar reporte de Ingeniería Sismorresistente usando Gemini
app.post("/api/generate-report", aiRateLimiter, async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const {
      projectName,
      country,
      normName,
      zoneName,
      soilName,
      numFloors,
      interstoryHeight,
      typologyName,
      earthquakeMw,
      earthquakeDepth,
      earthquakeDuration,
      pga,
      fundamentalPeriod,
      maxDrift,
      maxDriftFloor,
      baseShear,
      overallRisk,
      habitability,
      driftLimit,
    } = req.body;

    const ai = getGeminiClient();

    const prompt = `
Actúa como un Ingeniero Civil Estructural experto en Sismorresistencia y Especialista en Gestión y Reducción del Riesgo de Desastres (RRD) en Latinoamérica.
Genera un informe técnico formal en Español con recomendaciones profesionales para el siguiente proyecto evaluado en etapas tempranas.

DATOS DEL PROYECTO EVALUADO:
- Nombre del Proyecto: ${projectName || "Evaluación de Riesgo - Escuela Local"}
- Ubicación: ${country} (${zoneName})
- Normativa Aplicada: ${normName}
- Tipo de Suelo: ${soilName}
- Número de Pisos: ${numFloors} pisos
- Altura de entrepiso: ${interstoryHeight} m
- Tipología Constructiva: ${typologyName}

DATOS DEL SISMO EVALUADO:
- Magnitud (Mw): ${earthquakeMw}
- Profundidad Focal: ${earthquakeDepth} km
- Duración de la Fase Fuerte: ${earthquakeDuration || 30} segundos
- PGA Estimado en la base: ${pga.toFixed(3)}g

RESULTADOS DE LA SIMULACIÓN DINÁMICA (MDOF):
- Periodo Fundamental del Edificio: ${fundamentalPeriod.toFixed(3)} segundos
- Cortante Basal de Diseño/Demanda: ${baseShear.toFixed(1)} kN
- Máxima Deriva de Piso Calculada: ${maxDrift.toFixed(5)} (Límite normativo: ${driftLimit})
- Piso con Mayor Deriva: Piso ${maxDriftFloor}
- Nivel de Riesgo Estructural: ${overallRisk}
- Estado de Habitabilidad Post-Sismo: ${habitability}

INSTRUCCIONES PARA EL REPORTE:
1. El informe debe ser riguroso, técnico y redactado con seriedad académica e ingenieril.
2. Debe contener las siguientes secciones bien demarcadas usando formato Markdown estándar:
   - **1. Resumen de Amenaza y Vulnerabilidad**: Explica la relación entre la magnitud del sismo, el tipo de suelo (amplificación) y el comportamiento dinámico.
   - **2. Diagnóstico del Comportamiento Dinámico**: Analiza el periodo fundamental (e.g., si está en rango resonante con el suelo), las derivas y si excedió el límite de la norma ${normName}.
   - **3. Clasificación de Daños Esperados**: Describe detalladamente el tipo de agrietamiento, fallas (corte, flexión, piso blando, etc.) que experimentará esta tipología (${typologyName}) bajo este nivel de deriva (${maxDrift.toFixed(5)}).
   - **4. Plan de Acción y Medidas de Reducción del Riesgo (RRD)**: Proporciona 4 medidas de mitigación específicas (ej. encamisado de concreto, incorporación de muros/placas, disipadores de energía, aislación sísmica, o restricciones de uso) con enfoque latinoamericano.

Mantén el tono profesional e ilustrativo. No utilices jerga innecesariamente compleja sin explicarla.
    `.trim();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.3,
      }
    });

    const reportText = response.text || "No se pudo generar el reporte. Intente nuevamente.";

    res.json({ report: reportText });
  } catch (error: any) {
    console.error("Error generating Gemini report:", error);
    res.status(500).json({
      error: error.message || "Error interno del servidor al procesar la solicitud con la IA.",
    });
  }
});

// API Endpoint para generar reporte específico de vulnerabilidad sísmica en Venezuela (Metodología FUNVISIS)
app.post("/api/generate-vulnerabilidad-ve", aiRateLimiter, async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const {
      buildingName,
      location,
      floors,
      basements,
      semiBasements,
      peopleExposed,
      usageGroup,
      constructionPeriod,
      terrainCondition,
      hasDrainage,
      structuralType,
      irregularities,
      depositDepth,
      deterioroEstrucCemento,
      deterioroEstrucAcero,
      deterioroParedes,
      mantenimientoGeneral,
      indices,
    } = req.body;

    const ai = getGeminiClient();

    const prompt = `
Actúa como un destacado Especialista en Ingeniería Sismorresistente en Venezuela, experto en la metodología de priorización sísmica de la Fundación Venezolana de Investigaciones Sismológicas (FUNVISIS) y la norma COVENIN 1756.

Genera un reporte técnico de evaluación de vulnerabilidad sísmica formal, estructurado e instructivo en Español para la edificación evaluada bajo el marco de la reducción del riesgo de desastres (RRD).

DATOS DE INSPECCIÓN (PLANILLA FUNVISIS G-20007752-2):
- Nombre/Nº Edificación: ${buildingName || "S/N"}
- Ubicación: ${location.state}, ${location.city}, Mun. ${location.municipality}, Parroquia ${location.parish}, Sector ${location.sector}
- Coordenadas UTM: X: ${location.coordX || "S/N"}, Y: ${location.coordY || "S/N"} (Huso: ${location.huso || "S/N"})
- Geometría: ${floors} pisos, ${basements} sótanos, ${semiBasements} semi-sótanos
- Capacidad de Ocupación: ${peopleExposed} personas expuestas
- Grupo de Uso: Grupo ${usageGroup} (Grupo de importancia)
- Período de Construcción: ${constructionPeriod.label} (Norma aplicable de la época)
- Condición del Terreno: ${terrainCondition.label} (Drenaje: ${hasDrainage ? "Sí tiene" : "No tiene (descarga al terreno)"})
- Tipología Estructural: Tipo ${structuralType.id} - ${structuralType.description}
- Irregularidades Presentes: ${irregularities.length > 0 ? irregularities.join(", ") : "Ninguna detectada"}
- Profundidad de Depósito de Sedimentos (>120m, Suelo S3): ${depositDepth ? "Sí (Riesgo en edificios altos)" : "No o No aplica"}
- Grado de Deterioro:
  * Estructura Concreto: ${deterioroEstrucCemento || "Ninguno"}
  * Estructura Acero: ${deterioroEstrucAcero || "Ninguno"}
  * Paredes de Relleno: ${deterioroParedes || "Ninguno"}
  * Estado General de Mantenimiento: ${mantenimientoGeneral}

RESULTADOS DEL CÁLCULO DE ÍNDICES FUNVISIS:
- Índice de Amenaza (Ia): ${indices.Ia.toFixed(3)} (Zona Sísmica de la región)
- Índice de Antigüedad (I1): ${indices.I1.toFixed(1)}
- Índice de Tipo Estructural (I2): ${indices.I2.toFixed(1)}
- Índice de Irregularidad (I3): ${indices.I3.toFixed(1)} (Acotado a 100)
- Índice de Profundidad de Depósito (I4): ${indices.I4.toFixed(1)}
- Índice de Topografía y Drenajes (I5): ${indices.I5.toFixed(1)}
- Índice de Grado de Deterioro (I6): ${indices.I6.toFixed(1)} (Acotado a 100)
- ÍNDICE DE VULNERABILIDAD GLOBAL (Iv): ${indices.Iv.toFixed(2)} (Rango: 0-100) -> Calificación: ${indices.IvLabel}
- ÍNDICE DE IMPORTANCIA (Ii): ${indices.Ii.toFixed(2)}
- ÍNDICE DE RIESGO SÍSMICO (Ir = Ia * Iv): ${indices.Ir.toFixed(2)} (Rango: 0-100) -> Calificación: ${indices.IrLabel}
- ÍNDICE DE PRIORIZACIÓN DE EDIFICIOS (Ip = Ia * Iv * Ii): ${indices.Ip.toFixed(2)} (Rango: 0-100) -> Calificación: P${indices.IpPrioridad}

INSTRUCCIONES PARA LA REDACCIÓN DEL REPORTE:
1. Adopta un tono sumamente técnico, riguroso, formal y didáctico para estudiantes, arquitectos, ingenieros civiles u organismos de gestión de riesgo de desastres en Venezuela.
2. Organiza el reporte con Markdown claro usando la siguiente estructura:
   - ### **1. Diagnóstico de la Amenaza Sísmica Regional**
     * Analiza el nivel de amenaza en el Estado/Región correspondiente a partir del Índice de Amenaza (Ia). Habla del contexto tectónico de fallas sismogénicas principales en Venezuela (Falla de Boconó, Falla de San Sebastián, o Falla de El Pilar) y si las condiciones de ladera/topográficas o drenajes están amplificando la amenaza.
   - ### **2. Análisis de Vulnerabilidad Estructural (Metodología FUNVISIS)**
     * Comenta la influencia del tipo estructural (${structuralType.description}) y la antigüedad (I1 = ${indices.I1}). Discute la norma bajo la cual fue diseñada o si es una vivienda popular autoconstruida (explicar que las viviendas de barrio autoconstruidas son típicamente más vulnerables debido a la falta de ingeniería formal).
     * Detalla la incidencia de las irregularidades detectadas (${irregularities.join(", ")}) en el aumento de la vulnerabilidad (ej. cómo el piso blando o las columnas cortas han causado colapsos históricos como en Cariaco 1997 o Caracas 1967).
   - ### **3. Evaluación del Deterioro y Mantenimiento**
     * Evalúa las condiciones físicas encontradas (deterioro de concreto/acero, agrietamiento de tabiquería y nivel de mantenimiento general) y cómo el índice I6 influye en el comportamiento sismorresistente.
   - ### **4. Clasificación de Riesgo y Nivel de Priorización (RRD)**
     * Interpreta los índices globales Iv (${indices.Iv.toFixed(2)}: ${indices.IvLabel}), Ir (${indices.Ir.toFixed(2)}: ${indices.IrLabel}) e Ip (${indices.Ip.toFixed(2)}: P${indices.IpPrioridad}). Explica si la edificación debe ingresar de forma prioritaria a una fase de estudios detallados de ingeniería estructural (como ensayos no destructivos de esclerometría, ultrasonido o modelado de elementos finitos en SAP2000/ETABS).
   - ### **5. Recomendaciones de Mitigación y Reducción del Riesgo de Desastres**
     * Ofrece al menos 4 recomendaciones específicas para esta edificación (ej. encamisado de columnas de concreto armado con fibra de carbono o camisas de acero, rigidización de muros, corrección de columnas cortas mediante juntas de separación con paredes, mejora de drenajes de laderas, o planes de desalojo escolar/comunitario).

No utilices afirmaciones exageradas, mantén una perspectiva de seguridad y desarrollo óptimo en las sociedades organizadas de Venezuela.
    `.trim();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.3,
      }
    });

    const reportText = response.text || "No se pudo generar el reporte de vulnerabilidad. Intente de nuevo.";

    res.json({ report: reportText });
  } catch (error: any) {
    console.error("Error generating FUNVISIS report:", error);
    res.status(500).json({
      error: error.message || "Error interno del servidor al procesar la solicitud con la IA.",
    });
  }
});

// API Endpoint para generar reporte de vulnerabilidad FEMA P-154
app.post("/api/generate-fema154", aiRateLimiter, async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const {
      buildingName,
      location,
      fecha,
      floors,
      peopleExposed,
      hazardLevel,
      structuralType,
      baseScore,
      modifiers,
      finalScore,
      pasaEvaluacion
    } = req.body;

    const ai = getGeminiClient();

    const prompt = `
Actúa como un Ingeniero Civil Estructural perito y Especialista en Gestión y Reducción del Riesgo de Desastres (RRD) certificado en la metodología FEMA P-154 (Rapid Visual Screening of Buildings for Potential Seismic Hazards).

Genera un reporte técnico de evaluación visual rápida formal, estructurado e instructivo en Español para la edificación evaluada bajo el método de triaje de FEMA.

DATOS DE INSPECCIÓN SÍSMICA RÁPIDA (FEMA P-154):
- Nombre del Edificio: ${buildingName || "S/N"}
- Ubicación/Dirección: ${location || "S/N"}
- Fecha de Inspección: ${fecha || "No especificada"}
- Número de Niveles/Pisos: ${floors} pisos
- Capacidad de Ocupación: ${peopleExposed} personas expuestas
- Nivel de Peligro Sísmico Regional: Peligro ${hazardLevel}
- Tipología Estructural: Tipo ${structuralType.id} - ${structuralType.description}

RESULTADOS DEL CÁLCULO DE SCORE FÍSICO S:
- Puntaje Básico de Partida (Base Score): ${baseScore.toFixed(2)}
- Modificadores Observados: ${modifiers.length > 0 ? modifiers.join(", ") : "Ninguno detectado"}
- PUNTAJE ESTRUCTURAL FINAL (Score S): ${finalScore.toFixed(2)}
- Umbral de Aceptabilidad de FEMA: S = 2.0
- Clasificación de Triaje: ${pasaEvaluacion ? "Probablemente Seguro (S >= 2.0)" : "DETALLADA REQUERIDA (S < 2.0) - Falla la evaluación rápida"}

INSTRUCCIONES PARA LA REDACCIÓN DEL REPORTE:
1. Adopta un tono sumamente profesional, técnico, formal y didáctico para ingenieros, estudiantes de ingeniería, inspectores municipales o gestores de riesgo.
2. Organiza el reporte con Markdown claro usando la siguiente estructura:
   - ### **1. Diagnóstico del Nivel de Peligro Regional**
     * Analiza el nivel de peligro regional seleccionado (${hazardLevel}) y la justificación de por qué la sismicidad influye en los factores base estructurales.
   - ### **2. Análisis de Tipología Estructural y Score Básico**
     * Analiza el tipo de sistema estructural identificado (Tipo ${structuralType.id}: ${structuralType.description}) y explica brevemente su comportamiento intrínseco ante movimientos sísmicos alternantes de corte y flexión (ventajas y limitaciones de esta tipología).
   - ### **3. Impacto de los Modificadores de Puntaje Observados**
     * Explica detalladamente cómo cada uno de los modificadores activos (${modifiers.join(", ")}) reduce el puntaje final y qué significa físicamente (por ejemplo: por qué la irregularidad vertical, el suelo blando, o las construcciones pre-código aumentan sustancialmente el riesgo de daño grave o colapso progresivo).
   - ### **4. Clasificación del Riesgo y Conclusión del Triaje (FEMA P-154)**
     * Interpreta la puntuación final de Score S (${finalScore.toFixed(2)}). Comenta el significado matemático del score (probabilidad logarítmica de colapso) y concluye claramente si el edificio aprueba o si requiere de forma PRIORITARIA y obligatoria una inspección de Fase 2 (evaluación detallada e instrumentada con esclerómetro, ultrasonido o modelado de elementos finitos).
   - ### **5. Recomendaciones Técnicas de Mitigación y Reforzamiento (RRD)**
     * Proporciona al menos 4 recomendaciones técnicas de ingeniería o de RRD específicas para esta edificación y tipología (ej. rigidizar el plano de entrepiso, instalar disipadores histeréticos o viscosos, encamisar columnas de concreto o acero, realizar estudios de interacción suelo-estructura, o planes de desalojo escolar/comunitario).

No uses afirmaciones de venta ni lenguaje florido, mantén una perspectiva de seguridad humana y rigor de cálculo de ingeniería sismorresistente.
    `.trim();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.3,
      }
    });

    const reportText = response.text || "No se pudo generar el reporte FEMA P-154. Intente de nuevo.";

    res.json({ report: reportText });
  } catch (error: any) {
    console.error("Error generating FEMA P-154 report:", error);
    res.status(500).json({
      error: error.message || "Error interno del servidor al procesar la solicitud con la IA.",
    });
  }
});

// API Endpoint para generar reporte de vulnerabilidad GNDT (Benedetti-Petrini)
app.post("/api/generate-gndt", aiRateLimiter, async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const {
      buildingName,
      location,
      floors,
      peopleExposed,
      pgaEsperado,
      mmi,
      indexIv,
      nivelRiesgo,
      descripcionesActivas,
      danioCalculado
    } = req.body;

    const ai = getGeminiClient();

    const prompt = `
Actúa como un Ingeniero Civil Estructural perito y Especialista en Patología de Edificaciones y Reducción de Desastres, especializado en la metodología del Índice de Vulnerabilidad GNDT (Gruppo Nazionale per la Difesa dai Terremoti - Benedetti & Petrini).

Genera un reporte técnico pericial analítico, altamente formal, instructivo y riguroso en Español para la edificación evaluada bajo el método GNDT.

DATOS DE LA EDIFICACIÓN E INSPECCIÓN:
- Nombre de la Estructura: ${buildingName || "S/N"}
- Dirección/Ubicación: ${location || "S/N"}
- Número de Pisos: ${floors} niveles
- Personas Expuestas: ${peopleExposed} ocupantes
- Aceleración Pico del Suelo de Diseño (PGA): ${pgaEsperado.toFixed(2)}g
- Intensidad de Mercalli Modificada Equivalente: MMI ${mmi}

RESULTADOS DEL CÁLCULO GNDT:
- Índice de Vulnerabilidad Normalizado (I_v): ${indexIv} / 100
- Clasificación de Riesgo: ${nivelRiesgo}
- Estimación del Grado de Daño Físico Esperado (D): ${danioCalculado}%

CALIFICACIÓN DE LOS 11 PARÁMETROS OBSERVADOS:
${descripcionesActivas.join("\n")}

INSTRUCCIONES PARA LA REDACCIÓN DEL REPORTE:
1. Emplea un vocabulario estrictamente técnico de ingeniería civil, sismología y patología de materiales. Evita comentarios comerciales o informales.
2. Utiliza Markdown claro para estructurar la auditoría de la siguiente forma:
   - ### **1. Introducción y Marco Teórico de GNDT**
     * Explica brevemente la metodología del Índice de Vulnerabilidad (GNDT de Benedetti y Petrini), justificando por qué es idóneo para evaluar este tipo de edificación y cuál es el significado físico de un Índice de Vulnerabilidad de ${indexIv}/100.
   - ### **2. Análisis Crítico de los 11 Parámetros de Vulnerabilidad**
     * Revisa y comenta de forma resumida pero profunda los 11 parámetros calificados (enfócate especialmente en aquellos con peor calificación: Clase C o Clase D, explicando cómo inciden en el colapso).
   - ### **3. Cruce de PGA y Pronóstico de Daño Estructural (Curva de Vulnerabilidad)**
     * Analiza el escenario de sismo planteado (PGA = ${pgaEsperado.toFixed(2)}g, MMI ${mmi}) y el porcentaje de daño esperado del ${danioCalculado}%. Describe qué tipos de daños físicos reales sufrirá la estructura en concreto, vigas, losas, mamposterías y elementos no estructurales si ocurre este nivel de aceleración sísmica.
   - ### **4. Clasificación de Riesgo y Recomendación de Intervención**
     * Interpreta la severidad del riesgo (${nivelRiesgo}) y concluye de forma concluyente si se requiere evacuación provisional, estudios instrumentados invasivos (ensayos de núcleos de concreto, esclerometría, ultrasonido) o modelado computacional dinámico en software de cálculo.
   - ### **5. Plan de Reforzamiento Estructural y Mitigación (RRD)**
     * Brinda al menos 5 recomendaciones de ingeniería detalladas para mitigar la vulnerabilidad detectada y mejorar la capacidad sísmica de la edificación (ej. encamisado de columnas, rigidización de diafragmas flexibles, arriostramiento metálico, reducción de masa en pisos altos, inyección de grietas estructurales, etc.).

No uses auto-alabanzas ni afirmaciones exageradas, mantén la máxima objetividad de seguridad humana y rigor científico de ingeniería estructural.
    `.trim();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.3,
      }
    });

    const reportText = response.text || "No se pudo generar el reporte de vulnerabilidad GNDT. Intente de nuevo.";

    res.json({ report: reportText });
  } catch (error: any) {
    console.error("Error generating GNDT report:", error);
    res.status(500).json({
      error: error.message || "Error interno del servidor al procesar la solicitud con la IA.",
    });
  }
});

// API Endpoint para generar reporte de simulación educativa de sismo en Venezuela
app.post("/api/generate-simulation-report", aiRateLimiter, async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const {
      magnitude,
      depth,
      crustMaterial,
      waveVelocities,
      detectedFault,
      affectedCities,
    } = req.body;

    const ai = getGeminiClient();

    const citiesDescription = affectedCities.map((c: any) => 
      `- **${c.name}**: Distancia epicentral: ${c.distance.toFixed(1)} km. Tiempo llegada Onda P: ${c.arrivalTimes.p.toFixed(2)}s, Onda S: ${c.arrivalTimes.s.toFixed(2)}s. Intensidad Estimada (Mercalli): ${c.estimatedIntensity}. Riesgo de Daños: ${c.damageEstimate}`
    ).join("\n");

    const prompt = `
Actúa como un destacado Sismólogo y Especialista en Prevención de Desastres de la Fundación Venezolana de Investigaciones Sismológicas (FUNVISIS).
Genera un reporte técnico de simulación sísmica con fines educativos e informativos en Español, analizando de forma rigurosa y clara el sismo simulado en Venezuela.

DATOS DEL SISMO SIMULADO:
- Magnitud de Momento (Mw): ${magnitude}
- Profundidad Focal (Hipocentro): ${depth} km (Clasificación: ${depth <= 70 ? 'Superficial (0-70 km)' : depth <= 300 ? 'Intermedio (70-300 km)' : 'Profundo (300-700 km)'})
- Material de la Corteza Seleccionado: ${crustMaterial}
- Velocidades de Ondas Estimadas:
  * Onda P (Primaria): ${waveVelocities.p.toFixed(2)} km/s
  * Onda S (Secundaria): ${waveVelocities.s.toFixed(2)} km/s
  * Onda R (Rayleigh): ${waveVelocities.r.toFixed(2)} km/s
  * Onda L (Love): ${waveVelocities.l.toFixed(2)} km/s

FALLA SISMOGÉNICA DETECTADA:
- Nombre: ${detectedFault ? detectedFault.name : 'Ninguna falla principal identificada en la cercanía'}
- Tipo de Falla (Neotectónica): ${detectedFault ? detectedFault.type : 'S/N'}
- Tasa de Desplazamiento (Slip Rate): ${detectedFault ? detectedFault.slipRate : 'S/N'}
- Extensión Probable de la Falla: ${detectedFault ? detectedFault.extension : 'S/N'}
- Distancia desde el Epicentro a la Falla: ${detectedFault ? detectedFault.distance.toFixed(1) + ' km' : 'N/A'}

CIUDADES EVALUADAS POR PROXIMIDAD:
${citiesDescription}

INSTRUCCIONES PARA LA REDACCIÓN DEL REPORTE:
1. Adopta un tono académico, técnico pero sumamente didáctico y preventivo, ideal para estudiantes, docentes y el público general interesado en la sismología en Venezuela (Aula Sísmica).
2. Organiza el reporte usando Markdown claro con las siguientes secciones obligatorias:
   - ### **1. Diagnóstico del Evento y Contexto Tectónico**
     * Explica qué tipo de sismo ocurrió de acuerdo a su magnitud y profundidad focal. 
     * Describe la falla geológica detectada (${detectedFault ? detectedFault.name : 'Ninguna'}), su comportamiento neotectónico habitual en el límite de placas Caribe-Sudamericana, y cómo su ubicación geográfica coincide con el epicentro simulado.
   - ### **2. Física de las Ondas Sísmicas y Tiempos de Viaje**
     * Explica didácticamente la diferencia entre las ondas corporales (P y S) y las ondas superficiales (Rayleigh y Love), detallando cómo el material de la corteza (${crustMaterial}) influye en sus velocidades.
     * Analiza el tiempo que tardaron las ondas en llegar a las ciudades más expuestas y explica cómo se siente el arribo de cada tipo de onda (compresión vs sacudida lateral/elíptica).
   - ### **3. Estimación de Daños y Escala de Mercalli**
     * Explica la diferencia fundamental entre Magnitud (energía liberada en el foco) e Intensidad (percepción y daños en superficie, escala de Mercalli Modificada).
     * Detalla los niveles de daños esperados en las poblaciones más próximas de acuerdo a su cercanía y la magnitud simulada, enfatizando la vulnerabilidad del tipo de construcción típico (mampostería informal, edificios sismorresistentes, etc.).
   - ### **4. Medidas de Autoprotección y Cultura Preventiva (RRD)**
     * Proporciona pautas de conducta claras y organizadas sobre qué hacer **ANTES, DURANTE y DESPUÉS** de un sismo de este tipo (enfoque educativo de prevención de FUNVISIS).

Mantén la redacción objetiva pero con un fuerte llamado a la prevención y la educación comunitaria.
    `.trim();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.3,
      }
    });

    const reportText = response.text || "No se pudo generar el reporte de simulación. Intente de nuevo.";

    res.json({ report: reportText });
  } catch (error: any) {
    console.error("Error generating simulation report:", error);
    res.status(500).json({
      error: error.message || "Error interno del servidor al procesar la solicitud con la IA.",
    });
  }
});

// Configuración diferida de Nodemailer para evitar errores si no hay variables de entorno en desarrollo
let mailTransporter: nodemailer.Transporter | null = null;

function getMailTransporter(): nodemailer.Transporter {
  if (!mailTransporter) {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "465", 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      throw new Error("La configuración SMTP (SMTP_HOST, SMTP_USER, SMTP_PASS) no está completa en las variables de entorno.");
    }

    mailTransporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true para puerto 465 (SSL), false para otros (TLS)
      auth: {
        user,
        pass,
      },
      tls: {
        // Permitir certificados autofirmados si es necesario
        rejectUnauthorized: false,
      },
    });
  }
  return mailTransporter;
}

// Endpoint para procesar el formulario de contacto
app.post("/api/contact", async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ error: "Por favor complete los campos obligatorios: Nombre, Correo y Mensaje." });
      return;
    }

    console.log("=========================================");
    console.log(`NUEVO MENSAJE DE CONTACTO RECIBIDO - ${new Date().toISOString()}`);
    console.log(`De: ${name} <${email}>`);
    console.log(`Asunto: ${subject || "Sin asunto"}`);
    console.log("=========================================");

    // Envío del correo real a través de SMTP
    const transporter = getMailTransporter();
    const mailOptions = {
      from: `"${name} (Contacto Web)" <${process.env.SMTP_USER}>`, // El remitente autenticado
      replyTo: email, // Responder al correo del usuario
      to: "contacto@grdesastres.com",
      subject: `[Contacto Web] ${subject || "Nuevo Mensaje de Contacto"}`,
      text: `Has recibido un nuevo mensaje desde el formulario de contacto de tu sitio web:

Nombre: ${name}
Correo: ${email}
Asunto: ${subject || "Sin Asunto"}
Mensaje:
----------------------------------------
${message}
----------------------------------------

Fecha: ${new Date().toLocaleString()}
`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #f8fafc;">
          <h2 style="color: #1e3a8a; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-top: 0;">Nuevo mensaje de contacto</h2>
          <p style="margin: 15px 0;"><strong>Nombre:</strong> ${name}</p>
          <p style="margin: 15px 0;"><strong>Correo:</strong> <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a></p>
          <p style="margin: 15px 0;"><strong>Asunto:</strong> ${subject || "Sin Asunto"}</p>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #ffffff; border-left: 4px solid #3b82f6; border-radius: 4px; color: #334155; line-height: 1.6;">
            <strong>Mensaje:</strong><br />
            ${message.replace(/\n/g, "<br />")}
          </div>
          
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 11px; color: #64748b; text-align: center; margin: 0;">Este correo fue enviado automáticamente desde el formulario de contacto de grdesastres.com</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("Correo enviado con éxito a contacto@grdesastres.com");

    res.json({ success: true, message: "¡Mensaje recibido correctamente! El correo ha sido enviado a la bandeja." });
  } catch (error: any) {
    console.error("Error al procesar/enviar mensaje de contacto:", error);
    if (error.message && error.message.includes("La configuración SMTP")) {
      res.status(500).json({ error: "El servicio de correo no está configurado en el servidor (variables de entorno SMTP faltantes)." });
    } else {
      res.status(500).json({ error: "Error interno al enviar el correo. Por favor, intente más tarde." });
    }
  }
});

// Setup de Vite Middleware o servir archivos estáticos compilados
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SismoRisk LATAM] Servidor escuchando en http://0.0.0.0:${PORT}`);
    console.log(`[SismoRisk LATAM] Entorno: ${process.env.NODE_ENV || "development"}`);
    if (!process.env.GEMINI_API_KEY) {
      console.warn("[SismoRisk LATAM] ⚠️  GEMINI_API_KEY no configurada — los reportes de IA no funcionarán.");
    }
  });
}

setupServer();
