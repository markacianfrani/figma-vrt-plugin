<template>
  <div id="ui" class="min-h-full p-6">
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul class="divide-y divide-gray-200">
        <li>
          <a class="block hover:bg-gray-50">
            <div class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <label class="inline-flex items-center">
                  <input type="checkbox" @change="selectAll" />
                  <span class="ml-2 text-md text-gray-700 md:truncate">Select All</span>
                </label>
              </div>
            </div>
          </a>
        </li>
        <li v-for="page in pages.value" :key="page.nodeId">
          <a class="block hover:bg-gray-50">
            <div class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <label class="inline-flex items-center">
                  <input type="checkbox" :value="page.nodeId" v-model="checkedPages.value" />
                  <span class="ml-2 text-md text-gray-700 md:truncate">{{ page.name }}</span>
                </label>
              </div>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>

import styles from 'figma-plugin-ds/dist/figma-plugin-ds.css'
import {
  dispatch,
  handleEvent
} from "./uiMessageHandler";
import {
  onMounted,
  ref,
  reactive
} from 'vue';


let all = false
let pages = reactive([])
let checkedPages = reactive([])

function selectAll() {
  if (!all) {
    const allIds = pages.value.map((page) => page.nodeId);
    console.log('all ids', allIds);
    checkedPages.value = allIds;
    all = true;
  } else {
    checkedPages.value = [];
    all = false;
  }
}

dispatch("fetchPages");

onMounted(() => {

  // The following shows how messages from the main code can be handled in the UI code.
  handleEvent("pagesFetched", figmaData => {
    pages.value = figmaData
  });
})

</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>