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
  Settings
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

export default function LandingPage({ onNavigate }: LandingPageProps) {
  // --- Estados para Modales Interactivos ---
  const [activeModal, setActiveModal] = useState<"aula" | "biblioteca" | "heroes" | "blogs" | null>(null);

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
      <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center font-black text-slate-950 tracking-wider">
              JO
            </div>
            <span className="font-display font-extrabold text-sm tracking-wider uppercase bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Jairo Ovallos
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <a href="#fundador" className="hover:text-cyan-400 transition-colors">El Fundador</a>
            <a href="#sobre-mi" className="hover:text-cyan-400 transition-colors">Sobre Mí</a>
            <a href="#educacion" className="hover:text-cyan-400 transition-colors">Educación</a>
            <a href="#experiencia" className="hover:text-cyan-400 transition-colors">Experiencia</a>
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
          SECCIÓN HERO (CABECERA)
          ========================================================================= */}
      <header className="relative w-full pt-32 pb-24 px-6 md:px-12 flex flex-col items-center justify-center text-center min-h-[85vh] overflow-hidden">
        {/* Imagen de fondo de colapso sísmico a lo ancho de la página */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img 
            src={earthquakeHero} 
            alt="Colapso Sísmico" 
            className="w-full h-full object-cover opacity-100"
          />
          {/* Degradado sutil solo en bordes superior e inferior para integrar la foto */}
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundImage: 'linear-gradient(to top, rgba(2,6,23,1) 0%, rgba(2,6,23,0.25) 15%, rgba(2,6,23,0.15) 50%, rgba(2,6,23,0.25) 85%, rgba(2,6,23,0.85) 100%)'
            }}
          />
        </div>

        {/* Luces y efectos de fondo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl -z-10 pointer-events-none" />

        {/* Textos Informativos */}
        <div className="relative z-10 space-y-6 flex flex-col items-center max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-slate-900/90 border border-slate-855 px-3.5 py-1.5 rounded-full text-[10px] font-bold text-cyan-400 tracking-wider uppercase backdrop-blur-sm">
            <Sparkles className="h-3 w-3" />
            <span>Ingeniero con experiencia en la gestión integral de riesgos socionaturales y tecnológicos</span>
          </div>

          <div className="space-y-2 bg-slate-950/60 backdrop-blur-sm px-6 py-5 rounded-2xl border border-slate-800/50 shadow-2xl shadow-black/40">
            <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white leading-none drop-shadow-lg">
              Jairo Alonso <br />
              <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-500 bg-clip-text text-transparent">
                Ovallos Cañas
              </span>
            </h1>
            <p className="font-display text-lg md:text-xl font-bold text-slate-100 drop-shadow-sm">
              Ingeniero Civil Construcción e Ingeniero en Geociencias
            </p>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-xl text-center drop-shadow pt-2">
              Comprometido, responsable, entusiasta y creativo. Cuento con una sólida experiencia en la 
              <strong className="text-white"> Gestión y Administración de Contratos</strong> en minería y obras civiles, combinada con 
              habilidades de programación aplicadas al <strong className="text-white">Análisis de Datos con Python</strong> y la 
              visualización interactiva de información técnica.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a 
              href="#portafolio" 
              className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs uppercase px-6 py-3 rounded-xl transition shadow-lg shadow-cyan-500/20 cursor-pointer flex items-center space-x-2"
            >
              <span>Abrir Plataforma Sísmica</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            <a 
              href="#experiencia" 
              className="bg-slate-900/90 hover:bg-slate-855 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs uppercase px-6 py-3 rounded-xl transition cursor-pointer backdrop-blur-sm"
            >
              Ver Experiencia Laboral
            </a>
          </div>
        </div>
      </header>

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
                    <span className="text-[10px] sm:text-xs font-semibold text-slate-200">Gestión de Emergencias ISO 22320</span>
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

              {/* Bloque 3: Sinergia con la Gran Minería */}
              <div className="space-y-4">
                <h3 className="font-display font-bold text-xl md:text-2xl text-white border-l-4 border-yellow-500 pl-4 uppercase">
                  Sinergia con la Gran Minería y Estándares de Clase Mundial
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  En Chile, he trasladado este riguroso entrenamiento en respuesta rápida, gestión documental y mitigación de amenazas al sector industrial de mayor exigencia: la gran minería y la infraestructura. Desempeñándome como Administrador de Contratos y Jefe de Operaciones en faenas de alta complejidad (como SQM y Compañía Minera Los Pelambres), he liderado:
                </p>
                <ul className="text-xs sm:text-sm text-slate-400 space-y-2 list-disc list-inside">
                  <li>El diseño e implementación de protocolos de seguridad y planes de contingencia para brigadas de emergencia industriales.</li>
                  <li>La gestión de riesgos y la continuidad operacional aplicando normativas internacionales críticas de seguridad y emergencias (<strong className="text-white">ISO 22320</strong> para gestión de emergencias, <strong className="text-white">ISO 39001</strong> para seguridad vial e <strong className="text-white">ISO 9001</strong> para control de calidad).</li>
                  <li>La optimización de procesos mediante el análisis de datos avanzados (<strong className="text-white">Data Science en Python</strong>) y el control estricto de KPIs operacionales.</li>
                </ul>
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
          SECCIÓN SOBRE MÍ (APTITUDES Y CAPACIDADES)
          ========================================================================= */}
      <section id="sobre-mi" className="py-24 px-6 border-t border-slate-900 bg-slate-900/10">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="font-display font-black text-3xl md:text-4xl text-white uppercase tracking-wider">
              Aptitudes y Capacidades
            </h2>
            <div className="h-1.5 w-16 bg-gradient-to-r from-cyan-500 to-emerald-500 mx-auto rounded-full" />
            <p className="text-xs sm:text-sm text-slate-400">
              Mi perfil combina de manera única los fundamentos técnicos de la ingeniería con sólidas habilidades de gestión comercial, análisis de datos avanzado y control de sistemas normativos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            
            {/* Aptitud 1 */}
            <div className="bg-slate-900/60 border border-slate-850 hover:border-slate-800 p-6 rounded-2xl space-y-4 transition-all hover:translate-y-[-4px] text-left">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">
                Gestión de Contratos
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Especialista en la administración contractual en proyectos mineros, desarrollo e interpretación de KPIs y niveles de servicio (SLAs), negociación y resolución de conflictos operacionales.
              </p>
            </div>

            {/* Aptitud 2 */}
            <div className="bg-slate-900/60 border border-slate-850 hover:border-slate-800 p-6 rounded-2xl space-y-4 transition-all hover:translate-y-[-4px] text-left">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">
                Análisis de Datos
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Programación para ciencia de datos con Python (Pandas, NumPy, Matplotlib) y visualización ejecutiva en herramientas de BI como Tableau, Google Looker Studio y PowerBI.
              </p>
            </div>

            {/* Aptitud 3 */}
            <div className="bg-slate-900/60 border border-slate-850 hover:border-slate-800 p-6 rounded-2xl space-y-4 transition-all hover:translate-y-[-4px] text-left">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">
                Sistemas de Gestión
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Conocimiento práctico e implementación de Sistemas de Gestión Integrados bajo normas internacionales ISO 9001 (Calidad), ISO 39001 (Seguridad Vial) e ISO 22320 (Gestión de Emergencias).
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECCIÓN EDUCACIÓN (DATOS ACADÉMICOS)
          ========================================================================= */}
      <section id="educacion" className="py-24 px-6 border-t border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="font-display font-black text-3xl md:text-4xl text-white uppercase tracking-wider">
              Datos Académicos
            </h2>
            <div className="h-1.5 w-16 bg-gradient-to-r from-cyan-500 to-emerald-500 mx-auto rounded-full" />
            <p className="text-xs sm:text-sm text-slate-400">
              Trayectoria de formación académica superior en ingeniería y diplomados de especialización.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6 pt-4 text-left">
            
            {/* Timeline Item 1 */}
            <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl flex justify-between items-start gap-4 hover:border-slate-800 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400 shrink-0 mt-0.5">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase">
                    Diplomado en Administración de Contratos para la Minería
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Especialización en Gestión Legal y Comercial Minera, Chile
                  </p>
                </div>
              </div>
              <span className="font-mono text-[10px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                2025
              </span>
            </div>

            {/* Timeline Item 2 */}
            <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl flex justify-between items-start gap-4 hover:border-slate-800 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400 shrink-0 mt-0.5">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase">
                    Diplomado en Data Science and Data Analytics
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Programación para ciencia de datos y visualización con Python
                  </p>
                </div>
              </div>
              <span className="font-mono text-[10px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                2025
              </span>
            </div>

            {/* Timeline Item 3 */}
            <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl flex justify-between items-start gap-4 hover:border-slate-800 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 shrink-0 mt-0.5">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase">
                    Ingeniero en Geociencias
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Estudio de materiales terrestres, tectónica y geofísica aplicada
                  </p>
                </div>
              </div>
              <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                2014
              </span>
            </div>

            {/* Timeline Item 4 */}
            <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl flex justify-between items-start gap-4 hover:border-slate-800 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 shrink-0 mt-0.5">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase">
                    Ingeniero Civil Construcción
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Cálculo estructural, procesos constructivos y materiales
                  </p>
                </div>
              </div>
              <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                2011
              </span>
            </div>

            {/* Timeline Item 5 */}
            <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl flex justify-between items-start gap-4 hover:border-slate-800 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 shrink-0 mt-0.5">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase">
                    Técnico Superior Universitario en Geología y Minas
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Mapeo geológico, prospección mineral y muestreo de suelos
                  </p>
                </div>
              </div>
              <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                2004
              </span>
            </div>

            <div className="p-4 bg-slate-900/30 border border-slate-850/60 rounded-xl text-center">
              <p className="text-xs text-slate-500">
                ⚠️ Mi educación superior fue desarrollada en Venezuela y mis títulos se encuentran debidamente apostillados.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECCIÓN EXPERIENCIA LABORAL
          ========================================================================= */}
      <section id="experiencia" className="py-24 px-6 border-t border-slate-900 bg-slate-900/10">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="font-display font-black text-3xl md:text-4xl text-white uppercase tracking-wider">
              Experiencia Laboral en Chile
            </h2>
            <div className="h-1.5 w-16 bg-gradient-to-r from-cyan-500 to-emerald-500 mx-auto rounded-full" />
            <p className="text-xs sm:text-sm text-slate-400">
              Desempeño profesional destacado en empresas colaboradoras de minería, pesaje industrial y servicios logísticos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            
            {/* Empleo 1 */}
            <div className="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group">
              <div className="relative h-48 w-full overflow-hidden shrink-0">
                <img 
                  src={jairoNera} 
                  alt="Nera Chile Spa" 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <span className="absolute bottom-3 left-4 text-[9px] font-mono font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-850 px-2 py-0.5 rounded uppercase">
                  Logística y Contratos
                </span>
              </div>
              
              <div className="p-5 flex-1 space-y-3 text-left">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white uppercase leading-tight">Nera Chile Spa</h4>
                  <p className="text-[10px] font-semibold text-slate-500">2025 - Actualmente</p>
                </div>
                <ul className="text-[11px] text-slate-400 space-y-2 list-disc list-inside">
                  <li><strong>Analista de Contratos</strong> (Agosto - Act.)</li>
                  <li><strong>Operador Central de Despacho</strong> (Abril - Agosto 2025)</li>
                  <li>Elaboración y monitoreo de métricas de servicio (KPIs y SLAs).</li>
                </ul>
              </div>
            </div>

            {/* Empleo 2 */}
            <div className="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group">
              <div className="relative h-48 w-full overflow-hidden shrink-0">
                <img 
                  src={jairoMolinstec} 
                  alt="Molinstec" 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <span className="absolute bottom-3 left-4 text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-850 px-2 py-0.5 rounded uppercase">
                  Ventas Técnicas
                </span>
              </div>
              
              <div className="p-5 flex-1 space-y-3 text-left">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white uppercase leading-tight">Molinstec Spa</h4>
                  <p className="text-[10px] font-semibold text-slate-500">Junio 2024 - Marzo 2025</p>
                </div>
                <ul className="text-[11px] text-slate-400 space-y-2 list-disc list-inside">
                  <li><strong>Ingeniero de Ventas</strong></li>
                  <li>Asesoramiento técnico en sistemas de pesaje, balanzas industriales e ingeniería de medición de flujo.</li>
                  <li>Desarrollo de propuestas comerciales complejas.</li>
                </ul>
              </div>
            </div>

            {/* Empleo 3 */}
            <div className="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group">
              <div className="relative h-48 w-full overflow-hidden shrink-0">
                <img 
                  src={jairoSnow} 
                  alt="Explor-K Safety" 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <span className="absolute bottom-3 left-4 text-[9px] font-mono font-bold text-yellow-400 bg-yellow-950/80 border border-yellow-850 px-2 py-0.5 rounded uppercase">
                  Operaciones Mineras
                </span>
              </div>
              
              <div className="p-5 flex-1 space-y-3 text-left">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white uppercase leading-tight">Explor-K Safety & Driving</h4>
                  <p className="text-[10px] font-semibold text-slate-500">Diciembre 2020 - Diciembre 2023</p>
                </div>
                <ul className="text-[11px] text-slate-400 space-y-2 list-disc list-inside">
                  <li><strong>Administrador de Contrato SQM</strong> (Ago 2022 - Dic 2023)</li>
                  <li><strong>Jefe de Operación</strong> (Feb 2022 - Dic 2023)</li>
                  <li>Liderazgo en terreno, control de personal, seguridad vial en faena y cumplimiento de planes preventivos.</li>
                </ul>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECCIÓN PORTAFOLIO: PLATAFORMA SÍSMICA Y TRABAJOS
          ========================================================================= */}
      <section id="portafolio" className="relative py-24 px-6 border-t border-slate-900 overflow-hidden">
        {/* Imagen de fondo para toda la sección de portafolio */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={collapsedBuilding}
            alt="Fondo sección portafolio"
            className="w-full h-full object-cover opacity-100"
          />
          {/* Overlay sutil solo en bordes — mismo estilo que la sección Hero */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(2,6,23,1) 0%, rgba(2,6,23,0.25) 15%, rgba(2,6,23,0.15) 50%, rgba(2,6,23,0.25) 85%, rgba(2,6,23,0.90) 100%)' }}
          />
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

          </div>

          {/* 2. OTROS TRABAJOS ANTERIORES Y EXPERIENCIA HUMANITARIA */}
          <div className="space-y-6 text-left">
            <h3 className="font-display font-black text-lg text-white uppercase tracking-wider text-center md:text-left">
              Trabajos Anteriores y Misiones Humanitarias
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Proyecto 1: Minera Los Pelambres */}
              <div className="bg-slate-900 border border-slate-855 rounded-2xl overflow-hidden flex flex-col justify-between group">
                <div className="h-36 w-full relative overflow-hidden shrink-0">
                  <img src={jairoPelambres} alt="Los Pelambres" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent" />
                </div>
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white uppercase">Minera Los Pelambres (Servicios)</h4>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Liderazgo en terreno desempeñándome desde Brigadista de Emergencia y Encargado de Logística hasta Jefe de Operaciones para una empresa colaboradora de servicios industriales.
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase mt-2">Jefe de Operaciones</span>
                </div>
              </div>

              {/* Proyecto 2: Terremoto Nepal 2015 */}
              <div className="bg-slate-900 border border-slate-855 rounded-2xl overflow-hidden flex flex-col justify-between group">
                <div className="h-36 w-full relative overflow-hidden shrink-0">
                  <img src={jairoNepal} alt="Nepal 2015" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent" />
                </div>
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white uppercase">Misión Humanitaria Nepal</h4>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Miembro activo de la misión civil de apoyo humanitario y rescate de sobrevivientes tras el catastrófico terremoto de Katmandú en 2015.
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-cyan-400 uppercase font-semibold mt-2">Nepal (2015)</span>
                </div>
              </div>

              {/* Proyecto 3: Terremoto Ecuador 2016 */}
              <div className="bg-slate-900 border border-slate-855 rounded-2xl overflow-hidden flex flex-col justify-between group">
                <div className="h-36 w-full relative overflow-hidden shrink-0">
                  <img src={jairoEcuador} alt="Ecuador 2016" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent" />
                </div>
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white uppercase">Misión Humanitaria Ecuador</h4>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Operaciones de búsqueda y rescate en estructuras colapsadas (USAR) tras el sismo de magnitud 7.8 en Manabí, apoyando los centros ECU 911.
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-cyan-400 uppercase font-semibold mt-2">Ecuador (2016)</span>
                </div>
              </div>

              {/* Proyecto 4: Analista Asiameric */}
              <div className="bg-slate-900 border border-slate-855 rounded-2xl overflow-hidden flex flex-col justify-between group">
                <div className="h-36 w-full relative overflow-hidden shrink-0">
                  <img src={jairoData} alt="Asiameric" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent" />
                </div>
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white uppercase">Analista de Operaciones Logísticas</h4>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Control operativo y seguimiento de despachos de comercio exterior de importación y exportación para la compañía logística Asiameric en Santiago.
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase mt-2">Asiameric Chile</span>
                </div>
              </div>

              {/* Proyecto 5: Profesor Universitario */}
              <div className="bg-slate-900 border border-slate-855 rounded-2xl overflow-hidden flex flex-col justify-between group">
                <div className="h-36 w-full relative overflow-hidden shrink-0">
                  <img src={jairoClass} alt="Clases UNET" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent" />
                </div>
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white uppercase">Docencia Universitaria</h4>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Profesor, monitor y facilitador de asignaturas técnicas en ciencias de la tierra y emergencias en la UNET, Santiago Mariño y la UNES.
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase mt-2">Docencia Superior</span>
                </div>
              </div>

              {/* Proyecto 6: PC Táchira */}
              <div className="bg-slate-900 border border-slate-855 rounded-2xl overflow-hidden flex flex-col justify-between group">
                <div className="h-36 w-full relative overflow-hidden shrink-0">
                  <img src={jairoPc} alt="PC Tachira" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent" />
                </div>
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white uppercase">Operaciones Protección Civil Táchira</h4>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      12 años dedicados al servicio público en Táchira en labores de prevención sísmica, planificación ante emergencias y comando de incidentes civiles.
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase mt-2">Gestión de Emergencias</span>
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
          PIE DE PÁGINA (FOOTER)
          ========================================================================= */}
      <footer className="bg-slate-950 py-8 px-6 border-t border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 text-center">
          <p>© Jairo Ovallos 2026. Todos los derechos reservados.</p>
          <div className="flex items-center space-x-2">
            <span>Desarrollado con React + TS + Tailwind v4 + Motion</span>
            <span>•</span>
            <span className="text-slate-400">geologol</span>
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

      </AnimatePresence>

    </div>
  );
}
