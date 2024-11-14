<template>
  <header class="header">
    <div class="header-left">
      <img
        src="@/assets/hacker-news-logo.png"
        alt="Hacker News Logo"
        class="logo"
      />
      <div class="header-text">
        <span class="search-text">Search</span>
        <span class="hacker-news-text">Hacker News</span>
      </div>
    </div>
    <div class="search-bar-container">
      <div class="search-bar">
        <input
          type="text"
          class="search-input"
          placeholder="Search stories by title, URL or author"
          v-model="searchQuery"
          @input="onSearchInput"
        />
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "AppHeader",
  data() {
    return {
      searchQuery: "",
    };
  },
  methods: {
    onSearchInput() {
      this.$emit("search", this.searchQuery);
      this.$emit("page-changed", 1);
    },
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  width: 50px;
  height: auto;
  margin-right: 1rem;
}

.header-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.search-text {
  color: #888;
  font-size: 0.9rem;
}

.hacker-news-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.search-bar-container {
  display: flex;
  flex: 1;
  justify-content: center;
}

.search-bar {
  display: flex;
  align-items: center;
  border-radius: 20px;
  background-color: #f0f0f0;
  padding: 0.5rem 1rem;
  width: 100%;
  max-width: 600px;
}

.search-icon {
  color: #888;
  margin-right: 0.5rem;
}

.search-input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 1rem;
  color: #333;
  flex: 1;
  padding: 0.3rem;
  border-radius: 20px;
}

.search-input::placeholder {
  color: #888;
}
</style>
