"use strict"
document.addEventListener("DOMContentLoaded", function () {
  const body = document.querySelector('body');
  const wrapper = document.getElementById('wrapper');
  const header = document.getElementById('header');
  const main = document.getElementById('main');
  const footer = document.getElementById('footer');
  const lockPadding = document.querySelectorAll(".lock-padding");

  const timeout = 300;

  const headerStyle = getComputedStyle(header); // получаем объект со стилями элемента
  const headerHeight = Math.ceil(header.getBoundingClientRect().height);
  main.style.marginTop = headerHeight + "px"; /* Верхний отступ равен высоте шапки */

  /*плавный скрол*/
  const anchors = document.querySelectorAll(".js-scroll-link");

  for (let anchor of anchors) {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const blockID = anchor.getAttribute("href").substr(1);

      document.getElementById(blockID).scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }

  function bodyLock() {
    const lockPaddingValue = window.innerWidth - wrapper.offsetWidth + "px"; // разница между шириной всего viewport и шириной объекта, который находится внутри viewport. Т.е., получаем ширину скролла, который убирается при открытии popup. Это делается для того, чтобы при исчезновании/появлении скролла контент не двигался в стороны на ширину скролла.
    /*проверка наличие объектов lockPadding*/

    let pagePosition =
      window.scrollY; /* сохраняет текущее нахождение скролла на момента его блокировки */

    if (lockPadding.lenght > 0) {
      /*цикл для фиксированных объектов, чтобы не двигались при исчезновании/появлении скролла*/
      for (let index = 0; index < lockPadding.lenght; index++) {
        const el = lockPadding[index];
        el.style.paddingRight = lockPaddingValue;
      }
    }
    body.style.paddingRight = lockPaddingValue;
    body.classList.add("lock");

    body.dataset.position = pagePosition; /* добавляет в body атрибут со значением pagePosition, для использования при разблокировке */
    body.style.top = -pagePosition + "px";
  }
  function bodyUnLock() {
    setTimeout(function () {
      /*проверка наличие объектов lockPadding*/
      let pagePosition = parseInt(
        body.dataset.position,
        10
      ); /* получение значения атрибута body и переведение в число */
      body.style.top = "auto"; /* стилизация позиции body */
      if (lockPadding.lenght > 0) {
        for (let index = 0; index < lockPadding.lenght; index++) {
          const el = lockPadding[index];
          el.style.paddingRight = "0px";
        }
      }
      body.style.paddingRight = "0px";
      body.classList.remove("lock");

      window.scroll({
        top: pagePosition,
        left: 0
      }); /* сохранение нахожения скролла в момент разблокировки */
      body.removeAttribute("data-position"); /* удаление атрибута у body */
    }, timeout);
  }

  /*TABS*/
  const tabsWrapperItems = document.querySelector('.tabs-items');
  const tabsBtns = document.querySelectorAll('.tabs-btn');
  const tabsItems = document.querySelectorAll('.tabs-item');

  for (let index = 0; index < tabsItems.length; index++) {
    if (tabsItems[index].classList.contains('open-tabs-item')) {
      const tabsItemsChild = tabsItems[index].querySelector('.tabs-item__pre');
      const tabsItemsChildHeight = tabsItemsChild.getBoundingClientRect().height;
      tabsWrapperItems.style.minHeight = tabsItemsChildHeight + "px";
    }
  }

  tabsBtns.forEach(function (tabsBtn) {
    tabsBtn.addEventListener('click', (tabsBtn) => {
      const path = tabsBtn.currentTarget.dataset.path;

      for (let i = 0; i < tabsBtns.length; i++) {
        tabsBtns[i].classList.remove('open-tabs-btn');
      }
      tabsBtn.currentTarget.classList.add('open-tabs-btn');
      tabsItems.forEach((tabsItem) => {
        tabsItem.classList.remove('open-tabs-item');
      });
      // поиск ячейки по атрибуту
      const tabsOpenItem = document.querySelector(`[data-target="${path}"]`);
      // присваивание ячейке класса открытия
      tabsOpenItem.classList.add('open-tabs-item');
      // поиск дочери открытой ячейки по классу
      const tabsOpenItemsChild = tabsOpenItem.querySelector('.tabs-item__pre');
      // вычисление высоты у дочери открытой ячейки
      const tabsOpenItemsChildHeight = tabsOpenItemsChild.getBoundingClientRect().height;
      // присваивание главному блоку ячеек минимальной высоты на основании высоты дочери открытой ячейки
      tabsWrapperItems.style.minHeight = tabsOpenItemsChildHeight + "px";
    });
  });

  /*MODAL*/
  const btns = document.querySelectorAll(".modal-btn");
  const modalsOverlays = document.querySelectorAll(".modals-overlay");

  modalsOverlays.forEach((element) => {
    element.classList.remove('modals-overlay--visible');
    const modalCards = element.querySelectorAll(".modal-card");
    btns.forEach((el) => {
      el.addEventListener("click", function (e) {
        bodyLock();
        let path = e.currentTarget.getAttribute("data-path");

        modalCards.forEach((elem) => {
          elem.classList.remove('modal-card--visible');
        });

        element.querySelector(`[data-target="${path}"]`).classList.add("modal-card--visible");
        element.classList.add('modals-overlay--visible');
      });
    });
    element.addEventListener("click", function (el) {
      if (el.target === element) {
        bodyUnLock();
        element.classList.remove('modals-overlay--visible');
        modalCards.forEach((elem) => {
          elem.classList.remove('modal-card--visible');
        });
      }
    });
  });



  /* VIDEO */
  // selector of all videos on the page
  const videos = document.querySelectorAll('.hero-video');

  // generate video url
  let generateUrl = function (id) {
    let query = '?rel=0&showinfo=0&autoplay=1';

    return 'https://www.youtube.com/embed/' + id + query;
  };

  // creating iframe
  let createIframe = function (id) {
    let iframe = document.createElement('iframe');

    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('allow', 'autoplay; encrypted-media');
    iframe.setAttribute('src', generateUrl(id));

    return iframe;
  };

  // main code
  videos.forEach((el) => {
    let videoHref = el.dataset.video;

    let deletedLength = 'https://youtu.be/'.length;

    let videoId = videoHref.substring(deletedLength, videoHref.length); // substring вырезает из videoHref значение deletedLength

    let imgVideo = el.querySelector('.hero-video__img');
    let youtubeImgSrc = 'https://i.ytimg.com/vi/' + videoId + '/maxresdefault.jpg'; // htts://i.ytimg.com/vi/ - ссылка позволяет получить доступ к постерам видео
    imgVideo.setAttribute('src', youtubeImgSrc);

    el.addEventListener('click', (e) => {
      e.preventDefault();

      let iframe = createIframe(videoId);
      el.querySelector('.hero-video__img').remove();
      el.appendChild(iframe);
      el.querySelector('.hero-video__play').remove();
    });
  });

});
