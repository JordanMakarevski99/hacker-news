<template>
  <aside class="sidebar">
    <ul class="menu-list">
      <li
        class="menu-item"
        :class="{ active: currentCategory === '' }"
        @click="changeCategory('')"
      >
        <div class="icon-container">
          <font-awesome-icon :icon="['fas', 'globe']" class="icon" />
        </div>
        <span>All</span>
      </li>
      <li
        class="menu-item"
        :class="{ active: currentCategory === 'story' }"
        @click="changeCategory('story')"
      >
        <div class="icon-container">
          <font-awesome-icon :icon="['fas', 'fire']" class="icon" />
        </div>
        <span>Hot</span>
      </li>
      <li
        class="menu-item"
        :class="{ active: currentCategory === 'show_hn' }"
        @click="changeCategory('show_hn')"
      >
        <div class="icon-container">
          <font-awesome-icon :icon="['fas', 'eye']" class="icon" />
        </div>
        <span>Show HN</span>
      </li>
      <li
        class="menu-item"
        :class="{ active: currentCategory === 'ask_hn' }"
        @click="changeCategory('ask_hn')"
      >
        <div class="icon-container">
          <font-awesome-icon :icon="['fas', 'question']" class="icon" />
        </div>
        <span>Ask HN</span>
      </li>
      <li
        class="menu-item"
        :class="{ active: currentCategory === 'poll' }"
        @click="changeCategory('poll')"
      >
        <div class="icon-container">
          <font-awesome-icon :icon="['fas', 'poll-h']" class="icon" />
        </div>
        <span>Polls</span>
      </li>
      <li
        class="menu-item"
        :class="{ active: currentCategory === 'job' }"
        @click="changeCategory('job')"
      >
        <div class="icon-container">
          <font-awesome-icon :icon="['fas', 'briefcase']" class="icon" />
        </div>
        <span>Jobs</span>
      </li>
    </ul>
    <hr class="divider" />
    <ul class="menu-list">
      <li
        class="menu-item"
        :class="{ active: currentCategory === 'starred' }"
        @click="changeCategory('starred')"
      >
        <div class="icon-container">
          <font-awesome-icon :icon="['fas', 'star']" class="icon" />
        </div>
        <span>Starred</span>
      </li>
    </ul>
  </aside>
</template>

<script>
export default {
  name: "SideBar",
  data() {
    return {
      categories: JSON.parse(localStorage.getItem("categories")) || [
        "show_hn",
        "ask_hn",
        "story",
        "poll",
        "job",
      ],
    };
  },
  mounted() {
    this.categories = JSON.parse(localStorage.getItem("categories")) || [
      "show_hn",
      "ask_hn",
      "story",
      "poll",
      "job",
    ];
  },
  props: {
    currentCategory: String,
    isHotActive: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    changeCategory(category) {
      this.$emit("page-changed", 1);
      this.$emit("category-changed", category);

      const categories = JSON.parse(localStorage.getItem("categories")) || [
        "show_hn",
        "ask_hn",
        "story",
        "poll",
        "job",
      ];
      if (!categories.includes(category)) {
        categories.push(category);
        localStorage.setItem("categories", JSON.stringify(categories));
      }
    },
    emitSortByPoints() {
      this.$emit("sort-by-points");
    },
  },
};
</script>

<style scoped>
.sidebar {
  width: 200px !important;
  background-color: #f5f5f5;
  padding: 1rem;
  font-family: Arial, sans-serif;
  height: 100vh;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;
  color: #333;
  font-size: 1rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.icon-container {
  width: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon {
  color: #888;
  font-size: 1.2rem;
}

span {
  margin-left: 0.75rem;
}

.menu-item:hover {
  color: #007bff;
  background-color: rgba(0, 123, 255, 0.1);
}

.menu-item:hover .icon {
  color: #007bff;
}

.menu-item.active {
  color: #007bff;
  background-color: rgba(0, 123, 255, 0.1);
  font-weight: 500;
}

.menu-item.active .icon {
  color: #007bff;
}

.divider {
  margin: 1rem 0;
  border: none;
  height: 1px;
  background-color: #ccc;
}
</style>