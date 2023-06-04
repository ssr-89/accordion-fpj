"use strict"
document.addEventListener("DOMContentLoaded", () => {
  // Коллекция дата-атрибутов data-spollers
  const spollersArray = document.querySelectorAll("[data-spollers]");

  // Проверка наличия элементов с данным дата-атрибутом
  if (spollersArray.length > 0) {

    // Получение обычных спойлеров
    // Array.from переводит в массив, а далее работаем с методом filter
    const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
      // с помощью split разделяются значения data-spollers и тем самым проверяется наличие значения
      // item - это (650,min)
      return !item.dataset.spollers.split(",")[0];
    });

    // Инициализацтя обычных спойлеров (активация)
    if (spollersRegular.length > 0) {
      initSpollers(spollersRegular);
    }

    // Получение спойлеров с медиа запросами
    // Array.from переводит в массив, а далее работаем с методом filter
    const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
      // с помощью split разделяются значения data-spollers и тем самым проверяется наличие значения
      // item - это (650,min)
      return item.dataset.spollers.split(",")[0];
    });

    // Инициализация спойлеров с медиа запросами
    // проверка наличия элементов с данным дата-атрибутом
    if (spollersMedia.length > 0) {

      const breakpointsArray = []; // пустой массив

      spollersMedia.forEach(item => {
        const params = item.dataset.spollers; // получение элементов с data-sollers
        const breakpoint = {}; // пустой объект

        // paramsArray - массив со значениями data-spollers
        const paramsArray = params.split(","); // С помощью split разделяются значения data-spollers

        // создание значений для объекта breakpoint
        breakpoint.value = paramsArray[0]; // первый параметр data-spollers

        // второй параметр data-spollers
        // trim убирает пробелы вокруг
        // по умолчанию "max", если не указано иное
        breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";

        // item - это (650,min)
        breakpoint.item = item;

        // объект добавялется в массив
        breakpointsArray.push(breakpoint);
      });


      /*
      1 mediaQueries - это breakpointsArray и преобразуется в строку (пример: '"(min-width: 650px),", "650,", "min"')
      2 mediaQueries фильтруется от повторения (если правильно понял)
      3 Далее breakpoint это элемент mediaQueries
      */


      // Получаем уникальные брейкпоинты
      // map - переделываем массив в строку с медиа-запросами
      /* 1 */let mediaQueries = breakpointsArray.map(function (item) {
        // Здесь item - это breakpoint из breakpointsArray
        return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
      });
      /* 2 */mediaQueries = mediaQueries.filter(function (item, index, self) {
        return self.indexOf(item) === index;
      });

      // Работаем с каждым брейкпоинтом
      /* 3 */mediaQueries.forEach(breakpoint => {

        // с помощью split разделяются значения на три части и преобразует в массив
        const paramsArray = breakpoint.split(",");
        const mediaBreakpoint = paramsArray[1]; // первый параметр data-spollers (пример: 650)
        const mediaType = paramsArray[2]; // второй параметр data-spollers (пример: min)

        // window слушает ширину экрана и отрабатывает, если сработал нужный брейкпоинт
        // в paramsArray[0] индексом берётся параметр из mediaQueries(breakpoint) выше (пример: "min-width: 650px")
        const matchMedia = window.matchMedia(paramsArray[0]);

        // Объекты с нужными условиями
        const spollersArray = breakpointsArray.filter(function (item) {
          if (item.value === mediaBreakpoint && item.type === mediaType) {
            return true;
          }
        });

        // Событие
        matchMedia.addListener(function () {
          // spollersArray - собранный массив объектов
          // matchMedia - слушание ширины экрана, иными словами выдаёт значения data-spollers
          initSpollers(spollersArray, matchMedia);
        });

        // чтобы заработало сразу при загрузке страницы
        initSpollers(spollersArray, matchMedia);
      });
    }
    // Инициализация
    function initSpollers(spollersArray, matchMedia = false) { // массив объектов и константа matchMedia
      spollersArray.forEach(spollersBlock => { // spollersBlock каждый элемент массива
        // spollersBlock.item - это breakpoint.item = item; (650,min)
        spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;

        // matchMedia.matches вернёт true, если ширина экрана больше или равен пример: 650px
        // !matchMedia - для спойлеров без значений data-spollers
        if (matchMedia.matches || !matchMedia) {
          spollersBlock.classList.add('_init'); // присваиваем технический класс

          // вызывается функция контентной части
          initSpollerBody(spollersBlock);
          spollersBlock.addEventListener("click", setSpollerAction); // событие клик
        }


        else {
          spollersBlock.classList.remove('_init');

          // дезактивируем функцию
          initSpollerBody(spollersBlock, false); // передаём в spollersBlock объект
          spollersBlock.removeEventListener("click", setSpollerAction); // убираем событие клик
        }
      });
    }

    // Работа с контентом
    // если нет подходящих парамтеров для активации спойлера, то в hideSpollerBody передаётся false
    function initSpollerBody(spollersBlock, hideSpollerBody = true) {

      const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]'); // получаем все заголовки спойлеров

      // проверка наличия заголовков спойлеров
      if (spollerTitles.length > 0) {

        spollerTitles.forEach(spollerTitle => {

          if (hideSpollerBody) {
            // если hideSpollerBody true, тогда у заголовка убираем tabindex
            spollerTitle.removeAttribute('tabindex');

            // если нет класса _active
            if (!spollerTitle.classList.contains('_active')) {
              // тогда скрываем контентную часть с помощью nextElementSibling (т.е., следующий элемент после заголовка)
              spollerTitle.nextElementSibling.hidden = true;
            }
          }
          // если hideSpollerBody false
          else {
            spollerTitle.setAttribute('tabindex', '-1'); // tabindex добавляем, чтобы спойлеры были обычными блоками при недостижения нужного брейкпоинта
            spollerTitle.nextElementSibling.hidden = false; // из-за этого атрибута в Google Chrome спойлер дёргается при закрывании
          }
        });
      }
    }
    function setSpollerAction(e) { // клик по кнопке
      const el = e.target; // нажатый объект

      // если у объекта есть data-spoller || у ближайшего родителя
      if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {

        // элемент с data-spoller || ближайший родитель с data-spoller
        const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');

        // получаем родительский блок выбранного спойлера
        const spollersBlock = spollerTitle.closest('[data-spollers]');

        // если у оболочки есть data-one-spoller, то true
        const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;

        // проверка родителей спойлера на наличие класса _slide
        if (!spollersBlock.querySelectorAll('._slide').length) {
          if (oneSpoller && !spollerTitle.classList.contains('_active')) { // если у гл блока есть data-one-spoller и у нажатой кнопки нет класс _active
            hideSpollersBody(spollersBlock); // все остальные спойлеры скрыть
          }
          spollerTitle.classList.toggle('_active'); // спойлеру добавляем или убираем класс _active
          _slideToggle(spollerTitle.nextElementSibling, 500);
        }
        e.preventDefault();
      }
    }
    function hideSpollersBody(spollersBlock) {
      // активный и открытый спойлер
      const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');

      if (spollerActiveTitle) {
        spollerActiveTitle.classList.remove('_active'); // убираем класс _active
        _slideUp(spollerActiveTitle.nextElementSibling, 500);
      }
    }
  }


  /*===============================================================*/
  // SlideToggle
  let _slideUp = (target, duration = 500) => {
    if (!target.classList.contains('_slide')) { // если у объекта нет тех. класса _slide
      target.classList.add('_slide'); // добавляет класс _slide
      target.style.transitionProperty = 'height, margin, padding';
      target.style.transitionDuration = duration + 'ms';
      target.style.height = target.offsetHeight + 'px';
      target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      window.setTimeout(() => {
        target.hidden = true;
        target.style.removeProperty('height');
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        target.style.removeProperty('overflow');
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
        target.classList.remove('_slide');
      }, duration);
    }
  }
  let _slideDown = (target, duration = 500) => {
    if (!target.classList.contains('_slide')) {
      target.classList.add('_slide');
      if (target.hidden) {
        target.hidden = false;
      }
      let height = target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      target.offsetHeight;
      target.style.transitionProperty = 'height, margin, padding';
      target.style.transitionDuration = duration + 'ms';
      target.style.height = height + 'px';
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      window.setTimeout(() => {
        target.style.removeProperty('height');
        target.style.removeProperty('overflow');
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
        target.classList.remove('_slide');
      }, duration);
    }
  }
  let _slideToggle = (target, duration = 500) => {
    if (target.hidden) {
      return _slideDown(target, duration); // открыто - скрыть
    } else {
      return _slideUp(target, duration); // закрыто - показать
    }
  }

  /*===============================================================*/
  /*
  Для родителя спойлеров пишем атрибут data-spollers
  Для получения обычных спойлеров в data-spollers не указываются значения

  Для заголовков спойлеров пишем атрибут data-spoller
  Если нужно включить/выключить работу спойлеров на разных размерах экранов пишем параметры ширины и типа брейкпоинта.
  Например:
  data-spollers-"992,max" -спойлеры будут рабоать только на экранах меньше или равно 992px
  data-spollers-"768,max" -спойлеры будут рабоать только на экранах меньше или равно 768px

  Если нужно чтобы в блоке открывался только один спойлер добавялем атрибут data-one-spoller
  */
});
