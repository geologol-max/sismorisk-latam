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
  Building2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import heroSeismologists from "../assets/hero_seismologists.jpg";
import earthStructure from "../assets/earth_structure.jpg";

interface LandingPageProps {
  onNavigate: (tab: "modelo" | "espectro" | "vulnerabilidad" | "fema" | "gndt" | "simulador") => void;
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
  }
];

export default function LandingPage({ onNavigate }: LandingPageProps) {
  // --- Estados para Modales Interactivos ---
  const [activeModal, setActiveModal] = useState<"aula" | "biblioteca" | "heroes" | "blogs" | null>(null);

  // --- Estado para destacar zonas en el gráfico Nuestro Planeta ---
  const [hoveredPlanetSection, setHoveredPlanetSection] = useState<string | null>(null);
  const [selectedPlanetSection, setSelectedPlanetSection] = useState<string | null>("subduccion");

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
    // Si la frecuencia está cerca del período fundamental simulado del edificio escolar (~0.8 Hz)
    const buildingNaturalFreq = 0.8;
    const diff = Math.abs(frequency - buildingNaturalFreq);
    if (diff < 0.15) {
      setResonanceStatus("RESONANCIA");
    } else if (frequency > 1.5) {
      setResonanceStatus("Crítica");
    } else {
      setResonanceStatus("Baja");
    }
  }, [frequency]);

  // Secciones geológicas de la Tierra con sus explicaciones
  const PLANET_SECTIONS: { [key: string]: { title: string; desc: string; detail: string; statusColor: string } } = {
    subduccion: {
      title: "Zona de Subducción",
      desc: "Colisión y hundimiento tectónico continuo.",
      detail: "La placa de Nazca de densidad oceánica alta se desliza por debajo de la placa Continental de Sudamérica a una velocidad promedio de 7.8 cm anuales. Esta fricción colosal bloquea las placas hasta que se libera de forma violenta, provocando los terremotos de mayor magnitud registrados en la historia de la humanidad (como Valdivia Mw 9.5).",
      statusColor: "text-red-400"
    },
    corteza: {
      title: "Corteza Terrestre",
      desc: "La delgada corteza rocosa sólida externa.",
      detail: "Representa menos del 1% del volumen de la Tierra. En zonas continentales alcanza entre 30-70 km de espesor, mientras que en fondos oceánicos apenas tiene 5-10 km. Se fractura bajo esfuerzos tectónicos de compresión y cizalla, dando origen a la red de fallas geológicas activas.",
      statusColor: "text-amber-400"
    },
    manto: {
      title: "Manto Terrestre",
      desc: "Capa rocosa semifluida caliente hiperdensa.",
      detail: "Se extiende hasta los 2,900 km de profundidad. Compuesto de rocas ricas en silicio, magnesio y hierro. En su interior se generan las corrientes de convección térmica, donde el material caliente asciende y el frío desciende. Este lento pero colosal ciclo actúa como la banda transportadora que desplaza las placas tectónicas en la superficie.",
      statusColor: "text-orange-500"
    },
    nucleo_externo: {
      title: "Núcleo Externo",
      desc: "Océano de hierro y níquel líquido turbulento.",
      detail: "Ubicado entre los 2,900 km y 5,150 km de profundidad. Las temperaturas oscilan entre 4,000°C y 5,000°C. La convección vigorosa de este metal líquido altamente conductor genera corrientes eléctricas que, combinadas con la rotación terrestre (efecto dinamo), sustentan el campo magnético global que protege al planeta de la radiación solar dañina.",
      statusColor: "text-yellow-500"
    },
    nucleo_interno: {
      title: "Núcleo Interno",
      desc: "Esfera metálica superdensa sólida.",
      detail: "La capa más profunda con un radio aproximado de 1,220 km. Aunque su temperatura supera los 5,400°C (similar a la superficie del Sol), la inmensa presión gravitatoria del planeta impide que los metales se fundan, manteniéndolos en un estado de cristal sólido rígido compuesto de hierro y níquel.",
      statusColor: "text-yellow-200"
    },
    ondas: {
      title: "Ondas Sísmicas",
      desc: "Propagación de energía elástica destructiva.",
      detail: "Ondas de cuerpo (P de compresión rápidas, S de corte destructivas transversales) viajan por el interior de la tierra reflejándose en cada capa. Al impactar la corteza se convierten en ondas superficiales (Rayleigh y Love) causando la sacudida violenta que colapsa edificaciones.",
      statusColor: "text-rose-500"
    },
    volcanes: {
      title: "Arcos Volcánicos",
      desc: "Fusión de placa hidratada bajo alta presión.",
      detail: "La placa oceánica que subduce arrastra agua y minerales hidratados. Al descender al manto superior, el calor funde el agua y reduce el punto de fusión de las rocas circundantes, creando magma de menor densidad que asciende verticalmente, alimentando cadenas volcánicas altamente explosivas a lo largo de las cordilleras (por ejemplo, el Arco Volcánico de los Andes).",
      statusColor: "text-red-500"
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans select-none overflow-x-hidden antialiased">
      
      {/* HEADER PREMIUM ESTILO MOCKUP */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 animate-pulse">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-black tracking-widest text-white font-display uppercase">GEOLOGOL</span>
              <span className="text-slate-700">|</span>
              <span className="text-xs font-semibold text-slate-400 tracking-wider font-sans uppercase hidden sm:inline">Ciencias de la Tierra y Reducción del Riesgo de Desastres</span>
            </div>
            <p className="text-[10px] text-blue-500 font-semibold tracking-widest uppercase mt-0.5">Plataforma de Simulación Sismorresistente Latam</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => onNavigate("modelo")}
            className="hidden md:flex items-center space-x-2 bg-blue-600/10 hover:bg-blue-600/25 border border-blue-500/30 text-blue-400 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow-inner"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>ACCESO DIRECTO SIMULADOR</span>
          </button>
        </div>
      </header>

      {/* COMPOSICIÓN DE CUATRO PANELES GRANDES (MOCKUP ORIGINAL) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 flex-1 w-full max-w-[1920px] mx-auto border-b border-slate-900">
        
        {/* =====================================================================
            PANEL SUPERIOR IZQUIERDO: HÉROE Y CTA (CINE, EMOCIÓN Y ACCIÓN)
            ===================================================================== */}
        <section 
          className="lg:col-span-5 relative overflow-hidden min-h-[450px] lg:min-h-[620px] flex flex-col justify-between p-8 lg:p-12"
          style={{
            backgroundImage: `url(${heroSeismologists})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          {/* Superposición Degradada Oscura */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/45 z-0"></div>

          {/* Sello de Geologol */}
          <div className="relative z-10">
            <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono text-[9px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest">
              GEOLOGOL | CIENCIAS DE LA TIERRA
            </span>
          </div>

          {/* Contenido del Hero */}
          <div className="relative z-10 space-y-4 max-w-lg mt-auto">
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white uppercase font-display leading-[0.95] drop-shadow-md">
              RESILIENCE<br />AGAINST RISK
            </h1>
            <p className="text-xs text-slate-300 font-medium leading-relaxed drop-shadow">
              Latin American Seismic Risk Modeling Platform Developed by Geologol for Continuous Improvement in Civil Engineering and DRR.
            </p>
            <div className="pt-2">
              <button 
                onClick={() => {
                  const el = document.getElementById("study-tools-panel");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-6 py-3 rounded-xl transition cursor-pointer shadow-lg shadow-blue-500/20 uppercase tracking-wider flex items-center gap-2 group"
              >
                <span>Explorar Herramientas Latam</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Indicador K9 en el pie de la imagen */}
          <div className="relative z-10 flex items-center space-x-2 mt-6 text-[9px] font-mono text-slate-400">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></div>
            <span>Monitoreo Activo & Prevención en Campo</span>
          </div>

        </section>

        {/* =====================================================================
            PANEL SUPERIOR DERECHO: CUADRÍCULA DE HERRAMIENTAS (ANÁLISIS SÍSMICO)
            ===================================================================== */}
        <section id="study-tools-panel" className="lg:col-span-7 bg-slate-950 p-6 lg:p-10 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-900">
          
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4">
              <div className="space-y-1">
                <h2 className="text-lg font-black tracking-wider text-white uppercase font-display flex items-center gap-2">
                  <Layers className="h-5 w-5 text-blue-500" />
                  LATAM RISK ANALYSIS AND STUDY TOOLS
                </h2>
                <p className="text-xs text-slate-400">Seleccione un módulo interactivo para iniciar la simulación, evaluación estructural o consultar recursos didácticos.</p>
              </div>
              <span className="hidden sm:inline bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono text-[9px] font-bold px-2.5 py-1 rounded-md uppercase">9 MÓDULOS</span>
            </div>

            {/* Cuadrícula de 9 módulos dispuestos en un grid 3x3 altamente uniforme */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              
              {/* Módulo 1: Plataforma de Modelado */}
              <div 
                onClick={() => onNavigate("modelo")}
                className="bg-slate-900/60 hover:bg-slate-900 border border-slate-850 hover:border-blue-500/50 rounded-xl p-4 transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[150px] relative overflow-hidden shadow-md"
              >
                <div className="absolute top-0 right-0 h-16 w-16 bg-blue-500/5 rounded-bl-full transform translate-x-3 -translate-y-3"></div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">1</span>
                    <Activity className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <h3 className="text-xs font-bold text-white uppercase group-hover:text-blue-400 transition-colors tracking-wide leading-tight">
                    PLATAFORMA DE RIESGO SÍSMICO LATAM
                  </h3>
                  <p className="text-[10px] text-slate-400 line-clamp-2">Espectros de aceleración y análisis dinámico MDOF por piso.</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-850/60 flex items-center justify-between">
                  <span className="text-[9px] font-bold text-blue-400 tracking-wider uppercase font-mono">SIMULACIÓN DINÁMICA</span>
                  <ChevronRight className="h-3 w-3 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Módulo 2: FUNVISIS */}
              <div 
                onClick={() => onNavigate("vulnerabilidad")}
                className="bg-slate-900/60 hover:bg-slate-900 border border-slate-850 hover:border-indigo-500/50 rounded-xl p-4 transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[150px] relative overflow-hidden shadow-md"
              >
                <div className="absolute top-0 right-0 h-16 w-16 bg-indigo-500/5 rounded-bl-full transform translate-x-3 -translate-y-3"></div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded">2</span>
                    <Building2 className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <h3 className="text-xs font-bold text-white uppercase group-hover:text-indigo-400 transition-colors tracking-wide leading-tight">
                    VULNERABILIDAD EDIFICACIONES FUNVISIS
                  </h3>
                  <p className="text-[10px] text-slate-400 line-clamp-2">Evaluación y priorización sísmica oficial según COVENIN 1756.</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-850/60 flex items-center justify-between">
                  <span className="text-[9px] font-bold text-indigo-400 tracking-wider uppercase font-mono">NORMATIVA VENEZUELA</span>
                  <ChevronRight className="h-3 w-3 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Módulo 3: FEMA */}
              <div 
                onClick={() => onNavigate("fema")}
                className="bg-slate-900/60 hover:bg-slate-900 border border-slate-850 hover:border-red-500/50 rounded-xl p-4 transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[150px] relative overflow-hidden shadow-md"
              >
                <div className="absolute top-0 right-0 h-16 w-16 bg-red-500/5 rounded-bl-full transform translate-x-3 -translate-y-3"></div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded">3</span>
                    <FileText className="h-4 w-4 text-slate-500 group-hover:text-red-400 transition-colors" />
                  </div>
                  <h3 className="text-xs font-bold text-white uppercase group-hover:text-red-400 transition-colors tracking-wide leading-tight">
                    VULNERABILIDAD EDIFICACIONES FEMA
                  </h3>
                  <p className="text-[10px] text-slate-400 line-clamp-2">Cribado visual rápido FEMA P-154 con modificadores locales.</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-850/60 flex items-center justify-between">
                  <span className="text-[9px] font-bold text-red-400 tracking-wider uppercase font-mono">U.S. STANDARD FOCUS</span>
                  <ChevronRight className="h-3 w-3 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Módulo 4: GNDT */}
              <div 
                onClick={() => onNavigate("gndt")}
                className="bg-slate-900/60 hover:bg-slate-900 border border-slate-850 hover:border-emerald-500/50 rounded-xl p-4 transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[150px] relative overflow-hidden shadow-md"
              >
                <div className="absolute top-0 right-0 h-16 w-16 bg-emerald-500/5 rounded-bl-full transform translate-x-3 -translate-y-3"></div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">4</span>
                    <Activity className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <h3 className="text-xs font-bold text-white uppercase group-hover:text-emerald-400 transition-colors tracking-wide leading-tight">
                    VULNERABILIDAD EDIFICACIONES GNDT
                  </h3>
                  <p className="text-[10px] text-slate-400 line-clamp-2">Metodología italiana de 11 parámetros críticos para mampostería.</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-850/60 flex items-center justify-between">
                  <span className="text-[9px] font-bold text-emerald-400 tracking-wider uppercase font-mono">EUROPEAN STANDARD</span>
                  <ChevronRight className="h-3 w-3 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Módulo 5: Simulador Sismológico (NUEVO) */}
              <div 
                onClick={() => onNavigate("simulador")}
                className="bg-slate-900/60 hover:bg-slate-900 border border-slate-850 hover:border-blue-500/50 rounded-xl p-4 transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[150px] relative overflow-hidden shadow-md ring-1 ring-blue-500/25"
              >
                <div className="absolute top-0 right-0 h-16 w-16 bg-blue-500/10 rounded-bl-full transform translate-x-3 -translate-y-3"></div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded">NUEVO</span>
                    <Sparkles className="h-4 w-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  </div>
                  <h3 className="text-xs font-bold text-white uppercase group-hover:text-blue-400 transition-colors tracking-wide leading-tight">
                    SIMULADOR SÍSMICO VENEZUELA
                  </h3>
                  <p className="text-[10px] text-slate-400 line-clamp-2">Simula epicentros, hipocentros y detecta fallas geológicas reales de FUNVISIS.</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-850/60 flex items-center justify-between">
                  <span className="text-[9px] font-bold text-blue-400 tracking-wider uppercase font-mono">EDUCACIÓN Y PREVENCIÓN</span>
                  <ChevronRight className="h-3 w-3 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Módulo 6: Aula de clases */}
              <div 
                onClick={() => setActiveModal("aula")}
                className="bg-slate-900/60 hover:bg-slate-900 border border-slate-850 hover:border-yellow-500/50 rounded-xl p-4 transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[150px] relative overflow-hidden shadow-md"
              >
                <div className="absolute top-0 right-0 h-16 w-16 bg-yellow-500/5 rounded-bl-full transform translate-x-3 -translate-y-3"></div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded">6</span>
                    <BookOpen className="h-4 w-4 text-slate-500 group-hover:text-yellow-400 transition-colors" />
                  </div>
                  <h3 className="text-xs font-bold text-white uppercase group-hover:text-yellow-400 transition-colors tracking-wide leading-tight">
                    AULA DE CLASES SISMOLÓGICA
                  </h3>
                  <p className="text-[10px] text-slate-400 line-clamp-2">Animaciones de ondas sísmicas, periodos de vibración y resonancia.</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-850/60 flex items-center justify-between">
                  <span className="text-[9px] font-bold text-yellow-400 tracking-wider uppercase font-mono">EDUCACIÓN INTERACTIVA</span>
                  <ChevronRight className="h-3 w-3 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Módulo 7: Material Bibliográfico */}
              <div 
                onClick={() => setActiveModal("biblioteca")}
                className="bg-slate-900/60 hover:bg-slate-900 border border-slate-850 hover:border-cyan-500/50 rounded-xl p-4 transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[150px] relative overflow-hidden shadow-md"
              >
                <div className="absolute top-0 right-0 h-16 w-16 bg-cyan-500/5 rounded-bl-full transform translate-x-3 -translate-y-3"></div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded">7</span>
                    <FileText className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <h3 className="text-xs font-bold text-white uppercase group-hover:text-cyan-400 transition-colors tracking-wide leading-tight">
                    MATERIAL BIBLIOGRÁFICO Y GUÍAS
                  </h3>
                  <p className="text-[10px] text-slate-400 line-clamp-2">Biblioteca digital de códigos sismorresistentes y manuales internacionales.</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-850/60 flex items-center justify-between">
                  <span className="text-[9px] font-bold text-cyan-400 tracking-wider uppercase font-mono">DESCARGAR RECURSOS</span>
                  <ChevronRight className="h-3 w-3 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Módulo 8: Héroes Anónimos */}
              <div 
                onClick={() => setActiveModal("heroes")}
                className="bg-slate-900/60 hover:bg-slate-900 border border-slate-850 hover:border-orange-500/50 rounded-xl p-4 transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[150px] relative overflow-hidden shadow-md"
              >
                <div className="absolute top-0 right-0 h-16 w-16 bg-orange-500/5 rounded-bl-full transform translate-x-3 -translate-y-3"></div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">8</span>
                    <Users className="h-4 w-4 text-slate-500 group-hover:text-orange-400 transition-colors" />
                  </div>
                  <h3 className="text-xs font-bold text-white uppercase group-hover:text-orange-400 transition-colors tracking-wide leading-tight">
                    HÉROES ANÓNIMOS DEL RIESGO
                  </h3>
                  <p className="text-[10px] text-slate-400 line-clamp-2">Historias de rescatistas, brigadas caninas K9 y científicos de campo.</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-850/60 flex items-center justify-between">
                  <span className="text-[9px] font-bold text-orange-400 tracking-wider uppercase font-mono">HISTORIAS DE VALOR</span>
                  <ChevronRight className="h-3 w-3 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Módulo 9: Blogs Especialistas */}
              <div 
                onClick={() => setActiveModal("blogs")}
                className="bg-slate-900/60 hover:bg-slate-900 border border-slate-850 hover:border-purple-500/50 rounded-xl p-4 transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[150px] relative overflow-hidden shadow-md"
              >
                <div className="absolute top-0 right-0 h-16 w-16 bg-purple-500/5 rounded-bl-full transform translate-x-3 -translate-y-3"></div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded">9</span>
                    <HelpCircle className="h-4 w-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <h3 className="text-xs font-bold text-white uppercase group-hover:text-purple-400 transition-colors tracking-wide leading-tight">
                    BLOGS Y ARTÍCULOS ESPECIALISTAS
                  </h3>
                  <p className="text-[10px] text-slate-400 line-clamp-2">Análisis de fallas tectónicas, ductilidad y disipadores basales.</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-850/60 flex items-center justify-between">
                  <span className="text-[9px] font-bold text-purple-400 tracking-wider uppercase font-mono">OPINIONES EXPERTAS</span>
                  <ChevronRight className="h-3 w-3 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>
          </div>

          {/* Información complementaria rápida */}
          <div className="mt-6 p-4 bg-slate-900/40 border border-slate-850/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400 shrink-0">
                <Info className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">¿Por qué unificar estas metodologías?</p>
                <p className="text-[10px] text-slate-400">Latinoamérica abarca fallas geológicas altamente heterogéneas, requiriendo cribados locales adaptados.</p>
              </div>
            </div>
            <button 
              onClick={() => onNavigate("modelo")}
              className="w-full sm:w-auto text-center bg-slate-800 hover:bg-slate-750 text-white font-bold text-[10px] tracking-widest uppercase px-4 py-2.5 rounded-xl border border-slate-700 hover:border-slate-600 transition cursor-pointer"
            >
              Comenzar Evaluación
            </button>
          </div>

        </section>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-slate-900/50 flex-1 w-full max-w-[1920px] mx-auto">
        
        {/* =====================================================================
            PANEL INFERIOR IZQUIERDO: CUADRÍCULA DE HERRAMIENTAS 2 (DUPLICADO FUNCIONAL DE CONTROL)
            ===================================================================== */}
        <section className="bg-slate-950 p-8 lg:p-12 flex flex-col justify-between border-t lg:border-t-0 border-slate-900">
          
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4">
              <div className="space-y-1">
                <h2 className="text-lg font-black tracking-widest text-white uppercase font-display flex items-center gap-2">
                  <Compass className="h-5 w-5 text-indigo-400" />
                  HERRAMIENTAS COMPLEMENTARIAS RRD LATAM
                </h2>
                <p className="text-xs text-slate-400">Panel de acceso complementario para acelerar el diagnóstico y la reducción del riesgo de desastres.</p>
              </div>
              <span className="hidden sm:inline bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">ACCESO COMPLEMENTARIO</span>
            </div>

            {/* Cuadrícula de herramientas complementaria tal como la imagen del usuario pide */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="bg-slate-900/40 border border-slate-850 hover:border-slate-750 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-blue-400 tracking-wider uppercase font-mono">Módulo Técnico 1 - 4</p>
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">HERRAMIENTAS DE INGENIERÍA</h3>
                    <p className="text-[10px] text-slate-400 mt-1">Efectúa simulaciones de espectros de respuesta elástica de aceleraciones y calcula el desplazamiento lateral relativo por piso (drift) de edificaciones bajo sismos reales.</p>
                  </div>
                  <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400 shrink-0">
                    <Activity className="h-5 w-5" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-850/50">
                  <button onClick={() => onNavigate("modelo")} className="text-[10px] font-bold bg-slate-900 hover:bg-slate-850 text-white py-2 px-3 rounded-lg border border-slate-800 transition cursor-pointer text-left flex items-center justify-between">
                    <span>MDOF</span> <ChevronRight className="h-3 w-3 text-blue-400" />
                  </button>
                  <button onClick={() => onNavigate("vulnerabilidad")} className="text-[10px] font-bold bg-slate-900 hover:bg-slate-850 text-white py-2 px-3 rounded-lg border border-slate-800 transition cursor-pointer text-left flex items-center justify-between">
                    <span>FUNVISIS</span> <ChevronRight className="h-3 w-3 text-indigo-400" />
                  </button>
                  <button onClick={() => onNavigate("fema")} className="text-[10px] font-bold bg-slate-900 hover:bg-slate-850 text-white py-2 px-3 rounded-lg border border-slate-800 transition cursor-pointer text-left flex items-center justify-between">
                    <span>FEMA</span> <ChevronRight className="h-3 w-3 text-red-400" />
                  </button>
                  <button onClick={() => onNavigate("gndt")} className="text-[10px] font-bold bg-slate-900 hover:bg-slate-850 text-white py-2 px-3 rounded-lg border border-slate-800 transition cursor-pointer text-left flex items-center justify-between">
                    <span>GNDT</span> <ChevronRight className="h-3 w-3 text-emerald-400" />
                  </button>
                </div>
              </div>

              <div className="bg-slate-900/40 border border-slate-850 hover:border-slate-750 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-yellow-400 tracking-wider uppercase font-mono">Módulo Educativo 5 - 8</p>
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">BIBLIOTECA & FORMACIÓN</h3>
                    <p className="text-[10px] text-slate-400 mt-1">Biblioteca digital unificada con códigos sismorresistentes, manuales de autoprotección frente a sismos, historias de búsqueda canina K9 y blogs expertos.</p>
                  </div>
                  <div className="p-2 bg-yellow-500/10 rounded-xl text-yellow-400 shrink-0">
                    <BookOpen className="h-5 w-5" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-850/50">
                  <button onClick={() => setActiveModal("aula")} className="text-[10px] font-bold bg-slate-900 hover:bg-slate-850 text-white py-2 px-3 rounded-lg border border-slate-800 transition cursor-pointer text-left flex items-center justify-between">
                    <span>Aula Virtual</span> <ChevronRight className="h-3 w-3 text-yellow-400" />
                  </button>
                  <button onClick={() => setActiveModal("biblioteca")} className="text-[10px] font-bold bg-slate-900 hover:bg-slate-850 text-white py-2 px-3 rounded-lg border border-slate-800 transition cursor-pointer text-left flex items-center justify-between">
                    <span>Biblioteca</span> <ChevronRight className="h-3 w-3 text-cyan-400" />
                  </button>
                  <button onClick={() => setActiveModal("heroes")} className="text-[10px] font-bold bg-slate-900 hover:bg-slate-850 text-white py-2 px-3 rounded-lg border border-slate-800 transition cursor-pointer text-left flex items-center justify-between">
                    <span>Héroes RRD</span> <ChevronRight className="h-3 w-3 text-orange-400" />
                  </button>
                  <button onClick={() => setActiveModal("blogs")} className="text-[10px] font-bold bg-slate-900 hover:bg-slate-850 text-white py-2 px-3 rounded-lg border border-slate-800 transition cursor-pointer text-left flex items-center justify-between">
                    <span>Blogs</span> <ChevronRight className="h-3 w-3 text-purple-400" />
                  </button>
                </div>
              </div>

            </div>

            {/* Panel de Acreditación / Metas */}
            <div className="bg-gradient-to-r from-blue-950/40 to-slate-900/60 border border-blue-900/25 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4">
              <div className="h-12 w-12 bg-blue-500/10 rounded-xl border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Award className="h-6 w-6 animate-pulse" />
              </div>
              <div className="space-y-0.5 flex-1 text-center sm:text-left">
                <p className="text-xs font-bold text-white">Mejora Continua y Reducción del Riesgo</p>
                <p className="text-[10px] text-slate-300">Cada simulación contribuye a crear una conciencia sismorresistente informada en comunidades de Latinoamérica.</p>
              </div>
            </div>

          </div>

          <div className="mt-8 text-center sm:text-left text-[10px] text-slate-500">
            * Las metodologías descritas son herramientas educativas y de estimación primaria sismorresistente.
          </div>

        </section>

        {/* =====================================================================
            PANEL INFERIOR DERECHO: NUESTRO PLANETA (CIENCIAS DE LA TIERRA CON MOVIMIENTO)
            ===================================================================== */}
          <section id="nuestro-planeta-panel" className="bg-slate-950 p-8 lg:p-12 flex flex-col justify-between border-t border-slate-900 lg:border-l relative overflow-hidden">
          
          <div className="space-y-6 relative z-10">
            <div className="border-b border-slate-900 pb-4">
              <span className="text-[10px] font-bold text-blue-400 tracking-wider uppercase font-mono">Sección Interactiva Geodinámica</span>
              <h2 className="text-xl font-black tracking-widest text-white uppercase font-display mt-1 leading-tight">
                NUESTRO PLANETA: CIENCIAS DE LA TIERRA Y DINÁMICA GEOLÓGICA
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Comprendiendo Nuestro Planeta para Mitigar el Riesgo Global, y Potenciar la RRD en LATAM.
              </p>
            </div>

            {/* CONTENEDOR DE LA SIMULACIÓN VISUAL DEL PLANETA (REPRESENTA EL VIDEO CON MOVIMIENTO ACTIVO Y PARÁMETROS) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Lado izquierdo de la simulación del planeta: Explicación interactiva */}
              <div className="md:col-span-4 space-y-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase font-mono">ESTRUCTURA Y PARÁMETROS</p>
                  
                  <div className="flex flex-col space-y-1.5">
                    {Object.keys(PLANET_SECTIONS).map((key) => {
                      const item = PLANET_SECTIONS[key];
                      const isSelected = selectedPlanetSection === key;
                      const isHovered = hoveredPlanetSection === key;
                      return (
                        <button
                          key={key}
                          onMouseEnter={() => setHoveredPlanetSection(key)}
                          onMouseLeave={() => setHoveredPlanetSection(null)}
                          onClick={() => setSelectedPlanetSection(key)}
                          className={`w-full text-left px-3 py-2 rounded-xl border text-xs transition duration-200 cursor-pointer flex items-center justify-between ${
                            isSelected 
                              ? 'bg-blue-600/10 border-blue-500/50 text-white' 
                              : isHovered 
                                ? 'bg-slate-900 border-slate-800 text-slate-200' 
                                : 'bg-slate-900/40 border-slate-900/60 text-slate-400'
                          }`}
                        >
                          <span className="font-medium">{item.title}</span>
                          <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-blue-400' : 'bg-slate-600'} transition-colors`}></span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Lado derecho: El gráfico interactivo animado de la Tierra */}
              <div className="md:col-span-8 flex flex-col items-center justify-center relative min-h-[360px] bg-slate-950/80 rounded-2xl border border-slate-900 overflow-hidden p-0 group">
                
                {/* La ilustración científica de fondo */}
                <img 
                  src={earthStructure} 
                  alt="Estructura de la Tierra" 
                  className="w-full h-auto max-h-[380px] object-cover opacity-75 group-hover:opacity-90 transition-opacity duration-500"
                />
                
                {/* Sutil degradado lateral */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/20 pointer-events-none"></div>

                {/* Hotspots interactivos overlay con coordenadas relativas y brillo animado */}
                
                {/* Corteza */}
                <div 
                  onMouseEnter={() => setHoveredPlanetSection("corteza")}
                  onMouseLeave={() => setHoveredPlanetSection(null)}
                  onClick={() => setSelectedPlanetSection("corteza")}
                  style={{ top: "15%", left: "50%" }}
                  className={`absolute w-4 h-4 rounded-full cursor-pointer flex items-center justify-center border border-white/70 transition-all duration-300 ${
                    selectedPlanetSection === "corteza" || hoveredPlanetSection === "corteza" ? "bg-amber-400 scale-125 shadow-lg shadow-amber-400/80" : "bg-amber-500/50 hover:bg-amber-400"
                  }`}
                  title="Corteza Terrestre"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                </div>

                {/* Manto */}
                <div 
                  onMouseEnter={() => setHoveredPlanetSection("manto")}
                  onMouseLeave={() => setHoveredPlanetSection(null)}
                  onClick={() => setSelectedPlanetSection("manto")}
                  style={{ top: "35%", left: "48%" }}
                  className={`absolute w-4 h-4 rounded-full cursor-pointer flex items-center justify-center border border-white/70 transition-all duration-300 ${
                    selectedPlanetSection === "manto" || hoveredPlanetSection === "manto" ? "bg-orange-500 scale-125 shadow-lg shadow-orange-500/80" : "bg-orange-500/50 hover:bg-orange-500"
                  }`}
                  title="Manto Terrestre"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                </div>

                {/* Núcleo Externo */}
                <div 
                  onMouseEnter={() => setHoveredPlanetSection("nucleo_externo")}
                  onMouseLeave={() => setHoveredPlanetSection(null)}
                  onClick={() => setSelectedPlanetSection("nucleo_externo")}
                  style={{ top: "54%", left: "48%" }}
                  className={`absolute w-4 h-4 rounded-full cursor-pointer flex items-center justify-center border border-white/70 transition-all duration-300 ${
                    selectedPlanetSection === "nucleo_externo" || hoveredPlanetSection === "nucleo_externo" ? "bg-yellow-500 scale-125 shadow-lg shadow-yellow-500/80" : "bg-yellow-500/50 hover:bg-yellow-500"
                  }`}
                  title="Núcleo Externo"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                </div>

                {/* Núcleo Interno */}
                <div 
                  onMouseEnter={() => setHoveredPlanetSection("nucleo_interno")}
                  onMouseLeave={() => setHoveredPlanetSection(null)}
                  onClick={() => setSelectedPlanetSection("nucleo_interno")}
                  style={{ top: "72%", left: "48%" }}
                  className={`absolute w-4 h-4 rounded-full cursor-pointer flex items-center justify-center border border-white/70 transition-all duration-300 ${
                    selectedPlanetSection === "nucleo_interno" || hoveredPlanetSection === "nucleo_interno" ? "bg-white scale-125 shadow-lg shadow-white" : "bg-white/50 hover:bg-white"
                  }`}
                  title="Núcleo Interno"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                </div>

                {/* Subducción */}
                <div 
                  onMouseEnter={() => setHoveredPlanetSection("subduccion")}
                  onMouseLeave={() => setHoveredPlanetSection(null)}
                  onClick={() => setSelectedPlanetSection("subduccion")}
                  style={{ top: "25%", left: "75%" }}
                  className={`absolute w-4 h-4 rounded-full cursor-pointer flex items-center justify-center border border-white/70 transition-all duration-300 ${
                    selectedPlanetSection === "subduccion" || hoveredPlanetSection === "subduccion" ? "bg-cyan-400 scale-125 shadow-lg shadow-cyan-400/80" : "bg-cyan-500/50 hover:bg-cyan-400"
                  }`}
                  title="Zona de Subducción"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                </div>

                {/* Volcanes */}
                <div 
                  onMouseEnter={() => setHoveredPlanetSection("volcanes")}
                  onMouseLeave={() => setHoveredPlanetSection(null)}
                  onClick={() => setSelectedPlanetSection("volcanes")}
                  style={{ top: "18%", left: "84%" }}
                  className={`absolute w-4 h-4 rounded-full cursor-pointer flex items-center justify-center border border-white/70 transition-all duration-300 ${
                    selectedPlanetSection === "volcanes" || hoveredPlanetSection === "volcanes" ? "bg-red-500 scale-125 shadow-lg shadow-red-500/80" : "bg-red-500/50 hover:bg-red-500"
                  }`}
                  title="Arco Volcánico"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                </div>

                {/* Ondas Sísmicas */}
                <div 
                  onMouseEnter={() => setHoveredPlanetSection("ondas")}
                  onMouseLeave={() => setHoveredPlanetSection(null)}
                  onClick={() => setSelectedPlanetSection("ondas")}
                  style={{ top: "32%", left: "68%" }}
                  className={`absolute w-4 h-4 rounded-full cursor-pointer flex items-center justify-center border border-white/70 transition-all duration-300 ${
                    selectedPlanetSection === "ondas" || hoveredPlanetSection === "ondas" ? "bg-rose-500 scale-125 shadow-lg shadow-rose-500/80" : "bg-rose-500/50 hover:bg-rose-500"
                  }`}
                  title="Ondas Sísmicas / Foco"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                </div>

                {/* Sello de Simulación en vivo */}
                <div className="absolute bottom-3 right-3 flex items-center space-x-1.5 bg-slate-950/90 border border-slate-900 px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-400 font-mono shadow-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>MODELO CIENTÍFICO INTERACTIVO</span>
                </div>

              </div>

            </div>

            {/* CUADRO EXPLICATIVO DE LA SECCIÓN SELECCIONADA */}
            <AnimatePresence mode="wait">
              {selectedPlanetSection && (
                <motion.div 
                  key={selectedPlanetSection}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="bg-slate-900/50 border border-slate-850 p-5 rounded-2xl space-y-2 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-white uppercase tracking-wider">
                      {PLANET_SECTIONS[selectedPlanetSection].title}
                    </h4>
                    <span className={`text-[10px] font-mono font-bold tracking-widest uppercase ${PLANET_SECTIONS[selectedPlanetSection].statusColor}`}>
                      {PLANET_SECTIONS[selectedPlanetSection].desc}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {PLANET_SECTIONS[selectedPlanetSection].detail}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          <div className="mt-8 pt-4 border-t border-slate-900 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-4">
            <div className="flex items-center space-x-4">
              <span className="font-mono text-[10px] text-blue-500">PLACA CARIBE</span>
              <span className="text-slate-800">•</span>
              <span className="font-mono text-[10px] text-indigo-400">PLACA COCOS</span>
              <span className="text-slate-800">•</span>
              <span className="font-mono text-[10px] text-emerald-400">PLACA SUDAMERICANA</span>
            </div>
            <div className="flex items-center space-x-1 font-semibold text-slate-300">
              <Compass className="h-3.5 w-3.5 text-blue-500" />
              <span>Modelo Geológico Integrado RRD</span>
            </div>
          </div>

        </section>

      </div>

      {/* PIE DE PÁGINA PREMIUM (DERECHOS DE AUTOR Y ENLACES DEL MOCKUP) */}
      <footer className="border-t border-slate-900 bg-slate-950 px-8 py-6 text-slate-500 text-xs mt-auto">
        <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-slate-400 font-medium">
              © 2026 Geologol | Plataforma de Modelado de Riesgo Sísmico Latam
            </p>
            <p className="text-[11px] text-slate-500">
              Desarrollada por Geologol para la Mejora Continua en la Ingeniería Civil y la Reducción del Riesgo de Desastres (RRD).
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <button onClick={() => {
              const el = document.getElementById("study-tools-panel");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }} className="hover:text-blue-500 transition cursor-pointer">Contenidos</button>
            <span className="text-slate-800">|</span>
            <button onClick={() => {
              const el = document.getElementById("nuestro-planeta-panel");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }} className="hover:text-blue-500 transition cursor-pointer">Geodinámica</button>
            <span className="text-slate-800">|</span>
            <button onClick={() => setActiveModal("biblioteca")} className="hover:text-blue-500 transition cursor-pointer">Unete & Recursos</button>
          </div>
        </div>
      </footer>


      {/* =========================================================================
          MODALES INTERACTIVOS DE LOS MÓDULOS DE FORMACIÓN Y RECURSOS (5 - 8)
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
                  <div className="md:col-span-5 space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-yellow-500 tracking-wider uppercase font-mono">Tipo de Onda Sísmica</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button 
                          onClick={() => setWaveType("P")}
                          className={`px-3 py-2 text-[10px] font-bold rounded-xl border transition cursor-pointer uppercase ${
                            waveType === "P" ? "bg-yellow-500/10 border-yellow-500 text-yellow-400" : "bg-slate-900 border-slate-800 text-slate-400"
                          }`}
                        >
                          Ondas P (Primarias)
                        </button>
                        <button 
                          onClick={() => setWaveType("S")}
                          className={`px-3 py-2 text-[10px] font-bold rounded-xl border transition cursor-pointer uppercase ${
                            waveType === "S" ? "bg-yellow-500/10 border-yellow-500 text-yellow-400" : "bg-slate-900 border-slate-800 text-slate-400"
                          }`}
                        >
                          Ondas S (Corte)
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
                      <p className="text-[9px] text-slate-500">Ajusta los ciclos por segundo. El edificio escolar resuena a ~0.8 Hz.</p>
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
                  <div className="md:col-span-7 flex flex-col items-center justify-center bg-slate-900/40 border border-slate-850 p-4 rounded-2xl relative min-h-[260px] overflow-hidden">
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
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Info className="h-4 w-4 text-yellow-500" />
                    Concepto Físico Clave: Resonancia Estructural
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Cada edificación tiene un <strong>período natural de vibración</strong> (determinado por su altura, rigidez y masa). Si las ondas del terremoto empujan el edificio con esa misma frecuencia, se produce el fenómeno de la <strong>resonancia</strong>. En este estado, los desplazamientos se amplifican exponencialmente en cada ciclo, sometiendo a las vigas y columnas a fuerzas críticas que pueden provocar el colapso repentino si la estructura carece de la ductilidad o amortiguamiento adecuado.
                  </p>
                  <p className="text-xs text-slate-300">
                    Nuestra plataforma permite modelar estos efectos dinámicos complejos para edificios de hasta 15 pisos bajo la normativa sismorresistente local de diferentes países de Latinoamérica.
                  </p>
                </div>

              </div>

              {/* Pie del Modal */}
              <div className="bg-slate-950 p-4 border-t border-slate-800 flex justify-between items-center">
                <p className="text-[10px] text-slate-500">Módulo de Formación Continua Geologol v1.0 • Todos los derechos reservados</p>
                <button 
                  onClick={() => {
                    setActiveModal(null);
                    onNavigate("modelo");
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
              <div className="p-6 bg-slate-950 border-b border-slate-850 flex flex-col sm:flex-row gap-4">
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
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
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
                          className="bg-slate-950/60 border border-slate-850 hover:border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all"
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
                            <span>DESCARGAR RECURSOS</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Pie */}
              <div className="bg-slate-950 p-4 border-t border-slate-800 text-center">
                <p className="text-[10px] text-slate-500">El repositorio digital de Geologol promueve el acceso libre y universal a material educativo de RRD en Latinoamérica.</p>
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
                <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl flex flex-col md:flex-row gap-6 relative overflow-hidden items-center">
                  
                  {/* Avatar Representativo de Color Estructurado */}
                  <div className={`h-24 w-24 rounded-2xl ${HEROES_DB[activeHeroIdx].avatarBg} flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-black/40 shrink-0 select-none uppercase tracking-wider animate-pulse`}>
                    {HEROES_DB[activeHeroIdx].name.split(" ").map(w => w[0]).join("").substring(0,2)}
                  </div>

                  <div className="space-y-3 flex-1 text-center md:text-left">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-widest">{HEROES_DB[activeHeroIdx].group}</p>
                      <h4 className="text-lg font-black text-white uppercase">{HEROES_DB[activeHeroIdx].name}</h4>
                      <p className="text-xs text-slate-400 font-medium italic">{HEROES_DB[activeHeroIdx].role}</p>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {HEROES_DB[activeHeroIdx].story}
                    </p>

                    <div className="bg-slate-900 border border-slate-850 p-3 rounded-xl flex items-center gap-3">
                      <Award className="h-5 w-5 text-yellow-500 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Logro de Servicio Destacado</p>
                        <p className="text-xs text-white font-medium mt-0.5">{HEROES_DB[activeHeroIdx].achievement}</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Selectores del Carrusel */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                      className="space-y-4 max-w-2xl mx-auto"
                    >
                      <div className="space-y-1 pb-3 border-b border-slate-850">
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

                      <div className="pt-4 border-t border-slate-850 text-center">
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
                      className="space-y-4"
                    >
                      {BLOGS_DB.map((post) => (
                        <div 
                          key={post.id}
                          onClick={() => setSelectedBlogPost(post)}
                          className="bg-slate-950/60 hover:bg-slate-950 border border-slate-850 hover:border-slate-800 p-5 rounded-2xl transition cursor-pointer flex flex-col justify-between space-y-3"
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
                          
                          <div className="pt-2 border-t border-slate-850/40 flex items-center justify-between text-[10px] font-bold text-purple-400 tracking-wider uppercase font-mono">
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

      </AnimatePresence>

    </div>
  );
}
