<script setup lang="ts">
import { env } from '@/config/env'
const apiUrl = env.API_URL
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="text-center mb-6">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span class="text-2xl">❌</span>
      </div>
      <h2 class="text-xl font-semibold text-red-700 mb-2">API No Disponible</h2>
      <p class="text-gray-600">El servidor Laravel no está respondiendo.</p>
    </div>

    <div class="bg-red-50 border border-red-200 rounded-lg p-4">
      <h3 class="font-semibold text-red-800 mb-3">Para continuar:</h3>
      <ul class="text-red-700 text-sm space-y-2">
        <li class="flex items-start gap-2">
          <span class="mt-1">🔧</span>
          <div>
            <strong>Inicia el servidor Laravel:</strong>
            <code class="block bg-red-100 px-2 py-1 rounded mt-1 font-mono">php artisan serve</code>
          </div>
        </li>
        <li class="flex items-start gap-2">
          <span class="mt-1">🌐</span>
          <div>
            <strong>Verifica la URL:</strong>
            <code class="block bg-red-100 px-2 py-1 rounded mt-1 font-mono">{{ apiUrl }}</code>
          </div>
        </li>
        <li class="flex items-start gap-2">
          <span class="mt-1">🔒</span>
          <div>
            <strong>Configura CORS en Laravel:</strong>
            <p class="text-red-600 mt-1">
              Asegúrate de que <code class="bg-red-100 px-1 rounded">cors.php</code> permita tu
              dominio Vue.js
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
