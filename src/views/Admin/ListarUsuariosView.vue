<template>
  <div class="listar-usuarios">
    <div class="header-section">
      <h2>Gestión de Usuarios</h2>
      <router-link to="/admin/adminOptions/gestionarUsuarios/crear-usuario" class="btn-primary">
        ➕ Crear Usuario
      </router-link>
    </div>

    <!-- Buscador -->
    <div class="search-section">
      <input
          v-model="searchQuery"
          type="text"
          placeholder="🔍 Buscar usuario..."
          class="search-input"
      />
    </div>

    <!-- Tabla de usuarios -->
    <div class="table-container">
      <div v-if="isLoading" class="loading">Cargando usuarios...</div>

      <div v-else-if="error" class="error-message">{{ error }}</div>

      <table v-else class="users-table">
        <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Usuario</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="usuario in filteredUsuarios" :key="usuario.idUsuario">
          <td>{{ usuario.idUsuario }}</td>
          <td>{{ usuario.nombre }}</td>
          <td>{{ usuario.usuarioLogin }}</td>
          <td>{{ usuario.email }}</td>
          <td>
            <span class="badge">{{ usuario.rol.nombre }}</span>
          </td>
          <td>
              <span :class="['status', usuario.estado ? 'active' : 'inactive']">
                {{ usuario.estado ? 'Activo' : 'Inactivo' }}
              </span>
          </td>
          <td>
            <div class="actions">
              <button @click="editarUsuario(usuario)" class="btn-edit" title="Editar">
                ✏️
              </button>
              <button
                  @click="toggleEstado(usuario)"
                  :class="['btn-toggle', usuario.estado ? 'btn-deactivate' : 'btn-activate']"
                  :title="usuario.estado ? 'Desactivar' : 'Activar'"
              >
                {{ usuario.estado ? '🔒' : '🔓' }}
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import usuarioService from '@/services/usuarioService'

const router = useRouter()
const usuarios = ref([])
const searchQuery = ref('')
const isLoading = ref(false)
const error = ref('')

const filteredUsuarios = computed(() => {
  if (!searchQuery.value) return usuarios.value

  const query = searchQuery.value.toLowerCase()
  return usuarios.value.filter(u =>
      u.nombre.toLowerCase().includes(query) ||
      u.usuarioLogin.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query)
  )
})

onMounted(async () => {
  await loadUsuarios()
})

async function loadUsuarios() {
  isLoading.value = true
  error.value = ''

  try {
    const result = await usuarioService.getAllUsuarios()
    if (result.success) {
      usuarios.value = result.data
    } else {
      error.value = result.error
    }
  } catch (err) {
    error.value = 'Error al cargar usuarios'
  } finally {
    isLoading.value = false
  }
}

function editarUsuario(usuario) {

  console.log('Editar usuario:', usuario)
  alert('Funcionalidad de edición próximamente')
}

async function toggleEstado(usuario) {
  const accion = usuario.estado ? 'desactivar' : 'activar'

  if (confirm(`¿Estás seguro de ${accion} a ${usuario.nombre}?`)) {
    try {
      const usuarioActualizado = { ...usuario, estado: !usuario.estado }
      const result = await usuarioService.updateUsuario(usuarioActualizado)

      if (result.success) {
        await loadUsuarios()
        alert(`Usuario ${accion}do exitosamente`)
      } else {
        alert(result.error)
      }
    } catch (err) {
      alert('Error al actualizar usuario')
    }
  }
}
</script>

<style scoped>
.listar-usuarios {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-section h2 {
  margin: 0;
  font-size: 24px;
  color: #0f172a;
  font-weight: 600;
}

.btn-primary {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}



.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.search-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
  overflow: hidden;
}

.loading, .error-message {
  padding: 40px;
  text-align: center;
  color: #64748b;
}

.error-message {
  color: #dc2626;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table thead {
  background: #f8fafc;
}

.users-table th {
  padding: 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e2e8f0;
}

.users-table td {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
  color: #0f172a;
}

.users-table tbody tr:hover {
  background: #f8fafc;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status.active {
  background: #dcfce7;
  color: #16a34a;
}

.status.inactive {
  background: #fee2e2;
  color: #dc2626;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-edit, .btn-toggle {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
}

.btn-edit {
  background: #eff6ff;
}

.btn-edit:hover {
  background: #dbeafe;
  transform: scale(1.1);
}

.btn-toggle {
  background: #f1f5f9;
}

.btn-toggle:hover {
  transform: scale(1.1);
}

.btn-deactivate:hover {
  background: #fee2e2;
}

.btn-activate:hover {
  background: #dcfce7;
}
</style>