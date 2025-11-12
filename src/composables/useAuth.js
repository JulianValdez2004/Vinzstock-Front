import {ref, computed, onMounted, onUnmounted} from 'vue'
import authService from '@/services/authService'
import { useRoute, useRouter } from 'vue-router'


export function useAuth() {
    const usuario = ref(null)
    const isAuthenticated = ref(false)
    const route = useRoute()
    const router = useRouter()


    let inactivityTimer

    function startInactivityTimer() {

        if (!isAuthenticated.value) return

        resetInactivityTimer()

        // Escuchar eventos de actividad
        window.addEventListener('mousemove', resetInactivityTimer)
        window.addEventListener('keydown', resetInactivityTimer)
        window.addEventListener('click', resetInactivityTimer)
    }

    function stopInactivityTimer() {
        clearTimeout(inactivityTimer)
        window.removeEventListener('mousemove', resetInactivityTimer)
        window.removeEventListener('keydown', resetInactivityTimer)
        window.removeEventListener('click', resetInactivityTimer)
    }

    function resetInactivityTimer() {

        if (!isAuthenticated.value) return

        clearTimeout(inactivityTimer)
        inactivityTimer = setTimeout(() => {
            logout()
            alert('Tu sesión ha expirado por inactividad. Por favor, inicia sesión de nuevo.')
            router.push('/login')
        }, 15 * 60 * 1000) // 15 minutos
    }



    // Cargar usuario al montar
    onMounted(() => {
        loadUser()
        if (isAuthenticated.value && route.path !== '/login') {
            startInactivityTimer()
        }
    })

    onUnmounted(() => {
        stopInactivityTimer()
    })

    /**
     * Cargar usuario desde localStorage
     */
    function loadUser() {
        if (authService.isAuthenticated()) {
            usuario.value = authService.getUser()
            isAuthenticated.value = true
        }
    }

    /**
     * Establecer usuario después del login
     */
    function setUser(user) {
        usuario.value = user
        isAuthenticated.value = true
    }

    /**
     * Cerrar sesión
     */
    function logout() {
        authService.logout()
        usuario.value = null
        isAuthenticated.value = false
    }

    /**
     * Verificar si tiene un rol
     */
    function hasRole(rol) {
        return usuario.value?.hasRole(rol) || false
    }

    /**
     * Verificar si es admin
     */
    const isAdmin = computed(() => {
        return usuario.value?.nombreRol === "Administrador"
    })

    /**
     * Obtener iniciales
     */
    const userInitials = computed(() => {
        return usuario.value?.getInitials() || '?'
    })

    return {
        usuario,
        isAuthenticated,
        isAdmin,
        userInitials,
        loadUser,
        setUser,
        logout,
        hasRole
    }
}