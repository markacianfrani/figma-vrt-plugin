<template>
  <div id="ui" class="h-screen flex flex-col justify-between">
    <div class="flex items-center">
      <tab-strip @select-all="selectAll" @select-none="selectNone"></tab-strip>
      <div class="ml-auto flex items-center pr-xs py-xs">
        <label class="mr-2 text-secondary">Threshold</label>
        <div class="input w-16">
          <input
            v-model="threshold"
            max="1"
            min="0.1"
            type="number"
            step=".10"
            class="input__field"
          />
        </div>
      </div>
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
    <footer class="p-xs">
      <div class="flex items-center">
        <button
          @click.prevent="snapshotBaseline"
          :disabled="loading || !hasSelection"
          class="button"
          :class="hasBaseline ? 'button--secondary' : 'button--primary'"
        >{{ !hasBaseline ? 'Take Baseline Snapshot' : 'Rerun Baseline' }}</button>
        <div class="m-auto flex items-center" v-if="loading">
          <div class="text-white icon icon--spinner icon--spin"></div>Loading...
          <span
            class="italic text-secondary ml-2"
          >This may take a hot minute if you have a lot of pages.</span>
        </div>
        <div class="flex items-center" :class="{ 'ml-auto': !loading }">
          <button
            @click.prevent="snapshotComparison"
            :disabled="loading || !hasBaseline || !hasSelection"
            class="text-white button button--primary mr-4"
          >Take Snapshot</button>

          <button
            @click="goDiff"
            :disabled="loading || !hasBaseline || !hasComparision || !hasSelection"
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
import TabStrip from './components/TabStrip.vue'
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
const threshold = ref(0.1)
const pageSet = reactive(new PageSet())
let pages = computed(() => {
  return pageSet.pages
})

const hasSelection = computed(() => {
  return selectedPages.value.length > 0
})

const hasBaseline = computed(() => {
  const pagesWithBaselines = selectedPages.value.filter(page => !page.baselineImage)
  return pagesWithBaselines.length === 0;
})

const hasComparision = computed(() => {
  const pagesWithBaselines = selectedPages.value.filter(page => !page.comparisionImage)
  return pagesWithBaselines.length === 0;
})


const selectedPages = computed(() => {
  return pages.value.filter(page => page.isVisible)
})

const loading = ref(false)

const diffPage = (page) => {
  return new Promise((resolve, reject) => {
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

    let diffThreshold = threshold.value
    if (threshold.value > 1) {
      diffThreshold = 1
    }
    if (threshold.value < 0) {
      diffThreshold = 0
    }
    const diffCount = pixelmatch(
      img1.data,
      img2.data,
      diff.data,
      width,
      height,
      { threshold: diffThreshold }
    );


    diffCtx.putImageData(diff, 0, 0);
    page.diffImage = diffCanvas.toDataURL();
    page.diffPercent = diffCount;
    page.status = "done";
    resolve(page)
  })

}

/**
 * Double requestAnimationFrame
 * @param {} callback 
 */
const waitForPaint = (callback) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(callback)
  })
}

dispatch("fetchPages");
const goDiff = async () => {
  loading.value = true

  waitForPaint(async () => {
    await Promise.all(
      selectedPages.value.map(async (page) => {
        await diffPage(page)
      })
    )
    loading.value = false
  })
}

const selectAll = () => {
  pages.value.map(page => page.setVisibility(true))
}

const selectNone = () => {
  pages.value.map(page => page.setVisibility(false))
}

async function setLoading(value) {
  return new Promise((resolve, reject) => {
    loading.value = value
    resolve()
  })
}

async function snapshotBaseline() {
  loading.value = true
  waitForPaint(async () => {
    selectedPages.value.map(page => {
      page.status = 'Snapshotting Baselines...'
    })
    for (const page in selectedPages.value) {
      if (page > 0 && page % 2 === 0) {
        await sleep()
      }
      dispatch("snapshotBaseline", selectedPages.value[page].nodeId)
    }
    loading.value = false
  })
}

async function snapshotComparison() {
  loading.value = true
  waitForPaint(async () => {

    selectedPages.value.map(page => {
      page.status = 'Snapshotting Comparisions...'
    })

    for (const page in selectedPages.value) {
      if (page > 0 && page % 2 === 0) {
        await sleep()
      }
      dispatch("snapshotComparision", selectedPages.value[page].nodeId)
    }
    loading.value = false
  })
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
    waitForPaint(async () => {
      await draw(page, 'comparision')
    })

  });

  handleEvent("pagesFetched", figmaData => {
    figmaData.map(pageData => {
      const page = new Page(pageData.name, pageData.nodeId)
      pageSet.addPage(page)
    })

  });
})

</script>
