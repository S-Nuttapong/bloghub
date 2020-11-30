<template>
  <div>
    <div class="columns">
      <div class="column">
        <div class="field">
          <div class="label">Post Title</div>
          <div class="control">
            <input
              v-model="title"
              type="text"
              class="input"
              data-test="post-title"
            />
          </div>
          <div class="control mt-3">
            <div class="label">Post Tag</div>
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
                <button
                  class="delete is-small"
                  @click="removeTag(index)"
                ></button>
              </span>
            </div>
            <button
              class="button is-primary is-small"
              @click="addTag"
              :disabled="disableAdd"
            >
              Add Tag
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column is-one-half">
        <div
          contenteditable
          id="markdown"
          ref="contentEditable"
          @input="handleEdit"
          data-test="markdown"
        />
      </div>
      <div class="column is-one-half">
        <div v-html="html" />
      </div>
    </div>

    <div class="columns">
      <div class="column">
        <button
          @click="submit"
          class="button is-primary is-pulled-right"
          data-test="submit-post"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, computed } from "vue";
import TagSelector from "./TagSelector.vue";
import { Post } from "./types";
import { parse, MarkedOptions } from "marked";
import { highlightAuto } from "highlight.js";
import debounce from "lodash/debounce";

export default defineComponent({
  name: "PostWriter",
  props: {
    post: {
      type: Object as () => Post,
      required: true,
    },
  },

  setup(props, ctx) {
    const initPost = props.post;

    const title = ref(initPost.title);
    const contentEditable = ref<null | HTMLDivElement>(null);
    const markdown = ref(initPost.markdown);
    const html = ref("");

    const initTags = initPost.tags ? initPost.tags : [];
    const tags = ref<string[]>(initTags);

    const value = ref("");
    const disableAdd = computed(() => !value.value);
    const addTag = () => {
      tags.value.push(value.value);

      value.value = "";
    };
    const removeTag = (index: number) => {
      tags.value.splice(index, 1);
    };

    const options: MarkedOptions = {
      highlight: (code: string) => highlightAuto(code).value,
    };

    const handleEdit = () => {
      markdown.value = contentEditable.value.innerText;
    };

    const submit = () => {
      const post: Post = {
        ...initPost,
        title: title.value,
        markdown: markdown.value,
        html: html.value,
        tags: tags.value,
      };
      ctx.emit("save", post);
    };

    const update = (value: string) => {
      html.value = parse(value, options);
    };

    watch(() => markdown.value, debounce(update, 500), { immediate: true });

    onMounted(() => {
      contentEditable.value.innerText = markdown.value;
    });

    return {
      submit,
      html,
      title,
      contentEditable,
      handleEdit,
      markdown,
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
#markdown {
  white-space: pre-wrap;
}
</style>
