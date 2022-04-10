<template>
	<ul class="px-xs py-2xs text-base flex items-center">
		<li @click="$emit('selectAll')" class="pr-2xs font-bold cursor-pointer">Select All</li>
		<li @click="$emit('selectNone')" class="px-2xs font-bold cursor-pointer">Select None</li>
		
	</ul>
</template>


<script setup>
</script>