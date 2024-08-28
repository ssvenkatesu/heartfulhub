// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('postForm');
    const postsContainer = document.getElementById('posts');

    // Load posts from localStorage on page load
    loadPosts();

    postForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const messageInput = document.getElementById('message');
        const photoInput = document.getElementById('photo');
        const message = messageInput.value;
        const photo = photoInput.files[0];
        
        if (photo) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const photoURL = e.target.result;
                addPost(message, photoURL);
                savePost(message, photoURL);
                postForm.reset();
            }
            reader.readAsDataURL(photo);
        }
    });

    function addPost(message, photoURL) {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        
        const imgElement = document.createElement('img');
        imgElement.src = photoURL;
        
        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        
        postElement.appendChild(imgElement);
        postElement.appendChild(messageElement);
        
        postsContainer.appendChild(postElement);
    }

    function savePost(message, photoURL) {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.push({ message, photoURL });
        localStorage.setItem('posts', JSON.stringify(posts));
    }

    function loadPosts() {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.forEach(post => addPost(post.message, post.photoURL));
    }
});
