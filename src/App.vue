<template>
  <div id="nav">
    {{ getModel() }}
    <router-link to="/">Home</router-link>
    |
    <router-link to="/about">About</router-link>
  </div>
  <button @click="handleClick">update name</button>
  <router-view/>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup () {
    const model = ref<string>('macbook air')
    const bg = ref<string>('red')

    function handleClick (): void {
      model.value = 'macbook pro'
    }

    function getModel (): string {
      return model.value.toUpperCase()
    }

    return {
      bg,
      handleClick,
      getModel
    }
  }
})
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  background: v-bind('bg');
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
