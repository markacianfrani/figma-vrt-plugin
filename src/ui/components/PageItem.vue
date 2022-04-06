<template>
	<div class>
		<div @click="toggle" class="cursor-pointer flex items-center text-xxs">
			<div :class="[!isOpen ? 'icon--caret-right' : 'icon--caret-down']" class="icon"></div>
			{{ page.name }}
			<div class="ml-auto mr-4">
				<span v-if="page.status !== 'done'" class="text-gray-400">{{ page.status }}</span>
				<span
					v-if="page.status === 'done'"
					:class="[page.diffPercent > 0 ? 'bg-red-500' : 'bg-green-500']"
					class="py px-2 text-xxs text-white rounded"
				>{{ page.diffPercent > 0 ? 'FAIL' : 'PASS' }}</span>
			</div>
		</div>
		<div :class="{ 'hidden': !isOpen }" class>
			<p
				v-if="page.status !== 'done'"
				class="text-center text-gray-600 p-4"
			>Go forth and take a comparision snapshot. If there are any regressions, they will be displayed here.</p>

			<p
				v-if="page.status === 'done' && page.diffPercent === 0"
				class="text-center text-gray-600 p-4"
			>Everything looks good!</p>
			<div :class="{ 'hidden': (page.status !== 'done' && page.diffPercent >= 0) }" class="p-4">
				<slot></slot>
			</div>
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
	useSlots,
	computed
} from 'vue';
import { PageI } from '../model/Page'

const isOpen = ref(false)

function toggle() {
	isOpen.value = !isOpen.value
}

const props = defineProps({
	page: PageI
})

</script>