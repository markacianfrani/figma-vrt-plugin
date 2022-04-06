<template>
  <div id="ui" class="h-screen flex flex-col justify-between">
    <div
      v-if="loading"
      class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center"
    >
      <div class="text-white icon icon--spinner icon--spin"></div>
      <h2 class="mt-6 text-center text-white text-xl font-semibold">Loading...</h2>
      <p class="text-center text-white">This may take a hot minute if you have a lot of pages.</p>
    </div>

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
        <button
          @click.prevent="snapshotBaseline"
          :disabled="loading"
          class="button button--secondary"
          :class="{ 'bg-green-500 text-white': !hasBaseline }"
        >{{ !hasBaseline ? 'Take Baseline Snapshot' : 'Rerun Baseline' }}</button>
        <div class="ml-auto flex items-center">
          <button
            @click.prevent="snapshotComparison"
            :disabled="loading || !hasBaseline"
            class="text-white button button--primary mr-4"
          >Take Snapshot</button>

          <button
            @click.prevent="goDiff"
            :disabled="loading || !hasBaseline || !hasComparision"
            class="text-white button button--primary"
            :class="{ 'bg-green-500': hasBaseline && hasComparision }"
          >Compare Snapshots</button>
        </div>
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
  nextTick,
  computed
} from 'vue';

const canvasReferences = ref([])
let checkedPages = reactive([])
const pageSet = reactive(new PageSet())
let pages = computed(() => {
  return pageSet.pages
})


const hasBaseline = computed(() => {
  const pagesWithBaselines = pages.value.filter(page => !page.baselineImage)
  return pagesWithBaselines.length === 0;
})

const hasComparision = computed(() => {
  const pagesWithBaselines = pages.value.filter(page => !page.comparisionImage)
  return pagesWithBaselines.length === 0;
})


const loading = ref(false)
// const hasComparision = ref(false)

dispatch("fetchPages");
async function goDiff() {
  setLoading(true)

  Promise.all(
    pages.value.map(async (page) => {
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
      page.status = "done";
      Promise.resolve()
    })
  )

  setTimeout(() => {
    setLoading(false)
  }, 0);

}

async function setLoading(value) {
  return new Promise((resolve, reject) => {
    loading.value = value
    resolve()
  })
}

async function snapshotBaseline() {
  pages.value.map(page => {
    page.status = 'Snapshotting Baselines...'
  })

  for (const page in pages.value) {
    // if (page % 2 === 0) {
      await sleep(2000)
    // }
    dispatch("snapshotBaseline", pages.value[page].nodeId)
  }
}

async function snapshotComparison() {
  pages.value.map(page => {
    page.status = 'Snapshotting Comparisions...'
  })

  for (const page in pages.value) {
    if (page % 2 === 0) {
      await sleep(1000)
    }
    dispatch("snapshotComparision", pages.value[page].nodeId)
  }

}

async function sleep(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
  handleEvent("baselineSnapshotsFetched", figmaData => {
    const page = pages.value.find(page => page.nodeId === figmaData.nodeId)
    page.setBaselineImage(figmaData.image)
    page.status = 'Baseline loaded'
    draw(page, 'baseline')
  });

  handleEvent("comparisionSnapshotsFetched", async (figmaData) => {
    const page = pages.value.find(page => page.nodeId === figmaData.nodeId)
    page.setComparisionImage(figmaData.image)
    page.status = 'Comparision loaded'
    draw(page, 'comparision')
  });

  handleEvent("pagesFetched", figmaData => {
    figmaData.map(pageData => {
      const page = new Page(pageData.name, pageData.nodeId)
      pageSet.addPage(page)
    })

  });
})

</script>
