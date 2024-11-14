<template>
  <div class="post-list">
    <div class="filter-container">
      <span class="main-filter">{{ categoryDisplayName }}</span>

      <div v-if="category !== 'starred' && category !== 'story'">
        <span class="small-text">Sort by</span>
        <select
          v-model="selectedSort"
          class="dropdown"
          @change="onFilterChange"
        >
          <option value="points">Popularity</option>
          <option value="created_at">Date</option>
        </select>
      </div>

      <span class="small-text" v-if="category !== 'starred'">for</span>
      <select
        v-if="category !== 'starred'"
        v-model="selectedTime"
        class="dropdown"
        @change="onFilterChange"
      >
        <option value="24h">Last 24h</option>
        <option value="week">Last Week</option>
        <option value="month">Last Month</option>
      </select>

      <span class="small-text">Posts per page</span>
      <select
        v-model="hitsPerPage"
        class="dropdown"
        @change="onHitsPerPageChange"
      >
        <option
          v-for="option in hitsPerPageOptions"
          :key="option"
          :value="option"
        >
          {{ option }}
        </option>
      </select>

      <div class="results-info">
        <span class="results-count">
          <i class="fas fa-search"></i>
          {{ numberOfResults }} results
        </span>
        <span class="query-time">
          <i class="fas fa-stopwatch"></i>
          {{ formattedQueryTime }} seconds
        </span>
      </div>
    </div>

    <div v-if="posts.length > 0">
      <div
        class="post-item"
        v-for="post in displayedPosts"
        :key="post.objectID"
      >
        <h3 class="post-title">
          <a :href="post.url" target="_blank" class="title-link">{{
            post.title
          }}</a>
          <i
            class="fas fa-star star-icon"
            :class="{ starred: isStarred(post.objectID) }"
            @click.stop="toggleStar(post.objectID)"
          ></i>
        </h3>

        <div class="post-meta">
          <div class="post-meta-item">
            <i class="fas fa-heart"></i>
            <span>{{ post.points }} points</span>
          </div>
          <div class="post-meta-item">
            <i class="fas fa-user"></i>
            <span>{{ post.author }}</span>
          </div>
          <div class="post-meta-item">
            <i class="fas fa-clock"></i>
            <span>{{ formatTime(post.created_at) }} ago</span>
          </div>
          <div class="post-meta-item" @click="fetchComments(post.objectID)">
            <i class="fas fa-comment"></i>
            <span class="comments">{{ post.num_comments }} comments</span>
          </div>
          <div class="post-meta-item">
            <i class="fas fa-link"></i>
            <a :href="post.url" target="_blank" class="read-more">
              {{ extractDomain(post.url) }}
            </a>
          </div>
        </div>

        <div v-if="selectedPost === post.objectID" class="comments-section">
          <div class="comments-header">
            <h4>Comments ({{ postComments.length }})</h4>
            <button class="close-comments" @click="selectedPost = null">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="comments-container">
            <div
              v-for="comment in postComments"
              :key="comment.id"
              class="comment"
            >
              <div class="comment-header">
                <div class="commenter-char">
                  {{ comment.author[0].toUpperCase() }}
                </div>
                <div class="commenter-info">
                  <span class="commenter-name">{{ comment.author }}</span>
                  <span class="comment-time" v-if="comment.created_at">
                    {{ formatTime(comment.created_at) }} ago
                  </span>
                </div>
              </div>
              <div class="comment-content">
                <p v-html="formatTextWithLinks(comment.text)"></p>
              </div>
              <button
                v-if="comment.children.length > 0"
                @click="toggleNestedComments(comment.id)"
                class="show-hide-replies-btn"
              >
                <i
                  :class="{
                    'fas fa-chevron-down': !comment.showNested,
                    'fas fa-chevron-up': comment.showNested,
                  }"
                ></i>
                {{ comment.showNested ? "Hide Replies" : "Show Replies" }}
              </button>

              <div v-if="comment.showNested" class="nested-comments">
                <NestedComments
                  :comments="comment.children"
                  :format-time="formatTime"
                  :format-text="formatTextWithLinks"
                />
              </div>
            </div>

            <div v-if="postComments.length === 0" class="no-comments">
              <i class="fas fa-comments"></i>
              <p>No comments yet</p>
            </div>
          </div>
        </div>
      </div>

      <div class="pagination-container">
        <button
          class="pagination-button"
          :disabled="currentPage === 1"
          @click="changePage(1)"
        >
          First
        </button>

        <button
          class="pagination-button"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          <i class="fas fa-arrow-left"></i> Prev
        </button>

        <span class="pagination-info"
          >Page {{ currentPage }} of {{ totalPages }}</span
        >

        <button
          class="pagination-button"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          Next <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>

    <div v-else>
      <p>No posts found.</p>
    </div>
  </div>
</template>


