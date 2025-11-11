<script setup>
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  variant: { type: String, default: 'default' },
  size: { type: String, default: 'default' },
  disabled: { type: Boolean, default: false },
  type: { type: String, default: 'button' }
})

const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'

const variantClasses = computed(() => ({
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline: 'border border-primary text-primary bg-transparent hover:bg-primary/10',
  ghost: 'hover:bg-primary/10 hover:text-primary',
  link: 'underline-offset-4 hover:underline text-primary'
}[props.variant] || 'bg-primary text-primary-foreground hover:bg-primary/90'))

const sizeClasses = computed(() => ({
  default: 'h-10 px-4 py-2',
  sm: 'h-9 px-3 rounded-md',
  lg: 'h-11 px-8 rounded-md',
  icon: 'h-10 w-10'
}[props.size] || 'h-10 px-4 py-2'))

const classes = computed(() => cn(baseClasses, variantClasses.value, sizeClasses.value))
</script>

<template>
  <button :type="props.type" :disabled="props.disabled" :class="classes">
    <slot />
  </button>
  
</template>