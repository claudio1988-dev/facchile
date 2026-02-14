# Panel Administrativo FacChile

Panel de administración completo para la gestión de productos, categorías, marcas y pedidos del e-commerce FacChile.

## 🚀 Características

### Dashboard Principal
- Vista general con métricas clave
- Total de productos (activos/inactivos)
- Total de categorías y marcas
- Productos recientes
- Accesos rápidos a las principales funciones

### Gestión de Productos
- **Listado completo** con paginación
- **Filtros avanzados**:
  - Búsqueda por nombre
  - Filtro por categoría
  - Filtro por marca
  - Filtro por estado (activo/inactivo)
- **CRUD completo**:
  - Crear productos con todos los campos
  - Editar productos existentes
  - Eliminar productos
- **Campos del producto**:
  - Información general (nombre, slug, descripciones)
  - Clasificación (categoría, marca, clase de envío)
  - Precio base
  - Opciones (activo, restringido, verificación de edad)
  - URL de imagen principal

### Gestión de Categorías
- Listado de categorías con contador de productos
- Crear, editar y eliminar categorías
- Validación para prevenir eliminación de categorías con productos

### Gestión de Marcas
- Listado de marcas con contador de productos
- Crear, editar y eliminar marcas
- Validación para prevenir eliminación de marcas con productos

## 📍 Rutas

Todas las rutas del panel administrativo están bajo el prefijo `/adminfacchile` y requieren autenticación:

- `GET /adminfacchile` - Dashboard principal
- `GET /adminfacchile/products` - Listado de productos
- `GET /adminfacchile/products/create` - Crear producto
- `POST /adminfacchile/products` - Guardar producto
- `GET /adminfacchile/products/{id}/edit` - Editar producto
- `PUT /adminfacchile/products/{id}` - Actualizar producto
- `DELETE /adminfacchile/products/{id}` - Eliminar producto
- `GET /adminfacchile/categories` - Listado de categorías
- `GET /adminfacchile/brands` - Listado de marcas

## 🎨 Componentes UI

El panel utiliza **shadcn/ui** con Tailwind CSS para una interfaz moderna y consistente:

- **Card** - Contenedores de contenido
- **Table** - Tablas de datos
- **Button** - Botones de acción
- **Input** - Campos de entrada
- **Select** - Selectores dropdown
- **Checkbox** - Casillas de verificación
- **Badge** - Etiquetas de estado
- **Label** - Etiquetas de formulario

## 🔧 Tecnologías

- **Backend**: Laravel 12
- **Frontend**: React 18 + TypeScript
- **Routing**: Inertia.js v2
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📦 Estructura de Archivos

```
app/Http/Controllers/Admin/
├── DashboardController.php
├── ProductController.php
├── CategoryController.php
├── BrandController.php
└── OrderController.php

resources/js/pages/admin/
├── Dashboard.tsx
├── products/
│   ├── Index.tsx
│   ├── Create.tsx
│   └── Edit.tsx
├── categories/
│   └── Index.tsx
└── brands/
    └── Index.tsx

routes/
└── admin.php
```

## 🔐 Seguridad

- Todas las rutas requieren autenticación (`auth` middleware)
- Todas las rutas requieren verificación de email (`verified` middleware)
- Validación de datos en todos los formularios
- Protección contra eliminación de categorías/marcas con productos asociados

## 🎯 Próximas Funcionalidades

- [ ] Gestión de pedidos completa
- [ ] Gestión de clientes
- [ ] Reportes y estadísticas avanzadas
- [ ] Gestión de variantes de productos
- [ ] Gestión de imágenes múltiples
- [ ] Gestión de inventario
- [ ] Sistema de permisos y roles

## 📝 Notas de Desarrollo

### Auto-generación de Slug
El formulario de creación de productos incluye auto-generación de slug basado en el nombre del producto, normalizando caracteres especiales y espacios.

### Validaciones
- Slugs únicos para productos, categorías y marcas
- Precios numéricos con 2 decimales
- Relaciones obligatorias (categoría, clase de envío)
- Relaciones opcionales (marca)

### Formato de Datos
- Fechas en formato `d/m/Y` para el usuario
- Precios formateados con separador de miles para Chile
- Estados booleanos con badges visuales
