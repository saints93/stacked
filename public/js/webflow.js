/*!
 * Minimal Webflow runtime replacement for the STACKED site.
 * Provides just enough functionality for WebflowInit (ready queue + ix2)
 * and re-implements the homepage hero animation plus mobile nav toggles.
 */
(function () {
  'use strict';

  var readyQueue =
    window.Webflow && Array.isArray(window.Webflow.ready)
      ? window.Webflow.ready.slice()
      : [];
  var heroTimers = [];
  var heroInitialized = false;
  var navInstances = [];
  var navResizeAttached = false;
  var navOutsideAttached = false;

  function safeForEach(list, iterator) {
    Array.prototype.forEach.call(list || [], iterator);
  }

  function closeAllNavMenus() {
    navInstances.forEach(function (instance) {
      instance.close();
    });
  }

  function handleNavResize() {
    if (window.innerWidth >= 992) {
      closeAllNavMenus();
    }
  }

  function handleDocumentClick(evt) {
    navInstances.forEach(function (instance) {
      if (!instance.nav.contains(evt.target)) {
        instance.close();
      }
    });
  }

  function openMenu(instance) {
    instance.nav.classList.add('w--open');
    instance.button.classList.add('w--open');
    instance.menu.setAttribute('data-nav-menu-open', 'true');
    instance.menu.style.display = 'block';
    instance.menu.setAttribute('aria-hidden', 'false');
    instance.button.setAttribute('aria-expanded', 'true');
  }

  function closeMenu(instance) {
    instance.nav.classList.remove('w--open');
    instance.button.classList.remove('w--open');
    instance.menu.removeAttribute('data-nav-menu-open');
    instance.menu.style.display = '';
    instance.menu.setAttribute('aria-hidden', 'true');
    instance.button.setAttribute('aria-expanded', 'false');
  }

  function initNavMenus() {
    var navs = document.querySelectorAll('.w-nav');
    if (!navs.length) {
      return;
    }

    safeForEach(navs, function (nav) {
      if (nav.__stackedNavInit) {
        return;
      }

      var menu = nav.querySelector('.w-nav-menu');
      var button = nav.querySelector('.w-nav-button');

      if (!menu || !button) {
        return;
      }

      var instance = { nav: nav, menu: menu, button: button };

      instance.open = function () {
        closeAllNavMenus();
        openMenu(instance);
      };

      instance.close = function () {
        closeMenu(instance);
      };

      button.addEventListener('click', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        if (nav.classList.contains('w--open')) {
          instance.close();
        } else {
          instance.open();
        }
      });

      button.addEventListener('keydown', function (evt) {
        if (evt.key === 'Enter' || evt.key === ' ') {
          evt.preventDefault();
          if (nav.classList.contains('w--open')) {
            instance.close();
          } else {
            instance.open();
          }
        }
      });

      menu.addEventListener('click', function (evt) {
        evt.stopPropagation();
      });

      nav.addEventListener('keydown', function (evt) {
        if (evt.key === 'Escape') {
          instance.close();
        }
      });

      nav.__stackedNavInit = true;
      navInstances.push(instance);
      instance.close();
    });

    if (!navResizeAttached && navInstances.length) {
      navResizeAttached = true;
      window.addEventListener('resize', handleNavResize);
    }

    if (!navOutsideAttached && navInstances.length) {
      navOutsideAttached = true;
      document.addEventListener('click', handleDocumentClick);
    }
  }

  function fadeCircle(items, current, next) {
    if (items[current]) {
      items[current].style.opacity = '0';
    }
    if (items[next]) {
      items[next].style.opacity = '1';
    }
  }

  function initHeroAnimations() {
    if (heroInitialized) {
      return;
    }

    var heroBlock = document.querySelector(
      '.header-image-wrapper .circle-image-block'
    );
    if (!heroBlock) {
      return;
    }

    var itemNodes = heroBlock.querySelectorAll('.circle-item');
    if (!itemNodes.length) {
      return;
    }

    heroInitialized = true;
    var items = Array.prototype.slice.call(itemNodes);
    items.forEach(function (item, index) {
      item.style.display = 'flex';
      item.style.opacity = index === 0 ? '1' : '0';
      item.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
    });

    if (items.length > 1) {
      var activeIndex = 0;
      heroTimers.push(
        window.setInterval(function () {
          var nextIndex = (activeIndex + 1) % items.length;
          fadeCircle(items, activeIndex, nextIndex);
          activeIndex = nextIndex;
        }, 4000)
      );
    }

    var toggleBlock = heroBlock.querySelector('.image-toogle-block');
    if (toggleBlock) {
      toggleBlock.style.display = 'block';
      var altImages = Array.prototype.slice.call(
        toggleBlock.querySelectorAll('.alternate-image')
      );
      altImages.forEach(function (img, index) {
        img.style.opacity = index === 0 ? '1' : '0';
        img.style.transition = 'opacity 1s ease';
      });

      if (altImages.length > 1) {
        var altIndex = 0;
        heroTimers.push(
          window.setInterval(function () {
            var nextAlt = (altIndex + 1) % altImages.length;
            altImages[altIndex].style.opacity = '0';
            altImages[nextAlt].style.opacity = '1';
            altIndex = nextAlt;
          }, 2500)
        );
      }
    }
  }

  function cleanupHeroAnimations() {
    while (heroTimers.length) {
      window.clearInterval(heroTimers.pop());
    }
    heroInitialized = false;
  }

  function initAll() {
    initNavMenus();
    initHeroAnimations();
  }

  function destroy() {
    cleanupHeroAnimations();
    closeAllNavMenus();
  }

  function runReadyQueue() {
    readyQueue.forEach(function (fn) {
      try {
        fn();
      } catch (err) {
        console.error('Webflow ready callback failed', err);
      }
    });
  }

  var webflowApi = window.Webflow || {};
  webflowApi.ready = readyQueue;
  webflowApi.push = function (fn) {
    if (typeof fn === 'function') {
      readyQueue.push(fn);
    }
  };
  webflowApi.require = function (name) {
    if (name === 'ix2') {
      return { init: initAll };
    }
    return { init: function () {} };
  };
  webflowApi.destroy = destroy;
  window.Webflow = webflowApi;

  function onDomReady() {
    if (onDomReady._ran) {
      return;
    }
    onDomReady._ran = true;
    runReadyQueue();
    initAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onDomReady);
  } else {
    onDomReady();
  }
})();
