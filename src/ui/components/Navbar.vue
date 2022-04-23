<template>
	<div class="text-base border-b border-gray-400">
		<ul class="flex items-center">
			<li @click="$emit('selectPage', 'home')" class="p-2xs cursor-pointer hover:text-black hover:font-bold"
				:class="[currentPage === 'home' ? 'font-bold text-black' : 'text-gray-400']">
				Home
			</li>
			<li @click="$emit('selectPage', 'settings')"
				class="ml-auto p-2xs flex items-center cursor-pointer hover:text-black hover:font-bold"
				:class="[currentPage === 'settings' ? 'font-bold text-black' : 'text-gray-400']">
				<div class="icon icon--settings"
					:class="[currentPage === 'settings' ? 'icon--black' : 'icon--black3']"></div>
				Settings
			</li>
		</ul>
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

const emit = defineEmits(['selectPage'])
const isOpen = ref(false)

function toggle() {
	isOpen.value = !isOpen.value
}


const props = defineProps({
	currentPage: {
		type: String,
		default() { return 'home' }
	}
})

</script>