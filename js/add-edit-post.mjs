import postApi from './api/postApi.js';
import utils from './utils.js';
import AppConstants from './appConstants.js';

// set form value
const setFormValue = (postItem) => {
  if (!postItem) return;
  const formPost = document.querySelector('#postForm');
  if (!postForm) return;

  // set background image
  utils.setBackgroundImageByElementId('postHeroImage', postItem.imageUrl);

  // set title values
  utils.setValueByElementId('postTitle', postItem.title);

  // set author
  utils.setValueByElementId('postAuthor', postItem.author);

  // set Descriptions
  utils.setValueByElementId('postDescription', postItem.description);
};

// add click event for change background image
const handleClickChangeImage = () => {
  const numberIdRandom = Math.trunc(Math.random() * 1000);
  const urlRandom = `url(https://picsum.photos/id/${numberIdRandom}/${AppConstants.DEFAULT_IMAGE_WIDTH}/${AppConstants.DEFAULT_IMAGE_HEIGHT})`;
  console.log(urlRandom);
  const backgroundImage = document.querySelector('#postHeroImage');
  backgroundImage.style.backgroundImage = urlRandom;
};

// get form values from
const getFormsValue = (formPost) => {
  const formValues = {};
  if (formPost) {
    formValues.title = utils.getValueByElementId('postTitle');

    formValues.author = utils.getValueByElementId('postAuthor');

    formValues.description = utils.getValueByElementId('postDescription');

    formValues.imageUrl = utils.getBackgroundImageByElementId('postHeroImage');
  }
  return formValues;
};

// check form values
const validateFormValues = (formValues) => {
  if (!formValues) return false;
  //   const formPost = document.querySelector('#postForm');

  let isValidForm = true;
  // check title whether is empty or not
  const isValidTile = !formValues.title ? false : true;
  if (!isValidTile) {
    isValidForm = false;
    console.log('chua dien title');
  }

  // check author  whether is empty or not
  const isValidAuthor = !formValues.author ? false : true;
  if (!isValidAuthor) isValidForm = false;

  // check description whether is empty or not
  const isValidDescription = !formValues.description ? false : true;
  if (!isValidDescription) {
    isValidForm = false;
    console.log('Description is empty');
  }

  // check background
  const isValidBackground = !formValues.imageUrl ? false : true;
  if (!isValidBackground) {
    isValidForm = false;
    alert('you have yet taken a pic for your post');
  }

  return isValidForm;
};

// check whether is edit mode or not?
const isEditMode = (postId) => {
  if (postId) return true;
  return false;
};

// submit form changes
const handleSubmit = async (e) => {
  e.preventDefault();

  const formPost = e.target.parentNode.parentNode;
  console.log(formPost);
  const formValues = getFormsValue(formPost);

  const isValid = validateFormValues(formValues);
  // check form is valid
  if (!isValid) {
    const formPost = document.querySelector('#postForm');
    formPost.classList.add('was-validated');
    return;
  }

  // hide button save and show loading when form value is ok
  const submitForm = document.querySelector('#savePost');
  submitForm.classList.add('d-none');
  const loadingButton = document.querySelector('#loading-button');
  loadingButton.classList.remove('d-none');

  // edit post
  const urlParam = new URLSearchParams(window.location.search);
  console.log(urlParam);
  const postId = urlParam.get('id');
  if (isEditMode(postId)) {
    formValues.id = postId;
    console.log(formValues);
    await postApi.update(formValues);

    window.location = `./post-detail.html?id=${postId}`;
  } else {
    // add new post
    const newResponse = await postApi.add(formValues);
    const newPostId = newResponse.data.id;
    window.location = `./post-detail.html?id=${newPostId}`;
  }
};

(async function () {
  try {
    const urlParam = new URLSearchParams(window.location.search);
    console.log(urlParam);
    const postId = urlParam.get('id');

    if (isEditMode(postId)) {
      // show link to detail page
      const goToPageDetail = document.querySelector('#goToDetailPageLink');
      if (goToPageDetail) {
        goToPageDetail.textContent = 'View post detail';
        goToPageDetail.addEventListener('click', () => {
          goToPageDetail.href = `/post-detail.html?id=${postId}`;
        });
      }
      const response = await postApi.get(postId);
      const postItem = response.data;

      // render form detail
      setFormValue(postItem);
    }

    // chose background
    const changePostImage = document.querySelector('#postChangeImage');
    console.log(changePostImage);
    if (changePostImage) {
      changePostImage.addEventListener('click', handleClickChangeImage);
    }

    // handle submit add/edit post
    const submitForm = document.querySelector('#savePost');
    submitForm.addEventListener('click', handleSubmit);
  } catch (error) {
    console.log('Fail to loading', error);
  }
})();
