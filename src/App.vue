<template>
  <div id="app">
    <AppHeader @search="onSearchInput" />
    <div v-if="!isOnline" class="offline-message">
      You are currently offline. Please check your internet connection and try
      again.
    </div>
    <div class="main-content">
      <SideBar
        :currentCategory="currentCategory"
        @category-changed="onCategoryChanged"
      />
      <div class="content">
        <PostList :searchQuery="searchQuery" :category="currentCategory" />
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import PostList from "@/components/PostList.vue";
import SideBar from "@/components/SideBar.vue";
import "@fortawesome/fontawesome-free/css/all.css";

export default {
  name: "App",
  components: {
    AppHeader,
    SideBar,
    PostList,
  },
  data() {
    return {
      currentCategory: "",
      searchQuery: "",
      isOnline: true,
      currentPage: 1,
      categories: JSON.parse(localStorage.getItem("categories")) || [
        "",
        "show_hn",
        "ask_hn",
        "story",
        "poll",
        "job",
      ],
    };
  },
  created() {
    window.addEventListener("online", this.handleOnlineStatus);
    window.addEventListener("offline", this.handleOnlineStatus);
  },
  methods: {
    onCategoryChanged(category) {
      this.currentCategory = category;
      this.currentPage = 1;
      this.$emit("page-changed", this.currentPage);
    },
    onSearchInput(query) {
      this.searchQuery = query;
      this.currentPage = 1;
      this.$emit("page-changed", this.currentPage);
    },
    onPageChanged(page) {
      this.currentPage = page;
      this.$emit("page-changed", this.currentPage);
    },
    handleOnlineStatus() {
      this.isOnline = navigator.onLine;
    },
    mounted() {
      this.currentCategory = this.categories[0];
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-content {
  display: flex;
  flex: 1;
}

.content {
  max-width: 83.7% !important;
  flex: 1;
}
</style>
