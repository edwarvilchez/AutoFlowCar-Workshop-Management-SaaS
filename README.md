# AutoFlow - Workshop Management SaaS (White-Label)

AutoFlow es una plataforma integral de gestión para talleres mecánicos de alto rendimiento, diseñada como una solución SaaS multitenant. Ofrece un flujo de trabajo optimizado, una interfaz premium y herramientas de análisis financiero directo en el navegador.

## 🌟 Características Principales

### 🔐 Gestión de Accesos y RBAC (Role-Based Access Control)

- **Sistema de Roles:**
  - **Administrador:** Control total, gestión de analistas y módulo financiero completo.
  - **Analista:** Gestión operativa de vehículos, inventario y carga de pagos de clientes.
  - **Cliente:** Interfaz simplificada para solicitar, reagendar o eliminar sus propias citas.
- **Seguridad:** Rutas protegidas mediante `ProtectedRoute` y persistencia de sesión en `localStorage`.

### 📅 Centro de Reservaciones Inteligente

- **Booking Flow en 3 Pasos:**
  1. **Información:** Captura de datos del cliente y vehículo con campos validados.
  2. **Diagnóstico Inicial:** Selección técnica de servicios requeridos con iconos descriptivos.
  3. **Agenda:** Selector dinámico de fecha y hora para evitar sobrecarga operativa.
- **Gestión de Citas (Cliente):** Los clientes pueden ver su historial, reagendar mediante edición o eliminar citas pendientes.

### 📱 Notificaciones Multicanal

- **WhatsApp Direct:** Generación automática de mensajes con formato profesional para confirmar citas mediante `wa.me`.
- **Email Digest:** Envío de resúmenes de servicios y confirmaciones de agenda directamente al correo del cliente.

### 📊 Dashboard Operativo (Workflow Kanban)

- **Visualización en Tiempo Real:** Control total de las unidades mediante 5 etapas críticas: Recepción, Diagnóstico, Ejecución, Control de Calidad y Egreso.
- **Acciones Rápidas:** Botón de "Cargar Pago" para analistas y validación de presupuesto aprobado para avanzar a ejecución.
- **Interactividad:** Cambio de estados vehicular con actualización instantánea de contadores.

### 🍱 Gestión de Inventario y Stock

- **Control de Insumos:** Seguimiento detallado de piezas y consumibles.
- **Alertas Visuales:** Identificación inmediata de stock crítico (rojo) y niveles óptimos.

### 💰 Facturación y Análisis Financiero

- **Módulo Financiero Dual Currency:**
  - Visualización de ingresos totales y facturación pendiente en **USD** y **Bolívares (VES)** simultáneamente.
  - Configuración centralizada de **Tasa de Cambio** con persistencia local.
  - Gestión crud de **Métodos de Pago** (Transferencia, Pago Móvil, Zelle, Efectivo, Cripto).
- **Reportes PDF:** Generación de informes profesionales con un solo clic, incluyendo tablas detalladas de servicios y métricas de ventas.

### 🤖 Diagnóstico Inteligente con IA (Gemini)

- **Análisis Predictivo:** Integración con **Google Gemini AI** para generar reportes ejecutivos de mantenimiento basados en el historial del vehículo.
- **Asistente Técnico:** Sugerencias automáticas de servicios y detección de anomalías recurrentes.
- **Soporte Regional:** Configuración robusta con manejo de errores específicos para regiones con restricciones (VPN/Proxy).

### 📝 Gestión de Presupuestos y Cotizaciones

- **Generador de Presupuestos:** Creación rápida de cotizaciones detalladas incluyendo repuestos y mano de obra.
- **Cálculo Dual:** Conversión automática de montos a Moneda Local (VES) según tasa del día.
- **Flujo de Aprobación:** Sistema de bloqueo que impide avanzar reparaciones sin la aprobación explícita del cliente.
- **PDF Export:** Descarga de presupuestos formales con un clic.

## 🎨 Diseño y Experiencia de Usuario (UI/UX)

- **Estética High-Tech:** Basado en el concepto de _Glassmorphism_ y alto contraste.
- **Tipografía Dinámica:** Uso de **Montserrat** con estilos audaces para transmitir velocidad y precisión.
- **Responsividad Total:** Adaptado perfectamente para Desktop, Tablets y Smartphones con una barra lateral inteligente.
- **Formularios Premium:** Campos de entrada diseñados para la máxima comodidad y claridad visual con validaciones en tiempo real.

## 🛠️ Stack Tecnológico

- **Core:** React 19 + TypeScript.
- **State Management:** Custom Hooks (`useVehicles`, `useFinancial`) + React Context pattern ready.
- **Routing:** React Router 7.
- **Iconografía:** Lucide React.
- **Engine PDF:** jsPDF + AutoTable.
- **Estilos:** Custom CSS con arquitectura de variables para personalización rápida.

---

_AutoFlow: La evolución digital para el taller moderno._
