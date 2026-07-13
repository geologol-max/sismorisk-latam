import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Activity,
  Building2,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Play,
  Square,
  RotateCcw,
  FileText,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Globe,
  MapPin,
  Info,
  Sliders,
  Flame,
  Download,
  BookOpen,
  HelpCircle,
  Compass,
  ClipboardList,
  CheckSquare,
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  countryNorms,
  structuralTypologies,
  analyzeMDOFBuilding,
  BuildingSeismicResults,
  TypologyType,
  getSpectralAcceleration
} from "./lib/seismic";
// Carga diferida de componentes grandes — reduce el bundle inicial de 616kB a ~150kB
const VulnerabilidadVenezuela = React.lazy(() => import("./components/VulnerabilidadVenezuela"));
const FemaP154 = React.lazy(() => import("./components/FemaP154"));
const GndtVulnerability = React.lazy(() => import("./components/GndtVulnerability"));
const LandingPage = React.lazy(() => import("./components/LandingPage"));
const SimuladorSismos = React.lazy(() => import("./components/SimuladorSismos"));

// Componente de carga — fallback para Suspense mientras se descarga el chunk
const ModuleLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    <p className="text-sm font-medium text-slate-500">Cargando módulo...</p>
  </div>
);

// Proyectos iniciales precargados
interface SavedProject {
  id: string;
  name: string;
  countryCode: string;
  zoneCode: string;
  soilCode: string;
  numFloors: number;
  interstoryHeight: number;
  typologyId: TypologyType;
  earthquakeMw: number;
  earthquakeDepth: number;
  epicentralDistance: number;
  earthquakeDuration?: number;
}

const DEFAULT_PROJECTS: SavedProject[] = [
  {
    id: "proj-1",
    name: "Evaluación de Riesgo - Escuela Local",
    countryCode: "PE",
    zoneCode: "Z4",
    soilCode: "S2",
    numFloors: 8,
    interstoryHeight: 3.0,
    typologyId: "frame",
    earthquakeMw: 8.0,
    earthquakeDepth: 35,
    epicentralDistance: 50,
    earthquakeDuration: 30,
  },
  {
    id: "proj-2",
    name: "Edificio de Oficinas - El Golf (Santiago)",
    countryCode: "CL",
    zoneCode: "Z3",
    soilCode: "B",
    numFloors: 10,
    interstoryHeight: 3.2,
    typologyId: "shearWall",
    earthquakeMw: 8.8,
    earthquakeDepth: 25,
    epicentralDistance: 70,
    earthquakeDuration: 60,
  },
  {
    id: "proj-3",
    name: "Viviendas Autoconstruidas - Comuna Siloé",
    countryCode: "CO",
    zoneCode: "Alta",
    soilCode: "D",
    numFloors: 3,
    interstoryHeight: 2.8,
    typologyId: "adobe",
    earthquakeMw: 7.2,
    earthquakeDepth: 15,
    epicentralDistance: 15,
    earthquakeDuration: 25,
  }
];

