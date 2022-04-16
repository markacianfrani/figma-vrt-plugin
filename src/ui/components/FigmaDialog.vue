<template>

	<dialog ref="modal" class="w-1/3 m-auto  p-4">
		<header class="flex items-center text-black font-bold  opacity-80">
			Welcome
			<div @click="close" class="icon-button ml-auto">
				<div class="icon icon--close"></div>
			</div>
		</header>

		<div class="my-4">

			whatup
		</div>
		<footer class="flex items-center">
			<div class="ml-auto flex items-center">

				<button @click="$emit('deny'); close()" class="button button--secondary mr-4">No</button>
				<button @click="$emit('accept'); close()" class="button button--primary">Yes</button>
			</div>
		</footer>
	</dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps(['open'])
const modal = ref(null)
watch(() => props.open, () => {
	if (props.open) {
		show()
	} else {
		close()
	}
})

const show = () => {
	modal.value.showModal()
}

const close = () => {
	modal.value.close()
}
</script>

<style>
dialog::backdrop {
	background: #F0F0F0;
	opacity: 80%;
}

dialog {
	border: 0.5px solid rgba(0, 0, 0, 0.2);
	box-shadow: 0px 2px 14px rgba(0, 0, 0, 0.15);
	border-radius: 2px;
}
</style>