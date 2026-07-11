<div align="center">

# 🌋 SismoRisk LATAM

### Plataforma de Modelado de Riesgo Sísmico para Latinoamérica

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-3.5_Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Simulador dinámico interactivo MDOF · 8 Normativas LATAM · FUNVISIS · FEMA P-154 · GNDT · IA**

[🌐 Demo en Vivo](#) · [📖 Documentación](#uso) · [🐛 Reportar Bug](https://github.com/geologol-max/sismorisk-latam/issues)

</div>

---

## 📋 Descripción

**SismoRisk LATAM** es una plataforma web interactiva orientada al cálculo preliminar de la **respuesta dinámica de estructuras** ante solicitaciones sísmicas en América Latina. Desarrollada por **Geologol** para la mejora continua en la Ingeniería Civil y la Reducción del Riesgo de Desastres (RRD).

> ⚠️ Esta herramienta tiene fines **educativos, de investigación y análisis de escenarios de riesgo**. No reemplaza software profesional homologado (ETABS, SAP2000, etc.) para proyectos ejecutivos reales.

---

## ✨ Características

### 🏗️ Simulador Dinámico MDOF
- Modelo de Múltiples Grados de Libertad con **solver de Jacobi** para análisis modal
- Combinación de modos con **SRSS** (Square Root of Sum of Squares)
- Animación en tiempo real del comportamiento sísmico del edificio
- Evaluación de niveles de daño por piso (Ninguno / Leve / Moderado / Severo / Colapso)

### 🌎 Normativas Sísmicas LATAM
| País | Norma |
|---|---|
| 🇵🇪 Perú | E.030-2018 |
| 🇨🇱 Chile | NCh433 Of.96 |
| 🇨🇴 Colombia | NSR-10 |
| 🇻🇪 Venezuela | COVENIN 1756:2001 |
| 🇸🇻 El Salvador | REP-2004 |
| 🇪🇨 Ecuador | NEC-SE-DS:2015 |
| 🇵🇦 Panamá | REP-2014 |
| 🇨🇺 Cuba | NC 46:2017 |

### 📊 Metodologías de Evaluación de Vulnerabilidad
- **FUNVISIS** — Ficha de Evaluación Rápida (Venezuela)
- **FEMA P-154** — Rapid Visual Screening (RVS)
- **GNDT** — Índice de Vulnerabilidad de Benedetti-Petrini (Italia/Europa)

### 🤖 Inteligencia Artificial
- Generación de **Informes Técnicos** con Google Gemini 3.5 Flash
- Interpretación contextual de resultados sísmicos
- Recomendaciones de reforzamiento estructural

---

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18 o superior
- Una clave de API de Google Gemini ([obtener gratis](https://ai.google.dev/))

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/geologol-max/sismorisk-latam.git
cd sismorisk-latam

# Instalar dependencias
npm install

# Configurar variable de entorno
cp .env.example .env
# Editar .env y poner tu GEMINI_API_KEY
```

### Ejecutar en Desarrollo

```bash
npm run dev
# Abrir http://localhost:3000
```

### Build de Producción

```bash
npm run build
npm run start
```

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + TypeScript + Tailwind CSS v4 |
| Animaciones | Framer Motion |
| Backend | Express 4 + Node.js |
| Build | Vite 6 (con code splitting + manualChunks) |
| IA | Google Generative AI SDK (Gemini 3.5 Flash) |
| Seguridad | express-rate-limit (20 req/15min/IP) |
| Contenedor | Docker multi-stage (Alpine Node 22) |

---

## 🏛️ Arquitectura

```
├── src/
│   ├── App.tsx                          # Componente principal (React.lazy + Suspense)
│   ├── lib/
│   │   └── seismic.ts                   # Motor: Jacobi, SRSS, espectros, GMPE
│   └── components/
│       ├── LandingPage.tsx              # Portal de inicio
│       ├── VulnerabilidadVenezuela.tsx  # Módulo FUNVISIS
│       ├── FemaP154.tsx                 # Módulo FEMA P-154
│       └── GndtVulnerability.tsx        # Módulo GNDT
├── server.ts                            # Express server + endpoints Gemini
├── Dockerfile                           # Multi-stage build para producción
└── vite.config.ts                       # Build con code splitting optimizado
```

---

## 🌐 Despliegue en Hostinger VPS

```bash
# En el servidor VPS (Ubuntu 22.04):
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 22
npm install -g pm2

git clone https://github.com/geologol-max/sismorisk-latam.git /var/www/sismorisk
cd /var/www/sismorisk

echo "GEMINI_API_KEY=tu_clave_aqui" > .env
echo "NODE_ENV=production" >> .env

npm install
npm run build
pm2 start dist/server.cjs --name sismorisk-latam
pm2 save && pm2 startup
```

Ver la [Guía completa de despliegue](DEVELOPMENT_LOG.md) para configuración de Nginx + SSL.

---

## 📄 Licencia

MIT © 2026 [Geologol](https://github.com/geologol-max)

---

<div align="center">
Desarrollado con ❤️ para la ingeniería civil y la reducción del riesgo sísmico en Latinoamérica
</div>
