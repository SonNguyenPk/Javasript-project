import utils from './utils.js';
import postApi from './api/postApi.js';

const renderPostItem = (postItem) => {
  if (!postItem) return;
  utils.setBackgroundImageByElementId('postHeroImage', postItem.imageUrl);

  const postItemTitle = document.querySelector('#postDetailTitle');
  if (postItemTitle) {
    postItemTitle.textContent = postItem.title;
  }

  const postItemAuthor = document.querySelector('#postDetailAuthor');
  if (postItemAuthor) {
    postItemAuthor.textContent = postItem.author;
  }

  const postItemTimeSpan = document.querySelector('#postDetailTimeSpan');
  if (postItemTimeSpan) {
    postItemTimeSpan.textContent = utils.formatDate(postItem.createdAt);
  }
};

(async function () {
  try {
    const urlParam = new URLSearchParams(window.location.search);
    const postId = urlParam.get('id');
    const response = await postApi.get(postId);
    const postItem = response.data;

    // add click to go to edit page
    const goToEditPostPage = document.querySelector('#goToEditPageLink');
    if (goToEditPostPage) {
      goToEditPostPage.addEventListener('click', () => {
        goToEditPostPage.href = `/add-edit-post.html?id=${postId}`;
      });
    }

    renderPostItem(postItem);
  } catch (error) {
    console.log('There are something wrong!', error);
  }
})();
