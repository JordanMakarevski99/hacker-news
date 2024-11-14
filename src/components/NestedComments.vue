<template>
  <div class="nested-comments-container">
    <div v-for="comment in comments" :key="comment.id" class="comment-thread">
      <div class="comment">
        <div class="comment-header">
          <div class="commenter-char">
            {{ comment.author ? comment.author[0].toUpperCase() : "?" }}
          </div>
          <div class="commenter-info">
            <span class="commenter-name">{{
              comment.author || "Anonymous"
            }}</span>
            <span class="comment-time" v-if="comment.created_at">
              {{ formatTime(comment.created_at) }} ago
            </span>
          </div>
        </div>
        <div class="comment-content">
          <p v-html="formatText(comment.text || '')"></p>
        </div>
      </div>

      <div
        v-if="comment.children && comment.children.length > 0"
        class="nested-comments"
      >
        <nested-comments
          :comments="comment.children"
          :format-time="formatTime"
          :format-text="formatText"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NestedComments",
  props: {
    comments: {
      type: Array,
      required: true,
    },
    formatTime: {
      type: Function,
      required: true,
    },
    formatText: {
      type: Function,
      required: true,
    },
  },
};
</script>
<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
}

.nested-comments {
  margin-left: 2rem;
  margin-top: 1rem;
  padding-left: 1.5rem;
  border-left: 3px solid #e0e0e0;
  background-color: #f1f3f5;
  border-radius: 8px;
}
.nested-comments .comment:first-child {
  background-color: #f8f9fa;
  border-left: 4px solid #007bff;
  padding: 1rem 1.5rem;
}

.nested-comments .comment:first-child .comment-content {
  margin-left: calc(36px + 1rem);
}

.nested-comments .comment:first-child:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}
.nested-comments .comment {
  max-width: 100%;
  width: 100%;
  margin-bottom: 1rem;
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.nested-comments .comment:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
}

.nested-comments .comment:last-child {
  margin-bottom: 0;
}

.nested-comments .commenter-char {
  width: 40px;
  height: 40px;
  font-size: 1.1rem;
  background-color: #495057;
  color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  flex-shrink: 0;
}

.nested-comments .commenter-info {
  margin-left: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.nested-comments .commenter-name {
  font-weight: 600;
  color: #343a40;
  font-size: 1rem;
}

.nested-comments .comment-time {
  color: #868e96;
  font-size: 0.85rem;
  margin-top: 0.2rem;
}

.nested-comments .comment-content {
  margin-left: calc(40px + 1rem);
  color: #495057;
  font-size: 1rem;
  line-height: 1.6;
}

.nested-comments .comment-content p {
  margin: 0;
  word-break: break-word;
  overflow-wrap: break-word;
}

@media (max-width: 768px) {
  .nested-comments {
    margin-left: 1.5rem;
    padding-left: 1rem;
  }

  .nested-comments .comment-content {
    margin-left: calc(36px + 1rem);
  }

  .nested-comments .commenter-char {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
}
</style>
