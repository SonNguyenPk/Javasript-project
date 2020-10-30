import postApi from './api/postApi.js';
import AppConstants from './appConstants.js';

const renderPostList = (postList) => {
  const ulElement = document.querySelector('#postsList');

  // fill data in postItem
  postList.forEach((post, idx) => {
    // clone template post
    const templateElement = document.querySelector('#postItemTemplate');
    if (!templateElement) return;

    const postTemplate = templateElement.content.querySelector('li');
    const postItem = postTemplate.cloneNode(true);
    console.log(postItem);

    // fill data into template
    // fill image
    const postImage = postItem.querySelector('#postItemImage');
    if (postImage) {
      postImage.src = post.imageUrl;
    }

    // fill title
    const postTitle = postItem.querySelector('#postItemTitle');
    if (postTitle) {
      postTitle.textContent = post.title;
    }

    // fill description
    const postContent = postItem.querySelector('#postItemDescription');
    if (postContent) {
      postContent.textContent = post.description;
    }

    // fill Author
    const postAuthor = postItem.querySelector('#postItemAuthor');
    if (postAuthor) {
      postAuthor.textContent = post.author;
    }

    // add click post to move to detail page
    const divPostItem = postItem.querySelector('#postItem');
    if (divPostItem) {
      divPostItem.addEventListener('click', () => {
        window.location = `/post-detail.html?id=${post.id}`;
      });
    }

    // add click icon to move to edit pages
    const editPostIcon = postItem.querySelector('#postItemEdit');
    if (editPostIcon) {
      editPostIcon.addEventListener('click', (e) => {
        e.stopPropagation();

        window.location = `/add-edit-post.html?id=${post.id}`;
      });
    }

    // add click icon to remove post from
    const removePostIcon = postItem.querySelector('#postItemRemove');
    if (removePostIcon) {
      removePostIcon.addEventListener('click', async (e) => {
        e.stopPropagation();

        const message = `Are you sure to remove ${post.title}?`;

        if (window.confirm(message)) {
          try {
            await postApi.remove(post.id);

            postItem.remove();
          } catch (error) {
            alert(`Fail to remove ${post.title}`);

            console.log(error);
          }
        }
      });
    }

    // append postItem to postList
    ulElement.appendChild(postItem);
  });
};

// pagination
const handleClickPage = (totalPost) => {
  const countPage = totalPost / AppConstants.DEFAULT_LIMIT;
  let totalPage =
    totalPost % AppConstants.DEFAULT_LIMIT > 0 ? Math.trunc(countPage) + 1 : countPage;
  console.log(totalPage);
  const currentPage = new URLSearchParams(window.location.search);
  console.log(currentPage);
  //   const nextPageIcons = document.querySelector('#postPagination>li:last-child');
  //   if (currentPage < totalPage || nextPageIcons) {
  //     nextPageIcons.addEventListener('click', () => {});
  //   }
};

(async function () {
  try {
    const params = {
      _page: AppConstants.DEFAULT_PAGE,
      _limit: AppConstants.DEFAULT_LIMIT,
    };

    const response = await postApi.getAll(params);
    const dataResponse = response.data;
    const postList = dataResponse.data;
    const totalPost = dataResponse.pagination._totalRows;
    console.log(postList);
    console.log(totalPost);

    // hide loading
    const loading = document.querySelector('#loading');
    if (loading) {
      loading.classList.add('d-none');
    }
    //render PostList
    renderPostList(postList);

    handleClickPage(totalPost);
  } catch (error) {
    console.log('Fail to get post list', error);
  }
})();
