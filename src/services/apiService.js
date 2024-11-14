import axios from 'axios';

const API_URL = 'https://hn.algolia.com/api/v1/';

export default {
    async fetchPostsOnline(query, sortBy, timeFilter, page = 0, hitsPerPage = 10) {
        let url;

        if (this.isCategory(query)) {
            url = `${API_URL}search?tags=${encodeURIComponent(query)}&page=${page}&hitsPerPage=${hitsPerPage}`;
        } else {
            url = `${API_URL}search?query=${encodeURIComponent(query)}&page=${page}&hitsPerPage=${hitsPerPage}`;
        }

        if (sortBy === 'created_at') {
            url = `${API_URL}search_by_date?query=${encodeURIComponent(query)}&page=${page}&hitsPerPage=${hitsPerPage}`;
        }

        if (timeFilter === '24h') {
            url += `&numericFilters=created_at_i>${Math.floor(Date.now() / 1000) - 86400}`;
        } else if (timeFilter === 'week') {
            url += `&numericFilters=created_at_i>${Math.floor(Date.now() / 1000) - 604800}`;
        } else if (timeFilter === 'month') {
            url += `&numericFilters=created_at_i>${Math.floor(Date.now() / 1000) - 2592000}`;
        }

        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
    },
    async fetchPosts(query, sortBy, timeFilter, page = 0, hitsPerPage = 10) {
        if (navigator.onLine) {
            return this.fetchPostsOnline(query, sortBy, timeFilter, page, hitsPerPage);
        } else {
            return this.fetchPostsOffline(query);
        }
    },

    isCategory(query) {
        const categories = ['show_hn', 'ask_hn', 'story', 'poll', 'job'];
        return categories.includes(query.toLowerCase());
    },

    async fetchPostById(id) {
        try {
            const response = await fetch(`http://hn.algolia.com/api/v1/items/${id}`);
            if (!response.ok) {
                throw new Error('Post not found');
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching post ${id}:`, error);
            return null;
        }
    },

    async fetchComments(postId) {
        try {
            const response = await axios.get(`${API_URL}items/${postId}`);

            return response.data.children || [];

        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }
    },
};
