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
        <li v-for="page in pages" :key="page.nodeId">
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
    <div>
      <button @click="snapshotBaseline" class="button button--primary">Baseline Snapshot</button>
    </div>

    <div>
      <div v-for="(page, index) in pages" :key="`baseline-${page.nodeId}`">
        {{page.name}}
        <canvas :ref="el => { canvasReferences[`${page.nodeId}-baseline`] = el}" class="border"></canvas>
        <canvas :ref="el => { canvasReferences[`${page.nodeId}-comparision`] = el}" class="border"></canvas>
        <canvas :ref="el => { canvasReferences[`${page.nodeId}-diff`] = el}" class="border"></canvas>
      </div>
    </div>
  </div>

  
</template>

<script setup>

import styles from 'figma-plugin-ds/dist/figma-plugin-ds.css'
import pixelmatch from 'pixelmatch'
import { PageSet } from './model/PageSet'
import { Page } from './model/Page'

import {
  dispatch,
  handleEvent
} from "./uiMessageHandler";
import {
  onMounted,
  onBeforeUpdate,
  ref,
  reactive,
  computed
} from 'vue';

let all = false
const canvasReferences = ref([])
let checkedPages = reactive([])
const baselineRef = ref(null)
const comparisionRef = ref(null)
const diffRef = ref(null)
const pageSet = reactive(new PageSet())
let pages = computed(() => {
  return pageSet.pages
})

 
function diff() {
  console.log('heard');
}
function selectAll() {
  if (!all) {
    const allIds = pages.map((page) => page.nodeId);
    console.log('all ids', allIds);
    checkedPages.value = allIds;
    all = true;
  } else {
    checkedPages.value = [];
    all = false;
  }
}

dispatch("fetchPages");

async function snapshotBaseline() {
  for (const pageData in pages.value) {
    const page = pages.value[pageData];
    await draw(page);
  }


}

async function draw(page) {
  return new Promise((resolve, reject) => {
    const canvas = canvasReferences.value[`${page.nodeId}-baseline`]
    const baselineImage = new Image();
    baselineImage.addEventListener("load", () => {
      canvas.width = baselineImage.width;
      canvas.height = baselineImage.height;
      canvas.getContext("2d").drawImage(baselineImage, 0, 0);
    });
    const url = URL.createObjectURL(new Blob([page.baselineImage]));
    baselineImage.src = url
    resolve();
  });
}

  onBeforeUpdate(() => {
      canvasReferences.value = [];
    });

onMounted(async () => {

  // The following shows how messages from the main code can be handled in the UI code.
  handleEvent("pagesFetched", figmaData => {
    console.log('fig', figmaData);
    figmaData.map(pageData => {
      const page = new Page(pageData.name, pageData.nodeId)
      page.setBaselineImage(pageData.image)
      pageSet.addPage(page)
    })
  });



})

</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>