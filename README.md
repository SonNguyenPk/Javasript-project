# Post UI Project :heart_eyes:

View live demo: [https://paulnguyen-mn.github.io/posts-ui/](https://paulnguyen-mn.github.io/posts-ui/)
This simple website has 3 pages:
- Home page: `/`
- Add/Edit a post page: `/add-edit-post.html`
- Post detail page: `/post-detail.html`

## :question: Questions you may have

> What is query params and example?

- Query params is the parts after question mark.

```
Let break the following url into smaller parts:
URL: https://js-post-api.herokuapp.com/api/posts?_limit=10&_page=1

- origin: "https://js-post-api.herokuapp.com"
- pathname: "/api/posts"
- search: "?_limit=10&_page=1"
- When you parse search, you'll get query params object with two keys:
  - `_limit`: 10
  - `_page`: 1
```

> How to know whether add or edit mode when visit `/add-edit-post.html` page?

- Well, depend on the availability of query param `postId`.
  If it exists, then `edit` mode, otherwise `add` mode.

> How to know which post to show detail when visiting `/post-detail.html`?

- Same as above. Let check `postId` query param.

> How many external libs used in the final project?

- [Boostrap](https://getbootstrap.com/): Used for building responsive layout
- [Bootstrap Carousel](https://getbootstrap.com/docs/4.0/components/carousel/): Used for slide show on Home page.
- [Lightbox](https://lokeshdhakar.com/projects/lightbox2/): Used for viewing image.
- [Fetch](https://github.com/github/fetch): Used for working with API.
- [Axios](https://github.com/axios/axios): Used for working with API.
- [Anime.js](https://animejs.com/) (optional): Animation ;)


## :tada: Post API Guide

- API_URL: `https://js-post-api.herokuapp.com/api`

### Get a list of posts

```sh
GET /posts
```


Supported query params:
- `_limit`: Limit the number of items per page.
- `_page`: Current page.
- `_sort`: Indicate which field should be sorted on
- `_order`: Indicate sort direction.

*Eg: Get page 2 posts with 10 posts/page*

```sh
GET /posts/:postId?_limit=10&_page=2
```

*Eg: Sort post to get the latest posts first.*

```sh
GET /posts/:postId?_sort=updatedAt&_order=desc
```


### To get a post detail

```sh
GET /posts/:postId
```

### To add a new post

```sh
POST /posts
```

Sample payload:

```js
{
  title: 'Some cool title',
  author: 'Po Nguyen',
  description: 'Awesome post',
  imageUrl: 'https://picsum.photos/id/580/1368/400',
}
```

### To update a post

```sh
PATCH /posts/:postId
```

Please ONLY include changes to your payload:

```js
{
  id: 'your-post-id',
  title: 'My new title',
}
```

### To remove a post

```sh
DELETE /posts/:postId
```

## :heart_eyes: General requirement

- Learn to use Post API: `https://js-post-api.herokuapp.com`
- Implement 3 pages with details described below.
- Learn to use Github.
- Deploy your page to Github Page.
- Use `axios` to work with API.
- (Optional) Use anime.js to add animation.

## :house: Home page

### Render list of posts

- Research `Bootstrap Carousel` and add to home page.
  - Include 3 slides
  - Each slide has title and description.
  - Auto move the next slide.
- Fetch list of posts and render to UI.
- Sort list of post to show the latest post first.
- `ADVANCED`: Support pagination to be able to to fetch posts by page and limit the number of posts per page.

### Handle event on each post item

- `Click`: Go to detail page and show detail of clicked post.
- `Edit button click`: Go to edit page and populate detail of clicked post to form.
- `Remove button click`: Show confirmation to remove? If yes, remove it. Otherwise, do nothing :P


## :heavy_plus_sign: Add/Edit post page

- Add form validation
  - Require `title` field
  - Require `author` field

**ADD MODE** (if `postId` query param doesn't exist)

- Handle form submit
  - Show error if validation is failed. Stop form submit.
  - Add new post with submitted values: `title`, `author`, `description` and `imageUrl`
  - If add successfully, show an alert with message `Save post successfully` and redirect to Edit page of the new post.
  - If failed, show an alert with error message.

**EDIT MODE** (if `postId` query param exists)

- Get post detail and set initial value for form.
- Handle form submit
  - Do nothing if user doesn't change anything.
  - Show error if validation is failed. Stop form submit.
  - Update existing post with field that has changes. Don't include unchanged properties inside payload.
  - If update successfully, show an alert with message `Save post successfully`.
  - If failed, show an alert with error message.

## :eyes: Post detail page

- Get post detail.
- Update corresponding DOM: `title`, `description`, `author`, `createdAt` and `imageUrl`.
- Integrate with `Lightbox` to view image when click on image.


Good luck everyone! :heart_eyes:
> Created by Po with :heart:
