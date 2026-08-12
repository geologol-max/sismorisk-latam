import React, { useState, useEffect, useRef } from "react";
import { 
  Activity, 
  BookOpen, 
  HelpCircle, 
  Shield, 
  Globe, 
  Flame, 
  Play, 
  Pause, 
  Download, 
  Users, 
  FileText, 
  ChevronRight, 
  Volume2, 
  ExternalLink,
  Award,
  Bookmark,
  Info,
  Layers,
  Map,
  Compass,
  ArrowRight,
  Sparkles,
  Heart,
  Building2,
  Mail,
  Send,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  HardHat,
  Settings,
  CheckCircle,
  XCircle,
  RotateCcw,
  Check,
  Video,
  Eye,
  Users,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Importación de fotos reales e imágenes del proyecto
import jairoSnow from "../assets/jairo_snow.jpg";
import jairoClass from "../assets/jairo_class.jpg";
import jairoEcuador from "../assets/jairo_ecuador.jpg";
import jairoNepal from "../assets/jairo_nepal.jpg";
import jairoData from "../assets/jairo_data.jpg";
import jairoPelambres from "../assets/jairo_pelambres.jpg";
import jairoNera from "../assets/jairo_nera.jpg";
import jairoPc from "../assets/jairo_pc.jpg";
import jairoMolinstec from "../assets/jairo_molinstec.jpg";
import earthquakeHero from "../assets/earthquake_hero.jpg";
import collapsedBuilding from "../assets/collapsed_building.jpg";
import earthStructure from "../assets/earth_structure.jpg";
import jairoNepalRescue1 from "../assets/jairo_nepal_rescue_1.jpg";
import jairoNepalRescue2 from "../assets/jairo_nepal_rescue_2.jpg";
import jairoRescueSearch from "../assets/jairo_rescue_search.jpg";
import jairoNepalClose from "../assets/jairo_nepal_close.jpg";
import jairoEcuadorCollapse from "../assets/jairo_ecuador_collapse.jpg";
import grdesastresLogo from "../assets/grdesastres_logo.png";
import emergencyKitHero from "../assets/emergency_kit_hero.jpg";
import firePreventionHero from "../assets/fire_prevention_hero.jpg";

interface LandingPageProps {
  onNavigate: (tab: "inicio" | "modelo" | "espectro" | "vulnerabilidad" | "fema" | "gndt" | "simulador") => void;
  heroVideoUrl?: string;
}

// ----------------------------------------------------
// DATOS BIBLIOGRÁFICOS
// ----------------------------------------------------
interface BiblioItem {
  id: string;
  title: string;
  author: string;
  year: string;
  source: string;
  description: string;
  downloadUrl: string;
  category: "Normativas" | "Manuales" | "RRD" | "Sismología";
}

const BIBLIOGRAFIA_DB: BiblioItem[] = [
  {
    id: "bib-1",
    title: "Norma COVENIN 1756-1:2019 - Edificaciones Sismorresistentes",
    author: "FUNVISIS & Ministerio de Obras Públicas",
    year: "2019",
    source: "Fondo Norma Venezuela",
    description: "Requisitos mínimos de diseño sismorresistente para edificaciones nuevas en el territorio nacional venezolano, detallando mapas de zonificación, tipos de suelos y espectros de diseño elásticos.",
    downloadUrl: "https://www.funvisis.gob.ve/",
    category: "Normativas"
  },
  {
    id: "bib-2",
    title: "FEMA P-154: Rapid Visual Screening of Buildings for Potential Seismic Hazards",
    author: "Federal Emergency Management Agency (FEMA)",
    year: "2015",
    source: "Applied Technology Council (ATC-130)",
    description: "Metodología estándar norteamericana para la identificación y cribado rápido de edificaciones vulnerables a sismos mediante puntajes básicos y modificadores estructurales.",
    downloadUrl: "https://www.fema.gov/",
    category: "Manuales"
  },
  {
    id: "bib-3",
    title: "Sismología de Venezuela y Caracterización de Fallas Activas",
    author: "FUNVISIS Red Sismológica Nacional",
    year: "2021",
    source: "Ediciones de Investigación FUNVISIS",
    description: "Estudio geotécnico sobre el sistema de fallas de Boconó, San Sebastián y El Pilar. Mapas de aceleración espectral e históricos de sismicidad.",
    downloadUrl: "https://www.funvisis.gob.ve/",
    category: "Sismología"
  },
  {
    id: "bib-4",
    title: "GNDT-1984: Istruzioni per la compilazione della scheda di vulnerabilità di I e II livello",
    author: "Gruppo Nazionale per la Difesa dai Terremoti (GNDT)",
    year: "1984",
    source: "CNR - Italia",
    description: "Guía metodológica italiana para la recopilación del índice de vulnerabilidad mediante 11 parámetros críticos para mampostería y estructuras portantes.",
    downloadUrl: "#",
    category: "Normativas"
  },
  {
    id: "bib-5",
    title: "Marco de Sendai para la Reducción del Riesgo de Desastres (2015-2030)",
    author: "Oficina de las Naciones Unidas para la RRD (UNDRR)",
    year: "2015",
    source: "Naciones Unidas",
    description: "Acuerdo internacional que establece 7 objetivos mundiales y 4 prioridades de acción para prevenir nuevos riesgos de desastres y reducir los existentes.",
    downloadUrl: "https://www.undrr.org/",
    category: "RRD"
  }
];

// ----------------------------------------------------
// DATOS DE HÉROES ANÓNIMOS
// ----------------------------------------------------
interface HeroeItem {
  id: string;
  name: string;
  role: string;
  group: string;
  imageAlt: string;
  story: string;
  achievement: string;
  avatarBg: string;
}

const HEROES_DB: HeroeItem[] = [
  {
    id: "hero-1",
    name: "Cabo José 'Cheo' Miranda",
    role: "Especialista en Búsqueda y Rescate Urbano (USAR)",
    group: "Protección Civil y Administración de Desastres",
    imageAlt: "Rescatista con traje naranja y casco de seguridad",
    story: "Con más de 18 años de servicio activo en terremotos de la región andina y el Caribe, coordinó el rescate de sobrevivientes bajo estructuras colapsadas en condiciones extremas, priorizando el soporte vital inmediato.",
    achievement: "Líder táctico en 12 misiones humanitarias internacionales de rescate en estructuras colapsadas.",
    avatarBg: "bg-orange-600"
  },
  {
    id: "hero-2",
    name: "Kala & Drako",
    role: "Caninos K9 de Rescate y Localización",
    group: "Unidad K9 de Búsqueda de FUNVISIS / Bomberos",
    imageAlt: "Golden Retriever de rescate con arnés reflectante",
    story: "Esta valiente Golden Retriever y su compañero Pastor Alemán han sido entrenados rigurosamente para detectar señales químicas humanas atrapadas profundamente bajo escombros. Su agudeza olfativa ha salvado vidas críticas tras colapsos súbitos.",
    achievement: "Localización exitosa de 8 personas atrapadas en desastres sísmicos urbanos.",
    avatarBg: "bg-yellow-600"
  },
  {
    id: "hero-3",
    name: "Dra. Gloria Romero",
    role: "Sismóloga e Investigadora de Red de Fallas",
    group: "Departamento de Geofísica, FUNVISIS",
    imageAlt: "Ingeniera con casco blanco analizando datos geológicos",
    story: "Dedicó su vida a registrar los micro-sismos de la falla de Boconó. Con sensores manuales y estaciones satelitales, documenta patrones sísmicos que alimentan los sistemas de alerta temprana de escuelas y hospitales.",
    achievement: "Desarrollo del primer mapa interactivo micro-sísmico de alta resolución para la cordillera andina.",
    avatarBg: "bg-blue-600"
  }
];

// ----------------------------------------------------
// DATOS DE BLOGS ESPECIALISTAS
// ----------------------------------------------------
interface BlogItem {
  id: string;
  title: string;
  author: string;
  role: string;
  date: string;
  readTime: string;
  summary: string;
  content: string;
  videoUrl?: string;
}

const BLOGS_DB: BlogItem[] = [
  {
    id: "blog-1",
    title: "La Falla de Boconó: El motor sísmico del occidente de Venezuela",
    author: "Ing. Geólogo Alejandro Delgado",
    role: "Consultor en Sismotectónica",
    date: "8 de Julio, 2026",
    readTime: "6 min de lectura",
    summary: "Una mirada profunda al sistema sismogénico más activo de Venezuela, su tasa de deslizamiento de 5 mm al año y por qué las construcciones andinas necesitan aisladores modernos.",
    content: "La falla de Boconó se extiende por más de 500 km entre la frontera colombiana y el mar Caribe. Su movimiento transcurrente dextral acumula esfuerzos de compresión inmensos debido al empuje de la placa del Caribe contra la placa de Sudamérica. El análisis histórico revela terremotos catastróficos cada 120-150 años. Mitigar este riesgo no solo requiere mapas avanzados, sino también un estricto control de materiales de construcción y reformas estructurales retroactivas mediante metodologías de cribado rápido como FEMA P-154 y FUNVISIS."
  },
  {
    id: "blog-2",
    title: "Lecciones de Chile: El éxito del diseño sismorresistente con disipadores",
    author: "Dra. Carmen Martínez",
    role: "Especialista en Ingeniería Estructural",
    date: "25 de Junio, 2026",
    readTime: "8 min de lectura",
    summary: "Chile resiste terremotos de magnitud Mw 8.8 sufriendo daños estructurales ínfimos. Analizamos el papel de la ductilidad y la disipación sísmica de energía basal.",
    content: "Chile se ubica en el cinturón de fuego del Pacífico, zona de subducción masiva entre la placa de Nazca y la placa Sudamericana. El secreto de su resiliencia reside en la estricta aplicación de la norma NCh433 y el uso obligatorio de muros de hormigón armado con altos niveles de confinamiento. Además, los sistemas modernos de aislamiento basal desacoplan la estructura del movimiento del terreno, reduciendo las aceleraciones de piso hasta en un 80%, salvando vidas y garantizando la operatividad de hospitales claves post-evento."
  },
  {
    id: "blog-3",
    title: "Cribado Rápido (RVS): El primer escudo ante el colapso masivo de escuelas",
    author: "MSc. Carlos Valenzuela",
    role: "Coordinador de Gestión de Riesgos de Desastres",
    date: "12 de Mayo, 2026",
    readTime: "5 min de lectura",
    summary: "Por qué evaluar edificios visualmente es el método más eficiente y de menor costo para que los gobiernos prioricen fondos de reforzamiento estructural.",
    content: "No es económicamente viable realizar análisis matemáticos complejos paso a paso para todas las edificaciones de una gran urbe. Los métodos de cribado rápido visual (como FEMA P-154) permiten clasificar miles de edificaciones en días. Un evaluador capacitado puede identificar factores de riesgo como irregularidad en planta, columna corta, piso débil o amplificación por suelo local en cuestión de 15 minutos, arrojando un puntaje de seguridad objetivo. Esto permite salvar vidas canalizando subsidios de refuerzo de forma quirúrgica."
  },
  {
    id: "blog-4",
    title: "Sismotectónica de los recientes terremotos en Venezuela Norcentral",
    author: "Ph.D. Franck Audemard",
    role: "Sismólogo y Paleosismólogo",
    date: "16 de Julio, 2026",
    readTime: "Webinar Completo",
    summary: "Grabación del seminario web de la SPE Caracas Petroleum Section sobre la sismotectónica norcentral de Venezuela y la dinámica de fallas activas.",
    content: "En esta conferencia técnica virtual auspiciada por la SPE Caracas, el Dr. Franck Audemard expone las dinámicas sismotectónicas de los últimos eventos telúricos registrados en el norte de Venezuela.\n\nEl análisis describe la tectónica de placas en el límite Caribe-Sudamérica, el papel sismogénico de los sistemas de fallas de San Sebastián y La Victoria, y el fenómeno de dobletes sísmicos. Se discuten las implicaciones para la evaluación de riesgo sísmico y la mitigación de desastres en áreas urbanas densamente pobladas.",
    videoUrl: "https://www.youtube.com/live/fOw8MurOTLs"
  }
];

// --- DATOS DEL AULA VIRTUAL & BANCO DE PREGUNTAS DEL TEST SISMO ---
interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const EARTHQUAKE_QUIZ_BANK: QuizQuestion[] = [
  {
    id: 1,
    question: "¿Cuál es el protocolo de autoprotección recomendado MIENTRAS ocurre el movimiento sísmico?",
    options: [
      "Salir corriendo hacia la calle inmediatamente",
      "Agacharse, cubrirse debajo de una mesa firme y aferrarse",
      "Subir en el ascensor hacia la azotea",
      "Pararse junto a grandes ventanas de vidrio"
    ],
    correctAnswer: 1,
    explanation: "Agacharse, cubrirse y aferrarse es la maniobra estándar internacional para evitar caídas y proteger la cabeza de desprendimientos."
  },
  {
    id: 2,
    question: "¿Por qué está estrictamente prohibido usar ascensores durante o inmediatamente después de un sismo?",
    options: [
      "Porque se desplazan demasiado lento",
      "Por riesgo inminente de atrapamiento e interrupción del servicio eléctrico",
      "Porque están reservados exclusivamente para el personal de rescate",
      "No hay ninguna contraindicación para usarlos"
    ],
    correctAnswer: 1,
    explanation: "Los movimientos telúricos pueden causar desalineación de los rieles de ascensores y cortes eléctricos instantáneos."
  },
  {
    id: 3,
    question: "Antes de que ocurra un sismo, ¿cuál es una medida preventiva clave en hogares y oficinas?",
    options: [
      "Fijar estantes altos, libreros y calentadores a elementos estructurales rígidos",
      "Dejar los muebles pesados sueltos cerca de las vías de salida",
      "Colocar frascos de cristal en repisas altas sin sujeción",
      "Cerrar con doble llave todas las puertas internas"
    ],
    correctAnswer: 0,
    explanation: "El volcamiento de mobiliario alto u objetos pesados es una de las causas principales de lesiones en interiores."
  },
  {
    id: 4,
    question: "¿Cuáles son consideradas zonas de cobertura o resguardo seguro dentro de una edificación?",
    options: [
      "Al lado de ventanales y fachadas de vidrio",
      "Debajo de mesas resistentes, dinteles o junto a columnas de hormigón armado",
      "Debajo de lámparas pesadas y techos falsos no fijados",
      "En la cocina al lado de las tuberías de gas"
    ],
    correctAnswer: 1,
    explanation: "Las mesas sólidas y elementos estructurales rígidos protegen contra la caída de mampostería, losas y cielo raso."
  },
  {
    id: 5,
    question: "¿Qué tipo de ondas sísmicas son las más rápidas y llegan primero a la estructura?",
    options: [
      "Ondas P (Primarias / Compresionales)",
      "Ondas S (Secundarias / Corte)",
      "Ondas de Rayleigh",
      "Ondas Love"
    ],
    correctAnswer: 0,
    explanation: "Las ondas P se desplazan a mayor velocidad en la corteza terrestre, seguidas poco después por las ondas S cortantes."
  },
  {
    id: 6,
    question: "Inmediatamente después de que cese el movimiento sísmico, ¿qué acción de seguridad es prioritaria?",
    options: [
      "Encender fósforos o velas para iluminar la vivienda",
      "Verificar grietas estructurales en X y cerrar llaves de paso de gas y electricidad",
      "Conectar todos los artefactos eléctricos de inmediato",
      "Evacuar corriendo sin mirar los alrededores"
    ],
    correctAnswer: 1,
    explanation: "Cerrar llaves de gas y luz evita incendios y explosiones ante posibles fugas causadas por el sismo."
  },
  {
    id: 7,
    question: "¿Por qué vía debe realizarse la evacuación segura de un edificio tras un evento sísmico?",
    options: [
      "Exclusivamente por las escaleras de emergencia hacia la zona de seguridad",
      "Por los ascensores de carga",
      "Por los ductos de basura o ventilación",
      "Saltando por las ventanas"
    ],
    correctAnswer: 0,
    explanation: "Las escaleras constituyen la única vía segura de escape vertical en caso de fallas de energía o emergencias."
  },
  {
    id: 8,
    question: "¿Para cuántas horas de autonomía mínima debe estar preparada la Mochila de Emergencia familiar?",
    options: [
      "12 horas",
      "24 horas",
      "72 horas",
      "1 mes"
    ],
    correctAnswer: 2,
    explanation: "Una mochila de 72 horas garantiza agua, alimento y primeros auxilios mientras arriban los servicios de auxilio."
  },
  {
    id: 9,
    question: "Si el sismo te sorprende al aire libre en la calle, ¿qué debes evitar?",
    options: [
      "Permanecer cerca de cables de alta tensión, postes, cornisas y fachadas de vidrio",
      "Ubicarte en un parque o plaza abierta",
      "Proteger tu cabeza con tus brazos",
      "Mantener la calma"
    ],
    correctAnswer: 0,
    explanation: "El desprendimiento de vidrios de fachadas y la caída de cables eléctricos representan riesgos graves en las vías públicas."
  },
  {
    id: 10,
    question: "¿Con qué frecuencia mínima se recomienda realizar simulacros de evacuación en viviendas y lugares de trabajo?",
    options: [
      "Al menos 2 veces al año",
      "Una vez cada 10 años",
      "Nunca es necesario",
      "Solo cuando ocurra un temblor real"
    ],
    correctAnswer: 0,
    explanation: "Los simulacros periódicos ayudan a automatizar las rutas de escape y reducir el tiempo de respuesta."
  }
];

const FIRE_QUIZ_BANK: QuizQuestion[] = [
  {
    id: 101,
    question: "¿Cuáles son los 3 elementos fundamentales que componen el Triángulo del Fuego?",
    options: [
      "Oxígeno, Nitrógeno y Dióxido de Carbono",
      "Combustible, Comburente (Oxígeno) y Fuente de Calor",
      "Agua, Aceite y Electricidad",
      "Madera, Plástico y Espuma"
    ],
    correctAnswer: 1,
    explanation: "Sin combustible, oxígeno o calor suficiente, el fuego no puede iniciarse ni sostenerse."
  },
  {
    id: 102,
    question: "¿Qué significa la sigla 'PASS' en el protocolo internacional de uso de extintores?",
    options: [
      "Parar, Alentar, Soplar, Salir",
      "Tirar del seguro, Apuntar a la base, Presionar la manilla y Barrer de lado a lado",
      "Presionar, Agitar, Sacudir, Soltar",
      "Paso 1, Apagar, Secar, Salir"
    ],
    correctAnswer: 1,
    explanation: "PASS en inglés (Pull, Aim, Squeeze, Sweep) es la técnica secuencial para combatir un conato de incendio."
  },
  {
    id: 103,
    question: "En presencia de humo denso dentro de un inmueble en llamas, ¿cuál es la forma correcta de desplazarse hacia la salida?",
    options: [
      "Caminando erguido a paso veloz",
      "Gateando al ras del suelo tapando nariz y boca con un paño",
      "Corriendo mientras se inhala profundamente",
      "Saltando por encima del humo"
    ],
    correctAnswer: 1,
    explanation: "El aire más limpio y menos caliente se mantiene cerca del suelo debido a la flotabilidad de los gases calientes."
  },
  {
    id: 104,
    question: "¿Cuál es la causa principal de fatalidades durante incendios en espacios cerrados?",
    options: [
      "Inhalación de monóxido de carbono y humos tóxicos",
      "Quemaduras directas de piel por llama viva",
      "Caída de vidrios rotos",
      "Agotamiento físico por correr"
    ],
    correctAnswer: 0,
    explanation: "Los gases tóxicos e irritantes privan de oxígeno al cuerpo y causan asfixia o desorientación antes de ser alcanzado por el fuego."
  },
  {
    id: 105,
    question: "Antes de abrir una puerta cerrada durante la evacuación por incendio, ¿qué precaución se debe tomar?",
    options: [
      "Tocar la puerta o la perilla con el dorso de la mano para verificar si está caliente",
      "Abrirla bruscamente para ventilación rápida",
      "Mirar por la cerradura acercando el ojo",
      "Patearla fuertemente para derribarla"
    ],
    correctAnswer: 0,
    explanation: "Si la puerta o perilla está caliente, indica que hay fuego activo del otro lado y no debe abrirse."
  },
  {
    id: 106,
    question: "¿Qué tipo de extintor es el más adecuado para incendios que involucran equipos eléctricos energizados (Clase C)?",
    options: [
      "Extintor de Agua Presurizada",
      "Extintor de Polvo Químico Seco (ABC) o CO2",
      "Baldes de agua potable",
      "Mantas húmedas de algodón"
    ],
    correctAnswer: 1,
    explanation: "El CO2 y el Polvo Químico Seco no conducen electricidad, evitando descargas eléctricas fatales al operador."
  },
  {
    id: 107,
    question: "¿Qué debes hacer si tu ropa se enciende accidentalmente por llamas?",
    options: [
      "Correr velozmente para apagar el fuego con el aire",
      "Detenerte, Tirarte al suelo y Rodar cubriendo tu rostro",
      "Gritar mientras saltas en el mismo lugar",
      "Quitarte la ropa tirándola hacia arriba"
    ],
    correctAnswer: 1,
    explanation: "Detenerse, tirarse al suelo y rodar sofoca el fuego por sofocación al eliminar el contacto directo con el oxígeno."
  },
  {
    id: 108,
    question: "¿Con qué frecuencia se recomienda probar los detectores de humo instalados en viviendas?",
    options: [
      "Una vez al mes",
      "Una vez cada 5 años",
      "Únicamente cuando suene por cocinar",
      "No requieren prueba"
    ],
    correctAnswer: 0,
    explanation: "Probar los detectores mensualmente garantiza que la batería y los sensores fotoeléctricos funcionen activamente."
  },
  {
    id: 109,
    question: "¿Por qué está prohibido sobrecargar adaptadores múltiples ('zapatillas') en tomacorrientes?",
    options: [
      "Porque causa cortocircuitos y sobrecalentamiento de líneas eléctricas",
      "Porque gasta demasiada energía de la red pública",
      "Porque apaga las luces automáticamente",
      "No hay ningún peligro en sobrecargarlos"
    ],
    correctAnswer: 0,
    explanation: "La sobrecarga eléctrica genera calor excesivo en conductores, derritiendo aislantes e iniciando incendios internos."
  },
  {
    id: 110,
    question: "Una vez que hayas evacuado completamente hacia la zona de seguridad exterior, ¿qué regla es infranqueable?",
    options: [
      "Bajo ninguna circunstancia reingresar al inmueble en llamas",
      "Volver por objetos personales de valor",
      "Regresar a apagar las luces que quedaron encendidas",
      "Ingresar para tomar fotos de la emergencia"
    ],
    correctAnswer: 0,
    explanation: "Reingresar a un edificio incendiado es causa mayor de fatalidades; los bomberos son los únicos equipados para rescate."
  }
];

const FLOOD_QUIZ_BANK: QuizQuestion[] = [
  {
    id: 201,
    question: "¿Qué profundidad de agua en movimiento rápido es suficiente para derribar a una persona adulta?",
    options: [
      "Apenas 15 cm de corriente de agua",
      "2 metros de profundidad",
      "5 metros de profundidad",
      "El agua no puede derribar a un adulto"
    ],
    correctAnswer: 0,
    explanation: "Solo 15 cm de agua en movimiento ejercen fuerza suficiente para hacer perder el equilibrio y arrastrar a un adulto."
  },
  {
    id: 202,
    question: "¿Qué profundidad de flujo de agua puede hacer flotar o desplazar un automóvil convencional fuera de la vía?",
    options: [
      "Entre 30 y 50 cm de agua",
      "3 metros de profundidad",
      "Solo si llega al techo",
      "Los autos nunca flotan"
    ],
    correctAnswer: 0,
    explanation: "30 a 50 cm de agua generan flotabilidad suficiente en neumáticos y chasis para desplazar un vehículo fuera de control."
  },
  {
    id: 203,
    question: "¿Cuál es la primera acción preventiva en la vivienda si el agua de crecida comienza a subir e ingresar?",
    options: [
      "Desconectar el interruptor general de luz antes de que el agua toque los tomacorrientes",
      "Encender todos los electrodomésticos",
      "Abrir la manguera del jardín",
      "Quedarse descalzo sobre el agua"
    ],
    correctAnswer: 0,
    explanation: "Cortar el suministro eléctrico evita electrocuciones masivas si el agua alcanza tableros o enchufes."
  },
  {
    id: 204,
    question: "Si debes evacuar una zona inundable a pie, ¿por dónde debes evitar transitar?",
    options: [
      "Por corrientes de agua rápida, zanjas, alcantarillas sin tapa y puentes socavados",
      "Por rutas altas señalizadas",
      "Por lomas y cerros elevados",
      "Por pasarelas elevadas secas"
    ],
    correctAnswer: 0,
    explanation: "Las alcantarillas abiertas bajo el agua y el flujo turbulento arrastran a las personas impidiendo su rescate."
  },
  {
    id: 205,
    question: "Tras una inundación, ¿qué precaución sanitaria se debe tomar con el agua de consumo?",
    options: [
      "Consumir únicamente agua embotellada o hervirla durante 3 a 5 minutos",
      "Tomar directamente del grifo sin filtrar",
      "Tomar agua estancada de las calles",
      "Mezclar el agua con aceite"
    ],
    correctAnswer: 0,
    explanation: "Las inundaciones contaminan las redes de agua con bacterias y aguas servidas; hervir elimina patógenos mortales."
  }
];

const KIT_QUIZ_BANK: QuizQuestion[] = [
  {
    id: 301,
    question: "¿Cuál es el volumen de agua potable de cálculo recomendado por persona en la fórmula de la Mochila de 72 Horas?",
    options: [
      "1 litro total",
      "9 litros por persona (3 litros/día durante 3 días)",
      "50 litros por persona",
      "No se requiere agua en la mochila"
    ],
    correctAnswer: 1,
    explanation: "La regla estandarizada es 1 persona × 3 días × 3 L/día = 9 Litros totales para consumo biológico e higiene básica."
  },
  {
    id: 302,
    question: "¿Por qué el horizonte temporal estándar de la mochila de supervivencia es de 72 horas?",
    options: [
      "Porque es el tiempo promedio estadístico que tardan en desplegarse los equipos de asistencia y rescate externo",
      "Porque los alimentos se vencen exactamente a los 3 días",
      "Porque las linternas solo duran 72 horas encendidas",
      "Fue una cifra elegida al azar"
    ],
    correctAnswer: 0,
    explanation: "En desastres mayores, las primeras 72 horas son la ventana crítica de autonomía ciudadana previa a la llegada de apoyo externo."
  },
  {
    id: 303,
    question: "¿Cómo deben almacenarse los documentos personales de propiedad e identificación dentro del kit?",
    options: [
      "Sueltos en el fondo de la mochila",
      "En bolsas plásticas herméticas estancas impermeables (Ziploc) o formato digital protegido",
      "En un sobre de papel simple",
      "En el automóvil estacionado fuera"
    ],
    correctAnswer: 1,
    explanation: "Las bolsas estancas protegen los documentos de identificación y registros legales contra agua, lodo y roturas."
  },
  {
    id: 304,
    question: "En el sistema de nutrición táctica para la mochila de 72 horas, ¿qué tipo de alimentos deben priorizarse?",
    options: [
      "Alimentos frescos que requieran refrigeración",
      "Barras de proteína calórica, enlatados con abre fácil y comida lista para consumir sin cocción",
      "Carnes crudas para cocinar a la parrilla",
      "Sopas congeladas"
    ],
    correctAnswer: 1,
    explanation: "Los alimentos no perecibles, de alta densidad calórica y listos para comer garantizan nutrición sin depender de gas o estufas."
  },
  {
    id: 305,
    question: "¿En qué lugar de la vivienda debe ubicarse la Mochila de Emergencia?",
    options: [
      "En un lugar visible de fácil acceso cercano a la ruta principal de salida",
      "Guardada bajo llave al fondo de un depósito",
      "En el entretecho o altillo de la casa",
      "En el sótano sin iluminación"
    ],
    correctAnswer: 0,
    explanation: "Estar ubicada junto a la vía de evacuación permite tomarla en segundos al momento de abandonar el inmueble."
  },
  {
    id: 306,
    question: "¿Qué tipo de linterna es la más funcional y recomendada para mantener las manos libres en labores de evacuación?",
    options: [
      "Linterna frontal de cabeza (Headlamp) LED",
      "Linterna pesada de mano de cristal",
      "La luz del teléfono celular únicamente",
      "Velas de cera tradicionales"
    ],
    correctAnswer: 0,
    explanation: "La linterna de cabeza ilumina la trayectoria mientras deja libres ambas manos para escalar, sujetarse o portar niños."
  },
  {
    id: 307,
    question: "Además de linternas, ¿qué dispositivo de comunicación e información a batería es indispensable en el kit?",
    options: [
      "Televisor de pantalla plana",
      "Radio portátil a batería o manivela dinamo (AM/FM/NOAA)",
      "Consola de videojuegos portátil",
      "Computadora de escritorio"
    ],
    correctAnswer: 1,
    explanation: "La radio a baterías o dinamo permite captar partes informativos de emergencia cuando las redes móviles caen."
  },
  {
    id: 308,
    question: "¿Por qué debe evitarse el uso de velas tradicionales como fuente de iluminación durante y después de un sismo o emergencia?",
    options: [
      "Porque iluminan demasiado",
      "Porque la llama abierta puede iniciar un incendio ante fugas imperceptibles de gas",
      "Porque gastan demasiada energía",
      "Porque son prohibidas por ley"
    ],
    correctAnswer: 1,
    explanation: "Las fugas de gas por ruptura de tuberías son comunes tras desastres; cualquier llama abierta causa explosiones instantáneas."
  },
  {
    id: 309,
    question: "¿Qué elemento acústico liviano se debe incluir en la mochila para señalización en caso de quedar atrapado bajo escombros?",
    options: [
      "Un silbato de emergencia sin bola interna",
      "Un parlante Bluetooth de alta potencia",
      "Una campana pesada de bronce",
      "Una bocina de aire comprimido"
    ],
    correctAnswer: 0,
    explanation: "El silbato emite un sonido agudo de alcance prolongado que requiere mínimo esfuerzo físico para ser detectado por rescatistas USAR."
  },
  {
    id: 310,
    question: "¿Con qué frecuencia se debe revisar y actualizar el contenido de la Mochila de Emergencia (vencimiento de agua, alimentos y baterías)?",
    options: [
      "Al menos 1 a 2 veces al año",
      "Una vez cada 20 años",
      "Nunca es necesario revisarla",
      "Solo cuando se use en un desastre real"
    ],
    correctAnswer: 0,
    explanation: "Inspeccionar el kit periódicamente asegura que los insumos médicos, agua embotellada y baterías estén vigentes y operativos."
  }
];

function getRandomQuizQuestions(topicId: "terremotos" | "incendios" | "inundaciones" | "kit" = "terremotos", count: number = 5): QuizQuestion[] {
  let bank = EARTHQUAKE_QUIZ_BANK;
  if (topicId === "incendios") bank = FIRE_QUIZ_BANK;
  if (topicId === "inundaciones") bank = FLOOD_QUIZ_BANK;
  if (topicId === "kit") bank = KIT_QUIZ_BANK;

  const shuffled = [...bank].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

interface AulaSlide {
  title: string;
  subtitle: string;
  badge: string;
  points: { title: string; desc: string }[];
  tip?: string;
}

interface AulaTopicData {
  id: "terremotos" | "incendios" | "inundaciones" | "kit";
  title: string;
  category: string;
  color: "cyan" | "orange" | "blue" | "emerald";
  slides: AulaSlide[];
}

const AULA_TOPICS_DATA: Record<"terremotos" | "incendios" | "inundaciones" | "kit", AulaTopicData> = {
  terremotos: {
    id: "terremotos",
    title: "Prevención y Autoprotección Sísmica",
    category: "Geodinámica & Riesgo Estructural",
    color: "cyan",
    slides: [
      {
        title: "01. Fenómeno Sísmico y Diagnóstico de Riesgo",
        subtitle: "Comprender la amenaza sísmica en la edificación",
        badge: "Fundamentos Técnicos",
        points: [
          { title: "Liberación de Energía", desc: "Los sismos se originan por el rompimiento repentino de fallas geológicas o interacción de placas tectónicas." },
          { title: "Ondas P y S", desc: "Las ondas P (compresión) llegan primero; las ondas S (corte) causan los mayores desplazamientos laterales en edificios." },
          { title: "Resonancia Estructural", desc: "Si el periodo del suelo coincide con el de la edificación, las oscilaciones se amplifican drásticamente." }
        ],
        tip: "Conocer la zona sísmica y el tipo de suelo de tu comuna permite tomar medidas de refuerzo oportunas."
      },
      {
        title: "02. Antes del Sismo: Prevención y Preparación",
        subtitle: "Medidas anticipadas en hogares, escuelas y oficinas",
        badge: "Acción Preventiva",
        points: [
          { title: "Fijación de Enseres", desc: "Asegura estantes altos, libreros, calentadores de agua y televisores a elementos estructurales rígidos." },
          { title: "Identificación de Zonas Seguras", desc: "Ubica mesas resistentes, dinteles de puertas y columnas de hormigón armado como puntos de cobertura." },
          { title: "Plan de Emergencia Familiar", desc: "Acuerda puntos de encuentro exterior y asigna roles claros para la desconexión de suministros." }
        ],
        tip: "Efectúa simulacros de evacuación al menos dos veces al año con tu familia o equipo de trabajo."
      },
      {
        title: "03. Durante el Sismo: Protocolo de Respuesta",
        subtitle: "Conducta segura mientras el suelo se encuentra vibrando",
        badge: "Respuesta Inmediata",
        points: [
          { title: "Agáchate, Cúbrete y Aférrate", desc: "Protégete de rodillas bajo una mesa firme, cubre tu cabeza con los brazos y aférrate a la estructura." },
          { title: "Puntos Peligrosos", desc: "Mantente alejado de ventanas de vidrio, fachadas exteriores, lámparas suspendidas y libreros desprotegidos." },
          { title: "No Usar Ascensores", desc: "Jamás utilices ascensores durante o inmediatamente después de un temblor por riesgo de atrapamiento." }
        ],
        tip: "Si estás al aire libre, aléjate de cables de alta tensión, postes, cornisas y edificios con ventanales."
      },
      {
        title: "04. Después del Sismo: Evaluación y Evacuación",
        subtitle: "Acciones posteriores al cese del movimiento telúrico",
        badge: "Recuperación & Seguridad",
        points: [
          { title: "Inspección Visual de Daños", desc: "Verifica si existen grietas en diagonal (en X) en muros de carga o columnas antes de continuar habitando." },
          { title: "Corte de Suministros", desc: "Cierra las llaves de paso de gas y el interruptor general de luz si sospechas fugas o fallas." },
          { title: "Evacuación Calmada", desc: "Evacúa por las escaleras hacia la zona de seguridad portando la mochila de emergencia de 72 horas." }
        ],
        tip: "Infórmate a través de emisoras de radio a batería y canales de emergencia oficiales."
      }
    ]
  },
  incendios: {
    id: "incendios",
    title: "Prevención y Control de Incendios Estructurales",
    category: "Seguridad Contra Incendios",
    color: "orange",
    slides: [
      {
        title: "01. Dinámica del Fuego y Riesgos Principales",
        subtitle: "Comportamiento del fuego en espacios cerrados",
        badge: "Física del Fuego",
        points: [
          { title: "Triángulo del Fuego", desc: "El fuego requiere Combustible, Comburente (Oxígeno) y Fuente de Calor para iniciar la combustión." },
          { title: "Clases de Fuego", desc: "Clase A (sólidos), Clase B (líquidos inflamables), Clase C (equipos eléctricos energizados)." },
          { title: "Gases Tóxicos", desc: "La causa N°1 de fatalidades no es el calor, sino la inhalación de monóxido de carbono y humos opacos." }
        ],
        tip: "Un conato de incendio puede propagarse a toda una habitación en menos de 3 minutos (Flashover)."
      },
      {
        title: "02. Prevención e Instalaciones Seguras",
        subtitle: "Eliminar las causas de origen eléctrico y térmico",
        badge: "Medidas Preventivas",
        points: [
          { title: "Control de Redes Eléctricas", desc: "Evita sobrecargar zócalos o adaptadores múltiples; revisa cables desgastados o empalmes defectuosos." },
          { title: "Detectores de Humo", desc: "Instala detectores fotoeléctricos en pasillos de acceso a dormitorios y prueba sus baterías mensualmente." },
          { title: "Almacenamiento de Inflamables", desc: "Guarda pintura, solventes y combustibles en recipientes normados lejos de fuentes de ignición." }
        ],
        tip: "Mantén despejadas las vías de evacuación y no bloquees puertas con cajas o muebles."
      },
      {
        title: "03. Uso del Extintor y Protocolo de Escape",
        subtitle: "Acciones de combate inicial de conatos",
        badge: "Técnica de Combate",
        points: [
          { title: "Método PASS", desc: "1. Tira del seguro. 2. Apunta a la base del fuego. 3. Presiona la manilla. 4. Barre de lado a lado." },
          { title: "Desplazamiento Bajo Humo", desc: "Gatea al ras del suelo si hay presencia de humo denso; el aire más limpio y frío se mantiene abajo." },
          { title: "Verificación de Puertas", desc: "Toca las puertas con el dorso de la mano antes de abrir: si está caliente, el fuego está al otro lado." }
        ],
        tip: "Si tu ropa se enciende: Detente, Tírate al suelo y Rueda tapándote el rostro con las manos."
      },
      {
        title: "04. Alerta y Evacuación de Emergencia",
        subtitle: "Procedimiento de salida y llamada a servicios de socorro",
        badge: "Evacuación & Rescate",
        points: [
          { title: "Activación de Alarma", desc: "Alerta a todos los ocupantes del recinto a viva voz o mediante los pulsadores de alarma." },
          { title: "Llamada a Bomberos", desc: "Comunícate de inmediato con el número de emergencias informando dirección exacta y presencia de personas." },
          { title: "No Regresar jamás", desc: "Una vez que hayas salido del edificio hacia un punto seguro, bajo ninguna circunstancia ingreses de nuevo." }
        ],
        tip: "Consensua un punto de encuentro seguro en el exterior para verificar que todos los miembros hayan evacuado."
      }
    ]
  },
  inundaciones: {
    id: "inundaciones",
    title: "Mitigación de Riesgos por Inundaciones y Crecidas",
    category: "Hidrometeorología & Cuencas",
    color: "blue",
    slides: [
      {
        title: "01. Amenaza Hidrometeorológica y Dinámica de Aguas",
        subtitle: "Comprendiendo las crecidas repentinas y desbordes",
        badge: "Diagnóstico Hidrológico",
        points: [
          { title: "Crecidas Repentinas (Flash Floods)", desc: "Ocurren en pocas horas tras precipitaciones intensas en cuencas de alta pendiente." },
          { title: "Fuerza del Agua", desc: "Apenas 15 cm de agua en movimiento rápido pueden hacer perder el equilibrio a una persona adulta." },
          { title: "Socavación y Deslizamientos", desc: "El flujo de agua socava los cimientos de muros, puentes y desestabiliza laderas empinadas." }
        ],
        tip: "Infórmate si tu vivienda se ubica en el lecho inundable o en la cota de desborde histórico de ríos."
      },
      {
        title: "02. Preparación y Reducción del Riesgo",
        subtitle: "Acciones comunitarias e individuales previas al invierno",
        badge: "Acción Preventiva",
        points: [
          { title: "Mantenimiento de Drenajes", desc: "Limpia canaletas, tejados, bajantes de agua y sumideros comunitarios para evitar anegamientos." },
          { title: "Protección de Documentos", desc: "Almacena escrituras, identificación y pólizas en bolsas de plástico con cierre hermético (Ziploc)." },
          { title: "Elevación de Equipos", desc: "Ubica electrodomésticos, enchufes y bienes de valor en niveles superiores si vives en zona inundable." }
        ],
        tip: "Prepara barreras de contención (sacos de arena) si existe riesgo de escorrentía hacia el inmueble."
      },
      {
        title: "03. Actuación Durante la Emergencia",
        subtitle: "Protocolo de autoprotección ante el avance del agua",
        badge: "Respuesta en Crisis",
        points: [
          { title: "Corte Eléctrico Preventivo", desc: "Desconecta el interruptor general de luz antes de que el agua entre en contacto con tableros o enchufes." },
          { title: "Evacuación a Zonas Altas", desc: "Abandona las zonas bajas dirigiéndote a los puntos de evacuación o cumbres previamente señalizadas." },
          { title: "No Cruzar Corrientes", desc: "Nunca intentes cruzar ríos, zanjas o calles inundadas a pie ni a bordo de vehículos." }
        ],
        tip: "Un automóvil puede ser arrastrado o flotar con tan solo 30 a 50 cm de corriente de agua."
      },
      {
        title: "04. Recuperación Sanitaria y Retorno Seguro",
        subtitle: "Medidas de desinfección e higiene post-inundación",
        badge: "Sanidad & Retorno",
        points: [
          { title: "Desinfección de Ámbitos", desc: "Lava y desinfecta con cloro todas las paredes, pisos y utensilios que hayan tenido contacto con aguas servidas." },
          { title: "Consumo de Agua Segura", desc: "Bebe únicamente agua embotellada o hiérvela durante 3 a 5 minutos antes de su consumo." },
          { title: "Alimentos Contaminados", desc: "Desecha cualquier alimento fresco o empaquetado que haya estado en contacto con el agua de la crecida." }
        ],
        tip: "Inspecciona la integridad estructural de la vivienda antes de volver a habitarla tras la bajada del agua."
      }
    ]
  },
  kit: {
    id: "kit",
    title: "Mochila de Emergencia de 72 Horas",
    category: "Autonomía & Sobrevivencia Familiar",
    color: "emerald",
    slides: [
      {
        title: "01. Módulo 04: La Mochila de 72 Horas",
        subtitle: "Configuración general de insumos esenciales de supervivencia",
        badge: "Visión General",
        points: [
          { title: "Agua Potable - 1L", desc: "Cantidad mínima portátil inmediata para consumo directo durante la evacuación inicial." },
          { title: "Kit de Primeros Auxilios (Trauma)", desc: "Estuche compacto de control de hemorragias, desinfección y curación rápida de heridas." },
          { title: "Documentación Esencial", desc: "Bolsa impermeable estanca con escrituras, identificaciones y respaldos legales." },
          { title: "Nutrición & Operaciones", desc: "Barras de proteína de alta energía, linterna táctica (1000 lumens) y radio AM/FM/NOAA." }
        ],
        tip: "Conserva el kit en un lugar visible de fácil acceso cercano a la ruta principal de salida de tu vivienda."
      },
      {
        title: "02. La Ventana Crítica de 72 Horas",
        subtitle: "Zona de Autoprotección Ciudadana entre el evento y la asistencia",
        badge: "Respuesta USAR & Estadística",
        points: [
          { title: "Respuesta Internacional USAR", desc: "Basado en las misiones de Búsqueda y Rescate Urbano del Ing. Jairo Ovallos (Terremoto de Nepal 2015, Ecuador 2016)." },
          { title: "Ventana de Autonomía (0h a 72h)", desc: "Periodo crítico en el cual la familia debe auto-sostenerse activamente antes de recibir apoyo externo." },
          { title: "Restablecimiento de Servicios", desc: "72 horas es el tiempo promedio estadístico que tardan en restablecerse los servicios básicos o llegar la asistencia gubernamental." }
        ],
        tip: "En desastres de gran magnitud, la ayuda humanitaria externa no es instantánea. La preparación inicial salva vidas."
      },
      {
        title: "03. Arquitectura del Kit: 5 Sistemas Críticos",
        subtitle: "Distribución táctica organizada para la supervivencia",
        badge: "Diseño Estructural",
        points: [
          { title: "1. Hidratación & 2. Nutrición Táctica", desc: "Agua potable calculada e insumos calóricos sin necesidad de cocción." },
          { title: "3. Soporte Médico & 4. Operaciones", desc: "Control de traumatismos, linternas frontales, energía de respaldo y multiherramientas de rescate." },
          { title: "5. Resguardo de Identidad", desc: "Documentación física y digital protegida ante agua, fuego y escombros." }
        ],
        tip: "Organiza cada sistema en compartimentos o bolsas impermeables independientes dentro de la mochila."
      },
      {
        title: "04. Sistema 1: La Fórmula de Hidratación",
        subtitle: "El insumo más crítico para la supervivencia humana",
        badge: "Sistema 1 - Hidratación",
        points: [
          { title: "Fórmula de Cálculo Vital", desc: "1 Persona × 3 Días × 3 Litros/Día = 9 Litros Totales necesarios por persona." },
          { title: "Consumo Vital Directo (2 Litros)", desc: "2 litros diarios destinados exclusivamente a la hidratación biológica del cuerpo." },
          { title: "Higiene y Primeros Auxilios (1 Litro)", desc: "1 litro diario para limpieza de heridas, higiene básica y preparación de sueros." }
        ],
        tip: "Distribuye los 9 litros en envases rígidos de 1L a 3L para facilitar su transporte entre los miembros del hogar."
      },
      {
        title: "05. Sistema 2: Matriz de Nutrición Táctica",
        subtitle: "Raciones calóricas de alto rendimiento y cero preparación",
        badge: "Sistema 2 - Nutrición",
        points: [
          { title: "Regla de Oro Nutricional", desc: "Evitar alimentos que requieran cocción o gasten la reserva de agua potable. Incluir siempre un abrelatas manual." },
          { title: "Energía Inmediata", desc: "Barras proteicas de alta densidad, chocolate amargo y frutos secos ricos en grasas saludables." },
          { title: "Larga Duración", desc: "Enlatados (atún, sardinas, legumbres) con sistema abre-fácil incorporado." },
          { title: "Cero Preparación", desc: "Alimentos deshidratados de consumo directo y galletas de agua." }
        ],
        tip: "Revisa las fechas de vencimiento de latas y barras cada 6 meses al ajustar la mochila."
      },
      {
        title: "06. Sistema 3: Anatomía del Soporte Médico",
        subtitle: "Control de traumatismos y mantenimiento de tratamientos crónicos",
        badge: "Sistema 3 - Salud & Auxilio",
        points: [
          { title: "Módulo A: Material de Curación (45°)", desc: "Control de sangrado y heridas: gasas estériles, vendas elásticas, suero, apósitos y antisépticos." },
          { title: "Módulo B: Medicación Base (45°)", desc: "Respuesta general: analgésicos, antialérgicos, antidiarreicos y antitérmicos de venta libre." },
          { title: "Módulo C: Condición Crónica (45°)", desc: "Reserva vital: recetas específicas y tratamientos continuos de la familia para al menos 7 días." }
        ],
        tip: "Guarda una tarjeta impermeable con el tipo de sangre, alergias y dosis de cada familiar en el estuche médico."
      },
      {
        title: "07. Sistema 4: Operaciones en Escenario de 'Corte Total'",
        subtitle: "Herramientas de iluminación, energía de respaldo y comunicación",
        badge: "Sistema 4 - Operaciones",
        points: [
          { title: "Linterna Frontal LED", desc: "Permite mantener las manos libres para evacuar, cargar niños o realizar asistencias tácticas." },
          { title: "Radio AM/FM/NOAA", desc: "A pilas o dinamo manual para recibir instrucciones de emergencia y alertas meteorológicas oficiales." },
          { title: "Energía de Respaldo & Utilidades", desc: "Pilas adicionales en bolsas herméticas, navaja multiusos y silbato de rescate para señalización acústica." }
        ],
        tip: "El silbato emite un sonido de alta frecuencia que requiere mucho menos esfuerzo físico que gritar si quedas atrapado."
      },
      {
        title: "08. Sistema 5: La Cápsula Hermética de Identidad",
        subtitle: "Protección documental, resguardo digital y efectivo",
        badge: "Sistema 5 - Identidad",
        points: [
          { title: "Documentos Físicos en Bolsa Estanca", desc: "Copias de DNI/Pasaportes, escrituras de propiedad, pólizas de seguro e historial médico." },
          { title: "Efectivo en Billetes Pequeños", desc: "Efectivo táctico (los puntos de pago electrónicos y cajeros automáticos colapsarán)." },
          { title: "Respaldo Digital USB", desc: "Copias digitales escaneadas encriptadas almacenadas en una memoria pendrive USB impermeable." }
        ],
        tip: "Protege la memoria USB con contraseña o encriptación para resguardar la privacidad de tus datos familiares."
      },
      {
        title: "09. El Ciclo de Mantenimiento: Siempre Listos",
        subtitle: "Protocolo continuo de actualización (El Reloj de la Preparación)",
        badge: "Mantenimiento & Continuidad",
        points: [
          { title: "1. Armar & 2. Auditar", desc: "Conformación inicial de los 5 sistemas y revisión técnica cada 6 meses (alineado con solsticios/cambios de hora)." },
          { title: "3. Rotar", desc: "Consumir y reemplazar alimentos y medicamentos próximos a caducar para mantener vigencia." },
          { title: "4. Ajustar", desc: "Modificar ropa, calzado y dosis médicas según el cambio de estación o crecimiento de los niños." }
        ],
        tip: '"Porque una sociedad consciente de sus riesgos es una sociedad capaz de resistir y recuperarse." — GRDesastres'
      }
    ]
  }
};

interface ModuleStats {
  views: number;
  evaluations: number;
  correctAnswers: number;
  totalQuestions: number;
}

interface AulaTelemetry {
  terremotos: ModuleStats;
  incendios: ModuleStats;
  inundaciones: ModuleStats;
  kit: ModuleStats;
}

const DEFAULT_AULA_TELEMETRY: AulaTelemetry = {
  terremotos: { views: 1420, evaluations: 890, correctAnswers: 3916, totalQuestions: 4450 },
  incendios: { views: 980, evaluations: 610, correctAnswers: 2562, totalQuestions: 3050 },
  inundaciones: { views: 1150, evaluations: 730, correctAnswers: 3139, totalQuestions: 3650 },
  kit: { views: 1830, evaluations: 1240, correctAnswers: 5456, totalQuestions: 6200 }
};

export default function LandingPage({ 
  onNavigate, 
  heroVideoUrl = "https://res.cloudinary.com/rtzau8g7/video/upload/v1786408885/quiero_un_video_relacionado_a_k6mfem.mp4" 
}: LandingPageProps) {
  // --- Estados para Modales Interactivos ---
  const [activeModal, setActiveModal] = useState<"aula" | "biblioteca" | "heroes" | "blogs" | null>(null);
  const [selectedAulaTopic, setSelectedAulaTopic] = useState<"terremotos" | "incendios" | "inundaciones" | "kit" | null>(null);
  const [aulaSlideIdx, setAulaSlideIdx] = useState<number>(0);
  const [aulaTab, setAulaTab] = useState<"video" | "test" | "diapositivas">("video");
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // --- Telemetría y Métricas del Aula Virtual ---
  const [telemetry, setTelemetry] = useState<AulaTelemetry>(() => {
    try {
      const saved = localStorage.getItem("grd_aula_telemetry");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_AULA_TELEMETRY;
  });

  useEffect(() => {
    try {
      localStorage.setItem("grd_aula_telemetry", JSON.stringify(telemetry));
    } catch (e) {}
  }, [telemetry]);

  const handleOpenAulaModule = (topicId: "terremotos" | "incendios" | "inundaciones" | "kit") => {
    setSelectedAulaTopic(topicId);
    setAulaSlideIdx(0);
    setAulaTab("video");
    setQuizQuestions(getRandomQuizQuestions(topicId, 5));
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);

    // Incrementar contador de vistas/reproducciones en tiempo real
    setTelemetry(prev => ({
      ...prev,
      [topicId]: {
        ...prev[topicId],
        views: prev[topicId].views + 1
      }
    }));
  };

  const handleRestartQuiz = () => {
    setQuizQuestions(getRandomQuizQuestions(selectedAulaTopic || "terremotos", 5));
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) {
        score += 1;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);

    // Incrementar evaluaciones y respuestas acertadas acumuladas
    if (selectedAulaTopic) {
      setTelemetry(prev => ({
        ...prev,
        [selectedAulaTopic]: {
          ...prev[selectedAulaTopic],
          evaluations: prev[selectedAulaTopic].evaluations + 1,
          correctAnswers: prev[selectedAulaTopic].correctAnswers + score,
          totalQuestions: prev[selectedAulaTopic].totalQuestions + 5
        }
      }));
    }
  };

  // --- Aula Interactiva: Estado de la Simulación ---
  const [waveType, setWaveType] = useState<"P" | "S" | "Surface">("S");
  const [frequency, setFrequency] = useState<number>(1.2); // Hz
  const [amplitude, setAmplitude] = useState<number>(30); // px
  const [resonanceStatus, setResonanceStatus] = useState<"Baja" | "RESONANCIA" | "Crítica">("Baja");
  const [isClassroomPlaying, setIsClassroomPlaying] = useState<boolean>(true);
  const [classroomTime, setClassroomTime] = useState<number>(0);

  // --- Biblioteca: Búsqueda y categoría ---
  const [biblioSearch, setBiblioSearch] = useState("");
  const [biblioCategory, setBiblioCategory] = useState<string>("Todos");

  // --- Héroes: Carrusel activo ---
  const [activeHeroIdx, setActiveHeroIdx] = useState(0);

  // --- Blogs: Post seleccionado para leer completo ---
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogItem | null>(null);

  // --- Estados para Formulario de Contacto ---
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      setSubmitStatus("error");
      setSubmitMessage("Por favor, completa todos los campos obligatorios.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          subject: contactSubject || "Contacto desde Portafolio Web",
          message: contactMessage,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus("success");
        setSubmitMessage("¡Mensaje enviado con éxito! Me pondré en contacto contigo muy pronto.");
        // Limpiar campos
        setContactName("");
        setContactEmail("");
        setContactSubject("");
        setContactMessage("");
      } else {
        setSubmitStatus("error");
        setSubmitMessage(data.error || "Hubo un problema al enviar el mensaje. Intentémoslo de nuevo.");
      }
    } catch (err) {
      console.error("Error submitting contact form:", err);
      // Fallback estático en caso de que no haya backend
      setSubmitStatus("success");
      setSubmitMessage("¡Mensaje enviado con éxito! (Simulado por falta de conexión al servidor local). Puedes escribirme directamente a geologol@gmail.com.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animación del Aula
  useEffect(() => {
    let animFrame: number;
    if (isClassroomPlaying && activeModal === "aula") {
      const update = () => {
        setClassroomTime((prev) => prev + 0.05);
        animFrame = requestAnimationFrame(update);
      };
      animFrame = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(animFrame);
  }, [isClassroomPlaying, activeModal]);

  // Detector de resonancia básica en el aula virtual
  useEffect(() => {
    const buildingNaturalFreq = 0.8;
    const diff = Math.abs(frequency - buildingNaturalFreq);
    if (diff < 0.15) {
      setResonanceStatus("RESONANCIA");
    } else if (frequency > buildingNaturalFreq + 0.15) {
      setResonanceStatus("Crítica");
    } else {
      setResonanceStatus("Baja");
    }
  }, [frequency]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      
      {/* =========================================================================
          BARRA DE NAVEGACIÓN (NAVBAR)
          ========================================================================= */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-1 rounded-xl bg-slate-900/90 border border-cyan-500/30 shadow-md shadow-cyan-500/10 flex items-center justify-center">
              <img 
                src={grdesastresLogo} 
                alt="Logo GRDesastres" 
                className="w-[38px] h-[38px] object-contain drop-shadow-[0_2px_8px_rgba(6,182,212,0.4)]"
              />
            </div>
            <span className="font-display font-extrabold text-sm tracking-wider uppercase bg-gradient-to-r from-white via-cyan-100 to-slate-300 bg-clip-text text-transparent">
              GRDesastres
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <a href="#inicio" className="hover:text-cyan-400 transition-colors">Inicio</a>
            <a href="#aula-virtual" className="hover:text-cyan-400 transition-colors">Aula Virtual</a>
            <a href="#portafolio" className="hover:text-cyan-400 transition-colors">Portafolio</a>
            <a href="#contacto" className="hover:text-cyan-400 transition-colors">Contacto</a>
          </div>
          
          <div>
            <a 
              href="#portafolio"
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-slate-950 text-xs font-bold uppercase py-2 px-4 rounded-lg tracking-wider transition-all shadow-md shadow-cyan-500/10 cursor-pointer"
            >
              Iniciar Simulador
            </a>
          </div>
        </div>
      </nav>

      {/* =========================================================================
          SECCIÓN HERO / INICIO (CABECERA)
          ========================================================================= */}
      <header id="inicio" className="relative w-full pt-32 pb-24 px-6 md:px-12 flex flex-col items-start justify-center min-h-[85vh] overflow-hidden">
        {/* Video de fondo a lo ancho de la página (reproducción automática, en bucle y sin overlay) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video 
            src={heroVideoUrl} 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-100"
          />
          {/* Insignia Oficial GRDesastres ajustada para cubrir exactamente la marca de agua del video */}
          <div className="absolute bottom-2 right-4 sm:bottom-3 sm:right-8 z-20 pointer-events-auto flex items-center space-x-3.5 bg-slate-950/95 backdrop-blur-xl px-4 sm:px-5 py-3 sm:py-3.5 rounded-3xl border border-cyan-500/50 shadow-2xl shadow-black/90 min-w-[210px] sm:min-w-[230px]">
            <div className="p-2 rounded-2xl bg-slate-900 border border-cyan-500/40 flex items-center justify-center shrink-0 shadow-inner">
              <img 
                src={grdesastresLogo} 
                alt="Emblema Oficial GRDesastres" 
                className="w-[42px] h-[42px] sm:w-[52px] sm:h-[52px] object-contain drop-shadow-[0_4px_12px_rgba(6,182,212,0.6)]"
              />
            </div>
            <div className="text-left font-mono space-y-0.5">
              <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wider block leading-none">GRDesastres</span>
              <span className="text-[9px] sm:text-[10px] text-cyan-400 font-bold tracking-widest uppercase block">Plataforma Oficial</span>
            </div>
          </div>
        </div>

        {/* Luces y efectos de fondo */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl -z-10 pointer-events-none" />

        {/* Textos Informativos del Propósito de GRDesastres (Alineados a la Izquierda) */}
        <div className="relative z-10 space-y-6 flex flex-col items-start text-left max-w-2xl ml-0 md:ml-6 lg:ml-12">
          <div className="inline-flex items-center space-x-2 bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-full text-[10px] font-bold text-cyan-400 tracking-wider uppercase backdrop-blur-sm">
            <Sparkles className="h-3 w-3" />
            <span>Plataforma de Gestión Integral de Riesgos Socionaturales y Tecnológicos</span>
          </div>

          <div className="space-y-4 bg-slate-950/85 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-800/80 shadow-2xl shadow-black/70 text-left">
            <div className="flex items-center space-x-4 sm:space-x-5">
              <div className="relative group shrink-0">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 opacity-40 blur-md group-hover:opacity-75 transition duration-500" />
                <div className="relative p-2.5 rounded-2xl bg-slate-900/95 border border-cyan-500/40 shadow-2xl flex items-center justify-center">
                  <img 
                    src={grdesastresLogo} 
                    alt="Emblema GRDesastres" 
                    className="w-[74px] h-[74px] sm:w-[92px] sm:h-[92px] object-contain drop-shadow-[0_4px_12px_rgba(6,182,212,0.5)]"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white leading-none drop-shadow-lg">
                  GR<span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-500 bg-clip-text text-transparent">Desastres</span>
                </h1>
                <p className="font-display text-xs sm:text-sm font-bold text-cyan-300/90 drop-shadow-sm">
                  Gestión y Reducción del Riesgo de Desastres en América Latina
                </p>
              </div>
            </div>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed drop-shadow pt-1 border-t border-slate-800/70">
              GRDesastres es una plataforma técnica y educativa integral enfocada en la evaluación de vulnerabilidad estructural, modelado dinámico de edificaciones ante sismos y capacitación en mitigación de riesgos. Unimos la ingeniería aplicada, el análisis de datos y las normativas internacionales para fortalecer la resiliencia ciudadana e institucional ante eventos extremos.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-start gap-4 pt-2">
            <a 
              href="#portafolio" 
              className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs uppercase px-6 py-3 rounded-xl transition shadow-lg shadow-cyan-500/20 cursor-pointer flex items-center space-x-2"
            >
              <span>Abrir Plataforma Sísmica</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            <a 
              href="#aula-virtual" 
              className="bg-slate-900/90 hover:bg-slate-855 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs uppercase px-6 py-3 rounded-xl transition cursor-pointer backdrop-blur-sm"
            >
              Explorar Aula Virtual
            </a>
          </div>
        </div>
      </header>

      {/* =========================================================================
          SECCIÓN AULA VIRTUAL (PREPARACIÓN Y PREVENCIÓN DE DESASTRES)
          ========================================================================= */}
      <section id="aula-virtual" className="py-24 px-6 border-t border-slate-900 bg-slate-950 relative overflow-hidden">
        {/* Glow decorativo de fondo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto space-y-12">
          
          {/* Encabezado de la Sección */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
              Formación & Capacitación Comunitaria
            </span>
            <h2 className="font-display font-black text-3xl md:text-4xl text-white uppercase tracking-wider">
              Aula Virtual de Preparación y Prevención
            </h2>
            <div className="h-1.5 w-16 bg-gradient-to-r from-cyan-500 to-emerald-500 mx-auto rounded-full" />
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Módulos interactivos de autoaprendizaje para el fortalecimiento de capacidades, autoprotección y respuesta efectiva ante amenazas socionaturales y tecnológicas. Haz clic en cada tarjeta para acceder a la presentación guiada.
            </p>
          </div>

          {/* Miniaturas Estilo YouTube para el Aula Virtual con Contadores de Telemetría */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            
            {/* Card 1: Terremotos (Módulo 01 con Video & Test) */}
            <div 
              onClick={() => handleOpenAulaModule("terremotos")}
              className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Miniatura estilo YouTube (16:9) */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <img 
                    src={earthquakeHero} 
                    alt="Miniatura Módulo 01: Terremotos" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 px-2.5 py-1 rounded-lg flex items-center space-x-1.5">
                    <Activity className="h-3 w-3 text-cyan-400" />
                    <span className="text-[9px] font-mono font-bold text-cyan-300 uppercase tracking-wider">Módulo 01</span>
                  </div>

                  <div className="absolute top-2.5 right-2.5 bg-cyan-500 text-slate-950 font-black text-[9px] uppercase px-2 py-0.5 rounded tracking-wider flex items-center space-x-1 shadow-lg">
                    <span>HD 1080p • VIDEO + TEST</span>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-cyan-500/90 text-slate-950 flex items-center justify-center shadow-xl shadow-cyan-500/30 group-hover:scale-110 group-hover:bg-cyan-400 transition-all duration-300">
                      <Play className="h-6 w-6 fill-slate-950 translate-x-0.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 bg-slate-950/90 backdrop-blur-sm text-cyan-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-cyan-500/30">
                    04:15 MP4
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 w-3/4 group-hover:w-full transition-all duration-700" />
                  </div>
                </div>

                {/* Metadatos estilo Canal de YouTube */}
                <div className="p-4 space-y-3 text-left">
                  <div className="flex items-start space-x-3">
                    <img 
                      src={grdesastresLogo} 
                      alt="Avatar Canal GRDesastres" 
                      className="w-9 h-9 rounded-full bg-slate-950 p-1 border border-cyan-500/40 shrink-0 shadow-md"
                    />
                    <div className="space-y-1">
                      <h3 className="font-display font-extrabold text-sm text-white uppercase group-hover:text-cyan-300 transition-colors line-clamp-2 leading-tight">
                        Módulo 01: Preparación y Autoprotección Sísmica
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium">
                        GRDesastres • Aula Virtual LATAM
                      </p>
                    </div>
                  </div>

                  {/* Panel de Contadores de Telemetría */}
                  <div className="pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-1.5 text-center font-mono">
                    <div className="bg-slate-950/90 border border-slate-800 p-1.5 rounded-lg">
                      <span className="text-[8px] font-bold text-slate-400 block uppercase">Reproducido</span>
                      <span className="text-xs font-black text-cyan-300">{telemetry.terremotos.views.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-950/90 border border-slate-800 p-1.5 rounded-lg">
                      <span className="text-[8px] font-bold text-slate-400 block uppercase">Evaluaciones</span>
                      <span className="text-xs font-black text-emerald-400">{telemetry.terremotos.evaluations.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-950/90 border border-slate-800 p-1.5 rounded-lg">
                      <span className="text-[8px] font-bold text-slate-400 block uppercase">Acertadas</span>
                      <span className="text-xs font-black text-amber-300">{telemetry.terremotos.correctAnswers.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button className="w-full bg-slate-950 hover:bg-cyan-500 hover:text-slate-950 border border-cyan-500/30 text-cyan-300 font-bold text-xs uppercase py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 font-mono group-hover:border-cyan-400">
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Ver Video & Responder Test</span>
                </button>
              </div>
            </div>

            {/* Card 2: Incendios */}
            <div 
              onClick={() => handleOpenAulaModule("incendios")}
              className="bg-slate-900/90 border border-slate-800 hover:border-orange-500/60 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <img 
                    src={firePreventionHero} 
                    alt="Miniatura Módulo 02: Incendios" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md border border-orange-500/40 px-2.5 py-1 rounded-lg flex items-center space-x-1.5">
                    <Flame className="h-3 w-3 text-orange-400" />
                    <span className="text-[9px] font-mono font-bold text-orange-300 uppercase tracking-wider">Módulo 02</span>
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-orange-500 text-slate-950 font-black text-[9px] uppercase px-2 py-0.5 rounded tracking-wider shadow-lg">
                    HD 1080p • VIDEO + TEST
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-orange-500/90 text-slate-950 flex items-center justify-center shadow-xl shadow-orange-500/30 group-hover:scale-110 group-hover:bg-orange-400 transition-all duration-300">
                      <Play className="h-6 w-6 fill-slate-950 translate-x-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-slate-950/90 backdrop-blur-sm text-orange-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-orange-500/30">
                    03:40 MP4
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 w-1/2 group-hover:w-full transition-all duration-700" />
                  </div>
                </div>

                <div className="p-4 space-y-3 text-left">
                  <div className="flex items-start space-x-3">
                    <img 
                      src={grdesastresLogo} 
                      alt="Avatar Canal GRDesastres" 
                      className="w-9 h-9 rounded-full bg-slate-950 p-1 border border-orange-500/40 shrink-0 shadow-md"
                    />
                    <div className="space-y-1">
                      <h3 className="font-display font-extrabold text-sm text-white uppercase group-hover:text-orange-300 transition-colors line-clamp-2 leading-tight">
                        Módulo 02: Prevención y Control de Incendios
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium">
                        GRDesastres • Aula Virtual LATAM
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-1.5 text-center font-mono">
                    <div className="bg-slate-950/90 border border-slate-800 p-1.5 rounded-lg">
                      <span className="text-[8px] font-bold text-slate-400 block uppercase">Reproducido</span>
                      <span className="text-xs font-black text-orange-300">{telemetry.incendios.views.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-950/90 border border-slate-800 p-1.5 rounded-lg">
                      <span className="text-[8px] font-bold text-slate-400 block uppercase">Evaluaciones</span>
                      <span className="text-xs font-black text-emerald-400">{telemetry.incendios.evaluations.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-950/90 border border-slate-800 p-1.5 rounded-lg">
                      <span className="text-[8px] font-bold text-slate-400 block uppercase">Acertadas</span>
                      <span className="text-xs font-black text-amber-300">{telemetry.incendios.correctAnswers.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button className="w-full bg-slate-950 hover:bg-orange-500 hover:text-slate-950 border border-orange-500/30 text-orange-300 font-bold text-xs uppercase py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 font-mono group-hover:border-orange-400">
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Abrir Lección en Video</span>
                </button>
              </div>
            </div>

            {/* Card 3: Inundaciones */}
            <div 
              onClick={() => handleOpenAulaModule("inundaciones")}
              className="bg-slate-900/90 border border-slate-800 hover:border-blue-500/60 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <img 
                    src={earthStructure} 
                    alt="Miniatura Módulo 03: Inundaciones" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md border border-blue-500/40 px-2.5 py-1 rounded-lg flex items-center space-x-1.5">
                    <Globe className="h-3 w-3 text-blue-400" />
                    <span className="text-[9px] font-mono font-bold text-blue-300 uppercase tracking-wider">Módulo 03</span>
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-blue-500 text-slate-950 font-black text-[9px] uppercase px-2 py-0.5 rounded tracking-wider shadow-lg">
                    HD 1080p • GUÍA VIDEO
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-blue-500/90 text-slate-950 flex items-center justify-center shadow-xl shadow-blue-500/30 group-hover:scale-110 group-hover:bg-blue-400 transition-all duration-300">
                      <Play className="h-6 w-6 fill-slate-950 translate-x-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-slate-950/90 backdrop-blur-sm text-blue-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-blue-500/30">
                    05:10 MP4
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 w-2/3 group-hover:w-full transition-all duration-700" />
                  </div>
                </div>

                <div className="p-4 space-y-3 text-left">
                  <div className="flex items-start space-x-3">
                    <img 
                      src={grdesastresLogo} 
                      alt="Avatar Canal GRDesastres" 
                      className="w-9 h-9 rounded-full bg-slate-950 p-1 border border-blue-500/40 shrink-0 shadow-md"
                    />
                    <div className="space-y-1">
                      <h3 className="font-display font-extrabold text-sm text-white uppercase group-hover:text-blue-300 transition-colors line-clamp-2 leading-tight">
                        Módulo 03: Mitigación por Inundaciones
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium">
                        GRDesastres • Aula Virtual LATAM
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-1.5 text-center font-mono">
                    <div className="bg-slate-950/90 border border-slate-800 p-1.5 rounded-lg">
                      <span className="text-[8px] font-bold text-slate-400 block uppercase">Reproducido</span>
                      <span className="text-xs font-black text-blue-300">{telemetry.inundaciones.views.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-950/90 border border-slate-800 p-1.5 rounded-lg">
                      <span className="text-[8px] font-bold text-slate-400 block uppercase">Evaluaciones</span>
                      <span className="text-xs font-black text-emerald-400">{telemetry.inundaciones.evaluations.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-950/90 border border-slate-800 p-1.5 rounded-lg">
                      <span className="text-[8px] font-bold text-slate-400 block uppercase">Acertadas</span>
                      <span className="text-xs font-black text-amber-300">{telemetry.inundaciones.correctAnswers.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button className="w-full bg-slate-950 hover:bg-blue-500 hover:text-slate-950 border border-blue-500/30 text-blue-300 font-bold text-xs uppercase py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 font-mono group-hover:border-blue-400">
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Abrir Lección en Video</span>
                </button>
              </div>
            </div>

            {/* Card 4: Kit de Emergencias */}
            <div 
              onClick={() => handleOpenAulaModule("kit")}
              className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/60 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <img 
                    src={emergencyKitHero} 
                    alt="Miniatura Módulo 04: Kit de Emergencias" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md border border-emerald-500/40 px-2.5 py-1 rounded-lg flex items-center space-x-1.5">
                    <Shield className="h-3 w-3 text-emerald-400" />
                    <span className="text-[9px] font-mono font-bold text-emerald-300 uppercase tracking-wider">Módulo 04</span>
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-emerald-500 text-slate-950 font-black text-[9px] uppercase px-2 py-0.5 rounded tracking-wider shadow-lg">
                    HD 1080p • VIDEO + TEST
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/90 text-slate-950 flex items-center justify-center shadow-xl shadow-emerald-500/30 group-hover:scale-110 group-hover:bg-emerald-400 transition-all duration-300">
                      <Play className="h-6 w-6 fill-slate-950 translate-x-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-slate-950/90 backdrop-blur-sm text-emerald-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                    06:00 MP4
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-4/5 group-hover:w-full transition-all duration-700" />
                  </div>
                </div>

                <div className="p-4 space-y-3 text-left">
                  <div className="flex items-start space-x-3">
                    <img 
                      src={grdesastresLogo} 
                      alt="Avatar Canal GRDesastres" 
                      className="w-9 h-9 rounded-full bg-slate-950 p-1 border border-emerald-500/40 shrink-0 shadow-md"
                    />
                    <div className="space-y-1">
                      <h3 className="font-display font-extrabold text-sm text-white uppercase group-hover:text-emerald-300 transition-colors line-clamp-2 leading-tight">
                        Módulo 04: Mochila de 72 Horas & Kit
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium">
                        GRDesastres • Aula Virtual LATAM
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-1.5 text-center font-mono">
                    <div className="bg-slate-950/90 border border-slate-800 p-1.5 rounded-lg">
                      <span className="text-[8px] font-bold text-slate-400 block uppercase">Reproducido</span>
                      <span className="text-xs font-black text-emerald-300">{telemetry.kit.views.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-950/90 border border-slate-800 p-1.5 rounded-lg">
                      <span className="text-[8px] font-bold text-slate-400 block uppercase">Evaluaciones</span>
                      <span className="text-xs font-black text-emerald-400">{telemetry.kit.evaluations.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-950/90 border border-slate-800 p-1.5 rounded-lg">
                      <span className="text-[8px] font-bold text-slate-400 block uppercase">Acertadas</span>
                      <span className="text-xs font-black text-amber-300">{telemetry.kit.correctAnswers.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button className="w-full bg-slate-950 hover:bg-emerald-500 hover:text-slate-950 border border-emerald-500/30 text-emerald-300 font-bold text-xs uppercase py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 font-mono group-hover:border-emerald-400">
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Abrir Lección en Video</span>
                </button>
              </div>
            </div>

          </div>

          {/* =========================================================================
              DASHBOARD DE IMPACTO Y TELEMETRÍA DE CAPACITACIÓN COMUNITARIA
              ========================================================================= */}
          {(() => {
            const totalViews = Object.values(telemetry).reduce((acc, m) => acc + m.views, 0);
            const totalEvaluations = Object.values(telemetry).reduce((acc, m) => acc + m.evaluations, 0);
            const totalCorrect = Object.values(telemetry).reduce((acc, m) => acc + m.correctAnswers, 0);
            const totalQuestions = Object.values(telemetry).reduce((acc, m) => acc + m.totalQuestions, 0);
            const overallAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

            return (
              <div className="mt-16 pt-12 border-t border-slate-850 space-y-10">
                
                {/* Encabezado del Dashboard */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-left">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold text-emerald-400 uppercase font-mono">
                      <Activity className="h-3 w-3" />
                      <span>Telemetría en Tiempo Real • Dashboard de Impacto</span>
                    </div>
                    <h3 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-wide">
                      Dashboard de Capacitación y Evaluación Sísmica
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Indicadores consolidados de uso, efectividad de respuesta y nivel de preparación alcanzado por participantes en América Latina a través del Aula Virtual GRDesastres.
                    </p>
                  </div>
                </div>

                {/* Tarjetas KPI de Primer Nivel (4 KPIs) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  
                  {/* KPI 1: Personas Capacitadas */}
                  <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3 relative overflow-hidden shadow-xl text-left hover:border-cyan-500/40 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Personas Capacitadas</span>
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                        <Users className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-mono font-black text-3xl text-white">
                        {Math.round(totalViews * 0.78).toLocaleString()}
                      </h4>
                      <div className="flex items-center space-x-1.5 text-[10px] font-mono text-emerald-400 font-bold">
                        <span>↑ +18.4% este mes</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">LATAM</span>
                      </div>
                    </div>
                  </div>

                  {/* KPI 2: Reproducciones Totales */}
                  <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3 relative overflow-hidden shadow-xl text-left hover:border-purple-500/40 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Reproducciones Totales</span>
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                        <Video className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-mono font-black text-3xl text-cyan-300">
                        {totalViews.toLocaleString()}
                      </h4>
                      <div className="flex items-center space-x-1.5 text-[10px] font-mono text-purple-400 font-bold">
                        <span>Horas Lectivas: {(totalViews * 0.08).toFixed(1)} hrs</span>
                      </div>
                    </div>
                  </div>

                  {/* KPI 3: Evaluaciones Desarrolladas */}
                  <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3 relative overflow-hidden shadow-xl text-left hover:border-emerald-500/40 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Evaluaciones Realizadas</span>
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <HelpCircle className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-mono font-black text-3xl text-emerald-400">
                        {totalEvaluations.toLocaleString()}
                      </h4>
                      <div className="flex items-center space-x-1.5 text-[10px] font-mono text-emerald-400 font-bold">
                        <span>Tests de 5 preguntas</span>
                      </div>
                    </div>
                  </div>

                  {/* KPI 4: Efectividad y Aciertos */}
                  <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3 relative overflow-hidden shadow-xl text-left hover:border-amber-500/40 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Preguntas Acertadas</span>
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                        <Award className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-mono font-black text-3xl text-amber-300">
                        {totalCorrect.toLocaleString()}
                      </h4>
                      <div className="flex items-center space-x-1.5 text-[10px] font-mono text-amber-400 font-bold">
                        <span>Tasa de Acierto: {overallAccuracy.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Gráficos de Progreso y Cobertura por Módulo */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Columna 1 y 2: Desglose Analítico por Módulo */}
                  <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-6 text-left shadow-2xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div>
                        <h4 className="font-display font-extrabold text-base text-white uppercase">
                          Rendimiento & Efectividad por Módulo Formativo
                        </h4>
                        <p className="text-xs text-slate-400">
                          Comparativa de reproducciones, tests completados y porcentaje de respuestas correctas.
                        </p>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded uppercase">
                        4 Módulos Activos
                      </span>
                    </div>

                    <div className="space-y-5">
                      {[
                        { id: "terremotos", name: "Módulo 01: Terremotos y Autoprotección Sísmica", data: telemetry.terremotos, color: "from-cyan-500 to-emerald-400" },
                        { id: "incendios", name: "Módulo 02: Prevención de Incendios Estructurales", data: telemetry.incendios, color: "from-orange-500 to-amber-400" },
                        { id: "inundaciones", name: "Módulo 03: Mitigación de Inundaciones y Crecidas", data: telemetry.inundaciones, color: "from-blue-500 to-cyan-400" },
                        { id: "kit", name: "Módulo 04: Mochila de 72 Horas y Kit de Emergencia", data: telemetry.kit, color: "from-emerald-500 to-teal-400" }
                      ].map((m) => {
                        const acc = m.data.totalQuestions > 0 ? (m.data.correctAnswers / m.data.totalQuestions) * 100 : 0;
                        return (
                          <div key={m.id} className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-2xl space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-xs font-bold text-white uppercase">{m.name}</span>
                              <div className="flex items-center space-x-3 text-[11px] font-mono">
                                <span className="text-slate-400">📹 {m.data.views.toLocaleString()} vistas</span>
                                <span className="text-slate-400">📝 {m.data.evaluations.toLocaleString()} tests</span>
                                <span className="text-amber-300 font-bold">🎯 {acc.toFixed(1)}% aciertos</span>
                              </div>
                            </div>

                            {/* Barra de Progreso de Efectividad */}
                            <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                              <div 
                                className={`h-full bg-gradient-to-r ${m.color} transition-all duration-1000`}
                                style={{ width: `${Math.min(100, acc)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Columna 3: Cobertura por Países LATAM */}
                  <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-6 text-left shadow-2xl flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="border-b border-slate-800 pb-3">
                        <h4 className="font-display font-extrabold text-base text-white uppercase">
                          Distribución por País LATAM
                        </h4>
                        <p className="text-xs text-slate-400">
                          Participación comunitaria e institucional registrada.
                        </p>
                      </div>

                      <div className="space-y-3.5">
                        {[
                          { country: "🇵🇪 Perú (E.030)", pct: 32 },
                          { country: "🇨🇱 Chile (NCh433)", pct: 26 },
                          { country: "🇻🇪 Venezuela (COVENIN)", pct: 20 },
                          { country: "🇨🇴 Colombia (NSR-10)", pct: 14 },
                          { country: "🇪🇨 Ecuador (NEC)", pct: 8 }
                        ].map((c, i) => (
                          <div key={i} className="space-y-1.5 font-mono">
                            <div className="flex justify-between text-xs font-bold text-slate-300">
                              <span>{c.country}</span>
                              <span className="text-cyan-400">{c.pct}%</span>
                            </div>
                            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                              <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${c.pct}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 text-center space-y-1">
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Certificación de Formación</span>
                      <p className="text-xs text-cyan-300 font-bold">1,840 Certificados Emitidos en LATAM</p>
                    </div>
                  </div>

                </div>

              </div>
            );
          })()}

        </div>
      </section>

      {/* =========================================================================
          SECCIÓN EL EQUIPO / EL FUNDADOR (DETRÁS DE GRDESASTRES)
          ========================================================================= */}
      <section id="fundador" className="py-24 px-6 border-t border-slate-900 bg-slate-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          
          {/* Encabezado */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded uppercase tracking-wider">
              El Equipo / El Fundador
            </span>
            <h2 className="font-display font-black text-3xl md:text-4xl text-white uppercase tracking-wider">
              Detrás de GRDesastres: Rigor Técnico, Trayectoria Científica y Respuesta en Terreno
            </h2>
            <div className="h-1.5 w-16 bg-gradient-to-r from-cyan-500 to-emerald-500 mx-auto rounded-full" />
          </div>

          {/* Frase Destacada */}
          <div className="max-w-4xl mx-auto bg-slate-900/50 border border-slate-800 p-6 md:p-8 rounded-3xl relative overflow-hidden text-center shadow-xl shadow-black/30">
            <div className="absolute -top-6 -left-6 text-slate-800/20 font-serif text-9xl pointer-events-none select-none">“</div>
            <p className="text-sm sm:text-base md:text-lg italic text-slate-200 leading-relaxed font-medium relative z-10">
              "La reducción del riesgo de desastres no se aprende solo en los libros; se forja analizando el terreno, planificando la prevención y actuando en los escenarios de mayor exigencia y vulnerabilidad real."
            </p>
            <div className="absolute -bottom-16 -right-6 text-slate-800/20 font-serif text-9xl pointer-events-none select-none">”</div>
          </div>

          {/* Grid de Contenido (Dos Columnas: Texto y Timeline a la izquierda, Fotos en Terreno a la derecha) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Columna Izquierda: Contenido y Timeline */}
            <div className="lg:col-span-7 space-y-10 text-left">
              
              {/* Bloque 1: El Puente entre la Geociencia... */}
              <div className="space-y-4">
                <h3 className="font-display font-bold text-xl md:text-2xl text-white border-l-4 border-cyan-500 pl-4 uppercase">
                  El Puente entre la Geociencia, la Ingeniería y la Resiliencia
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Soy <strong>Jairo Ovallos</strong>, TSU en Geología y Minas, Ingeniero Civil e Ingeniero en Geociencias. Mi carrera ha estado guiada por una profunda vocación: entender los procesos físicos y geológicos de la Tierra para diseñar infraestructuras seguras y proteger a las comunidades que las habitan.
                </p>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  A lo largo de mi trayectoria, he integrado el rigor de las ciencias de la Tierra con la ejecución práctica de planes de prevención y respuesta frente a emergencias bajo estrictas normativas técnicas y operativas.
                </p>

                {/* Bloque de Badges (Etiquetas Rápidas) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                  <div className="flex items-center space-x-3 bg-slate-900 border border-slate-850 px-4 py-3 rounded-xl hover:border-cyan-500/30 transition-colors">
                    <HardHat className="h-5 w-5 text-cyan-400 shrink-0" />
                    <span className="text-[10px] sm:text-xs font-semibold text-slate-200">Ing. Civil e Ing. en Geociencias</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-slate-900 border border-slate-850 px-4 py-3 rounded-xl hover:border-cyan-500/30 transition-colors">
                    <Globe className="h-5 w-5 text-cyan-400 shrink-0" />
                    <span className="text-[10px] sm:text-xs font-semibold text-slate-200">Especialista USAR Internacional</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-slate-900 border border-slate-850 px-4 py-3 rounded-xl hover:border-cyan-500/30 transition-colors">
                    <Shield className="h-5 w-5 text-cyan-400 shrink-0" />
                    <span className="text-[10px] sm:text-xs font-semibold text-slate-200">Ex-Jefe Planificación PC Táchira</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-slate-900 border border-slate-850 px-4 py-3 rounded-xl hover:border-cyan-500/30 transition-colors">
                    <Settings className="h-5 w-5 text-cyan-400 shrink-0" />
                    <span className="text-[10px] sm:text-xs font-semibold text-slate-200">Gestión Operativa de Emergencias & RRD</span>
                  </div>
                </div>
              </div>

              {/* Bloque 2: 12 Años de Liderazgo Operativo */}
              <div className="space-y-4">
                <h3 className="font-display font-bold text-xl md:text-2xl text-white border-l-4 border-emerald-500 pl-4 uppercase">
                  12 Años de Liderazgo Operativo y Respuesta en Primera Línea
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Durante más de una década en Protección Civil y Administración de Desastres del Estado Táchira (Venezuela), lideré el análisis, la planificación y la coordinación operativa ante eventos adversos complejos en una de las regiones con mayor dinamismo sismológico y geológico de Sudamérica:
                </p>
                
                <div className="space-y-3 pl-4 border-l border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase">Jefe de Operaciones y Comunicaciones (2011 - 2017)</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Coordinación en tiempo real y despliegue estratégico frente a emergencias de gran escala.</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase">Jefe de Planificación y Gestión del Riesgo (2009 - 2011)</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Diseño de metodologías preventivas, estudios de vulnerabilidad física y ordenamiento territorial.</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Esta vocación técnica de servicio me llevó a formar parte de misiones internacionales de ayuda humanitaria como especialista en misiones de Búsqueda y Rescate Urbano (USAR) frente a grandes catástrofes sísmicas de la última década:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">Nepal 2015</span>
                    <p className="text-xs text-slate-300">Despliegue en terreno y operaciones de rescate técnico tras el devastador sismo de magnitud 7.8.</p>
                  </div>
                  <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">Ecuador 2016</span>
                    <p className="text-xs text-slate-300">Evaluación estructural de edificaciones colapsadas, soporte técnico y primera respuesta humanitaria tras el terremoto de magnitud 7.8.</p>
                  </div>
                </div>
              </div>

              {/* Línea de Tiempo Operativa */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  Línea de Tiempo Operativa (Timeline)
                </h4>
                <div className="relative pl-6 border-l-2 border-slate-800 space-y-8">
                  {/* Item 1 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-cyan-500 border-4 border-slate-950" />
                    <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                      2005 - 2017
                    </span>
                    <h5 className="text-xs font-bold text-white uppercase mt-2">Protección Civil Táchira (Venezuela)</h5>
                    <p className="text-[11px] text-slate-400 mt-1">Planificación técnica, mitigación de riesgos e intervenciones operativas.</p>
                  </div>
                  
                  {/* Item 2 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-cyan-500 border-4 border-slate-950" />
                    <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                      2015
                    </span>
                    <h5 className="text-xs font-bold text-white uppercase mt-2">Misión Humanitaria - Sismo de Nepal</h5>
                    <p className="text-[11px] text-slate-400 mt-1">Búsqueda y rescate en Katmandú como especialista USAR del equipo nacional.</p>
                  </div>
                  
                  {/* Item 3 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-cyan-500 border-4 border-slate-950" />
                    <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                      2016
                    </span>
                    <h5 className="text-xs font-bold text-white uppercase mt-2">Misión Humanitaria - Sismo de Ecuador</h5>
                    <p className="text-[11px] text-slate-400 mt-1">Evaluación de daños estructurales y rescate técnico en zonas de catástrofe.</p>
                  </div>
                  
                  {/* Item 4 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-950" />
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      2020 - Presente
                    </span>
                    <h5 className="text-xs font-bold text-white uppercase mt-2">Gestión en Minería y Contratos (Chile)</h5>
                    <p className="text-[11px] text-slate-400 mt-1">Administración de contratos de alta exigencia, seguridad industrial y planes de continuidad operacional.</p>
                  </div>
                </div>
              </div>



              {/* Bloque 4: ¿Por qué nace grdesastres.com? */}
              <div className="space-y-4">
                <h3 className="font-display font-bold text-xl md:text-2xl text-white border-l-4 border-purple-500 pl-4 uppercase">
                  ¿Por qué nace grdesastres.com?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Este portal es el puente entre la ciencia aplicada, la experiencia operativa internacional y la acción de autoprotección ciudadana. Nuestro propósito es democratizar el conocimiento técnico para dotar a ingenieros, arquitectos, servidores públicos, tomadores de decisiones y comunidades de herramientas reales, metodologías de reducción de riesgos y normativas que salvan vidas.
                </p>
                <p className="text-xs sm:text-sm text-cyan-400 font-bold tracking-wide italic">
                  "Porque una sociedad consciente de sus riesgos es una sociedad capaz de resistir y recuperarse."
                </p>
              </div>

            </div>

            {/* Columna Derecha: Fotos en Terreno */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest text-center lg:text-left">
                Fotografías en Terreno (Misiones Internacionales)
              </h4>
              
              {/* Galería de Fotos - Grayscale con Hover de color */}
              <div className="space-y-4">
                
                {/* Foto Destacada (Nepal 1 - Jairo con casco Venezuela mirando colapso) */}
                <div className="relative group overflow-hidden rounded-2xl border border-slate-800 shadow-lg">
                  <img 
                    src={jairoNepalRescue1} 
                    alt="Terremoto de Nepal (2015) - Operación en terreno" 
                    className="w-full h-auto object-cover filter grayscale contrast-110 brightness-90 hover:grayscale-0 hover:contrast-100 hover:brightness-100 transition-all duration-700 ease-in-out"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 backdrop-blur-xs p-3 text-center border-t border-slate-850">
                    <p className="text-[10px] font-bold text-white uppercase tracking-wider">Terremoto de Nepal (2015)</p>
                    <p className="text-[8px] text-slate-400 mt-0.5">Evaluación de estructuras colapsadas e inspección técnica en terreno</p>
                  </div>
                </div>

                {/* Sub-grid de las otras 4 fotos */}
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Foto 2: Nepal Rescue 2 */}
                  <div className="relative group overflow-hidden rounded-xl border border-slate-800 shadow-md">
                    <img 
                      src={jairoNepalRescue2} 
                      alt="Nepal - Inspección en terreno" 
                      className="w-full h-40 object-cover filter grayscale contrast-110 brightness-90 hover:grayscale-0 hover:contrast-100 hover:brightness-100 transition-all duration-700 ease-in-out"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 backdrop-blur-xs p-2 text-center border-t border-slate-850">
                      <p className="text-[8px] font-bold text-white uppercase">Katmandú</p>
                      <p className="text-[7px] text-slate-400">Inspección técnica</p>
                    </div>
                  </div>

                  {/* Foto 3: Jairo Rescue Search */}
                  <div className="relative group overflow-hidden rounded-xl border border-slate-800 shadow-md">
                    <img 
                      src={jairoRescueSearch} 
                      alt="Búsqueda y rescate en estructuras colapsadas" 
                      className="w-full h-40 object-cover filter grayscale contrast-110 brightness-90 hover:grayscale-0 hover:contrast-100 hover:brightness-100 transition-all duration-700 ease-in-out"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 backdrop-blur-xs p-2 text-center border-t border-slate-850">
                      <p className="text-[8px] font-bold text-white uppercase">Búsqueda Técnica</p>
                      <p className="text-[7px] text-slate-400">Escenarios reales USAR</p>
                    </div>
                  </div>

                  {/* Foto 4: Jairo Nepal Close */}
                  <div className="relative group overflow-hidden rounded-xl border border-slate-800 shadow-md">
                    <img 
                      src={jairoNepalClose} 
                      alt="Jairo Ovallos en Nepal" 
                      className="w-full h-40 object-cover filter grayscale contrast-110 brightness-90 hover:grayscale-0 hover:contrast-100 hover:brightness-100 transition-all duration-700 ease-in-out"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 backdrop-blur-xs p-2 text-center border-t border-slate-850">
                      <p className="text-[8px] font-bold text-white uppercase">Especialista USAR</p>
                      <p className="text-[7px] text-slate-400">Misión humanitaria</p>
                    </div>
                  </div>

                  {/* Foto 5: Jairo Ecuador Collapse */}
                  <div className="relative group overflow-hidden rounded-xl border border-slate-800 shadow-md">
                    <img 
                      src={jairoEcuadorCollapse} 
                      alt="Terremoto de Ecuador (2016)" 
                      className="w-full h-40 object-cover filter grayscale contrast-110 brightness-90 hover:grayscale-0 hover:contrast-100 hover:brightness-100 transition-all duration-700 ease-in-out"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 backdrop-blur-xs p-2 text-center border-t border-slate-850">
                      <p className="text-[8px] font-bold text-white uppercase">Ecuador (2016)</p>
                      <p className="text-[7px] text-slate-400">Evaluación estructural</p>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>



      {/* =========================================================================
          SECCIÓN PORTAFOLIO: PLATAFORMA SÍSMICA Y TRABAJOS
          ========================================================================= */}
      <section id="portafolio" className="relative py-24 px-6 border-t border-slate-900 overflow-hidden">
        {/* Video de fondo para toda la sección de portafolio (reproducción automática, en bucle y sin overlay) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <video
            src="https://res.cloudinary.com/rtzau8g7/video/upload/v1786410279/quiero_un_video_donde_se_muest_upxuqj.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-100"
          />
          {/* Insignia Oficial GRDesastres ajustada para cubrir exactamente la marca de agua del video en el Portafolio */}
          <div className="absolute bottom-10 right-4 sm:bottom-12 sm:right-8 z-20 pointer-events-auto flex items-center space-x-3.5 bg-slate-950/95 backdrop-blur-xl px-4 sm:px-5 py-3.5 sm:py-4 rounded-3xl border border-cyan-500/50 shadow-2xl shadow-black/90 min-w-[210px] sm:min-w-[230px]">
            <div className="p-2 rounded-2xl bg-slate-900 border border-cyan-500/40 flex items-center justify-center shrink-0 shadow-inner">
              <img 
                src={grdesastresLogo} 
                alt="Emblema Oficial GRDesastres" 
                className="w-[42px] h-[42px] sm:w-[52px] sm:h-[52px] object-contain drop-shadow-[0_4px_12px_rgba(6,182,212,0.6)]"
              />
            </div>
            <div className="text-left font-mono space-y-0.5">
              <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wider block leading-none">GRDesastres</span>
              <span className="text-[9px] sm:text-[10px] text-cyan-400 font-bold tracking-widest uppercase block">Plataforma Oficial</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="font-display font-black text-3xl md:text-4xl text-white uppercase tracking-wider">
              Portafolio de Proyectos
            </h2>
            <div className="h-1.5 w-16 bg-gradient-to-r from-cyan-500 to-emerald-500 mx-auto rounded-full" />
            <p className="text-xs sm:text-sm text-slate-400">
              Explora las aplicaciones técnicas interactivas y los proyectos de ayuda humanitaria y docencia en los que he trabajado.
            </p>
          </div>

          {/* 1. PROYECTO INSIGNIA: PLATAFORMA DE MODELADO SÍSMICO LATAM */}
          <div className="border border-slate-700/80 bg-slate-900/40 backdrop-blur-sm rounded-3xl p-6 md:p-8 space-y-8 relative overflow-hidden text-left">
            {/* Glow decorativo cian en esquina superior derecha */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-700/50 pb-6">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded uppercase tracking-wider">
                  Proyecto Insignia
                </span>
                <h3 className="font-display font-black text-2xl md:text-3xl text-white uppercase leading-none">
                  Plataforma de Riesgo Sísmico LATAM
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Software integral para el análisis estructural y el cribado de vulnerabilidad sismorresistente. Permite simular edificaciones bajo códigos oficiales (E.030 Perú, NCh433 Chile, NSR-10 Colombia, COVENIN 1756 Venezuela) con emisión de reportes técnicos de IA.
                </p>
              </div>
            </div>

            {/* Submódulos Técnicos (Quick Launch) */}
            <div className="relative z-10 space-y-4">
              <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                Acceso Rápido a Herramientas de Cálculo
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                
                {/* Modulo 1: MDOF */}
                <button 
                  onClick={() => onNavigate("simulador")}
                  className="bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-cyan-500/30 p-4 rounded-xl text-left transition duration-200 cursor-pointer flex flex-col justify-between min-h-[140px] group"
                >
                  <Activity className="h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <h5 className="text-[11px] font-bold text-white uppercase">Simulador MDOF</h5>
                    <p className="text-[9px] text-slate-400 mt-1 leading-normal">Dinámica lineal de edificios de varios niveles ante acelerogramas.</p>
                  </div>
                </button>

                {/* Modulo 2: Espectro */}
                <button 
                  onClick={() => onNavigate("espectro")}
                  className="bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-cyan-500/30 p-4 rounded-xl text-left transition duration-200 cursor-pointer flex flex-col justify-between min-h-[140px] group"
                >
                  <Layers className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <h5 className="text-[11px] font-bold text-white uppercase">Espectro de Diseño</h5>
                    <p className="text-[9px] text-slate-400 mt-1 leading-normal">Zonificación de suelos y coeficientes de respuesta espectral.</p>
                  </div>
                </button>

                {/* Modulo 3: FEMA P-154 */}
                <button 
                  onClick={() => onNavigate("fema")}
                  className="bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-cyan-500/30 p-4 rounded-xl text-left transition duration-200 cursor-pointer flex flex-col justify-between min-h-[140px] group"
                >
                  <FileText className="h-5 w-5 text-yellow-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <h5 className="text-[11px] font-bold text-white uppercase">FEMA P-154 (RVS)</h5>
                    <p className="text-[9px] text-slate-400 mt-1 leading-normal">Cribado visual rápido para evaluación de riesgo estructural.</p>
                  </div>
                </button>

                {/* Modulo 4: GNDT */}
                <button 
                  onClick={() => onNavigate("gndt")}
                  className="bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-cyan-500/30 p-4 rounded-xl text-left transition duration-200 cursor-pointer flex flex-col justify-between min-h-[140px] group"
                >
                  <Shield className="h-5 w-5 text-orange-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <h5 className="text-[11px] font-bold text-white uppercase">Vulnerabilidad GNDT</h5>
                    <p className="text-[9px] text-slate-400 mt-1 leading-normal">Cálculo de índice con 11 parámetros críticos de mampostería.</p>
                  </div>
                </button>

                {/* Modulo 5: Venezuela */}
                <button 
                  onClick={() => onNavigate("vulnerabilidad")}
                  className="bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-cyan-500/30 p-4 rounded-xl text-left transition duration-200 cursor-pointer flex flex-col justify-between min-h-[140px] group"
                >
                  <Globe className="h-5 w-5 text-purple-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <h5 className="text-[11px] font-bold text-white uppercase">Riesgo Venezuela</h5>
                    <p className="text-[9px] text-slate-400 mt-1 leading-normal">Evaluaciones adaptadas al contexto y zonificación nacional.</p>
                  </div>
                </button>

              </div>
            </div>

            {/* Módulos de Divulgación y Aula Interactiva */}
            <div className="relative z-10 space-y-4 pt-4 border-t border-slate-850">
              <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                Módulos de Capacitación y Divulgación Sísmica
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Aula */}
                <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-white uppercase">Aula Virtual</p>
                    <p className="text-[8px] text-slate-500">Resonancia sísmica</p>
                  </div>
                  <button 
                    onClick={() => setActiveModal("aula")}
                    className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[9px] font-bold uppercase px-3 py-1.5 rounded-lg border border-cyan-500/20 transition cursor-pointer shrink-0 animate-pulse"
                  >
                    Simular Ondas
                  </button>
                </div>

                {/* Biblioteca */}
                <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-white uppercase">Biblioteca</p>
                    <p className="text-[8px] text-slate-500">Códigos y normativas</p>
                  </div>
                  <button 
                    onClick={() => setActiveModal("biblioteca")}
                    className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase px-3 py-1.5 rounded-lg border border-emerald-500/20 transition cursor-pointer shrink-0"
                  >
                    Buscar PDF
                  </button>
                </div>

                {/* Héroes */}
                <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-white uppercase">Héroes USAR</p>
                    <p className="text-[8px] text-slate-500">Historias de rescatistas</p>
                  </div>
                  <button 
                    onClick={() => setActiveModal("heroes")}
                    className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-[9px] font-bold uppercase px-3 py-1.5 rounded-lg border border-orange-500/20 transition cursor-pointer shrink-0"
                  >
                    Ver Historias
                  </button>
                </div>

                {/* Blog */}
                <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-white uppercase">Blog Técnico</p>
                    <p className="text-[8px] text-slate-500">Sismotectónica y fallas</p>
                  </div>
                  <button 
                    onClick={() => setActiveModal("blogs")}
                    className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-[9px] font-bold uppercase px-3 py-1.5 rounded-lg border border-purple-500/20 transition cursor-pointer shrink-0"
                  >
                    Leer Blog
                  </button>
                </div>

              </div>
            </div>

            {/* Fuentes Sismológicas Oficiales */}
            <div className="relative z-10 space-y-4 pt-4 border-t border-slate-850">
              <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                Fuentes Sismológicas Oficiales
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* USGS */}
                <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-white uppercase">USGS</p>
                    <p className="text-[8px] text-slate-500">Monitoreo sísmico global</p>
                  </div>
                  <a 
                    href="https://earthquake.usgs.gov/earthquakes/map/?currentFeatureId=us7000t1hd&extent=-37.16032,-189.66797&extent=73.67726,91.58203"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-[9px] font-bold uppercase px-3 py-1.5 rounded-lg border border-sky-500/20 transition cursor-pointer shrink-0 text-center"
                  >
                    Ver Mapa
                  </a>
                </div>

                {/* CSN Chile */}
                <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-white uppercase">CSN Chile</p>
                    <p className="text-[8px] text-slate-500">Centro Sismológico Nacional</p>
                  </div>
                  <a 
                    href="https://www.csn.uchile.cl/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[9px] font-bold uppercase px-3 py-1.5 rounded-lg border border-amber-500/20 transition cursor-pointer shrink-0 text-center"
                  >
                    Visitar Web
                  </a>
                </div>

                {/* SGC Colombia */}
                <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-white uppercase">SGC Colombia</p>
                    <p className="text-[8px] text-slate-500">Servicio Geológico Colombiano</p>
                  </div>
                  <a 
                    href="https://www.sgc.gov.co/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[9px] font-bold uppercase px-3 py-1.5 rounded-lg border border-rose-500/20 transition cursor-pointer shrink-0 text-center"
                  >
                    Visitar Web
                  </a>
                </div>

              </div>
            </div>

          </div>


        </div>
      </section>

      {/* =========================================================================
          SECCIÓN CONTACTO
          ========================================================================= */}
      <section id="contacto" className="py-24 px-6 border-t border-slate-900 bg-slate-900/10">
        <div className="max-w-3xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="font-display font-black text-3xl md:text-4xl text-white uppercase tracking-wider">
              Contáctame
            </h2>
            <div className="h-1.5 w-16 bg-gradient-to-r from-cyan-500 to-emerald-500 mx-auto rounded-full" />
            <div className="text-xs sm:text-sm text-slate-400 space-y-2 leading-relaxed max-w-xl mx-auto">
              <p>¿Tienes una consulta sobre las Herramientas Complementarias RRD, Módulos de Formación y Divulgación?</p>
              <p>¿Consulta por asesorías y capacitaciones para ti, tu familia o tu empresa?</p>
              <p>Envíame un mensaje directo y nos contactaremos contigo.</p>
              <div className="pt-2 text-slate-500 text-center">
                <p>Atentamente,</p>
                <p className="font-bold text-slate-300">El equipo de GRDesastres.com</p>
                <p className="text-cyan-400 font-bold mt-1">Preparamos personas, protegemos organizaciones.</p>
              </div>
            </div>
          </div>

          {/* Formulario de contacto — ancho completo */}
          <div className="bg-slate-900 border border-slate-850 p-6 md:p-8 rounded-2xl text-left">
            <form onSubmit={handleContactSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nombre Completo *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Tu Nombre" 
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Correo Electrónico *</label>
                  <input 
                    type="email" 
                    required
                    placeholder="ejemplo@dominio.com" 
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Asunto</label>
                <input 
                  type="text" 
                  placeholder="Oportunidad laboral, consulta de simulador..." 
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mensaje *</label>
                <textarea 
                  required
                  rows={5}
                  placeholder="Escribe tu mensaje aquí..." 
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-855 rounded-xl p-4 text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              {submitStatus && (
                <div className={`p-4 rounded-xl border text-xs ${
                  submitStatus === "success" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}>
                  {submitMessage}
                </div>
              )}

              <div className="text-end">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-slate-950 font-black text-xs uppercase px-6 py-3 rounded-xl tracking-wider transition-all shadow-md shadow-cyan-500/10 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto ml-auto disabled:opacity-50"
                >
                  {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                  <Send className="h-4.5 w-4.5" />
                </button>
              </div>

            </form>
          </div>

        </div>
      </section>

      {/* =========================================================================
          PIE DE PÁGINA CORPORATIVO (GRDESASTRES)
          ========================================================================= */}
      <footer className="bg-[#06101E] text-slate-300 py-12 px-6 border-t border-cyan-900/50">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Fila Principal de Navegación y Marca */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Columna 1: Marca e Identidad */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center space-x-3.5">
                <div className="p-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 shadow-lg shadow-cyan-500/10 flex items-center justify-center">
                  <img 
                    src={grdesastresLogo} 
                    alt="Emblema GRDesastres" 
                    className="w-[46px] h-[46px] object-contain drop-shadow-[0_2px_8px_rgba(6,182,212,0.3)]"
                  />
                </div>
                <span className="font-extrabold text-white text-base tracking-wider uppercase">
                  GRDesastres
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Plataforma integral de modelado de riesgo sísmico, capacitación y evaluación de vulnerabilidad estructural para edificaciones en Latinoamérica.
              </p>
              <div className="flex items-center space-x-2">
                <span className="badge-corporate-cyan">
                  <Shield className="h-3 w-3" /> Resiliencia & Riesgo Sísmico
                </span>
              </div>
            </div>

            {/* Columna 2: Módulos de Cálculo */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider text-cyan-400">Módulos de Análisis</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><button onClick={() => onNavigate("modelo")} className="hover:text-cyan-300 transition cursor-pointer">Simulador Dinámico MDOF</button></li>
                <li><button onClick={() => onNavigate("vulnerabilidad")} className="hover:text-cyan-300 transition cursor-pointer">Cribado FUNVISIS (Venezuela)</button></li>
                <li><button onClick={() => onNavigate("fema")} className="hover:text-cyan-300 transition cursor-pointer">Evaluación FEMA P-154 (RVS)</button></li>
                <li><button onClick={() => onNavigate("gndt")} className="hover:text-cyan-300 transition cursor-pointer">Índice Vulnerabilidad GNDT</button></li>
                <li><button onClick={() => onNavigate("simulador")} className="hover:text-cyan-300 transition cursor-pointer">Simulador Sismológico 3D</button></li>
              </ul>
            </div>

            {/* Columna 3: Normativas Compatibles */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider text-teal-400">Normativas LATAM</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>Perú: Norma E.030 Sismorresistente</li>
                <li>Chile: Norma NCh433 & NCh2745</li>
                <li>Colombia: Reglamento NSR-10</li>
                <li>Venezuela: COVENIN 1756-1:2019</li>
                <li>Ecuador: NEC-SE-DS 2015</li>
              </ul>
            </div>

            {/* Columna 4: Confidencialidad y NDA */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider text-amber-400">Aviso NDA & Seguridad</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed bg-[#08182B] p-3 rounded-xl border border-cyan-900/40">
                Los datos de proyectos e inspecciones ingresados se procesan localmente en el navegador garantizando estricta privacidad.
              </p>
            </div>

          </div>

          {/* Fila Inferior de Copyright y Créditos */}
          <div className="pt-6 border-t border-cyan-900/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>© 2026 GRDesastres — Plataforma de Riesgo Sísmico LATAM. Todos los derechos reservados.</p>
            <div className="flex items-center space-x-3 text-slate-400">
              <span className="text-cyan-400 font-mono">GRDesastres • React 19 • Tailwind</span>
              <span>•</span>
              <span className="hover:text-white transition cursor-pointer" onClick={() => onNavigate("inicio")}>Portal GRDesastres</span>
            </div>
          </div>

        </div>
      </footer>


      {/* =========================================================================
          MODALES INTERACTIVOS DE LOS MÓDULOS DE FORMACIÓN Y RECURSOS
          ========================================================================= */}
      <AnimatePresence>
        
        {/* MODAL 5: AULA DE CLASES SISMOLÓGICA (INTERACTIVO Y DIDÁCTICO) */}
        {activeModal === "aula" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 flex items-center justify-center overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col my-8 max-h-[90vh]"
            >
              {/* Encabezado del Modal */}
              <div className="bg-slate-950 p-6 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-yellow-500/10 rounded-xl text-yellow-400">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white uppercase tracking-wider">AULA DE CLASES VIRTUAL: FÍSICA DE ONDAS SÍSMICAS</h3>
                    <p className="text-xs text-slate-400">Interactúa con el sismógrafo escolar para entender la resonancia estructural.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition border border-slate-800 cursor-pointer"
                >
                  Cerrar
                </button>
              </div>

              {/* Contenido del Modal */}
              <div className="p-6 overflow-y-auto space-y-6">
                
                {/* Simulador Interactivo de Ondas */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-950 border border-slate-850 p-5 rounded-2xl items-center">
                  
                  {/* Controles de la Simulación */}
                  <div className="md:col-span-5 space-y-4 text-left">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-yellow-500 tracking-wider uppercase font-mono">Tipo de Onda Sísmica</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button 
                          onClick={() => setWaveType("P")}
                          className={`px-3 py-2 text-[10px] font-bold rounded-xl border transition cursor-pointer uppercase ${
                            waveType === "P" ? "bg-yellow-500/10 border-yellow-500 text-yellow-400" : "bg-slate-900 border-slate-800 text-slate-400"
                          }`}
                        >
                          Ondas P
                        </button>
                        <button 
                          onClick={() => setWaveType("S")}
                          className={`px-3 py-2 text-[10px] font-bold rounded-xl border transition cursor-pointer uppercase ${
                            waveType === "S" ? "bg-yellow-500/10 border-yellow-500 text-yellow-400" : "bg-slate-900 border-slate-800 text-slate-400"
                          }`}
                        >
                          Ondas S
                        </button>
                        <button 
                          onClick={() => setWaveType("Surface")}
                          className={`px-3 py-2 text-[10px] font-bold rounded-xl border transition cursor-pointer uppercase ${
                            waveType === "Surface" ? "bg-yellow-500/10 border-yellow-500 text-yellow-400" : "bg-slate-900 border-slate-800 text-slate-400"
                          }`}
                        >
                          Superficiales
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-300">Frecuencia Sísmica:</span>
                        <span className="font-mono font-bold text-yellow-400">{frequency.toFixed(2)} Hz</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.2" 
                        max="2.5" 
                        step="0.1" 
                        value={frequency} 
                        onChange={(e) => setFrequency(parseFloat(e.target.value))}
                        className="w-full accent-yellow-500 bg-slate-900"
                      />
                      <p className="text-[9px] text-slate-500">El edificio escolar resuena a ~0.8 Hz (ajusta para entrar en resonancia).</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-300">Amplitud (Aceleración):</span>
                        <span className="font-mono font-bold text-yellow-400">{amplitude} cm/s²</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="80" 
                        step="5" 
                        value={amplitude} 
                        onChange={(e) => setAmplitude(parseInt(e.target.value))}
                        className="w-full accent-yellow-500 bg-slate-900"
                      />
                    </div>

                    {/* Alerta de Resonancia */}
                    <div className={`p-4 rounded-xl border text-xs flex items-center justify-between transition-colors ${
                      resonanceStatus === "RESONANCIA" 
                        ? "bg-red-500/15 border-red-500/50 text-red-400" 
                        : resonanceStatus === "Crítica"
                          ? "bg-orange-500/10 border-orange-500/40 text-orange-400"
                          : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    }`}>
                      <div>
                        <p className="font-bold uppercase tracking-wider">Estado de Resonancia:</p>
                        <p className="text-[10px] text-slate-300 mt-0.5">
                          {resonanceStatus === "RESONANCIA" 
                            ? "¡RESONANCIA DETECTADA! El suelo y la estructura coinciden en frecuencia."
                            : resonanceStatus === "Crítica"
                              ? "Frecuencia alta: daño por sacudida rápida pero menor flexión."
                              : "Diseño seguro fuera del período crítico del suelo."}
                        </p>
                      </div>
                      <span className="font-black uppercase tracking-widest text-[10px] px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
                        {resonanceStatus}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <button 
                        onClick={() => setIsClassroomPlaying(!isClassroomPlaying)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-black text-xs uppercase px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center space-x-1.5"
                      >
                        {isClassroomPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        <span>{isClassroomPlaying ? "Pausar Física" : "Reanudar Física"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Canvas de Simulación Visual (SVG con Física simulada en vivo) */}
                  <div className="md:col-span-7 flex flex-col items-center justify-center bg-slate-900/40 border border-slate-855 p-4 rounded-2xl relative min-h-[260px] overflow-hidden">
                    <span className="absolute top-2 left-2 text-[8px] font-mono text-slate-500 uppercase">Sismógrafo Dinámico de Estructura</span>
                    
                    <svg viewBox="0 0 300 220" className="w-full max-w-[280px]">
                      {/* Línea del suelo oscilante */}
                      {(() => {
                        const groundSway = isClassroomPlaying ? Math.sin(classroomTime * frequency * 2 * Math.PI) * (amplitude / 4) : 0;
                        const buildingSway = isClassroomPlaying ? Math.sin(classroomTime * frequency * 2 * Math.PI - (resonanceStatus === "RESONANCIA" ? 1.5 : 0.5)) * (amplitude / 3) * (resonanceStatus === "RESONANCIA" ? 2.5 : 1.0) : 0;
                        
                        return (
                          <g>
                            {/* Onda sísmica en el suelo */}
                            <path 
                              d={`M 10,180 Q 80,${180 + groundSway} 150,180 T 290,180`} 
                              fill="none" 
                              stroke="#eab308" 
                              strokeWidth="2.5" 
                              opacity="0.8" 
                            />
                            
                            {/* Estratos de roca */}
                            <rect x="0" y="181" width="300" height="40" fill="#334155" opacity="0.4" />
                            
                            {/* EDIFICIO ESCOLAR (Sway dinámico proporcional a la física) */}
                            {/* Fundación */}
                            <rect x={120 + groundSway} y="170" width="60" height="10" fill="#475569" stroke="#fff" strokeWidth="1" />
                            
                            {/* Columnas estructurales elásticas */}
                            <path 
                              d={`M ${135 + groundSway},170 Q ${135 + groundSway + buildingSway * 0.5},115 ${135 + groundSway + buildingSway},60`} 
                              fill="none" 
                              stroke={resonanceStatus === "RESONANCIA" ? "#f43f5e" : "#38bdf8"} 
                              strokeWidth="4" 
                              strokeLinecap="round"
                            />
                            <path 
                              d={`M ${165 + groundSway},170 Q ${165 + groundSway + buildingSway * 0.5},115 ${165 + groundSway + buildingSway},60`} 
                              fill="none" 
                              stroke={resonanceStatus === "RESONANCIA" ? "#f43f5e" : "#38bdf8"} 
                              strokeWidth="4" 
                              strokeLinecap="round"
                            />
                            
                            {/* Losa o Techo del Aula */}
                            <rect 
                              x={110 + groundSway + buildingSway} 
                              y="45" 
                              width="80" 
                              height="15" 
                              rx="3" 
                              fill={resonanceStatus === "RESONANCIA" ? "#be123c" : "#0284c7"} 
                              stroke="#fff" 
                              strokeWidth="1" 
                            />
                            {/* Ventanas decorativas del aula */}
                            <rect x={120 + groundSway + buildingSway} y="50" width="10" height="6" fill="#e2e8f0" opacity="0.8" />
                            <rect x={145 + groundSway + buildingSway} y="50" width="10" height="6" fill="#e2e8f0" opacity="0.8" />
                            <rect x={170 + groundSway + buildingSway} y="50" width="10" height="6" fill="#e2e8f0" opacity="0.8" />

                            {/* Cartel de Aula */}
                            <text x={125 + groundSway + buildingSway} y="40" fill="#fff" fontSize="7" fontWeight="bold" fontFamily="monospace">AULA DE CLASES</text>

                            {/* Resorte o Amortiguador elástico */}
                            <line 
                              x1={150 + groundSway} 
                              y1="170" 
                              x2={150 + groundSway + buildingSway} 
                              y2="60" 
                              stroke="#f59e0b" 
                              strokeWidth="1" 
                              strokeDasharray="2 3" 
                            />

                            {/* Puntero de trazo del Sismógrafo */}
                            <line x1={150 + groundSway + buildingSway} y1="45" x2={260} y2="45" stroke="#475569" strokeWidth="0.5" strokeDasharray="1 3" />
                            <circle cx={150 + groundSway + buildingSway} cy="45" r="3" fill="#eab308" />
                          </g>
                        );
                      })()}
                    </svg>

                  </div>

                </div>

                {/* Explicación Didáctica */}
                <div className="space-y-3 text-left">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Info className="h-4 w-4 text-yellow-500" />
                    Concepto Físico Clave: Resonancia Estructural
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Cada edificación tiene un <strong>período natural de vibración</strong> (determinado por su altura, rigidez y masa). Si las ondas del terremoto empujan el edificio con esa misma frecuencia, se produce el fenómeno de la <strong>resonancia</strong>. En este estado, los desplazamientos se amplifican exponencialmente en cada ciclo, sometiendo a las vigas y columnas a fuerzas críticas que pueden provocar el colapso repentino si la estructura carece de la ductilidad o amortiguamiento adecuado.
                  </p>
                </div>

              </div>

              {/* Pie del Modal */}
              <div className="bg-slate-950 p-4 border-t border-slate-800 flex justify-between items-center">
                <p className="text-[10px] text-slate-500">Módulo de Formación Continua Geologol v1.0 • Todos los derechos reservados</p>
                <button 
                  onClick={() => {
                    setActiveModal(null);
                    onNavigate("simulador");
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase px-4 py-2 rounded-xl transition cursor-pointer shadow-md"
                >
                  Probar en Simulador Técnico
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* MODAL 6: MATERIAL BIBLIOGRÁFICO Y GUÍAS (BIBLIOTECA DIGITAL CON BÚSQUEDA) */}
        {activeModal === "biblioteca" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 flex items-center justify-center overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col my-8 max-h-[90vh]"
            >
              {/* Encabezado */}
              <div className="bg-slate-950 p-6 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white uppercase tracking-wider">BIBLIOTECA TÉCNICA RRD Y GEOLOGÍA</h3>
                    <p className="text-xs text-slate-400">Descarga manuales, normas de sismorresistencia e informes científicos oficiales.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition border border-slate-800 cursor-pointer"
                >
                  Cerrar
                </button>
              </div>

              {/* Búsqueda y Filtros */}
              <div className="p-6 bg-slate-950 border-b border-slate-855 flex flex-col sm:flex-row gap-4">
                <input 
                  type="text"
                  placeholder="Buscar norma, país o metodología..."
                  value={biblioSearch}
                  onChange={(e) => setBiblioSearch(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
                />
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {["Todos", "Normativas", "Manuales", "Sismología", "RRD"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setBiblioCategory(cat)}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition cursor-pointer uppercase ${
                        (cat === "Todos" ? biblioCategory === "Todos" : biblioCategory === cat)
                          ? "bg-cyan-500/10 border-cyan-500 text-cyan-400"
                          : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contenido / Lista */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1 text-left">
                {(() => {
                  const filtered = BIBLIOGRAFIA_DB.filter((item) => {
                    const matchesSearch = item.title.toLowerCase().includes(biblioSearch.toLowerCase()) || 
                                          item.description.toLowerCase().includes(biblioSearch.toLowerCase()) ||
                                          item.author.toLowerCase().includes(biblioSearch.toLowerCase());
                    const matchesCat = biblioCategory === "Todos" || item.category === biblioCategory;
                    return matchesSearch && matchesCat;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="text-center py-12 text-slate-500 space-y-2">
                        <Bookmark className="h-10 w-10 text-slate-600 mx-auto" />
                        <p className="text-sm font-bold">No se encontraron documentos en la biblioteca</p>
                        <p className="text-xs">Prueba con términos alternativos o modifica la categoría seleccionada.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      {filtered.map((item) => (
                        <div 
                          key={item.id}
                          className="bg-slate-950/60 border border-slate-855 hover:border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all"
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center space-x-2.5">
                              <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                                {item.category}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500">{item.year}</span>
                            </div>
                            <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">{item.title}</h4>
                            <p className="text-[10px] font-medium text-slate-400">Autor: {item.author} | Publicado en: {item.source}</p>
                            <p className="text-xs text-slate-300 line-clamp-3 md:line-clamp-2 mt-1">{item.description}</p>
                          </div>
                          
                          <a 
                            href={item.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full md:w-auto text-center bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/30 text-cyan-400 hover:text-cyan-300 font-bold text-[10px] tracking-wider uppercase px-4 py-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span>DESCARGAR</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Pie */}
              <div className="bg-slate-950 p-4 border-t border-slate-800 text-center">
                <p className="text-[10px] text-slate-500">El repositorio digital promueve el acceso libre y universal a material educativo de RRD en Latinoamérica.</p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* MODAL 7: HÉROES ANÓNIMOS DE LATINOAMÉRICA (GALERÍA/CAROUSEL DE VALOR) */}
        {activeModal === "heroes" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 flex items-center justify-center overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl flex flex-col my-8 max-h-[90vh]"
            >
              {/* Encabezado */}
              <div className="bg-slate-950 p-6 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-orange-500/10 rounded-xl text-orange-400">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white uppercase tracking-wider">HÉROES ANÓNIMOS DE LATINOAMÉRICA</h3>
                    <p className="text-xs text-slate-400">Conoce las historias de valor de quienes arriesgan su vida para mitigar el riesgo de desastres.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition border border-slate-800 cursor-pointer"
                >
                  Cerrar
                </button>
              </div>

              {/* Contenido / Visualizador */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                
                {/* Visualizador de Héroe Activo */}
                <div className="bg-slate-950 border border-slate-855 p-6 rounded-2xl flex flex-col md:flex-row gap-6 relative overflow-hidden items-center text-left">
                  
                  {/* Avatar Representativo de Color Estructurado */}
                  <div className={`h-24 w-24 rounded-2xl ${HEROES_DB[activeHeroIdx].avatarBg} flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-black/40 shrink-0 select-none uppercase tracking-wider animate-pulse`}>
                    {HEROES_DB[activeHeroIdx].name.split(" ").map(w => w[0]).join("").substring(0,2)}
                  </div>

                  <div className="space-y-3 flex-1 text-center md:text-left">
                    <div className="space-y-0.5 animate-fadeIn">
                      <p className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-widest">{HEROES_DB[activeHeroIdx].group}</p>
                      <h4 className="text-lg font-black text-white uppercase">{HEROES_DB[activeHeroIdx].name}</h4>
                      <p className="text-xs text-slate-400 font-medium italic">{HEROES_DB[activeHeroIdx].role}</p>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {HEROES_DB[activeHeroIdx].story}
                    </p>

                    <div className="bg-slate-900 border border-slate-855 p-3 rounded-xl flex items-center gap-3">
                      <Award className="h-5 w-5 text-yellow-500 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Logro de Servicio Destacado</p>
                        <p className="text-xs text-white font-medium mt-0.5">{HEROES_DB[activeHeroIdx].achievement}</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Selectores del Carrusel */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
                  {HEROES_DB.map((hero, idx) => (
                    <button
                      key={hero.id}
                      onClick={() => setActiveHeroIdx(idx)}
                      className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                        activeHeroIdx === idx 
                          ? "bg-slate-950 border-orange-500/50 shadow-inner" 
                          : "bg-slate-950/40 border-slate-900 hover:border-slate-800"
                      }`}
                    >
                      <p className="text-[9px] font-mono font-bold text-slate-500 uppercase truncate">{hero.role}</p>
                      <p className="text-xs font-bold text-white uppercase mt-0.5 truncate">{hero.name}</p>
                      <p className="text-[10px] text-orange-400 font-bold tracking-widest uppercase mt-1">Ver Historia</p>
                    </button>
                  ))}
                </div>

              </div>

              {/* Pie */}
              <div className="bg-slate-950 p-4 border-t border-slate-800 text-center flex items-center justify-center gap-1.5 text-xs text-slate-400">
                <Heart className="h-4 w-4 text-rose-500 fill-rose-500 animate-pulse" />
                <span>Rendimos sincero homenaje a todos los cuerpos civiles, rescatistas, geofísicos y caninos K9 en Latinoamérica.</span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* MODAL 8: BLOGS Y ARTÍCULOS ESPECIALISTAS (FEED COMPLETO DE LECTURA) */}
        {activeModal === "blogs" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 flex items-center justify-center overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl flex flex-col my-8 max-h-[90vh]"
            >
              {/* Encabezado */}
              <div className="bg-slate-950 p-6 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white uppercase tracking-wider">OPINIONES Y BLOGS ESPECIALISTAS</h3>
                    <p className="text-xs text-slate-400">Artículos técnicos, análisis geotécnicos e históricos escritos por sismólogos y geólogos de LATAM.</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (selectedBlogPost) {
                      setSelectedBlogPost(null);
                    } else {
                      setActiveModal(null);
                    }
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition border border-slate-800 cursor-pointer"
                >
                  {selectedBlogPost ? "Volver al Feed" : "Cerrar"}
                </button>
              </div>

              {/* Contenido / Lector */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                
                <AnimatePresence mode="wait">
                  {selectedBlogPost ? (
                    /* Lector del Post Seleccionado */
                    <motion.div 
                      key="reader"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      className="space-y-4 max-w-2xl mx-auto text-left"
                    >
                      <div className="space-y-1 pb-3 border-b border-slate-855">
                        <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">{selectedBlogPost.readTime}</span>
                        <h4 className="text-md sm:text-lg font-black text-white leading-tight uppercase">{selectedBlogPost.title}</h4>
                        <p className="text-xs text-slate-400 font-medium">Por: <span className="font-bold text-slate-200">{selectedBlogPost.author}</span> ({selectedBlogPost.role}) • {selectedBlogPost.date}</p>
                      </div>

                      <div className="text-xs text-slate-300 space-y-4 leading-relaxed font-sans text-justify">
                        {/* Párrafos del artículo */}
                        {selectedBlogPost.content.split("\n\n").map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                      </div>

                      {selectedBlogPost.videoUrl && (
                        <div className="mt-6 p-4 bg-slate-950/80 rounded-2xl border border-red-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="flex items-center space-x-3 text-left">
                            <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
                              <Play className="h-5 w-5 fill-red-500/20" />
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-white uppercase tracking-wide">Grabación de la Conferencia</h5>
                              <p className="text-[10px] text-slate-400">Accede directamente al video completo del seminario en YouTube.</p>
                            </div>
                          </div>
                          <a 
                            href={selectedBlogPost.videoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="bg-red-600 hover:bg-red-500 text-white font-black text-[10px] tracking-wider uppercase px-5 py-3 rounded-xl transition flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center shadow-lg shadow-red-600/10 hover:shadow-red-600/20"
                          >
                            Ver en YouTube
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}

                      <div className="pt-4 border-t border-slate-855 text-center">
                        <button 
                          onClick={() => setSelectedBlogPost(null)}
                          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-purple-400 font-bold text-[10px] tracking-widest uppercase px-4 py-2.5 rounded-xl transition cursor-pointer"
                        >
                          Volver a los Artículos
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    /* Feed de Artículos */
                    <motion.div 
                      key="feed"
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 15 }}
                      className="space-y-4 text-left"
                    >
                      {BLOGS_DB.map((post) => (
                        <div 
                          key={post.id}
                          onClick={() => setSelectedBlogPost(post)}
                          className="bg-slate-950/60 hover:bg-slate-950 border border-slate-855 hover:border-slate-800 p-5 rounded-2xl transition cursor-pointer flex flex-col justify-between space-y-3 group"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-mono text-purple-400 font-bold uppercase">{post.readTime}</span>
                              <span className="text-[10px] font-mono text-slate-500">{post.date}</span>
                            </div>
                            <h4 className="text-xs sm:text-sm font-bold text-white uppercase group-hover:text-purple-400 transition-colors leading-tight">{post.title}</h4>
                            <p className="text-[10px] text-slate-400 font-medium">Por: {post.author} ({post.role})</p>
                            <p className="text-xs text-slate-300 line-clamp-2 mt-1">{post.summary}</p>
                          </div>
                          
                          <div className="pt-2 border-t border-slate-855/40 flex items-center justify-between text-[10px] font-bold text-purple-400 tracking-wider uppercase group-hover:text-purple-300 transition-colors font-mono">
                            <span>Leer Artículo Completo</span>
                            <ArrowRight className="h-3 w-3" />
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

              {/* Pie */}
              <div className="bg-slate-950 p-4 border-t border-slate-800 text-center">
                <p className="text-[10px] text-slate-500">Módulo Científico Informativo • Las opiniones expresadas son de exclusiva responsabilidad de sus autores.</p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* MODAL DEL AULA VIRTUAL: LECCIONES EN VIDEO, TEST INTERACTIVO Y DIAPOSITIVAS */}
        {selectedAulaTopic && AULA_TOPICS_DATA[selectedAulaTopic] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            >
              {/* Header Modal */}
              <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold shrink-0">
                    {selectedAulaTopic === "terremotos" && <Activity className="h-5 w-5 text-cyan-400" />}
                    {selectedAulaTopic === "incendios" && <Flame className="h-5 w-5 text-orange-400" />}
                    {selectedAulaTopic === "inundaciones" && <Globe className="h-5 w-5 text-blue-400" />}
                    {selectedAulaTopic === "kit" && <Shield className="h-5 w-5 text-emerald-400" />}
                  </div>
                  <div className="text-left">
                    <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                      {AULA_TOPICS_DATA[selectedAulaTopic].category}
                    </span>
                    <h3 className="font-display font-black text-base sm:text-lg text-white uppercase leading-none">
                      {AULA_TOPICS_DATA[selectedAulaTopic].title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedAulaTopic(null);
                    setAulaSlideIdx(0);
                  }}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Navegación por Pestañas (Video / Test / Diapositivas) */}
              <div className="bg-slate-950/60 px-6 py-2.5 border-b border-slate-800/80 flex items-center justify-start gap-2 overflow-x-auto">
                <button
                  onClick={() => setAulaTab("video")}
                  className={`py-2 px-4 rounded-xl text-xs font-bold font-mono transition flex items-center space-x-2 cursor-pointer border ${
                    aulaTab === "video"
                      ? "bg-cyan-500/20 border-cyan-500/60 text-cyan-300 shadow-md shadow-cyan-500/10"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <Video className="h-4 w-4" />
                  <span>📹 Video de Formación</span>
                </button>

                <button
                  onClick={() => {
                    setAulaTab("test");
                    if (quizQuestions.length === 0) {
                      setQuizQuestions(getRandomQuizQuestions(selectedAulaTopic || "terremotos", 5));
                    }
                  }}
                  className={`py-2 px-4 rounded-xl text-xs font-bold font-mono transition flex items-center space-x-2 cursor-pointer border ${
                    aulaTab === "test"
                      ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow-md shadow-emerald-500/10"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <HelpCircle className="h-4 w-4 text-emerald-400" />
                  <span>📝 Test de Autoevaluación (5 Preguntas)</span>
                  {quizSubmitted && (
                    <span className="bg-emerald-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full ml-1">
                      {quizScore}/5
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setAulaTab("diapositivas")}
                  className={`py-2 px-4 rounded-xl text-xs font-bold font-mono transition flex items-center space-x-2 cursor-pointer border ${
                    aulaTab === "diapositivas"
                      ? "bg-purple-500/20 border-purple-500/60 text-purple-300 shadow-md shadow-purple-500/10"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <BookOpen className="h-4 w-4 text-purple-400" />
                  <span>📖 Presentación Guiada ({AULA_TOPICS_DATA[selectedAulaTopic].slides.length})</span>
                </button>
              </div>

              {/* Contenido según la pestaña seleccionada */}
              <div className="p-6 md:p-8 overflow-y-auto flex-1 text-left">
                {/* 1. PESTAÑA VIDEO DE FORMACIÓN */}
                {aulaTab === "video" && (() => {
                  const vConfig = selectedAulaTopic === "kit"
                    ? {
                        videoUrl: "https://res.cloudinary.com/rtzau8g7/video/upload/v1786499719/El_Kit_de_72_Horas_gu2k7m.mp4",
                        poster: emergencyKitHero,
                        badge: "Videolección Oficial • Módulo 04: Kit de Emergencias",
                        title: "El Kit de 72 Horas & Mochila Táctica de Supervivencia",
                        duration: "06:00 min"
                      }
                    : selectedAulaTopic === "incendios"
                    ? {
                        videoUrl: "https://res.cloudinary.com/rtzau8g7/video/upload/v1786501027/Plano_de_Supervivencia_w7cx73.mp4",
                        poster: firePreventionHero,
                        badge: "Videolección Oficial • Módulo 02: Incendios",
                        title: "Plano de Supervivencia & Prevención de Incendios Estructurales",
                        duration: "03:40 min"
                      }
                    : selectedAulaTopic === "inundaciones"
                    ? {
                        videoUrl: "https://res.cloudinary.com/rtzau8g7/video/upload/v1786498008/Preparaci%C3%B3n_ante_Sismos_n26b0x.mp4",
                        poster: earthStructure,
                        badge: "Videolección Oficial • Módulo 03: Inundaciones",
                        title: "Mitigación por Inundaciones y Crecidas Repentinas",
                        duration: "05:10 min"
                      }
                    : {
                        videoUrl: "https://res.cloudinary.com/rtzau8g7/video/upload/v1786498008/Preparaci%C3%B3n_ante_Sismos_n26b0x.mp4",
                        poster: earthquakeHero,
                        badge: "Videolección Oficial • Módulo 01: Terremotos",
                        title: "Preparación y Autoprotección ante Eventos Sísmicos",
                        duration: "04:15 min"
                      };

                  return (
                    <div className="space-y-6">
                      {/* Reproductor de Video HD */}
                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-cyan-500/40 shadow-2xl">
                        <video 
                          key={vConfig.videoUrl}
                          src={vConfig.videoUrl} 
                          controls 
                          playsInline 
                          poster={vConfig.poster}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Metadatos del Video e Invitación al Test */}
                      <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                              {vConfig.badge}
                            </span>
                            <h4 className="font-display font-black text-lg text-white uppercase pt-1">
                              {vConfig.title}
                            </h4>
                            <p className="text-xs text-slate-400 font-medium">
                              Producción Oficial GRDesastres • Duración: {vConfig.duration} • Formato HD 1080p
                            </p>
                          </div>
                          <button 
                            onClick={() => {
                              setAulaTab("test");
                              if (quizQuestions.length === 0) {
                                setQuizQuestions(getRandomQuizQuestions(selectedAulaTopic || "terremotos", 5));
                              }
                            }}
                          >
                            <HelpCircle className="h-4 w-4" />
                            <span>Ir al Test de Evaluación (5 Preguntas) →</span>
                          </button>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          Visualiza el contenido audiovisual completo para repasar los protocolos internacionales de gestión de riesgos, autoprotección y respuesta en emergencias.
                        </p>

                        {/* Tarjeta Destacada de Invitación al Test */}
                        <div className="bg-cyan-950/40 border border-cyan-500/40 p-4 rounded-xl flex items-start space-x-3.5 shadow-lg">
                          <Sparkles className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                          <div className="space-y-2">
                            <span className="text-xs font-extrabold text-cyan-300 uppercase tracking-wider block">
                              🎬 ¿Terminaste de ver la videolección?
                            </span>
                            <p className="text-xs text-cyan-100/90 leading-relaxed">
                              Te invitamos a poner a prueba lo aprendido respondiendo nuestro <strong>Test Básico de 5 preguntas aleatorias</strong>. Obtén al menos 3 aciertos de 5 para aprobar la evaluación del módulo.
                            </p>
                            <button 
                              onClick={() => {
                                setAulaTab("test");
                                if (quizQuestions.length === 0) {
                                  setQuizQuestions(getRandomQuizQuestions(selectedAulaTopic || "terremotos", 5));
                                }
                              }}
                              className="inline-flex items-center space-x-2 text-xs font-extrabold text-cyan-400 hover:text-cyan-200 underline uppercase tracking-wider cursor-pointer pt-1"
                            >
                              <span>Responder Test de Evaluación Ahora</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* 2. PESTAÑA TEST DE AUTOEVALUACIÓN (5 PREGUNTAS ALEATORIAS) */}
                {aulaTab === "test" && (
                  <div className="space-y-6">
                    {!quizSubmitted ? (
                      /* Formulario del Test */
                      <div className="space-y-6">
                        <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div>
                              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                                {selectedAulaTopic === "incendios" ? "Evaluación de Conocimientos • Módulo 02" :
                                 selectedAulaTopic === "inundaciones" ? "Evaluación de Conocimientos • Módulo 03" :
                                 selectedAulaTopic === "kit" ? "Evaluación de Conocimientos • Módulo 04" :
                                 "Evaluación de Conocimientos • Módulo 01"}
                              </span>
                              <h4 className="font-display font-black text-base text-white uppercase">
                                {selectedAulaTopic === "incendios" ? "Test Básico de Prevención de Incendios" :
                                 selectedAulaTopic === "inundaciones" ? "Test Básico de Mitigación por Inundaciones" :
                                 selectedAulaTopic === "kit" ? "Test Básico de Mochila de 72h y Kit de Emergencia" :
                                 "Test Básico de Autoprotección Sísmica"}
                              </h4>
                            </div>
                            <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                              Respondidas: {Object.keys(userAnswers).length} de 5
                            </span>
                          </div>

                          <p className="text-xs text-slate-300">
                            Responde las siguientes 5 preguntas aleatorias basadas en la lección y los conceptos clave del módulo.
                          </p>

                          {/* Lista de 5 Preguntas */}
                          <div className="space-y-6 pt-2">
                            {quizQuestions.map((q, qIdx) => (
                              <div key={q.id || qIdx} className="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-3 shadow-md">
                                <div className="flex items-start space-x-2.5">
                                  <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold px-2.5 py-1 rounded shrink-0">
                                    Pregunta {qIdx + 1} de 5
                                  </span>
                                  <h5 className="text-xs sm:text-sm font-bold text-white leading-snug">
                                    {q.question}
                                  </h5>
                                </div>

                                <div className="grid grid-cols-1 gap-2.5 pt-1">
                                  {q.options.map((opt, optIdx) => {
                                    const isSelected = userAnswers[qIdx] === optIdx;
                                    return (
                                      <button
                                        key={optIdx}
                                        onClick={() => {
                                          setUserAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
                                        }}
                                        className={`w-full text-left p-3.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between border cursor-pointer ${
                                          isSelected 
                                            ? "bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold shadow-md shadow-cyan-500/10"
                                            : "bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                                        }`}
                                      >
                                        <span className="pr-2">{String.fromCharCode(65 + optIdx)}) {opt}</span>
                                        {isSelected && <Check className="h-4 w-4 text-cyan-400 shrink-0" />}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Botón Enviar */}
                          <div className="pt-4 flex justify-end">
                            <button
                              disabled={Object.keys(userAnswers).length < 5}
                              onClick={handleSubmitQuiz}
                              className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 disabled:opacity-40 disabled:hover:from-cyan-500 text-slate-950 font-black text-xs uppercase px-6 py-3.5 rounded-xl transition shadow-lg shadow-cyan-500/20 flex items-center space-x-2 cursor-pointer font-mono"
                            >
                              <Send className="h-4 w-4" />
                              <span>Finalizar y Evaluar Respuestas ({Object.keys(userAnswers).length}/5)</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Pantalla de Resultados */
                      <div className="space-y-6">
                        {(() => {
                          const isPassed = quizScore >= 3;
                          return (
                            <div className="space-y-6">
                              {/* Banner de Resultado */}
                              <div className={`p-6 rounded-2xl border ${
                                isPassed 
                                  ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                                  : "bg-amber-950/40 border-amber-500/50 text-amber-200"
                              } shadow-2xl space-y-4`}>
                                <div className="flex items-center space-x-3.5">
                                  {isPassed ? (
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                                      <Award className="h-7 w-7" />
                                    </div>
                                  ) : (
                                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                                      <HelpCircle className="h-7 w-7" />
                                    </div>
                                  )}
                                  <div>
                                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest block">
                                      {isPassed ? "¡EVALUACIÓN APROBADA!" : "EVALUACIÓN INCOMPLETA"}
                                    </span>
                                    <h4 className="font-display font-black text-2xl text-white">
                                      Obtuviste {quizScore} de 5 aciertos ({Math.round((quizScore/5)*100)}%)
                                    </h4>
                                  </div>
                                </div>

                                <p className="text-xs leading-relaxed">
                                  {isPassed 
                                    ? "🎉 ¡Felicidades! Demostraste un dominio práctico de las medidas fundamentales de autoprotección, zonas de resguardo seguro y protocolos de evacuación ante terremotos."
                                    : "⚠️ Has acertado menos de 3 preguntas. Te sugerimos volver a revisar la videolección e intentarlo nuevamente con una nueva combinación de preguntas."
                                  }
                                </p>

                                <div className="pt-2 flex flex-wrap gap-3">
                                  <button
                                    onClick={handleRestartQuiz}
                                    className="bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-bold text-xs uppercase px-5 py-3 rounded-xl transition flex items-center space-x-2 cursor-pointer font-mono"
                                  >
                                    <RotateCcw className="h-4 w-4" />
                                    <span>Intentar con 5 NUEVAS Preguntas Aleatorias</span>
                                  </button>

                                  <button
                                    onClick={() => setAulaTab("video")}
                                    className="bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold text-xs uppercase px-5 py-3 rounded-xl transition flex items-center space-x-2 cursor-pointer font-mono"
                                  >
                                    <Video className="h-4 w-4" />
                                    <span>Volver al Video</span>
                                  </button>
                                </div>
                              </div>

                              {/* Desglose Detallado de Respuestas */}
                              <div className="bg-slate-950/80 border border-slate-800 p-5 sm:p-6 rounded-2xl space-y-4">
                                <h5 className="font-display font-extrabold text-sm text-white uppercase border-b border-slate-800 pb-2">
                                  Desglose Detallado de Respuestas ({quizScore}/5 Aciertos)
                                </h5>

                                {quizQuestions.map((q, qIdx) => {
                                  const uAns = userAnswers[qIdx];
                                  const isCorrect = uAns === q.correctAnswer;
                                  return (
                                    <div 
                                      key={q.id || qIdx} 
                                      className={`p-4 rounded-xl border space-y-2 ${
                                        isCorrect 
                                          ? "bg-emerald-950/20 border-emerald-500/30" 
                                          : "bg-rose-950/20 border-rose-500/30"
                                      }`}
                                    >
                                      <div className="flex items-start justify-between">
                                        <span className="text-xs font-bold text-white">
                                          {qIdx + 1}. {q.question}
                                        </span>
                                        {isCorrect ? (
                                          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 shrink-0 ml-2">
                                            Correcto ✓
                                          </span>
                                        ) : (
                                          <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30 shrink-0 ml-2">
                                            Incorrecto ✕
                                          </span>
                                        )}
                                      </div>

                                      <div className="text-xs space-y-1 pl-3 border-l-2 border-slate-700">
                                        <p className={isCorrect ? "text-emerald-300 font-medium" : "text-rose-300 font-medium"}>
                                          Tu respuesta: {uAns !== undefined ? q.options[uAns] : "Sin responder"}
                                        </p>
                                        {!isCorrect && (
                                          <p className="text-emerald-400 font-bold">
                                            Respuesta correcta: {q.options[q.correctAnswer]}
                                          </p>
                                        )}
                                        <p className="text-slate-400 text-[11px] pt-1">
                                          💡 <span className="font-bold">Explicación:</span> {q.explanation}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. PESTAÑA PRESENTACIÓN GUIADA (DIAPOSITIVAS) */}
                {aulaTab === "diapositivas" && (
                  <div className="space-y-6">
                    {/* Stepper de Diapositivas */}
                    <div className="bg-slate-950/40 p-2 rounded-xl border border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto">
                      {AULA_TOPICS_DATA[selectedAulaTopic].slides.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setAulaSlideIdx(idx)}
                          className={`flex-1 min-w-[100px] py-1.5 px-3 rounded-lg text-[10px] font-bold font-mono transition text-center cursor-pointer border ${
                            aulaSlideIdx === idx
                              ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                              : "bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          Diapositiva {idx + 1}
                        </button>
                      ))}
                    </div>

                    {/* Contenido de la Diapositiva */}
                    {(() => {
                      const currentSlide = AULA_TOPICS_DATA[selectedAulaTopic].slides[aulaSlideIdx];
                      return (
                        <div className="space-y-6">
                          <div className="space-y-2 border-b border-slate-800/80 pb-4">
                            <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded uppercase">
                              {currentSlide.badge}
                            </span>
                            <h4 className="font-display font-black text-xl md:text-2xl text-white uppercase pt-1">
                              {currentSlide.title}
                            </h4>
                            <p className="text-xs text-slate-400 font-medium">{currentSlide.subtitle}</p>
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            {currentSlide.points.map((pt, i) => (
                              <div key={i} className="bg-slate-950/60 border border-slate-850 p-4 rounded-2xl space-y-1 hover:border-slate-800 transition">
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                                  <h5 className="text-xs font-bold text-white uppercase">{pt.title}</h5>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed pl-4">{pt.desc}</p>
                              </div>
                            ))}
                          </div>

                          {currentSlide.tip && (
                            <div className="bg-cyan-950/30 border border-cyan-500/30 p-4 rounded-2xl flex items-start space-x-3">
                              <Sparkles className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                              <div>
                                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">Recomendación Experta</span>
                                <p className="text-xs text-cyan-100 font-medium mt-0.5">{currentSlide.tip}</p>
                              </div>
                            </div>
                          )}

                          {/* Controles de Diapositiva */}
                          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                            <button
                              disabled={aulaSlideIdx === 0}
                              onClick={() => setAulaSlideIdx((prev) => Math.max(0, prev - 1))}
                              className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-xl transition cursor-pointer"
                            >
                              Anterior
                            </button>

                            <span className="text-xs font-mono font-bold text-slate-400">
                              {aulaSlideIdx + 1} de {AULA_TOPICS_DATA[selectedAulaTopic].slides.length}
                            </span>

                            {aulaSlideIdx < AULA_TOPICS_DATA[selectedAulaTopic].slides.length - 1 ? (
                              <button
                                onClick={() => setAulaSlideIdx((prev) => prev + 1)}
                                className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs uppercase px-5 py-2.5 rounded-xl transition shadow-lg shadow-cyan-500/20 cursor-pointer flex items-center space-x-2"
                              >
                                <span>Siguiente</span>
                                <ArrowRight className="h-4 w-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedAulaTopic(null);
                                  setAulaSlideIdx(0);
                                }}
                                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs uppercase px-5 py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer"
                              >
                                Finalizar Presentación
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
