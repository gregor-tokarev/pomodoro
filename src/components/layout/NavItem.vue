<template>
  <div class="nav-item" :class="{'nav-item--active': props.isActive}">
    <AppIcon
      class="nav-item__icon"
      :icon-name="props.navItem.iconName"
      :color="props.isActive ? Colors.ACCENT_MAIN : Colors.GRAY_400"
    ></AppIcon>
    <div class="basic-text nav-item__text">{{ props.navItem.name }}</div>

    <div class="nav-item__right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { INavItem } from '../../../models/nav-item.model'
import AppIcon from '@/components/UI/AppIcon.vue'
import { Colors } from '@/assets/ts/UI/colors'

interface Props {
  navItem: INavItem,
  isActive: boolean
}

const props = defineProps<Props>()
</script>

<style scoped lang="scss">
.nav-item {
  display: flex;
  align-items: center;
  height: 68px;
  padding: 0 15px;
  cursor: pointer;
  border-radius: 20px;

  &--active {
    background-color: $accent-light;

    .nav-item__text {
      color: $accent-main;
    }

    .nav-item__icon {
      :slotted(.icon) :deep(path) {
        fill: $accent-main;
      }
    }

  }

  &__icon {
    margin-right: 10px;
  }

  &__text {
    color: $gray-400;
  }

  &__right {
    margin-left: auto;
  }
}
</style>
