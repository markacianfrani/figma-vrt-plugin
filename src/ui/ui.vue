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
      <button @click="snapshotComparison" class="button button--primary">Comparision Snapshot</button>
      <button @click="goDiff" class="button button--primary">Go Diff</button>
    </div>

    <div>
      <div v-for="(page, index) in pages" :key="`baseline-${page.nodeId}`">
        {{page.name}}
        {{page.diffPercent}}
        {{page.status}}
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
async function goDiff() {
  pages.value.forEach((page) => {
       const baselineCanvas = canvasReferences.value[`${page.nodeId}-baseline`]
       const comparisionCanvas = canvasReferences.value[`${page.nodeId}-comparision`]
       const diffCanvas = canvasReferences.value[`${page.nodeId}-diff`]

        const img1Ctx = baselineCanvas.getContext("2d");
        const img2Ctx = comparisionCanvas.getContext("2d");
        const diffCtx = diffCanvas.getContext("2d");
        const { width, height } = baselineCanvas;
        diffCanvas.width = width;
        diffCanvas.height = height;

         const img1 = img1Ctx.getImageData(0, 0, width, height);
        const img2 = img2Ctx.getImageData(0, 0, width, height);
        const diff = diffCtx.createImageData(width, height);

        const diffCount = pixelmatch(
          img1.data,
          img2.data,
          diff.data,
          width,
          height,
          { threshold: 0.1 }
        );


        diffCtx.putImageData(diff, 0, 0);
        page.diffImage = diffCanvas.toDataURL();
        page.diffPercent = diffCount;
        page.status = "Done";
  })

}

async function snapshotBaseline() {
  for (const pageData in pages.value) {
    const page = pages.value[pageData];
    await draw(page, 'baseline');
  }


}

async function snapshotComparison() {
  // for (const pageData in pages.value) {
  //   const page = pages.value[pageData];
  //   await draw(page);
  // }
  dispatch("snapshotComparision")
}

async function draw(page, context = 'baseline') {
  return new Promise((resolve, reject) => {
    const canvas = canvasReferences.value[`${page.nodeId}-${context}`]
    const baselineImage = new Image();
    baselineImage.addEventListener("load", () => {
      canvas.width = baselineImage.width;
      canvas.height = baselineImage.height;
      canvas.getContext("2d").drawImage(baselineImage, 0, 0);
    });
    let url = URL.createObjectURL(new Blob([page.baselineImage]));
        if (context === "comparision") {
          url = URL.createObjectURL(new Blob([page.comparisionImage]));
        }

        if (context === "diff") {
          url = URL.createObjectURL(new Blob([page.diffImage]));
        }

    baselineImage.src = url
    resolve();
  });
}

  onBeforeUpdate(() => {
      canvasReferences.value = [];
    });

onMounted(async () => {
   handleEvent("comparisionSnapshotsFetched", figmaData => {
      figmaData.map(pageData => {
        const page = pages.value.find(page => page.nodeId === pageData.nodeId)
        page.setComparisionImage(pageData.image)
        draw(page, 'comparision')
      })
     console.log('got comparisions', figmaData);
  });

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