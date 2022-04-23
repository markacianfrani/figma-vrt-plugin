<template>
  <div id="ui" class="h-screen flex flex-col justify-between">
    
    <Navbar @selectPage="(page) => currentPage = page" :current-page="currentPage"></Navbar>

    <HomeView v-if="currentPage === 'home'"></HomeView>
    <SettingsView v-if="currentPage === 'settings'"></SettingsView>

  </div>
</template>

<script setup>
import styles from 'figma-plugin-ds/dist/figma-plugin-ds.css'


import {
  onMounted,
  onBeforeUpdate,
  ref,
  reactive,
  nextTick,
  computed
} from 'vue';
import FigmaDialog from './components/FigmaDialog.vue';
import Navbar from './components/Navbar.vue'
import HomeView from '../views/HomeView.vue'
import SettingsView from '../views/SettingsView.vue'

const currentPage = ref('home')


</script>
