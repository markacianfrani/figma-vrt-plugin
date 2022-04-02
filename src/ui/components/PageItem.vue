<template>
	<div class="p-2 sm:px-6">
		<div @click="toggle" class="cursor-pointer flex items-center justify-between">
			<div :class="[isOpen ? 'icon--caret-right' : 'icon--caret-down']" class="icon"></div>
			{{ page.name }}
			<span class="ml-auto">{{ page.status }}</span>

			<span v-if="page.status !== 'waiting'" :class="[ page.diffPercent > 0 ? 'bg-red-500' : 'bg-green-500']" class="py px-2 text-xxs text-white rounded">
			{{ page.diffPercent }}
			</span>
		</div>
		<div :class="{ 'hidden': isOpen }" class="border">
			<slot></slot>
		</div>
	</div>
</template>

<script setup>
import {
	defineProps,
	onMounted,
	onBeforeUpdate,
	ref,
	reactive,
	computed
} from 'vue';
import PageI from '../model/Page'

const isOpen = ref(true)

function toggle() {
	isOpen.value = !isOpen.value
}

const props = defineProps({
	page: PageI
})

</script>