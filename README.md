This is a Vue.js app for browsing and searching posts on Hacker News. You can look through posts, see details, view comments, and even work offline. 

Works Offline: Can be used offline, showing posts that were loaded while online.
Post Comments: Click on posts to view comments.
Search Posts: Search by keywords and filter by popularity or date.
Favorite Posts: Favorite posts to keep them in a favorites list.
Pagination: Use next/prev buttons to go through different pages of posts.

Setup

1. Clone the Repository
git clone https://github.com/your-username/hacker-news-client.git
cd hacker-news-client

2. Install Dependencies
npm install

3. Run the App
npm run serve


Notes
API: This app uses Hacker News Algolia API for all post and comment data.
Offline Mode: It checks if we are online or offline with navigator.onLine. We can still see posts offline, but only if we loaded them before going offline.
Caching: Simple caching is used so posts do not disappear when we are offline.