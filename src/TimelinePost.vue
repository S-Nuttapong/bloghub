<template>
  <router-link :to="to" data-test="post" class="panel-block columns">
    <div class="column">
      <a>{{ post.title }}</a>
      <div>
        {{ post.created.format("Do MMM") }}
        <span class="has-text-grey is-size-7">{{
          post.authorName ? `by ${post.authorName}` : ``
        }}</span>
      </div>
    </div>
    <div class="column has-text-right">
      <div><br />Tags: #A #B #C</div>
    </div>
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Post } from "./types";

export default defineComponent({
  props: {
    post: {
      type: Object as () => Post,
      required: true,
    },
  },

  setup(props) {
    return {
      to: `/posts/${props.post.id}`,
    };
  },
});
</script>
