<template>
  <PostWriter :post="post" @save="save" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PostWriter from "./PostWriter.vue";
import { Post } from "./types";
import moment = require("moment");
import { useStore } from "./store";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "NewPost",

  components: {
    PostWriter,
  },

  setup() {
    const store = useStore();
    const router = useRouter();
    const authorId = parseInt(store.getState().authors.currentUserId!, 10);
    const authorName = authorId
      ? store.getState().authors.all[authorId].username
      : undefined;

    const post: Post = {
      id: -1,
      title: "New Post",
      markdown: "## New Post\nEnter your post here...",
      html: "",
      created: moment(),
      authorId,
      authorName,
    };

    const save = async (post: Post) => {
      await store.createPost(post);
      router.push("/");
    };

    return {
      post,
      save,
    };
  },
});
</script>
