<template>
  <div class="control">
    <input
      v-model="value"
      type="text"
      class="input"
      data-test="post-tag"
      placeholder="Vue.js"
    />
  </div>
  <div class="mt-1 mb-1">
    Tags:<span
      class="tag is-primary m-1"
      v-for="(tag, index) in tags"
      :key="tag"
      >{{ tag }}
      <button class="delete is-small" @click="removeTag(index)"></button>
    </span>
  </div>
  <button
    class="button is-primary is-small"
    @click="addTag"
    :disabled="disableAdd"
  >
    Add Tag
  </button>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";

export default defineComponent({
  setup() {
    const tags = ref<string[]>([]);
    const value = ref("");
    const disableAdd = computed(() => !value.value);
    const addTag = () => {
      tags.value.push(value.value);
      value.value = "";
    };
    const removeTag = (index: number) => {
      tags.value.splice(index, 1);
    };

    return {
      tags,
      value,
      addTag,
      disableAdd,
      removeTag,
    };
  },
});
</script>

<style scoped>
.m-1 {
  margin: 0.25rem;
}

.mt-1 {
  margin-top: 0.25rem;
}
.mb-1 {
  margin-bottom: 0.25rem;
}
</style>
