

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
