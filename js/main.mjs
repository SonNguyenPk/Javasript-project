import postApi from './api/postApi.js';
import AppConstants from './appConstants.js';
import utils from './utils.js';

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
      postContent.textContent = utils.truncateTextlength(post.description, 150);
    }

    // fill Author
    const postAuthor = postItem.querySelector('#postItemAuthor');
    if (postAuthor) {
      postAuthor.textContent = post.author;
    }

    // creation date
    const postTime = postItem.querySelector('#postItemTimeSpan');
    if (postTime) {
      postTime.textContent = utils.formatDate(post.createdAt);
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
            window.location.reload();
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

const handlePagination = (currentPage, totalPage) => {
  const paginationButton = document.querySelectorAll('#postsPagination>li');
  if (!paginationButton) return;
  paginationButton[0].parentNode.removeAttribute('hidden');
  if (currentPage === 1) paginationButton[0].classList.add('d-none');
  if (currentPage === totalPage) paginationButton[4].classList.add('d-none');
  paginationButton.forEach((button, idx) => {
    // handle click page
    button.addEventListener('click', () => {
      if (idx === 0) {
        const pageLink = paginationButton[idx].querySelector('.page-link');
        const prePage = currentPage - 1;
        if (pageLink) {
          pageLink.href = `?_page=${prePage}&_limit=${AppConstants.DEFAULT_LIMIT}`;
        }
      }
      if (idx === 4) {
        const nextPage = currentPage + 1;
        const pageLink = paginationButton[idx].querySelector('.page-link');
        if (pageLink) {
          pageLink.href = `?_page=${nextPage}&_limit=${AppConstants.DEFAULT_LIMIT}`;
        }
      }
    });
  });
};

(async function () {
  try {
    const urlParam = new URLSearchParams(window.location.search);
    const param = {
      _page: urlParam.get('_page') || AppConstants.DEFAULT_PAGE,
      _limit: AppConstants.DEFAULT_LIMIT,
      _sort: 'createdAt',
      _order: 'desc',
    };
    const response = await postApi.getAll(param);
    console.log(response);
    const postList = response.data.data;
    console.log(urlParam);
    const pagination = response.data.pagination;
    const currentPage = pagination._page;
    const totalPage =
      pagination._totalRows % AppConstants.DEFAULT_LIMIT > 0
        ? Math.trunc(pagination._totalRows / AppConstants.DEFAULT_LIMIT) + 1
        : pagination._totalRows / AppConstants.DEFAULT_LIMIT;
    // hide loading
    const loading = document.querySelector('#loading');
    if (loading) {
      loading.classList.add('d-none');
    }

    //render PostList + pagination
    if (response) {
      handlePagination(currentPage, totalPage);
      renderPostList(postList);
    }
  } catch (error) {
    console.log('Fail to get post list', error);
  }
})();