export default function App() {
  // --- Estados de Gestión de Proyectos ---
  const [projects, setProjects] = useState<SavedProject[]>(() => {
    const saved = localStorage.getItem("sismorisk_projects");
    return saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
  });
  const [selectedProjectId, setSelectedProjectId] = useState<string>("proj-1");
  const [newProjectName, setNewProjectName] = useState("");

  // --- Parámetros de Simulación Actual ---
  const [projectName, setProjectName] = useState("Evaluación de Riesgo - Escuela Local");
  const [countryCode, setCountryCode] = useState("PE");
  const [zoneCode, setZoneCode] = useState("Z4");
  const [soilCode, setSoilCode] = useState("S2");
  const [numFloors, setNumFloors] = useState(8);
  const [interstoryHeight, setInterstoryHeight] = useState(3.0);
  const [typologyId, setTypologyId] = useState<TypologyType>("frame");
  
  // Parámetros de sismo
  const [earthquakeMw, setEarthquakeMw] = useState(8.0);
  const [earthquakeDepth, setEarthquakeDepth] = useState(35);
  const [epicentralDistance, setEpicentralDistance] = useState(50);
  const [earthquakeDuration, setEarthquakeDuration] = useState(30);

  // --- Estados de Acordeón de Configuración ---
  const [activeAccordion, setActiveAccordion] = useState<number>(1);

  // --- Estados de Visualización ---
  const [activeTab, setActiveTab] = useState<"inicio" | "modelo" | "espectro" | "vulnerabilidad" | "fema" | "gndt" | "simulador">("inicio");
  const [activeGuideTab, setActiveGuideTab] = useState<"funcionamiento" | "real">("funcionamiento");
  const [animating, setAnimating] = useState(false);
  const [animTime, setAnimTime] = useState(0);

  // --- Reporte Técnico de IA (Gemini) ---
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportResult, setReportResult] = useState<string | null>(null);
  const [reportError, setReportError] = useState<string | null>(null);

  // --- Toasts de UI ---
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- Descargo de Responsabilidad ---
  const [disclaimerAccepted, setDisclaimerAccepted] = useState<boolean>(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      return localStorage.getItem("seismic_disclaimer_accepted") === "true";
    }
    return false;
  });

  const handleAcceptDisclaimer = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("seismic_disclaimer_accepted", "true");
    }
    setDisclaimerAccepted(true);
  };

  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Obtener norma del país actual
  const currentNorm = countryNorms[countryCode] || countryNorms["PE"];

  // Sincronizar parámetros cuando se selecciona un proyecto guardado
  useEffect(() => {
    const proj = projects.find(p => p.id === selectedProjectId);
    if (proj) {
      setProjectName(proj.name);
      setCountryCode(proj.countryCode);
      setZoneCode(proj.zoneCode);
      setSoilCode(proj.soilCode);
      setNumFloors(proj.numFloors);
      setInterstoryHeight(proj.interstoryHeight);
      setTypologyId(proj.typologyId);
      setEarthquakeMw(proj.earthquakeMw);
      setEarthquakeDepth(proj.earthquakeDepth);
      setEpicentralDistance(proj.epicentralDistance);
      setEarthquakeDuration(proj.earthquakeDuration || 30);
      setReportResult(null); // Reset report on project load
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjectId]);

  // Guardar proyectos en LocalStorage al modificarlos
  useEffect(() => {
    localStorage.setItem("sismorisk_projects", JSON.stringify(projects));
  }, [projects]);

  // Guardar cambios del proyecto actual en caliente
  const saveCurrentProjectState = () => {
    setProjects(prev => {
      const currentProj = prev.find(p => p.id === selectedProjectId);
      if (
        currentProj &&
        currentProj.name === projectName &&
        currentProj.countryCode === countryCode &&
        currentProj.zoneCode === zoneCode &&
        currentProj.soilCode === soilCode &&
        currentProj.numFloors === numFloors &&
        currentProj.interstoryHeight === interstoryHeight &&
        currentProj.typologyId === typologyId &&
        currentProj.earthquakeMw === earthquakeMw &&
        currentProj.earthquakeDepth === earthquakeDepth &&
        currentProj.epicentralDistance === epicentralDistance &&
        currentProj.earthquakeDuration === earthquakeDuration
      ) {
        return prev; // Sin cambios, mantener la misma referencia para evitar bucles infinitos
      }
      return prev.map(p =>
        p.id === selectedProjectId
          ? {
              ...p,
              name: projectName,
              countryCode,
              zoneCode,
              soilCode,
              numFloors,
              interstoryHeight,
              typologyId,
              earthquakeMw,
              earthquakeDepth,
              epicentralDistance,
              earthquakeDuration
            }
          : p
      );
    });
  };

  // Guardar en caliente cada vez que cambien variables básicas
  useEffect(() => {
    saveCurrentProjectState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    projectName,
    countryCode,
    zoneCode,
    soilCode,
    numFloors,
    interstoryHeight,
    typologyId,
    earthquakeMw,
    earthquakeDepth,
    epicentralDistance,
    earthquakeDuration
  ]);

  // --- Lógica del Motor de Dinámica Estructural ---
  // useMemo evita recalcular el análisis sísmico en cada re-render no relacionado
  const results: BuildingSeismicResults = useMemo(
    () =>
      analyzeMDOFBuilding(
        numFloors,
        interstoryHeight,
        typologyId,
        countryCode,
        zoneCode,
        soilCode,
        earthquakeMw,
        earthquakeDepth,
        epicentralDistance
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [numFloors, interstoryHeight, typologyId, countryCode, zoneCode, soilCode, earthquakeMw, earthquakeDepth, epicentralDistance]
  );

  // --- Animación del Sismo ---
  const animateBuilding = (timestamp: number) => {
    if (lastTimeRef.current !== 0) {
      const delta = (timestamp - lastTimeRef.current) / 1000;
      setAnimTime(prev => prev + delta);
    }
    lastTimeRef.current = timestamp;
    requestRef.current = requestAnimationFrame(animateBuilding);
  };

  useEffect(() => {
    if (animating) {
      lastTimeRef.current = 0;
      requestRef.current = requestAnimationFrame(animateBuilding);
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animating]);

  // Pausar animación del sismo cuando el tab del navegador está oculto (ahorra CPU)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && animating) {
        setAnimating(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [animating]);

  // Calcular PGA local para visualizaciones
  const pgaLocal = results.modes[0] ? results.floorResponses[0].force / (results.floorResponses[0].mass * 9.81) : 0.25;

  // --- Handlers de UI ---
  const handleCreateProject = () => {
    const name = newProjectName.trim() || `Evaluación - Nueva Estructura ${projects.length + 1}`;
    const newProj: SavedProject = {
      id: `proj-${Date.now()}`,
      name,
      countryCode: "PE",
      zoneCode: "Z4",
      soilCode: "S2",
      numFloors: 5,
      interstoryHeight: 3.0,
      typologyId: "frame",
      earthquakeMw: 7.5,
      earthquakeDepth: 40,
      epicentralDistance: 45,
      earthquakeDuration: 30
    };
    const updated = [...projects, newProj];
    setProjects(updated);
    setSelectedProjectId(newProj.id);
    setNewProjectName("");
    showToast("¡Proyecto creado con éxito!");
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (projects.length <= 1) {
      showToast("Debe mantener al menos un proyecto activo.");
      return;
    }
    const index = projects.findIndex(p => p.id === id);
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    if (selectedProjectId === id) {
      const nextActive = updated[index === 0 ? 0 : index - 1];
      setSelectedProjectId(nextActive.id);
    }
    showToast("Proyecto eliminado.");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleExportPDF = () => {
    // Generar formato imprimible de informe rápido
    window.print();
    showToast("Preparando vista de impresión técnica...");
  };

  const handleGenerateAIReport = async () => {
    setLoadingReport(true);
    setReportResult(null);
    setReportError(null);

    const typologyInfo = structuralTypologies.find(t => t.id === typologyId);

    try {
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName,
          country: currentNorm.name,
          normName: currentNorm.normName,
          zoneName: currentNorm.zones.find(z => z.code === zoneCode)?.name || zoneCode,
          soilName: currentNorm.soils.find(s => s.code === soilCode)?.name || soilCode,
          numFloors,
          interstoryHeight,
          typologyName: typologyInfo?.name || typologyId,
          earthquakeMw,
          earthquakeDepth,
          earthquakeDuration,
          pga: results.floorResponses[0].force / (results.floorResponses[0].mass * 9.81 * results.floorResponses.length) || 0.35, // PGA estimado
          fundamentalPeriod: results.fundamentalPeriod,
          maxDrift: results.maxDrift,
          maxDriftFloor: results.maxDriftFloor,
          baseShear: results.baseShear,
          overallRisk: results.overallRisk,
          habitability: results.habitability,
          driftLimit: currentNorm.driftLimit[typologyId]
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Error al invocar el servidor de IA.");
      }

      const data = await response.json();
      setReportResult(data.report);
      showToast("¡Reporte técnico de IA generado exitosamente!");
    } catch (err: any) {
      console.error(err);
      setReportError(err.message || "No se pudo conectar con el servidor de inteligencia artificial.");
    } finally {
      setLoadingReport(false);
    }
  };

  // --- Parámetros de animación física de balanceo ---
  let swayFactor = 0;
  let groundShake = 0;
  if (animating) {
    // Generar vibración sísmica realista con amortiguamiento amortiguado e impulsos
    const omega = 15; // frecuencia del suelo
    groundShake = Math.sin(animTime * omega) * 14 * Math.cos(animTime * 3.5);
    // Sway superior basado en el modo fundamental
    swayFactor = Math.sin(animTime * (2 * Math.PI / results.fundamentalPeriod)) * 1.6;
  }

  if (activeTab === "inicio") {
    return (
      <React.Suspense fallback={<ModuleLoader />}>
        <LandingPage onNavigate={(tab) => setActiveTab(tab)} />
      </React.Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans print:bg-white print:text-black">
      
      {/* HEADER DE LA APLICACIÓN */}
      <header className="bg-white border-b border-slate-200 py-3.5 px-6 flex flex-wrap items-center justify-between shadow-sm sticky top-0 z-50 print:relative print:border-b-2 print:border-black print:bg-white">
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTab("inicio")} title="Volver al Portal / Inicio">
          <div className="bg-blue-600 text-white p-2 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/10 group-hover:bg-blue-700 transition duration-200 print:border print:border-black">
            <Activity className="h-6 w-6" id="app-logo-icon" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition duration-200 print:text-black flex flex-wrap items-center gap-1.5 font-display uppercase leading-none">
              Plataforma de Modelado de Riesgo Sísmico <span className="text-blue-600 font-bold text-[10px] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 print:hidden uppercase tracking-wider">LATAM v1.0</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium print:hidden mt-0.5">
              Desarrollada por <span className="font-bold text-blue-600">Geologol</span> para la Mejora Continua en la Ingeniería Civil y RRD
            </p>
          </div>
        </div>

        {/* Gestor de Proyectos */}
        <div className="flex items-center space-x-3 mt-3 sm:mt-0 print:hidden">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1">
            <span className="text-xs font-mono text-slate-500 px-2">Proyecto:</span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-transparent text-sm font-semibold text-slate-800 border-none focus:ring-0 outline-none pr-8 py-1 cursor-pointer"
              id="project-selector"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-white text-slate-800">
                  {p.name.substring(0, 32)}{p.name.length > 32 ? "..." : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1">
            <input
              type="text"
              placeholder="Nueva evaluación..."
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-700 placeholder-slate-400 focus:outline-none px-2 py-1 w-32 focus:w-44 transition-all"
            />
            <button
              onClick={handleCreateProject}
              className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-md transition duration-200"
              title="Crear Nuevo Proyecto"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {projects.length > 1 && (
            <button
              onClick={(e) => handleDeleteProject(selectedProjectId, e)}
              className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 p-2 rounded-lg transition"
              title="Eliminar Proyecto Actual"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={handleExportPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3.5 rounded-lg flex items-center space-x-2 transition shadow-md shadow-blue-500/10"
          >
            <Download className="h-4 w-4" />
            <span>Exportar Reporte</span>
          </button>
        </div>
      </header>

      {/* Barra de Navegación Principal de la Aplicación */}
      <div className="bg-white border-b border-slate-200/80 px-6 py-2.5 flex items-center justify-between shadow-sm print:hidden">
        <div className="flex items-center space-x-2">
          <Layers className="text-blue-600 h-4 w-4" />
          <span className="text-xs font-black uppercase text-slate-800 tracking-wider font-display">Módulos de Análisis:</span>
        </div>
        <div className="flex items-center bg-slate-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("inicio")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "inicio"
                ? "bg-white text-blue-600 shadow-sm border border-slate-200/50"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>Inicio / Portal</span>
          </button>
          <button
            onClick={() => setActiveTab("modelo")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "modelo" || activeTab === "espectro"
                ? "bg-white text-blue-600 shadow-sm border border-slate-200/50"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Simulador Dinámico MDOF</span>
          </button>
          <button
            onClick={() => setActiveTab("vulnerabilidad")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "vulnerabilidad"
                ? "bg-white text-blue-600 shadow-sm border border-slate-200/50"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ClipboardList className="h-3.5 w-3.5" />
            <span>Evaluación FUNVISIS (Venezuela)</span>
          </button>
          <button
            onClick={() => setActiveTab("fema")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "fema"
                ? "bg-white text-blue-600 shadow-sm border border-slate-200/50"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Evaluación FEMA P-154 (RVS)</span>
          </button>
          <button
            onClick={() => setActiveTab("gndt")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "gndt"
                ? "bg-white text-blue-600 shadow-sm border border-slate-200/50"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Índice de Vulnerabilidad (GNDT)</span>
          </button>
          <button
            onClick={() => setActiveTab("simulador")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "simulador"
                ? "bg-white text-blue-600 shadow-sm border border-slate-200/50"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            <span>Simulador Sismológico</span>
          </button>
        </div>
      </div>

      {/* CUERPO PRINCIPAL DEL PANEL */}
      {activeTab === "simulador" ? (
        <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 lg:p-6 print:block">
          <React.Suspense fallback={<ModuleLoader />}>
            <SimuladorSismos />
          </React.Suspense>
        </main>
      ) : activeTab === "vulnerabilidad" ? (
        <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 lg:p-6 print:block">
          <React.Suspense fallback={<ModuleLoader />}>
            <VulnerabilidadVenezuela />
          </React.Suspense>
        </main>
      ) : activeTab === "fema" ? (
        <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 lg:p-6 print:block">
          <React.Suspense fallback={<ModuleLoader />}>
            <FemaP154 />
          </React.Suspense>
        </main>
      ) : activeTab === "gndt" ? (
        <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 lg:p-6 print:block">
          <React.Suspense fallback={<ModuleLoader />}>
            <GndtVulnerability />
          </React.Suspense>
        </main>
      ) : (
        <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 print:block">
        
        {/* PANEL IZQUIERDO: CONFIGURACIÓN DEL ESCENARIO */}
        <section className="lg:col-span-4 bg-slate-900 text-white border border-slate-800 rounded-2xl p-5 flex flex-col space-y-5 shadow-xl print:hidden">
          <div className="flex items-center space-x-2 border-b border-slate-800/80 pb-3">
            <Sliders className="text-blue-400 h-5 w-5" />
            <h2 className="text-md font-bold text-white tracking-wide font-display">CONFIGURACIÓN DEL ESCENARIO</h2>
          </div>

          {/* Campo editable del nombre del proyecto */}
          <div className="space-y-1">
            <label className="text-[11px] uppercase font-semibold tracking-wider text-slate-400">Título del Estudio Técnico</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>


          {/* ACORDEÓN 1: UBICACIÓN Y NORMATIVA */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-850/40">
            <button
              onClick={() => setActiveAccordion(activeAccordion === 1 ? 0 : 1)}
              className="w-full px-4 py-3 bg-slate-800/60 hover:bg-slate-800 flex items-center justify-between text-left transition cursor-pointer"
            >
              <span className="text-sm font-bold flex items-center gap-2 text-slate-200">
                <span className="text-blue-400 font-mono">1.</span> Ubicación y Norma Técnica
              </span>
              {activeAccordion === 1 ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
            </button>

            {activeAccordion === 1 && (
              <div className="p-4 space-y-4 border-t border-slate-800 animate-fadeIn">
                {/* País */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      <Globe className="h-3 w-3 text-blue-400" /> País
                    </label>
                    <select
                      value={countryCode}
                      onChange={(e) => {
                        const newCountry = e.target.value;
                        setCountryCode(newCountry);
                        const norm = countryNorms[newCountry];
                        if (norm) {
                          setZoneCode(norm.zones[0].code);
                          setSoilCode(norm.soils[0].code);
                        }
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="PE">Perú</option>
                      <option value="CL">Chile</option>
                      <option value="CO">Colombia</option>
                      <option value="VE">Venezuela</option>
                      <option value="SV">El Salvador</option>
                      <option value="EC">Ecuador</option>
                      <option value="PA">Panamá</option>
                      <option value="CU">Cuba</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      <MapPin className="h-3 w-3 text-blue-400" /> Región / Zona
                    </label>
                    <select
                      value={zoneCode}
                      onChange={(e) => setZoneCode(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      {currentNorm.zones.map(z => (
                        <option key={z.code} value={z.code}>{z.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Normativo y Tipo de Suelo */}
                <div className="space-y-3 pt-1">
                  <div className="flex justify-between items-center text-[11px] bg-slate-850 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 font-medium">Normativa Vigente:</span>
                    <span className="font-mono text-blue-400 font-bold">{currentNorm.normName}</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-medium">Tipo de Suelo (Cimentación)</label>
                    <select
                      value={soilCode}
                      onChange={(e) => setSoilCode(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      {currentNorm.soils.map(s => (
                        <option key={s.code} value={s.code}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ACORDEÓN 2: ESTRUCTURA */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-850/40">
            <button
              onClick={() => setActiveAccordion(activeAccordion === 2 ? 0 : 2)}
              className="w-full px-4 py-3 bg-slate-800/60 hover:bg-slate-800 flex items-center justify-between text-left transition cursor-pointer"
            >
              <span className="text-sm font-bold flex items-center gap-2 text-slate-200">
                <span className="text-blue-400 font-mono">2.</span> Parámetros de la Estructura
              </span>
              {activeAccordion === 2 ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
            </button>

            {activeAccordion === 2 && (
              <div className="p-4 space-y-4 border-t border-slate-800">
                {/* Altura y número de pisos */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-medium">N° de Pisos:</span>
                      <span className="font-mono text-blue-400 font-bold">{numFloors} pisos</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="12"
                      step="1"
                      value={numFloors}
                      onChange={(e) => setNumFloors(parseInt(e.target.value))}
                      className="w-full accent-blue-500 bg-slate-700 h-1 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-medium">Altura de Entrepiso:</span>
                      <span className="font-mono text-blue-400 font-bold">{interstoryHeight.toFixed(1)} m</span>
                    </div>
                    <input
                      type="range"
                      min="2.5"
                      max="4.5"
                      step="0.1"
                      value={interstoryHeight}
                      onChange={(e) => setInterstoryHeight(parseFloat(e.target.value))}
                      className="w-full accent-blue-500 bg-slate-700 h-1 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Altura total estimada:</span>
                      <span>{(numFloors * interstoryHeight).toFixed(1)} metros</span>
                    </div>
                  </div>
                </div>

                {/* Tipología Constructiva */}
                <div className="space-y-2 pt-1">
                  <label className="text-xs text-slate-400 font-medium">Sistema / Tipología Estructural</label>
                  <div className="grid grid-cols-2 gap-2">
                    {structuralTypologies.map((t) => {
                      const isSelected = t.id === typologyId;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setTypologyId(t.id)}
                          className={`p-2.5 rounded-lg border text-left transition flex flex-col space-y-1 justify-between cursor-pointer ${
                            isSelected
                              ? "bg-slate-800 border-blue-500 shadow-lg shadow-blue-500/10 text-white"
                              : "bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <div className="flex items-center space-x-1.5">
                            <div className={`p-1 rounded-md ${isSelected ? "bg-blue-500/20 text-blue-400" : "bg-slate-800 text-slate-400"}`}>
                              <Building2 className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-xs font-bold truncate leading-none">{t.name}</span>
                          </div>
                          <span className="text-[10px] leading-tight text-slate-400 truncate-3-lines mt-1">{t.description}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ACORDEÓN 3: SISMO DE DISEÑO */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-850/40">
            <button
              onClick={() => setActiveAccordion(activeAccordion === 3 ? 0 : 3)}
              className="w-full px-4 py-3 bg-slate-800/60 hover:bg-slate-800 flex items-center justify-between text-left transition cursor-pointer"
            >
              <span className="text-sm font-bold flex items-center gap-2 text-slate-200">
                <span className="text-blue-400 font-mono">3.</span> Parámetros Sísmicos (Sismo de Diseño/Real)
              </span>
              {activeAccordion === 3 ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
            </button>

            {activeAccordion === 3 && (
              <div className="p-4 space-y-4 border-t border-slate-800">
                {/* Magnitud Mw */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1 font-medium">
                      <Flame className="h-3.5 w-3.5 text-red-400" /> Magnitud (Mw):
                    </span>
                    <span className="font-mono text-red-400 font-bold">{earthquakeMw.toFixed(1)} Mw</span>
                  </div>
                  <input
                    type="range"
                    min="5.0"
                    max="9.0"
                    step="0.1"
                    value={earthquakeMw}
                    onChange={(e) => setEarthquakeMw(parseFloat(e.target.value))}
                    className="w-full accent-red-500 bg-slate-700 h-1 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>Daño moderado (Mw &lt; 6.5)</span>
                    <span className="text-red-400 font-medium">Catastrófico (Mw &ge; 8.0)</span>
                  </div>
                </div>

                {/* Profundidad Focal */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Profundidad Focal:</span>
                    <span className="font-mono text-slate-200 font-bold">{earthquakeDepth} km</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="150"
                    step="5"
                    value={earthquakeDepth}
                    onChange={(e) => setEarthquakeDepth(parseInt(e.target.value))}
                    className="w-full accent-blue-500 bg-slate-700 h-1 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Distancia Epicentral */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Distancia al Epicentro:</span>
                    <span className="font-mono text-slate-200 font-bold">{epicentralDistance} km</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    step="5"
                    value={epicentralDistance}
                    onChange={(e) => setEpicentralDistance(parseInt(e.target.value))}
                    className="w-full accent-blue-500 bg-slate-700 h-1 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Duración del Sismo */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Duración del Sismo (Fase Fuerte):</span>
                    <span className="font-mono text-slate-200 font-bold">{earthquakeDuration} s</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="120"
                    step="5"
                    value={earthquakeDuration}
                    onChange={(e) => setEarthquakeDuration(parseInt(e.target.value))}
                    className="w-full accent-blue-500 bg-slate-700 h-1 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>Sismo corto (&lt; 20s)</span>
                    <span>Moderado (20s - 45s)</span>
                    <span className="text-red-400">Larga duración (&gt; 45s)</span>
                  </div>
                </div>

                {/* Resumen del Sismo en Sitio */}
                <div className="bg-slate-850 border border-slate-800 p-3 rounded-lg space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Aceleración Base Local (PGA):</span>
                    <span className="font-mono text-red-400 font-bold">{(results.floorResponses[0].force / (results.floorResponses[0].mass * 9.81 * results.floorResponses.length)).toFixed(3)}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Duración Seleccionada:</span>
                    <span className="font-mono text-slate-300 font-semibold">{earthquakeDuration} segundos</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* DOCUMENTACIÓN RÁPIDA DE TIPOLOGÍA */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 space-y-1.5">
            <h4 className="font-bold text-slate-200 flex items-center gap-1 font-display">
              <Info className="h-3.5 w-3.5 text-blue-400" /> Parámetros Sismorresistentes
            </h4>
            <p className="leading-relaxed text-[11px] text-slate-400">
              El periodo fundamental de vibración del suelo interfiere con el periodo del edificio. Si coinciden, ocurre <b>resonancia sísmica</b> amplificando enormemente los desplazamientos de piso.
            </p>
          </div>
        </section>

        {/* PANEL CENTRAL: VISUALIZACIÓN DINÁMICA */}
        <section className="lg:col-span-5 flex flex-col space-y-6 print:block print:w-full">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm print:border-none print:bg-white print:text-black">
            
            {/* TABS DE VISUALIZACIÓN */}
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between print:hidden">
              <span className="text-[11px] uppercase font-semibold tracking-wider text-slate-500 font-display">Modelación Dinámica</span>
              <div className="flex space-x-1.5">
                <button
                  onClick={() => setActiveTab("modelo")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    activeTab === "modelo" ? "bg-white text-slate-900 border border-slate-200 shadow-sm font-bold" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Modelo Animado MDOF
                </button>
                <button
                  onClick={() => setActiveTab("espectro")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    activeTab === "espectro" ? "bg-white text-slate-900 border border-slate-200 shadow-sm font-bold" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Espectro de Respuesta
                </button>
              </div>
            </div>

            {/* CONTENIDO DE TABS */}
            <div className="p-4 flex flex-col items-center justify-center min-h-[460px] relative bg-slate-50/20">
              
              {/* TAB 1: MODELO ANIMADO DEL EDIFICIO */}
              {activeTab === "modelo" && (
                <div className="w-full flex flex-col items-center">
                  
                  {/* Vista 2.5D del Esqueleto del Edificio */}
                  <div className="w-full h-80 relative flex items-end justify-center overflow-hidden border border-slate-200 rounded-xl bg-slate-950 p-4 print:border-none print:bg-white">
                    <svg className="w-full h-full" viewBox="0 0 500 300" id="building-svg">
                      
                      {/* Fondo de cielo / Líneas de cuadrícula */}
                      <g className="opacity-10 print:hidden">
                        <line x1="0" y1="50" x2="500" y2="50" stroke="#fff" strokeWidth="1" strokeDasharray="3" />
                        <line x1="0" y1="100" x2="500" y2="100" stroke="#fff" strokeWidth="1" strokeDasharray="3" />
                        <line x1="0" y1="150" x2="500" y2="150" stroke="#fff" strokeWidth="1" strokeDasharray="3" />
                        <line x1="0" y1="200" x2="500" y2="200" stroke="#fff" strokeWidth="1" strokeDasharray="3" />
                      </g>
                      
                      {/* Ejes y cotas de altura */}
                      <g className="text-[10px] fill-slate-500 font-mono print:hidden">
                        <text x="15" y="260">Base</text>
                        {Array.from({ length: numFloors }).map((_, fIdx) => {
                          const yPos = 250 - (fIdx + 1) * (180 / numFloors);
                          return (
                            <text key={fIdx} x="15" y={yPos + 4} className="opacity-60">N-{fIdx + 1}</text>
                          );
                        })}
                      </g>

                      {/* Suelo Sismico Shaking */}
                      <g transform={`translate(${groundShake}, 0)`}>
                        <rect x="50" y="250" width="400" height="15" fill="#1e293b" className="print:fill-slate-200" />
                        <line x1="50" y1="250" x2="450" y2="250" stroke="#10b981" strokeWidth="3" />
                        {/* Grietas sismicas en el suelo si hay sismo fuerte */}
                        {animating && earthquakeMw >= 7.0 && (
                          <path d="M 120 250 L 125 258 L 118 261 L 130 265 M 340 250 L 335 256 L 342 260 L 338 264" stroke="#ef4444" strokeWidth="2" fill="none" />
                        )}
                      </g>

                      {/* Estructura del Edificio */}
                      <g>
                        {Array.from({ length: numFloors }).map((_, fIdx) => {
                          // Calcular altura de piso actual
                          const floorHeightPixels = 180 / numFloors;
                          const yBottom = 250 - fIdx * floorHeightPixels;
                          const yTop = 250 - (fIdx + 1) * floorHeightPixels;

                          // El balanceo/sway depende de la deformada modal del piso
                          const modeShapeSway = results.modes[0]?.shape[fIdx] || ((fIdx + 1) / numFloors);
                          const prevModeShapeSway = fIdx > 0 ? (results.modes[0]?.shape[fIdx - 1] || (fIdx / numFloors)) : 0;

                          // Coordenadas actuales X para columnas izquierdas y derechas
                          const curSwayXTop = groundShake + swayFactor * modeShapeSway * 18;
                          const curSwayXBottom = groundShake + swayFactor * prevModeShapeSway * 18;

                          const leftColXBottom = 160 + curSwayXBottom;
                          const leftColXTop = 160 + curSwayXTop;
                          
                          const rightColXBottom = 340 + curSwayXBottom;
                          const rightColXTop = 340 + curSwayXTop;

                          const midColXBottom = 250 + curSwayXBottom;
                          const midColXTop = 250 + curSwayXTop;

                          // Determinar color de las columnas del piso actual según el nivel de daño
                          const response = results.floorResponses[fIdx];
                          let colorStroke = "#3b82f6"; // Azul seguro
                          let colorFill = "rgba(59, 130, 246, 0.15)";
                          let animateDamageClass = "";

                          if (response.damage === "light") {
                            colorStroke = "#fbbf24"; // Amarillo
                            colorFill = "rgba(251, 191, 36, 0.2)";
                          } else if (response.damage === "moderate") {
                            colorStroke = "#f97316"; // Naranja
                            colorFill = "rgba(249, 115, 22, 0.25)";
                          } else if (response.damage === "severe") {
                            colorStroke = "#ef4444"; // Rojo
                            colorFill = "rgba(239, 68, 68, 0.3)";
                            animateDamageClass = "animate-pulse";
                          } else if (response.damage === "collapse") {
                            colorStroke = "#ef4444"; // Rojo oscuro destellante
                            colorFill = "rgba(127, 29, 29, 0.6)";
                          }

                          return (
                            <g key={fIdx}>
                              {/* Losa del piso */}
                              <polygon
                                points={`${leftColXTop - 12},${yTop} ${rightColXTop + 12},${yTop} ${rightColXTop + 10},${yTop + 6} ${leftColXTop - 10},${yTop + 6}`}
                                fill="#475569"
                                stroke="#1e293b"
                                strokeWidth="1"
                                className="print:fill-slate-300"
                              />

                              {/* Columnas del piso */}
                              {/* Columna Izquierda */}
                              <line
                                x1={leftColXBottom}
                                y1={yBottom}
                                x2={leftColXTop}
                                y2={yTop}
                                stroke={colorStroke}
                                strokeWidth={typologyId === "shearWall" ? 8 : typologyId === "frame" ? 5 : 3}
                                className={animateDamageClass}
                              />
                              
                              {/* Columna Central */}
                              <line
                                x1={midColXBottom}
                                y1={yBottom}
                                x2={midColXTop}
                                y2={yTop}
                                stroke={colorStroke}
                                strokeWidth={typologyId === "shearWall" ? 8 : typologyId === "frame" ? 5 : 3}
                                className={animateDamageClass}
                              />

                              {/* Columna Derecha */}
                              <line
                                x1={rightColXBottom}
                                y1={yBottom}
                                x2={rightColXTop}
                                y2={yTop}
                                stroke={colorStroke}
                                strokeWidth={typologyId === "shearWall" ? 8 : typologyId === "frame" ? 5 : 3}
                                className={animateDamageClass}
                              />

                              {/* Vigas transversales */}
                              <line
                                x1={leftColXTop}
                                y1={yTop}
                                x2={rightColXTop}
                                y2={yTop}
                                stroke={colorStroke}
                                strokeWidth="3"
                              />

                              {/* Cruces de diagonal/riostra (solo si es rigidez intermedia o muros de hormigón armado, dibujado como soporte) */}
                              {typologyId === "shearWall" && (
                                <g opacity="0.35">
                                  <polygon
                                    points={`${leftColXBottom + 2},${yBottom} ${midColXBottom - 2},${yBottom} ${midColXTop - 2},${yTop} ${leftColXTop + 2},${yTop}`}
                                    fill={colorFill}
                                  />
                                  <polygon
                                    points={`${midColXBottom + 2},${yBottom} ${rightColXBottom - 2},${yBottom} ${rightColXTop - 2},${yTop} ${midColXTop + 2},${yTop}`}
                                    fill={colorFill}
                                  />
                                </g>
                              )}

                              {/* Grietas de daño visual en muros/pórticos si hay daño severo */}
                              {(response.damage === "severe" || response.damage === "collapse") && (
                                <path
                                  d={`M ${(leftColXBottom + leftColXTop) / 2 - 5} ${(yBottom + yTop) / 2 - 5} L ${(leftColXBottom + leftColXTop) / 2 + 5} ${(yBottom + yTop) / 2 + 5} M ${(rightColXBottom + rightColXTop) / 2 - 5} ${(yBottom + yTop) / 2 + 5} L ${(rightColXBottom + rightColXTop) / 2 + 5} ${(yBottom + yTop) / 2 - 5}`}
                                  stroke="#f87171"
                                  strokeWidth="2.5"
                                  fill="none"
                                />
                              )}
                            </g>
                          );
                        })}
                      </g>

                      {/* Masa / Carteles indicadores de cada nivel */}
                      <g className="text-[10px] font-bold fill-white pointer-events-none print:hidden">
                        {Array.from({ length: numFloors }).map((_, fIdx) => {
                          const floorHeightPixels = 180 / numFloors;
                          const yTop = 250 - (fIdx + 1) * floorHeightPixels;
                          const modeShapeSway = results.modes[0]?.shape[fIdx] || ((fIdx + 1) / numFloors);
                          const curSwayXTop = groundShake + swayFactor * modeShapeSway * 18;
                          const rightColXTop = 340 + curSwayXTop;

                          return (
                            <text key={fIdx} x={rightColXTop + 18} y={yTop + 3} className="fill-slate-400 font-mono text-[9px]">
                              {results.floorResponses[fIdx].damage.toUpperCase()}
                            </text>
                          );
                        })}
                      </g>
                    </svg>

                    {/* Leyenda de daño rápido */}
                    <div className="absolute bottom-3 right-3 bg-slate-950/95 border border-slate-850 p-2.5 rounded-xl flex flex-col space-y-1 text-[9px] font-mono shadow-lg print:hidden">
                      <span className="text-white font-bold pb-1 border-b border-slate-800">Nivel de Daño</span>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        <span className="text-slate-300">Bajo / Ninguno</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <span className="text-slate-300">Leve (Inspeccionar)</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                        <span className="text-slate-300">Moderado / Severo</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                        <span className="text-red-400 font-bold">Colapso / Inhabitable</span>
                      </div>
                    </div>

                    {/* Sismógrafo en tiempo real en la esquina superior izquierda */}
                    <div className="absolute top-3 left-3 bg-slate-950/95 border border-slate-850 rounded-xl p-2 flex items-center space-x-2 shadow-md print:hidden">
                      <Activity className={`h-4 w-4 text-emerald-400 ${animating ? "animate-bounce" : ""}`} />
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-mono text-slate-400">PGA del Sismo</span>
                        <span className="text-xs font-mono font-bold text-white">{(results.floorResponses[0].force / (results.floorResponses[0].mass * 9.81 * results.floorResponses.length)).toFixed(3)}g</span>
                      </div>
                    </div>
                  </div>

                  {/* PANEL DE CONTROL DE SIMULACIÓN */}
                  <div className="mt-4 flex items-center space-x-3 w-full print:hidden">
                    <button
                      onClick={() => setAnimating(!animating)}
                      className={`flex-1 py-3 px-5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition cursor-pointer ${
                        animating
                          ? "bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10 font-bold"
                      }`}
                    >
                      {animating ? (
                        <>
                          <Square className="h-4 w-4" fill="currentColor" />
                          <span>Pausar Sismo</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" fill="currentColor" />
                          <span>Iniciar Simulación Sísmica</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setAnimating(false);
                        setAnimTime(0);
                      }}
                      className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 p-3 rounded-xl transition cursor-pointer"
                      title="Reiniciar deformada"
                    >
                      <RotateCcw className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  {/* Informador Educativo de Dinámica */}
                  <div className="mt-4 p-4 bg-white border border-slate-200 rounded-xl space-y-2 text-xs text-slate-600 w-full shadow-sm print:hidden">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5 font-display text-sm">
                      <Activity className="h-4 w-4 text-blue-600" /> Comportamiento Dinámico MDOF
                    </p>
                    <p className="leading-relaxed">
                      El edificio de <b>{numFloors} pisos</b> vibra con un periodo fundamental de{" "}
                      <span className="font-mono text-blue-600 font-extrabold">{results.fundamentalPeriod.toFixed(3)} s</span>.
                      {results.fundamentalPeriod > 1.2 ? (
                        <span> Es una estructura flexible y de periodo largo. Es muy susceptible a sismos de subducción profundos y amplificación de ondas en suelo blando.</span>
                      ) : (
                        <span> Es una estructura rígida de periodo corto. Las aceleraciones inerciales son muy altas, lo que pone a prueba la ductilidad de vigas y columnas.</span>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: ESPECTRO DE DISEÑO VS SISMO */}
              {activeTab === "espectro" && (
                <div className="w-full flex flex-col space-y-4">
                  <div className="text-center pb-2">
                    <h3 className="text-sm font-extrabold text-slate-800 font-display">Espectro Elástico de Aceleraciones Sa vs Periodo T</h3>
                    <p className="text-[11px] text-slate-500 font-mono">Norma {currentNorm.normName} | Suelo {soilCode}</p>
                  </div>

                  {/* Gráfico de Espectro Autogenerado en SVG */}
                  <div className="w-full h-72 border border-slate-200 rounded-xl bg-slate-950 p-4 relative shadow-sm print:bg-white print:border-none">
                    <svg className="w-full h-full" viewBox="0 0 500 240">
                      
                      {/* Ejes */}
                      <line x1="40" y1="20" x2="40" y2="210" stroke="#475569" strokeWidth="1.5" />
                      <line x1="40" y1="210" x2="480" y2="210" stroke="#475569" strokeWidth="1.5" />

                      {/* Etiquetas de Ejes */}
                      <text x="470" y="225" className="text-[10px] fill-slate-400 font-mono text-right">T (s)</text>
                      <text x="15" y="15" className="text-[10px] fill-slate-400 font-mono" transform="rotate(-90 15 15)">Acel. Sa (g)</text>

                      {/* Rejilla de Periodo T */}
                      {Array.from({ length: 7 }).map((_, i) => {
                        const tVal = i * 0.5; // 0.0s, 0.5s, 1.0s, 1.5s, 2.0s, 2.5s, 3.0s
                        const xPos = 40 + (tVal / 3.0) * 420;
                        return (
                          <g key={i}>
                            <line x1={xPos} y1="20" x2={xPos} y2="210" stroke="#334155" strokeWidth="0.5" strokeDasharray="2" />
                            <text x={xPos - 8} y="223" className="text-[9px] fill-slate-500 font-mono">{tVal.toFixed(1)}s</text>
                          </g>
                        );
                      })}

                      {/* Rejilla de Aceleración Sa */}
                      {Array.from({ length: 6 }).map((_, i) => {
                        const saVal = i * 0.2; // 0.0g a 1.0g
                        const yPos = 210 - (saVal / 1.0) * 180;
                        return (
                          <g key={i}>
                            <line x1="40" y1={yPos} x2="480" y2={yPos} stroke="#334155" strokeWidth="0.5" strokeDasharray="2" />
                            <text x="10" y={yPos + 4} className="text-[9px] fill-slate-500 font-mono">{saVal.toFixed(1)}g</text>
                          </g>
                        );
                      })}

                      {/* Curva 1: Espectro de Diseño Normativo (Verde) */}
                      {(() => {
                        const points: string[] = [];
                        for (let px = 0; px <= 100; px++) {
                          const T = (px / 100) * 3.0; // periodo de 0.0s a 3.0s
                          // Obtener aceleración de diseño
                          const sa = getSpectralAcceleration(T, countryCode, zoneCode, soilCode, 1.0); // R=1 elástico
                          const x = 40 + (T / 3.0) * 420;
                          const y = 210 - (sa / 1.0) * 180;
                          points.push(`${x},${y}`);
                        }
                        return (
                          <polyline
                            points={points.join(" ")}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="2.5"
                            className="print:stroke-green-600"
                          />
                        );
                      })()}

                      {/* Curva 2: Espectro de Respuesta del Sismo Real Escala (Rojo) */}
                      {(() => {
                        const points: string[] = [];
                        const scale = results.floorResponses[0].force / (results.floorResponses[0].mass * 9.81 * results.floorResponses.length * currentNorm.zones.find(z => z.code === zoneCode)!.value) || 1.0;
                        for (let px = 0; px <= 100; px++) {
                          const T = (px / 100) * 3.0;
                          const saDesign = getSpectralAcceleration(T, countryCode, zoneCode, soilCode, 1.0);
                          const saReal = saDesign * (earthquakeMw / 7.0) * (50 / epicentralDistance); // Relación empírica para el sismo real
                          const x = 40 + (T / 3.0) * 420;
                          const y = 210 - (Math.min(saReal, 1.2) / 1.0) * 180;
                          points.push(`${x},${y}`);
                        }
                        return (
                          <polyline
                            points={points.join(" ")}
                            fill="none"
                            stroke="#f43f5e"
                            strokeWidth="1.8"
                            strokeDasharray="4 2"
                            className="print:stroke-red-600"
                          />
                        );
                      })()}

                      {/* Marcador del Periodo Fundamental T1 de Nuestro Edificio */}
                      {(() => {
                        const T1 = results.fundamentalPeriod;
                        const saT1 = getSpectralAcceleration(T1, countryCode, zoneCode, soilCode, 1.0);
                        const x = 40 + (T1 / 3.0) * 420;
                        const y = 210 - (saT1 / 1.0) * 180;

                        if (x > 480) return null;

                        return (
                          <g>
                            {/* Línea vertical punteada indicadora */}
                            <line x1={x} y1="20" x2={x} y2="210" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3" />
                            {/* Círculo indicador intermitente */}
                            <circle cx={x} cy={y} r="6" fill="#f59e0b" className="animate-ping" />
                            <circle cx={x} cy={y} r="4" fill="#f59e0b" stroke="#fff" strokeWidth="1" />
                            {/* Bandera con texto de periodo */}
                            <rect x={x + 8} y={y - 18} width="95" height="18" rx="4" fill="#f59e0b" />
                            <text x={x + 12} y={y - 5} className="text-[9px] fill-slate-950 font-bold font-mono">T1 = {T1.toFixed(3)}s</text>
                          </g>
                        );
                      })()}
                    </svg>

                    {/* Leyenda Espectro */}
                    <div className="absolute top-4 right-4 bg-slate-950/95 border border-slate-850 p-2.5 rounded-xl flex flex-col space-y-1 text-[9px] font-mono shadow-lg print:hidden">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-3.5 h-0.5 bg-emerald-500 inline-block" />
                        <span className="text-slate-300">Espectro Diseño Elástico</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-3.5 h-0.5 bg-rose-500 border-dashed border-t inline-block" />
                        <span className="text-slate-300">SismoMw {earthquakeMw.toFixed(1)} Estimado</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-3.5 h-1.5 bg-amber-500 rounded-sm inline-block" />
                        <span className="text-slate-300">Periodo Edificio (T1)</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5 text-xs text-slate-600 shadow-sm">
                    <p className="font-bold text-slate-850 font-display flex items-center gap-1.5 text-sm">
                      <Info className="h-4 w-4 text-amber-500" /> Interpretación Física de Resonancia:
                    </p>
                    <p className="leading-relaxed">
                      Si el <b>T1</b> de la edificación está cerca del pico constante de la meseta del espectro (generalmente entre <b>0.1s y 0.8s</b> según el suelo), la amplificación de la aceleración inercial sísmica es máxima, aumentando drásticamente las fuerzas de corte y el daño estructural.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* PANEL DERECHO: RESULTADOS DE RIESGO */}
        <section className="lg:col-span-3 flex flex-col space-y-6 print:block print:w-full">
          
          {/* TARJETA DE RIESGO GLOBAL */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm print:border-none print:bg-white print:text-black">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-slate-500 font-display mb-4 print:text-black">Evaluación de Riesgo Sísmico</h3>

            <div className="grid grid-cols-2 gap-4">
              
              {/* ESTADO DE RIESGO */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col items-center justify-center text-center space-y-1.5 print:bg-slate-50">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 font-display">Riesgo Global</span>
                
                {results.overallRisk === "BAJO" && (
                  <>
                    <div className="bg-emerald-50 text-emerald-600 p-2 rounded-full border border-emerald-100">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-extrabold text-emerald-600">BAJO</span>
                  </>
                )}
                {results.overallRisk === "MODERADO" && (
                  <>
                    <div className="bg-amber-50 text-amber-600 p-2 rounded-full border border-amber-100">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-extrabold text-amber-600">MODERADO</span>
                  </>
                )}
                {results.overallRisk === "CRÍTICO" && (
                  <>
                    <div className="bg-orange-55 text-orange-600 p-2 rounded-full border border-orange-100">
                      <ShieldAlert className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-extrabold text-orange-600">CRÍTICO</span>
                  </>
                )}
                {results.overallRisk === "COLAPSO" && (
                  <>
                    <div className="bg-red-50 text-red-600 p-2 rounded-full border border-red-100">
                      <Flame className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-extrabold text-red-600">COLAPSO</span>
                  </>
                )}
              </div>

              {/* HABITABILIDAD POST-SISMO */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col items-center justify-center text-center space-y-1.5 print:bg-slate-50">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 font-display">Habitabilidad</span>
                
                {results.habitability === "HABITABLE" && (
                  <>
                    <div className="bg-emerald-50 text-emerald-600 p-2 rounded-full border border-emerald-100">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-600 text-center leading-tight">HABITABLE</span>
                  </>
                )}
                {results.habitability === "RESTRICCIONES / INSPECCIÓN" && (
                  <>
                    <div className="bg-amber-50 text-amber-600 p-2 rounded-full border border-amber-100">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-extrabold text-amber-600 text-center leading-tight">INSPECCIONAR</span>
                  </>
                )}
                {results.habitability === "EVACUAR / INHABITABLE" && (
                  <>
                    <div className="bg-red-50 text-red-600 p-2 rounded-full border border-red-100">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-extrabold text-red-600 text-center leading-tight">EVACUAR</span>
                  </>
                )}
              </div>

            </div>

            {/* MEDIDOR DE DERIVA MÁXIMA DE PISO */}
            <div className="mt-5 border-t border-slate-200 pt-4 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Deriva de entrepiso máxima:</span>
                <span className={`font-mono font-bold ${results.maxDrift > currentNorm.driftLimit[typologyId] ? "text-red-600" : "text-emerald-600"}`}>
                  {results.maxDrift.toFixed(5)}
                </span>
              </div>

              {/* Barra de Progreso del límite normado */}
              <div className="space-y-1">
                <div className="w-full bg-slate-100 border border-slate-200 rounded-full h-2 overflow-hidden flex">
                  <div
                    className={`h-full rounded-full ${
                      results.maxDrift > currentNorm.driftLimit[typologyId]
                        ? "bg-red-500"
                        : results.maxDrift > currentNorm.driftLimit[typologyId] * 0.7
                        ? "bg-orange-400"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(100, (results.maxDrift / currentNorm.driftLimit[typologyId]) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-slate-500 font-mono font-medium">
                  <span>Piso Crítico: {results.maxDriftFloor}</span>
                  <span>Límite {currentNorm.normName}: {currentNorm.driftLimit[typologyId]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* PERFIL DE DESPLAZAMIENTOS POR PISO */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm print:border-none print:bg-white print:text-black">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-slate-500 font-display mb-4 print:text-black">Perfil de Desplazamientos (Sway)</h3>
            
            <div className="space-y-3">
              {results.floorResponses.map((f, idx) => {
                const percentage = (f.displacement / (results.floorResponses[results.floorResponses.length - 1].displacement || 1e-4)) * 100;
                return (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-600 font-semibold font-display">Piso {f.floor}</span>
                      <span className="text-slate-500 font-medium">{(f.displacement * 100).toFixed(1)} cm | drift: {f.drift.toFixed(5)}</span>
                    </div>
                    <div className="w-full bg-slate-50 h-1.5 rounded-md overflow-hidden flex border border-slate-200">
                      <div
                        className={`h-full rounded-md ${
                          f.damage === "collapse" || f.damage === "severe"
                            ? "bg-red-500"
                            : f.damage === "moderate"
                            ? "bg-orange-400"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.max(3, percentage)}%` }}
                      />
                    </div>
                  </div>
                );
              }).reverse()}
            </div>
          </div>

          {/* BOTÓN REPORTE CON INTELIGENCIA ARTIFICIAL */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm print:hidden">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-slate-500 font-display mb-3">Diagnóstico Sísmico Experto IA</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-4 font-medium">
              Invoca al modelo de lenguaje <b>Gemini 1.5 Flash</b> para analizar la resonancia modal de la estructura y plantear un plan de reducción del riesgo.
            </p>

            <button
              onClick={handleGenerateAIReport}
              disabled={loadingReport}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-md shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Sparkles className="h-4 w-4" fill="currentColor" />
              <span>{loadingReport ? "Ingeniero de IA Analizando..." : "Generar Reporte Profesional"}</span>
            </button>
          </div>

        </section>

        {/* SECCIÓN DE GUÍAS TÉCNICAS */}
        <section className="lg:col-span-12 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mt-4 print:hidden" id="seccion-guias-tecnicas">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 mb-5 gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-50 text-blue-600 p-2 rounded-xl">
                <BookOpen className="h-5 w-5" id="icono-guias" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 uppercase font-display" id="titulo-guias">
                  Manual de Usuario y Guía de Modelado Real
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Comprenda el funcionamiento de la simulación sísmica y cómo calibrar parámetros para edificaciones reales
                </p>
              </div>
            </div>

            {/* Selector de Pestañas de la Guía */}
            <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1 self-start sm:self-center" id="selector-guias-tabs">
              <button
                onClick={() => setActiveGuideTab("funcionamiento")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
                  activeGuideTab === "funcionamiento"
                    ? "bg-white text-blue-600 shadow-sm border border-slate-150"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                id="btn-tab-funcionamiento"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Guía de Funcionamiento</span>
              </button>
              <button
                onClick={() => setActiveGuideTab("real")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
                  activeGuideTab === "real"
                    ? "bg-white text-blue-600 shadow-sm border border-slate-150"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                id="btn-tab-config-real"
              >
                <Compass className="h-3.5 w-3.5" />
                <span>Modelado de Edificio Real</span>
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeGuideTab === "funcionamiento" && (
              <motion.div
                key="funcionamiento"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                id="contenido-guia-funcionamiento"
              >
                {/* Bloque 1 */}
                <div className="bg-slate-50 border border-slate-200/65 rounded-xl p-4.5 space-y-3" id="bloque-guia-1">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-mono text-xs font-bold">1</span>
                    <h3 className="font-bold text-xs uppercase text-slate-800 font-display">Configurar el Entorno</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Utilice el <strong>Panel de Configuración</strong> a la izquierda. Elija la norma sismorresistente del país del proyecto. La plataforma cargará de inmediato la aceleración espectral reglamentaria local y las distorsiones (derivas) máximas de diseño toleradas para ese territorio.
                  </p>
                  <div className="bg-blue-50/50 border border-blue-100 p-2.5 rounded-lg text-[10px] text-blue-700 font-mono">
                    <span className="font-bold block">Ejemplo de Norma:</span>
                    Perú: Norma Técnica E.030 (2018)<br />
                    Chile: Norma Chilena NCh433<br />
                    Colombia: NSR-10 (Título A)
                  </div>
                </div>

                {/* Bloque 2 */}
                <div className="bg-slate-50 border border-slate-200/65 rounded-xl p-4.5 space-y-3" id="bloque-guia-2">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-mono text-xs font-bold">2</span>
                    <h3 className="font-bold text-xs uppercase text-slate-800 font-display">Establecer la Estructura</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Ajuste el número de pisos y la tipología de construcción. El simulador recalculará automáticamente la matriz de rigideces lateral y la distribución de masas por piso del edificio. Esto determina dinámicamente el <strong>Periodo Fundamental de Vibración (T₁)</strong>.
                  </p>
                  <div className="bg-amber-50/50 border border-amber-100 p-2.5 rounded-lg text-[10px] text-amber-800 font-mono">
                    <span className="font-bold block">Frecuencia Resonante:</span>
                    Si el periodo del edificio (T₁) coincide con la meseta del sismo, el movimiento se amplifica severamente (Resonancia Sísmica).
                  </div>
                </div>

                {/* Bloque 3 */}
                <div className="bg-slate-50 border border-slate-200/65 rounded-xl p-4.5 space-y-3" id="bloque-guia-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-mono text-xs font-bold">3</span>
                    <h3 className="font-bold text-xs uppercase text-slate-800 font-display">Analizar Resultados & IA</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Inicie la animación en 2.5D para observar el comportamiento dinámico. Compare la <strong>Deriva de Entrepiso Máxima</strong> obtenida con el límite normativo. Genere un informe completo de reducción de riesgo invocando al modelo de IA <strong>Gemini 1.5 Flash</strong>.
                  </p>
                  <div className="bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-lg text-[10px] text-emerald-800 font-mono">
                    <span className="font-bold block">Control de Daños:</span>
                    Derivas menores al límite normado indican un comportamiento sismorresistente seguro y habitable.
                  </div>
                </div>
              </motion.div>
            )}

            {activeGuideTab === "real" && (
              <motion.div
                key="real"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
                id="contenido-guia-real"
              >
                <div className="bg-slate-50 border border-slate-200/65 rounded-xl p-5" id="contenedor-pasos-real">
                  <h3 className="text-xs uppercase font-extrabold text-slate-800 mb-3 tracking-wider font-display flex items-center gap-1.5" id="titulo-pasos-real">
                    <ClipboardList className="h-4 w-4 text-blue-600" />
                    Pasos para Configurar Datos de una Edificación Existente o de Proyecto Real
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
                    
                    <div className="space-y-4" id="pasos-real-col-1">
                      <div className="flex items-start space-x-3" id="paso-real-1">
                        <CheckSquare className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-slate-800 block text-xs uppercase font-bold font-display mb-0.5">1. Ubicación y Zonificación Sísmica (PGA)</strong>
                          <span>
                            Identifique el factor de zona ($Z$ o $A_a$) en los planos de cimentaciones o en la memoria descriptiva de estructuras. Por ejemplo, en el Perú, Lima se encuentra en la <strong>Zona 4 ($Z = 0.45$)</strong>. Seleccione el país y la zona correspondiente en el acordeón "Ubicación y Norma Técnica" de la plataforma.
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3" id="paso-real-2">
                        <CheckSquare className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-slate-800 block text-xs uppercase font-bold font-display mb-0.5">2. Tipo de Suelo de Cimentación</strong>
                          <span>
                            Revise el <strong>Estudio de Mecánica de Suelos (EMS)</strong> del proyecto real. Localice la clasificación sismorresistente del perfil del terreno (ej. suelo muy rígido, intermedio o blando). Configúrelo en la plataforma para actualizar la forma del espectro de aceleraciones elástico que excitará a la estructura.
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3" id="paso-real-3">
                        <CheckSquare className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-slate-800 block text-xs uppercase font-bold font-display mb-0.5">3. Geometría Real y Niveles</strong>
                          <span>
                            Configure el <strong>Número de Pisos</strong> y la <strong>Altura de Entrepiso</strong> real basándose en los planos de cortes arquitectónicos. Esto calibrará la masa e inercias de manera proporcional para que el periodo dinámico de cálculo coincida estrechamente con el periodo físico del edificio.
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4" id="pasos-real-col-2">
                      <div className="flex items-start space-x-3" id="paso-real-4">
                        <CheckSquare className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-slate-800 block text-xs uppercase font-bold font-display mb-0.5">4. Sistema Estructural y Coeficiente R</strong>
                          <span>
                            Determine si la resistencia lateral del edificio real está compuesta principalmente por columnas y vigas (<strong>Pórticos / Frame</strong>), placas o muros de hormigón armado (<strong>Muros de Corte / Shear Wall</strong>), o ladrillo/albañilería confinada. Este factor define la ductilidad estructural y el factor de reducción de fuerza sísmica $R$.
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3" id="paso-real-5">
                        <CheckSquare className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-slate-800 block text-xs uppercase font-bold font-display mb-0.5">5. Definición del Escenario Sísmico Real</strong>
                          <span>
                            Ajuste los parámetros del "Sismo de Diseño" a partir de eventos históricos locales. Puede configurar la magnitud de momento $M_w$ y la distancia epicentral para recrear la aceleración real estimada que experimentó la edificación durante un terremoto histórico emblemático de su región.
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3" id="paso-real-6">
                        <CheckSquare className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-slate-800 block text-xs uppercase font-bold font-display mb-0.5">6. Interpretación y Criterio de Aceptación</strong>
                          <span>
                            Compare la <strong>Deriva Máxima de Diseño</strong> reportada por la plataforma con el límite de la norma nacional. Si el valor supera la norma, se requiere proyectar medidas de reforzamiento (como añadir muros de corte adicionales) o incorporar disipadores de energía para controlar los desplazamientos laterales del edificio real.
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Tabla comparativa de límites de deriva de diseño para control de colapso */}
                  <div className="mt-5 border-t border-slate-200/80 pt-4" id="contenedor-tabla-derivadas">
                    <h4 className="text-[10px] uppercase font-bold text-slate-500 mb-2 font-mono flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5 text-blue-500" /> Límites de Deriva de Diseño Normativo Comunes en LATAM
                    </h4>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="min-w-full text-[11px] font-mono divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-3 py-1.5 text-left font-bold text-slate-700 uppercase">País / Norma</th>
                            <th className="px-3 py-1.5 text-left font-bold text-slate-700 uppercase">Pórticos de Concreto</th>
                            <th className="px-3 py-1.5 text-left font-bold text-slate-700 uppercase">Muros de Corte / Placas</th>
                            <th className="px-3 py-1.5 text-left font-bold text-slate-700 uppercase">Albañilería / Adobe</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          <tr>
                            <td className="px-3 py-1.5 font-bold text-slate-800">Perú (E.030)</td>
                            <td className="px-3 py-1.5 text-slate-600">0.007 (0.7%)</td>
                            <td className="px-3 py-1.5 text-slate-600">0.006 (0.6%)</td>
                            <td className="px-3 py-1.5 text-slate-600">0.005 (0.5%)</td>
                          </tr>
                          <tr>
                            <td className="px-3 py-1.5 font-bold text-slate-800">Chile (NCh433)</td>
                            <td className="px-3 py-1.5 text-slate-600">0.002 (0.2% elástica)*</td>
                            <td className="px-3 py-1.5 text-slate-600">0.002 (0.2% elástica)*</td>
                            <td className="px-3 py-1.5 text-slate-600">0.001 (0.1% elástica)</td>
                          </tr>
                          <tr>
                            <td className="px-3 py-1.5 font-bold text-slate-800">Colombia (NSR-10)</td>
                            <td className="px-3 py-1.5 text-slate-600">0.010 (1.0%)</td>
                            <td className="px-3 py-1.5 text-slate-600">0.010 (1.0%)</td>
                            <td className="px-3 py-1.5 text-slate-600">0.005 (0.5%)</td>
                          </tr>
                          <tr>
                            <td className="px-3 py-1.5 font-bold text-slate-800">Ecuador (NEC)</td>
                            <td className="px-3 py-1.5 text-slate-600">0.020 (2.0% inelástica)</td>
                            <td className="px-3 py-1.5 text-slate-600">0.010 (1.0% inelástica)</td>
                            <td className="px-3 py-1.5 text-slate-600">0.005 (0.5%)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-[9px] text-slate-400 mt-1.5 italic">
                      *Nota: La norma de Chile (NCh433) limita la distorsión del centro de gravedad de la losa elástica a 0.002, a diferencia de los métodos inelásticos amplificados de otros países, siendo un control altamente exigente.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

      </main>
      )}

      {/* RESULTADO DEL INFORME IA MODAL / PANEL EXPANDIDO */}
      <AnimatePresence>
        {reportResult && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="max-w-[1700px] w-full mx-auto px-4 lg:px-6 pb-8 print:block"
          >
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl relative print:border-none print:bg-white print:text-black">
              
              {/* Encabezado del reporte */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4 print:border-b-2 print:border-black">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl print:hidden">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 font-display print:text-black">INFORME TÉCNICO DE SEGURIDAD SÍSMICA CON IA</h3>
                    <p className="text-xs text-slate-500 font-medium print:text-black">Generado por Gemini 3.5 Flash · Plataforma SismoRisk LATAM v1.0</p>
                  </div>
                </div>

                <div className="flex space-x-2 print:hidden">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(reportResult);
                      showToast("¡Texto de informe copiado!");
                    }}
                    className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold py-2 px-3 rounded-lg transition cursor-pointer"
                  >
                    Copiar Reporte
                  </button>
                  <button
                    onClick={() => setReportResult(null)}
                    className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold py-2 px-3 rounded-lg transition cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>
              </div>

              {/* Contenido del Reporte formateado */}
              <div className="prose prose-emerald max-w-none text-slate-700 font-serif leading-relaxed text-sm p-2 space-y-4 print:text-black print:font-sans">
                {reportResult.split("\n\n").map((para, pIdx) => {
                  if (para.startsWith("##")) {
                    return (
                      <h4 key={pIdx} className="text-md font-extrabold text-slate-900 pt-2 border-b border-slate-200 pb-1 print:text-black font-display">
                        {para.replace("##", "").trim()}
                      </h4>
                    );
                  } else if (para.startsWith("**") && para.endsWith("**")) {
                    return (
                      <p key={pIdx} className="font-bold text-blue-600 print:text-black">
                        {para.replace(/\*\*/g, "").trim()}
                      </p>
                    );
                  } else if (para.startsWith("-") || para.startsWith("*")) {
                    return (
                      <ul key={pIdx} className="list-disc pl-5 space-y-1 text-slate-700 print:text-black">
                        {para.split("\n").map((li, lIdx) => (
                          <li key={lIdx}>{li.replace(/^[-\*\s]+/, "")}</li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={pIdx}>{para}</p>;
                })}
              </div>

              {/* Firma consultor */}
              <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-400 font-mono font-medium print:border-t-2 print:border-black print:text-black">
                <span>ID Simulación: {selectedProjectId}</span>
                <span className="text-right">Plataforma de Modelado de Riesgo Sísmico LATAM v1.0</span>
              </div>

            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* TOAST NOTIFICATIONS */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 text-xs font-bold uppercase tracking-wider print:hidden"
          >
            <Activity className="h-4 w-4 animate-spin text-blue-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LÍMITE DE ERRORES DE REPORTES */}
      <AnimatePresence>
        {reportError && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-6 z-50 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl shadow-2xl flex items-start space-x-3 text-xs w-96 print:hidden"
          >
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <span className="font-extrabold text-red-600 block uppercase">Error de Solicitud de IA</span>
              <p className="text-red-700 leading-relaxed font-medium">{reportError}</p>
              <button
                onClick={() => setReportError(null)}
                className="text-red-800 hover:underline font-bold mt-1.5 block cursor-pointer"
              >
                Cerrar advertencia
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER GENERAL */}
      <footer className="bg-slate-950/80 border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500 font-mono mt-auto print:hidden">
        <p>SismoRisk LATAM v1.0 | Desarrollado para Consultorías Ágiles, Educación Superior de Ingeniería Civil y RRD por Plataforma de Modelado de Riesgo Sísmico LATAM v1.0 Desarrollada por Geologol para la Mejora Continua en la Ingeniería Civil y RRD</p>
        <p className="text-[10px] text-slate-600 mt-1">Sismos calculados de forma analítica mediante espectros elásticos de Chile (NCh433), Colombia (NSR-10) y Perú (E.030 2018).</p>
      </footer>

      {/* DESCARGO DE RESPONSABILIDAD OVERLAY MODAL */}
      <AnimatePresence>
        {!disclaimerAccepted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[9999] flex items-center justify-center p-4 overflow-y-auto"
            id="modal-descargo-responsabilidad"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ delay: 0.1, duration: 0.25 }}
              className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col space-y-5 my-8"
              id="tarjeta-descargo-contenido"
            >
              {/* Encabezado con Icono */}
              <div className="flex items-start space-x-4">
                <div className="bg-amber-100 text-amber-700 p-3 rounded-2xl border border-amber-200">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 uppercase font-display" id="titulo-modal-descargo">
                    Descargo de Responsabilidad y Términos de Uso
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Plataforma de Modelado de Riesgo Sísmico LATAM
                  </p>
                </div>
              </div>

              {/* Cuerpo del Mensaje */}
              <div className="text-xs text-slate-600 leading-relaxed space-y-4 border-t border-b border-slate-100 py-4 max-h-[60vh] overflow-y-auto pr-2">
                <p>
                  Esta plataforma web interactiva es una herramienta computacional orientada al cálculo preliminar de la respuesta dinámica de estructuras ante solicitaciones sísmicas en América Latina. Para poder acceder a sus herramientas, por favor lea y acepte las condiciones de uso descritas a continuación:
                </p>

                <div className="space-y-3.5">
                  <div className="flex items-start space-x-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-950 font-bold font-display block">Propósitos de la Herramienta:</strong>
                      La plataforma tiene fines estrictamente <strong>educativos, de investigación y análisis de escenarios de riesgos</strong> para la reducción del riesgo de desastres (RRD). Permite visualizar de forma interactiva la interacción de factores normativos y mecánicos en edificios de múltiples pisos (MDOF).
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-950 font-bold font-display block">Público Objetivo:</strong>
                      Ha sido creada para <strong>estudiantes de ingeniería y arquitectura, y responsables del desarrollo y la construcción</strong> en un marco de seguridad y desarrollo óptimo dentro de las sociedades organizadas, así como para <strong>organismos gestionadores del riesgo de desastres</strong> que requieran conceptualizar rápidamente vulnerabilidades estructurales a nivel macro.
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <strong className="text-red-600 font-bold font-display block text-xs uppercase">No Reemplazo de Software Profesional:</strong>
                      El modelo simplificado de simulación implementado representa una estimación teórica lineal aproximada. Su empleo <strong>no reemplaza bajo ninguna circunstancia el empleo de softwares de modelado estructural y análisis sísmico más robustos, complejos y fiables</strong> (como ETABS, SAP2000, Robot Structural Analysis, CYPECAD, entre otros) oficialmente aprobados y regulados por las normativas vigentes para el desarrollo de proyectos ejecutivos reales de construcción civil.
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-950 font-bold font-display block">Responsabilidad del Usuario:</strong>
                      El desarrollador y los autores de esta plataforma no asumen responsabilidad alguna por decisiones técnicas, diseños o evaluaciones tomadas en base a los coeficientes, derivas de diseño o informes de IA emitidos por este simulador. La validación ingenieril final corre siempre por cuenta del profesional responsable debidamente colegiado y habilitado en el territorio correspondiente.
                    </div>
                  </div>
                </div>

                <p className="bg-slate-50 border border-slate-150 rounded-xl p-3 text-slate-500 font-medium text-[11px] leading-relaxed">
                  Al hacer clic en el botón de abajo, el usuario declara ser consciente del alcance de este simulador y acepta el inicio de su uso bajo los fines y propósitos exclusivamente educativos e investigativos indicados.
                </p>
              </div>

              {/* Botón de Aceptación */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                <span className="text-[10px] text-slate-400 font-mono">
                  SismoRisk LATAM | RRD v1.0
                </span>
                <button
                  onClick={handleAcceptDisclaimer}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/15 cursor-pointer transition duration-250 active:scale-95"
                  id="btn-aceptar-descargo"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Aceptar y Entrar a la Aplicación</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

