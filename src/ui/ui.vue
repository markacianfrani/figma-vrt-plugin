<template>
  <div id="ui" class="h-screen flex flex-col justify-between">
    <main class="mb-auto overflow-auto">
      <ul>
        <li v-for="page in pages" :key="page.nodeId" class="border border-b-gray-300">
          <page-item :page="page">
            <canvas
              :ref="el => { canvasReferences[`${page.nodeId}-baseline`] = el }"
              class="hidden border"
            ></canvas>
            <canvas
              :ref="el => { canvasReferences[`${page.nodeId}-comparision`] = el }"
              class="hidden border"
            ></canvas>
            <canvas
              :ref="el => { canvasReferences[`${page.nodeId}-diff`] = el }"
              class="max-w-full m-auto"
            ></canvas>
          </page-item>
        </li>
      </ul>

    </main>
    <footer class="p-6">
      <div class="flex items-center">
        <button @click="snapshotBaseline" class="button button--secondary">Baseline Snapshot</button>
        <button @click="snapshotComparison" class="button button--primary">Comparision Snapshot</button>
        <button @click="goDiff" class="button button--primary">Go Diff</button>
      </div>
    </footer>
  </div>
</template>

<script setup>
import styles from 'figma-plugin-ds/dist/figma-plugin-ds.css'
import pixelmatch from 'pixelmatch'
import { PageSet } from './model/PageSet'
import { Page } from './model/Page'
import PageItem from './components/PageItem.vue'

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

const canvasReferences = ref([])
let checkedPages = reactive([])
const pageSet = reactive(new PageSet())
let pages = computed(() => {
  return pageSet.pages
})

const loading = ref(false)



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
  dispatch("snapshotBaseline")
  // for (const pageData in pages.value) {
  //   const page = pages.value[pageData];
  //   await draw(page, 'baseline');
  // }


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

// async function setComparisions(data) {
//   return new Promise((resolve, reject) => {

//   })
// }

onMounted(async () => {
  handleEvent("baselineSnapshotsFetched", figmaData => {
    figmaData.map(pageData => {
      const page = pages.value.find(page => page.nodeId === pageData.nodeId)
      page.setBaselineImage(pageData.image)
      draw(page, 'baseline')
    })
  });
  handleEvent("comparisionSnapshotsFetched", figmaData => {
    const result = figmaData.map((pageData) => {
      const page = pages.value.find(page => page.nodeId === pageData.nodeId)
      page.setComparisionImage(pageData.image)
      draw(page, 'comparision')

    })

    // await Promise.all(result)


    goDiff()
  });

  // The following shows how messages from the main code can be handled in the UI code.
  handleEvent("pagesFetched", figmaData => {
    console.log('fig', figmaData);
    figmaData.map(pageData => {
      const page = new Page(pageData.name, pageData.nodeId)
      // page.setBaselineImage(pageData.image)
      pageSet.addPage(page)
    })
  });




})

</script>
