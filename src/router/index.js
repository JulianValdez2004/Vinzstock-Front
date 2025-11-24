import { createRouter, createWebHistory } from 'vue-router'
import authService from '@/services/authService'

// Layouts
import AuthLayout from '@/Layouts/AuthLayout.vue'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import UserLayout from '@/Layouts/UserLayout.vue'

// Vistas de autenticación
import LoginView from '@/views/LoginView.vue'
import RecuperarContrasenaView from '@/views/RecuperarContrasenaView.vue'

// Vistas de admin
import AdminDashboardView from '@/views/Admin/DashboardView.vue'
import CrearUsuarioView from '@/views/Admin/CrearUsuarioView.vue'
import ListarUsuariosView from '@/views/Admin/ListarUsuariosView.vue'
import ConfiguracionView from '@/views/Admin/ConfiguracionView.vue'
import CrearProductoView from "@/views/Admin/CrearProductoView.vue";
import AdminOptions from "@/views/Admin/AdminOptions.vue";
import EditarProductoView from "@/views/Admin/EditarProductoView.vue";
import inventariodosView from "@/views/Admin/inventariodosView.vue";
import CrearProveedorView from "@/views/Admin/CrearProveedorView.vue";
import ProveedoresView from "@/views/Admin/proveedoresView.vue";
import EditarProveedorView from "@/views/Admin/EditarProveedorView.vue";
import CrearCompraView from "@/views/Admin/CrearCompraView.vue";

// Vistas de usuario
import UserDashboardView from '@/views/User/DashboardView.vue'
import PerfilView from '@/views/User/PerfilView.vue'





const routes = [
    {
        path: '/',
        redirect: '/login'
    },

    // ✅ RUTAS DE AUTENTICACIÓN (Sin autenticación requerida)
    {
        path: '/',
        component: AuthLayout,
        meta: { requiresAuth: false },
        children: [
            {
                path: 'login',
                name: 'Login',
                component: LoginView
            },
            {
             path: 'recuperar-contrasena',
             name: 'RecuperarContrasena',
             component: RecuperarContrasenaView
            }
        ]
    },

    // ✅ RUTAS DE ADMINISTRADOR (Requiere auth + rol admin)
    {
        path: '/admin',
        component: AdminLayout,
        meta: { requiresAuth: true, requiresAdmin: true },
        children: [
            {
                path: 'dashboard',
                name: 'AdminDashboard',
                component: AdminDashboardView
            },
            {
                path: 'adminOptions/gestionarUsuarios',
                name: 'ListarUsuarios',
                component: ListarUsuariosView
            },
            {
                path: 'adminOptions/gestionarUsuarios/crear-usuario',
                name: 'CrearUsuario',
                component: CrearUsuarioView
            }, /*
            {
                path: 'reportes',
                name: 'Reportes',
                component: () => import('@/views/admin/ReportesView.vue')
            },*/

            {
                path: 'inventario',
                name: 'AdminInventario',
                component: inventariodosView
            },
            {
                path: 'configuracion',
                name: 'Configuracion',
                component: ConfiguracionView
            },

            {
                path: "adminOptions",
                name : "AdminOptions",
                component: AdminOptions

            },

            {
                path: "inventario/crearProducto",
                name: "CrearProducto",
                component: CrearProductoView
            },

            {
                path: "inventario/editarProducto",
                name: "EditarProducto",
                component: EditarProductoView

            },

            {
                path: "proveedores",
                name: "Proveedores",
                component: ProveedoresView
            },

            {
                path: "proveedores/CrearProveedor",
                name: "CrearProveedor",
                component: CrearProveedorView
            },

            {
                path: "proveedores/editar/:id",
                name: "EditarProveedor",
                component: EditarProveedorView
            },

            {
                path: "proveedores/HacerPedido",
                name: "HacerPedido",
                component: CrearCompraView

            }

        ]
    },

    // ✅ RUTAS DE USUARIO NORMAL (Requiere auth)
    {
        path: '/cajero',
        component: UserLayout,
        meta: { requiresAuth: true, requiresAdmin: false },
        children: [
            {
                path: 'dashboard',
                name: 'UserDashboard',
                component: UserDashboardView
            },
            {
                path: 'perfil',
                name: 'Perfil',
                component: PerfilView
            }/*,
            {
                path: 'inventario',
                name: 'UserInventario',
                component: () => import('@/views/user/InventarioView.vue')
            }*/
        ]
    },

    // ✅ RUTA 404
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFoundView.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// ✅ GUARD DE NAVEGACIÓN CON VALIDACIÓN DE ROLES
router.beforeEach((to, from, next) => {
    const isAuthenticated = authService.isAuthenticated()
    const usuario = authService.getUser()

    console.log('🔒 Guard:', {
        to: to.path,
        isAuthenticated,
        usuario: usuario?.nombreRol
    })

    if (to.meta.requiresAuth) {
        if (!isAuthenticated) {
            console.log('❌ No autenticado, redirigiendo a login')
            next('/login')
            return
        }

        if (to.meta.requiresAdmin && !usuario.isAdmin()) {
            console.log('❌ No es admin, redirigiendo a dashboard de usuario')
            next('/cajero')
            return
        }

        if (!to.meta.requiresAdmin && usuario.isAdmin()) {
            console.log('❌ Es admin, redirigiendo a dashboard de admin')
            next('/admin')
            return
        }
    }

    if (to.path === '/login' && isAuthenticated) {
        console.log('✅ Ya autenticado, redirigiendo según rol')
        if (usuario.isAdmin()) {
            next('/admin/adminOptions')
        } else {
            next('/cajero/perfil')
        }
        return
    }

    console.log('✅ Navegación permitida')
    next()
})


export default router