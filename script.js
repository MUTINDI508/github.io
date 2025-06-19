document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("blog-posts");

  // List of blog post files.
  // In a real application, these might be fetched from an API or a generated list.
  const postList = [
    { id: "jekyll-installation", path: "jekyll-installation.html", title: "Jekyll Installation Guide" },
    { id: "markdown-uses", path: "markdown-uses.html", title: "Mastering Markdown: Beyond the Basics" },
    { id: "mermaid-js", path: "mermaid-js.html", title: "Visualizing Data with Mermaid.js" },
    { id: "sass", path: "sass.html", title: "Enhancing Your CSS Workflow with SASS" },
    { id: "vibe-coding", path: "vibe-coding.html", title: "The Art of Vibe Coding: Creating a Productive Environment" },
    { id: "information-architecture", path: "information-architecture.html", title: "Understanding Information Architecture for Better Websites" },
    { id: "vscode-ide-config", path: "vscode-ide-config.html", title: "Optimizing VS Code: A Developer's Configuration Guide" },
    { id: "wsl-installation", path: "wsl-installation.html", title: "Seamless Linux Integration: WSL Installation Guide" },
    { id: "wsl1-vs-wsl2", path: "wsl1-vs-wsl2.html", title: "WSL1 vs. WSL2: Choosing the Right Version for Your Workflow" }
  ];

  const postsPerPage = 3; // Number of posts per page
  let currentPage = 1;

  function displayPosts(page) {
    container.innerHTML = ''; // Clear existing posts
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const postsToDisplay = postList.slice(startIndex, endIndex);

    postsToDisplay.forEach(post => {
      fetch(post.path)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const previewContent = doc.querySelector('.post-preview').innerHTML;
          const fullContent = doc.querySelector('.post-full-content').innerHTML;

          const div = document.createElement("div");
          div.classList.add("post-card");
          div.setAttribute("data-post-id", post.id); // Add an ID for targeting

          div.innerHTML = `
            <h3>${post.title}</h3>
            <div class="preview-content">${previewContent}</div>
            <div class="full-article-content" style="display: none;">${fullContent}</div>
            <button class="button read-more-button" data-post-id="${post.id}">Read More</button>
            <button class="button go-back-button" style="display: none;">Go Back to All Posts</button>
          `;
          container.appendChild(div);

          // Add event listener for "Read More" button
          div.querySelector('.read-more-button').addEventListener('click', (event) => {
            const postId = event.target.dataset.postId;
            displayFullPost(postId);
          });

          // Add event listener for "Go Back" button
          div.querySelector('.go-back-button').addEventListener('click', () => {
            displayPosts(currentPage); // Go back to the current page of previews
            document.querySelector('.pagination').style.display = 'block'; // Show pagination
          });
        })
        .catch(err => console.error(`Failed to load ${post.path}:`, err));
    });
    updatePaginationControls();
  }

  function displayFullPost(postId) {
    const allPostCards = document.querySelectorAll('.post-card');
    allPostCards.forEach(card => {
      if (card.dataset.postId === postId) {
        card.querySelector('.preview-content').style.display = 'none';
        card.querySelector('.full-article-content').style.display = 'block';
        card.querySelector('.read-more-button').style.display = 'none';
        card.querySelector('.go-back-button').style.display = 'inline-block'; // Show "Go Back" button
      } else {
        card.style.display = 'none'; // Hide other posts
      }
    });
    document.querySelector('.pagination').style.display = 'none'; // Hide pagination when a single post is open
  }

  function updatePaginationControls() {
    const totalPages = Math.ceil(postList.length / postsPerPage);
    const paginationContainer = document.querySelector('.page-numbers');
    paginationContainer.innerHTML = ''; // Clear existing page numbers

    for (let i = 1; i <= totalPages; i++) {
      const pageLink = document.createElement('a');
      pageLink.href = '#';
      pageLink.textContent = i;
      if (i === currentPage) {
        pageLink.classList.add('current-page');
      }
      pageLink.addEventListener('click', (e) => {
        e.preventDefault();
        currentPage = i;
        displayPosts(currentPage);
      });
      paginationContainer.appendChild(pageLink);
    }

    const prevButton = document.querySelector('.prev-page');
    const nextButton = document.querySelector('.next-page');

    if (currentPage === 1) {
      prevButton.style.visibility = 'hidden';
    } else {
      prevButton.style.visibility = 'visible';
    }

    if (currentPage === totalPages) {
      nextButton.style.visibility = 'hidden';
    } else {
      nextButton.style.visibility = 'visible';
    }

    prevButton.onclick = (e) => {
      e.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        displayPosts(currentPage);
      }
    };

    nextButton.onclick = (e) => {
      e.preventDefault();
      if (currentPage < totalPages) {
        currentPage++;
        displayPosts(currentPage);
      }
    };
  }

  // Initial display of posts
  displayPosts(currentPage);
});