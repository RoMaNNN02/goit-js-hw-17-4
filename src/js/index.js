import Handlebars from "handlebars";
import imagesTemplate from "bundle-text:../handlebars/images.hbs";

import infoTemplate from "bundle-text:../handlebars/info.hbs";

const renderInfo = Handlebars.compile(infoTemplate);

const renderImages = Handlebars.compile(imagesTemplate);

const list = document.querySelector(".img-list");
const btn = document.querySelector(".load-more-button");

let page = 1;
let per_page = 20;

const fetchImagesList = (params) => {
  const url = `https://pixabay.com/api/?key=57944612-0802395d4928cc6ddeaf92dba&editors_choice=true&image_type=photo&${params}`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Помилка: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);

      const markup = renderImages(data);
      list.insertAdjacentHTML("beforeend", markup);
    });
};
fetchImagesList(`page=${page}&per_page=${per_page}`);

const handleLoadMore = () => {
  page++;

  const params = new URLSearchParams({
    per_page: per_page,
    page: page,
  });
  fetchImagesList(params);
};
const HandleInfo = (event) => {
  const item = event.target.closest(".img-item");
  if (!event.target.classList.contains("img")) {
    return;
  }
  if (item.querySelector(".info")) {
    const info = item.querySelector(".info");
    info.remove();
    return;
  }

  if (!item.querySelector(".info")) {
    const info = {
      downloads: event.target.dataset.downloads,
      views: event.target.dataset.views,
      likes: event.target.dataset.likes,
    };

    const markupInfo = renderInfo(info);
    item.insertAdjacentHTML("beforeend", markupInfo);
  }
};
btn.addEventListener("click", handleLoadMore);
list.addEventListener("click", HandleInfo);
