<template>
<ul class="h-lg text-base flex items-center pl-xs">
	<li @click="$emit('selectAll')" class="pr-2xs font-bold">Select All</li>
	<li @click="$emit('selectNone')" class="px-2xs font-bold cursor-pointer">Select None</li>
</ul>

</template>


<script setup>
</script>