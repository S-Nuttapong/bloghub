

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

