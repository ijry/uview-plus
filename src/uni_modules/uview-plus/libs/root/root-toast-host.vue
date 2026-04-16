<template>
  <up-toast ref="upGlobalToastRef" />
  <up-notify ref="upGlobalNotifyRef" />
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const upGlobalToastRef = ref(null)
const upGlobalNotifyRef = ref(null)

onMounted(() => {
  if (typeof uni === 'undefined' || !uni.$u) return
  if (typeof uni.$u.setRootToastRef === 'function') {
    uni.$u.setRootToastRef(upGlobalToastRef.value)
  }
  if (typeof uni.$u.setRootNotifyRef === 'function') {
    uni.$u.setRootNotifyRef(upGlobalNotifyRef.value)
  }
})

onBeforeUnmount(() => {
  if (typeof uni === 'undefined' || !uni.$u) return
  if (typeof uni.$u.setRootToastRef === 'function') {
    uni.$u.setRootToastRef(null)
  }
  if (typeof uni.$u.setRootNotifyRef === 'function') {
    uni.$u.setRootNotifyRef(null)
  }
})
</script>