<script>
import apiService from "@/services/apiService";
import NestedComments from "./NestedComments.vue";
export default {
  components: {
    NestedComments,
  },
  name: "PostList",
  data() {
    return {
      posts: [],
      selectedTag: "",
      selectedSort: "points",
      selectedTime: "24h",
      hitsPerPageOptions: [5, 10, 20],
      hitsPerPage: 10,
      currentPage: 1,
      numberOfResults: 0,
      queryTime: 0,
      postComments: [],
      selectedPost: null,
      starredPostsData:
        JSON.parse(localStorage.getItem("starredPostsData")) || [],
    };
  },
  computed: {
    formattedQueryTime() {
      return (this.queryTime / 1000).toFixed(3);
    },
    categoryDisplayName() {
      switch (this.category) {
        case "show_hn":
          return "Show HN";
        case "ask_hn":
          return "Ask HN";
        case "story":
          return "Hot Stories";
        case "job":
          return "Jobs";
        case "poll":
          return "Polls";
        case "starred":
          return "Starred Posts";
        case "":
          return "All posts";
        default:
          return this.currentCategory;
      }
    },
    displayedPosts() {
      if (this.category === "starred") {
        const start = (this.currentPage - 1) * this.hitsPerPage;
        const end = start + this.hitsPerPage;
        return this.starredPostsData.slice(start, end);
      }
      return this.posts;
    },
    totalPages() {
      const totalItems =
        this.category === "starred"
          ? this.starredPostsData.length
          : this.numberOfResults;
      return Math.ceil(totalItems / this.hitsPerPage);
    },
  },
  props: {
    category: String,
    searchQuery: String,
  },
  watch: {
    category(newCategory) {
      this.currentPage = 1;
      if (newCategory === "starred") {
        this.numberOfResults = this.starredPostsData.length;
      } else {
        this.selectedTag = newCategory;
        this.fetchPosts();
      }
    },
    searchQuery() {
      this.currentPage = 1;
      this.fetchPosts();
    },
  },
  methods: {
    isStarred(postID) {
      return this.starredPostsData.some((post) => post.objectID === postID);
    },
    toggleStar(postID) {
      const postIndex = this.starredPostsData.findIndex(
        (p) => p.objectID === postID
      );

      if (postIndex === -1) {
        const postToStar = this.posts.find((p) => p.objectID === postID);
        if (postToStar) {
          this.starredPostsData.push(postToStar);
        }
      } else {
        this.starredPostsData.splice(postIndex, 1);
      }

      localStorage.setItem(
        "starredPostsData",
        JSON.stringify(this.starredPostsData)
      );

      if (this.category === "starred") {
        this.numberOfResults = this.starredPostsData.length;
      }
    },
    extractDomain(url) {
      try {
        const parsedUrl = new URL(url);
        return parsedUrl.hostname.replace("www.", "");
      } catch (error) {
        return "";
      }
    },
    formatTime(createdAt) {
      const now = new Date();
      const timeDiff = now - new Date(createdAt);
      const seconds = Math.floor(timeDiff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) return `${days} day${days > 1 ? "s" : ""}`;
      if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
      if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""}`;
      return `${seconds} second${seconds > 1 ? "s" : ""}`;
    },
    async fetchPosts() {
      if (this.category === "starred") {
        this.numberOfResults = this.starredPostsData.length;
        return;
      }

      const query = this.searchQuery || this.category;
      const sortBy = this.selectedSort;
      const timeFilter = this.selectedTime;
      const page = this.currentPage - 1;
      const hitsPerPage = this.hitsPerPage;

      try {
        if (navigator.onLine) {
          const startTime = Date.now();
          const data = await apiService.fetchPostsOnline(
            query,
            sortBy,
            timeFilter,
            page,
            hitsPerPage
          );

          this.posts = data.hits;
          this.numberOfResults = data.nbHits;
          this.queryTime = Date.now() - startTime;

          localStorage.setItem(`posts-${query}`, JSON.stringify(data));
        } else {
          const cachedData = JSON.parse(localStorage.getItem(`posts-${query}`));

          if (cachedData) {
            this.posts = cachedData.hits;
            this.numberOfResults = cachedData.nbHits;
          } else {
            this.posts = [];
            this.numberOfResults = 0;
            console.error("Offline data not found.");
          }
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    },
    async fetchComments(postId) {
      if (this.selectedPost === postId) {
        this.selectedPost = null;
        this.postComments = [];
      } else {
        try {
          this.selectedPost = postId;
          const comments = await apiService.fetchComments(postId);
          this.postComments = comments;
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      }
    },
    toggleNestedComments(commentId) {
      const comment = this.postComments.find((c) => c.id === commentId);
      if (comment) {
        comment.showNested = !comment.showNested;
      }
    },
    formatTextWithLinks(text) {
      const urlPattern = /https?:\/\/[^\s]+/g;
      return text.replace(urlPattern, (url) => {
        return `<a href="${url}" target="_blank" class="comment-link">${url}</a>`;
      });
    },
    onFilterChange() {
      this.currentPage = 1;
      this.fetchPosts();
    },
    onHitsPerPageChange() {
      this.currentPage = 1;
      this.fetchPosts();
    },
    changePage(newPage) {
      if (newPage < 1 || newPage > this.totalPages) return;
      this.currentPage = newPage;
      this.fetchPosts();
    },
  },
  async mounted() {
    await this.fetchPosts();
  },
};
</script>

<style scoped>
.show-hide-replies-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.show-hide-replies-btn i {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.show-hide-replies-btn:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.show-hide-replies-btn:active {
  transform: scale(0.97);
}

.show-hide-replies-btn span {
  margin-left: 4px;
}

.comments:hover {
  cursor: pointer;
  color: blue;
}

.star-icon {
  font-size: 1.5rem;
  color: #ccc;
  cursor: pointer;
  margin-left: 0.5rem;
}
.star-icon.starred {
  color: #ffd700;
}

.results-info {
  display: flex;
  justify-content: space-between;
  padding: 10px 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  font-size: 1rem;
  margin-left: auto;
  color: #333;
}

.results-info span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.results-count,
.query-time {
  color: #555;
}

.results-info i {
  font-size: 1.2rem;
  color: #007bff;
}

.results-count {
  font-weight: 600;
}

.query-time {
  font-style: italic;
}

.filter-container {
  background-color: #f9f9f9;
  padding: 20px 0;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  border-top: 1px solid gray;
  border-bottom: 1px solid gray;
  flex-wrap: wrap;
}

.main-filter {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-right: 0.5rem;
}

.small-text {
  font-size: 0.9rem;
  color: #777;
  margin: 0 0.5rem;
}

.dropdown {
  font-size: 1rem;
  padding: 0.3rem 0.5rem;
  margin-right: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
}

.post-item {
  margin-bottom: 1rem;
  border-bottom: 1px solid #ddd;
  padding: 0 1rem 1rem 1rem;
}

.query-time {
  margin-left: 1rem;
}

.post-item h3 {
  font-size: 1.2rem;
  color: #333;
}

.post-meta {
  display: flex;
  font-size: 0.9rem;
  color: #555;
  flex-wrap: wrap;
}

.post-meta-item {
  display: flex;
  align-items: center;
  margin-left: 8px;
}

.post-meta-item i {
  margin-right: 0.3rem;
  color: #666;
}

.post-meta-item a {
  color: #007bff;
  text-decoration: none;
}

.post-meta-item a:hover {
  text-decoration: underline;
}

.commenter-char {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  flex-shrink: 0;
  background-color: #42b883;
}

.post-title {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title-link {
  color: #2c3e50;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.title-link:hover {
  color: #42b883;
  text-decoration: none;
}

.comments-section {
  margin-top: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.comments-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.close-comments {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s ease;
}

.close-comments:hover {
  color: #dc3545;
}

.comments-container {
  max-height: 500px;
  overflow-y: auto;
  padding: 1rem;
}

.comment {
  margin-bottom: 1.5rem;
  background-color: white;
  border-radius: 6px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.8rem;
}

.commenter-char {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  flex-shrink: 0;
}

.commenter-info {
  margin-left: 0.8rem;
  display: flex;
  flex-direction: column;
}

.commenter-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}

.comment-time {
  color: #6c757d;
  font-size: 0.8rem;
  margin-top: 0.2rem;
}

.comment-content {
  color: #4a5568;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-left: calc(36px + 0.8rem);
}

.comment-content p {
  margin: 0;
  white-space: pre-wrap;
}

.comment-link {
  color: #42b883;
  text-decoration: none;
  word-break: break-word;
}

.comment-link:hover {
  text-decoration: underline;
}

.no-comments {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  color: #6c757d;
}

.no-comments i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.no-comments p {
  margin: 0;
  font-size: 1rem;
}

.comments-container::-webkit-scrollbar {
  width: 8px;
}

.comments-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.comments-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.comments-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
}

.pagination-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.pagination-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 0.9rem;
  color: #555;
}

@media (max-width: 768px) {
  .filter-container {
    flex-direction: column;
    align-items: flex-start;
  }

  .main-filter {
    margin-bottom: 0.5rem;
  }

  .results-info {
    margin-left: 0;
    margin-top: 0.5rem;
  }

  .post-meta {
    flex-direction: column;
    align-items: flex-start;
  }

  .post-meta-item {
    margin-left: 0;
    margin-top: 0.3rem;
  }

  .pagination-container {
    flex-direction: column;
  }

  .pagination-button {
    margin: 0.3rem 0;
  }
}
.comment-thread {
  margin-bottom: 1.5rem;
}
</style>
