import React, { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Set body class for preload and ensure proper styling
    document.body.classList.add('is-preload');
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    document.body.style.margin = '0';
    document.body.style.padding = '0';

    // Load jQuery from CDN
    const jqueryScript = document.createElement('script');
    jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    jqueryScript.onload = () => {
      // After jQuery loads, initialize the template functionality
      initializeDimension();
    };
    document.head.appendChild(jqueryScript);

    function initializeDimension() {
      const $ = window.jQuery;
      
      // Breakpoints functionality
      const breakpoints = (function() {
        const obj = {
          list: null,
          media: {},
          events: [],
          init: function(config) {
            obj.list = config;
          },
          active: function(query) {
            if (!(query in obj.media)) {
              const mq = window.matchMedia(query);
              obj.media[query] = mq.matches;
            }
            return obj.media[query];
          }
        };
        return function(config) {
          obj.init(config);
        };
      })();

      // Browser detection
      const browser = (function() {
        const ua = navigator.userAgent;
        let name = 'other';
        let version = 0;
        
        if (/firefox/i.test(ua)) name = 'firefox';
        else if (/chrome/i.test(ua)) name = 'chrome';
        else if (/safari/i.test(ua)) name = 'safari';
        else if (/msie|trident/i.test(ua)) name = 'ie';
        
        return { name, version };
      })();

      // Main Dimension template logic
      const $window = $(window);
      const $body = $('body');
      const $wrapper = $('#wrapper');
      const $header = $('#header');
      const $footer = $('#footer');
      const $main = $('#main');
      const $main_articles = $main.children('article');

      breakpoints({
        xlarge: ['1281px', '1680px'],
        large: ['981px', '1280px'],
        medium: ['737px', '980px'],
        small: ['481px', '736px'],
        xsmall: ['361px', '480px'],
        xxsmall: [null, '360px']
      });

      // Remove preload class immediately to show content
      window.setTimeout(function() {
        $body.removeClass('is-preload');
      }, 100);

      // Nav alignment
      const $nav = $header.children('nav');
      const $nav_li = $nav.find('li');
      if ($nav_li.length % 2 == 0) {
        $nav.addClass('use-middle');
        $nav_li.eq($nav_li.length / 2).addClass('is-middle');
      }

      // Main article show/hide functionality
      const delay = 325;
      let locked = false;

      $main._show = function(id, initial) {
        const $article = $main_articles.filter('#' + id);
        if ($article.length == 0) return;

        if (locked || (typeof initial != 'undefined' && initial === true)) {
          $body.addClass('is-switching');
          $body.addClass('is-article-visible');
          $main_articles.removeClass('active');
          $header.hide();
          $footer.hide();
          $main.show();
          $article.show();
          $article.addClass('active');
          locked = false;
          setTimeout(function() {
            $body.removeClass('is-switching');
          }, (initial ? 1000 : 0));
          return;
        }

        locked = true;

        if ($body.hasClass('is-article-visible')) {
          const $currentArticle = $main_articles.filter('.active');
          $currentArticle.removeClass('active');
          setTimeout(function() {
            $currentArticle.hide();
            $article.show();
            setTimeout(function() {
              $article.addClass('active');
              $window.scrollTop(0);
              setTimeout(function() {
                locked = false;
              }, delay);
            }, 25);
          }, delay);
        } else {
          $body.addClass('is-article-visible');
          setTimeout(function() {
            $header.hide();
            $footer.hide();
            $main.show();
            $article.show();
            setTimeout(function() {
              $article.addClass('active');
              $window.scrollTop(0);
              setTimeout(function() {
                locked = false;
              }, delay);
            }, 25);
          }, delay);
        }
      };

      $main._hide = function(addState) {
        const $article = $main_articles.filter('.active');
        if (!$body.hasClass('is-article-visible')) return;
        
        if (typeof addState != 'undefined' && addState === true)
          history.pushState(null, null, '#');

        if (locked) {
          $body.addClass('is-switching');
          $article.removeClass('active');
          $article.hide();
          $main.hide();
          $footer.show();
          $header.show();
          $body.removeClass('is-article-visible');
          locked = false;
          $body.removeClass('is-switching');
          $window.scrollTop(0);
          return;
        }

        locked = true;
        $article.removeClass('active');
        setTimeout(function() {
          $article.hide();
          $main.hide();
          $footer.show();
          $header.show();
          setTimeout(function() {
            $body.removeClass('is-article-visible');
            $window.scrollTop(0);
            setTimeout(function() {
              locked = false;
            }, delay);
          }, 25);
        }, delay);
      };

      // Add close buttons to articles
      $main_articles.each(function() {
        const $this = $(this);
        $('<div class="close">Close</div>')
          .appendTo($this)
          .on('click', function() {
            location.hash = '';
          });
        $this.on('click', function(event) {
          event.stopPropagation();
        });
      });

      // Body click to hide article
      $body.on('click', function(event) {
        if ($body.hasClass('is-article-visible'))
          $main._hide(true);
      });

      // ESC key to close
      $window.on('keyup', function(event) {
        if (event.keyCode == 27 && $body.hasClass('is-article-visible'))
          $main._hide(true);
      });

      // Hash change handling
      $window.on('hashchange', function(event) {
        if (location.hash == '' || location.hash == '#') {
          event.preventDefault();
          event.stopPropagation();
          $main._hide();
        } else if ($main_articles.filter(location.hash).length > 0) {
          event.preventDefault();
          event.stopPropagation();
          $main._show(location.hash.substr(1));
        }
      });

      // Scroll restoration
      if ('scrollRestoration' in history)
        history.scrollRestoration = 'manual';

      // Initialize - hide main/articles
      $main.hide();
      $main_articles.hide();

      // Show initial article if hash present
      if (location.hash != '' && location.hash != '#')
        $window.on('load', function() {
          $main._show(location.hash.substr(1), true);
        });
    }

    return () => {
      document.body.classList.remove('is-preload');
      document.documentElement.style.height = '';
      document.body.style.height = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro:300italic,600italic,300,600");
        @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css");

        html, body, div, span, applet, object,
        iframe, h1, h2, h3, h4, h5, h6, p, blockquote,
        pre, a, abbr, acronym, address, big, cite,
        code, del, dfn, em, img, ins, kbd, q, s, samp,
        small, strike, strong, sub, sup, tt, var, b,
        u, i, center, dl, dt, dd, ol, ul, li, fieldset,
        form, label, legend, table, caption, tbody,
        tfoot, thead, tr, th, td, article, aside,
        canvas, details, embed, figure, figcaption,
        footer, header, hgroup, menu, nav, output, ruby,
        section, summary, time, mark, audio, video {
          margin: 0;
          padding: 0;
          border: 0;
          font-size: 100%;
          font: inherit;
          vertical-align: baseline;
        }

        article, aside, details, figcaption, figure,
        footer, header, hgroup, menu, nav, section {
          display: block;
        }

        body {
          line-height: 1;
        }

        ol, ul {
          list-style: none;
        }

        blockquote, q {
          quotes: none;
        }

        blockquote:before, blockquote:after, q:before, q:after {
          content: '';
          content: none;
        }

        table {
          border-collapse: collapse;
          border-spacing: 0;
        }

        body {
          -webkit-text-size-adjust: none;
        }

        mark {
          background-color: transparent;
          color: inherit;
        }

        input::-moz-focus-inner {
          border: 0;
          padding: 0;
        }

        input, select, textarea {
          -moz-appearance: none;
          -webkit-appearance: none;
          -ms-appearance: none;
          appearance: none;
        }

        @-ms-viewport {
          width: device-width;
        }

        @media screen and (max-width: 480px) {
          html, body {
            min-width: 320px;
          }
        }

        html {
          box-sizing: border-box;
          font-size: 16pt;
        }

        *, *:before, *:after {
          box-sizing: inherit;
        }

        body {
          background: #1b1f22;
        }

        body.is-preload *, body.is-preload *:before, body.is-preload *:after {
          animation: none !important;
          transition: none !important;
        }

        @media screen and (max-width: 1680px) {
          html {
            font-size: 12pt;
          }
        }

        @media screen and (max-width: 736px) {
          html {
            font-size: 11pt;
          }
        }

        @media screen and (max-width: 360px) {
          html {
            font-size: 10pt;
          }
        }

        body, input, select, textarea {
          color: #ffffff;
          font-family: "Source Sans Pro", sans-serif;
          font-weight: 300;
          font-size: 1rem;
          line-height: 1.65;
        }

        a {
          transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out, border-bottom-color 0.2s ease-in-out;
          border-bottom: dotted 1px rgba(255, 255, 255, 0.5);
          text-decoration: none;
          color: inherit;
        }

        a:hover {
          border-bottom-color: transparent;
        }

        strong, b {
          color: #ffffff;
          font-weight: 600;
        }

        em, i {
          font-style: italic;
        }

        p {
          margin: 0 0 2rem 0;
        }

        h1, h2, h3, h4, h5, h6 {
          color: #ffffff;
          font-weight: 600;
          line-height: 1.5;
          margin: 0 0 1rem 0;
          text-transform: uppercase;
          letter-spacing: 0.2rem;
        }

        h1 a, h2 a, h3 a, h4 a, h5 a, h6 a {
          color: inherit;
          text-decoration: none;
        }

        h1.major, h2.major, h3.major, h4.major, h5.major, h6.major {
          border-bottom: solid 1px #ffffff;
          width: max-content;
          padding-bottom: 0.5rem;
          margin: 0 0 2rem 0;
        }

        h1 {
          font-size: 2.25rem;
          line-height: 1.3;
          letter-spacing: 0.5rem;
        }

        h2 {
          font-size: 1.5rem;
          line-height: 1.4;
          letter-spacing: 0.5rem;
        }

        @media screen and (max-width: 736px) {
          h1 {
            font-size: 1.75rem;
            line-height: 1.4;
          }
          h2 {
            font-size: 1.25em;
            line-height: 1.5;
          }
        }

        label {
          color: #ffffff;
          display: block;
          font-size: 0.8rem;
          font-weight: 300;
          letter-spacing: 0.2rem;
          line-height: 1.5;
          margin: 0 0 1rem 0;
          text-transform: uppercase;
        }

        input[type="text"],
        input[type="password"],
        input[type="email"],
        input[type="tel"],
        select,
        textarea {
          appearance: none;
          transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out;
          background-color: transparent;
          border-radius: 4px;
          border: solid 1px #ffffff;
          color: inherit;
          display: block;
          outline: 0;
          padding: 0 1rem;
          text-decoration: none;
          width: 100%;
        }

        input[type="text"]:focus,
        input[type="password"]:focus,
        input[type="email"]:focus,
        input[type="tel"]:focus,
        select:focus,
        textarea:focus {
          background: rgba(255, 255, 255, 0.075);
          border-color: #ffffff;
          box-shadow: 0 0 0 1px #ffffff;
        }

        input[type="text"],
        input[type="password"],
        input[type="email"],
        select {
          height: 2.75rem;
        }

        textarea {
          padding: 0.75rem 1rem;
        }

        input[type="submit"],
        input[type="reset"],
        input[type="button"],
        button,
        .button {
          appearance: none;
          transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
          background-color: transparent;
          border-radius: 4px;
          border: 0;
          box-shadow: inset 0 0 0 1px #ffffff;
          color: #ffffff !important;
          cursor: pointer;
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 300;
          height: 2.75rem;
          letter-spacing: 0.2rem;
          line-height: 2.75rem;
          outline: 0;
          padding: 0 1.25rem 0 1.35rem;
          text-align: center;
          text-decoration: none;
          text-transform: uppercase;
          white-space: nowrap;
        }

        input[type="submit"]:hover,
        input[type="reset"]:hover,
        input[type="button"]:hover,
        button:hover,
        .button:hover {
          background-color: rgba(255, 255, 255, 0.075);
        }

        input[type="submit"].primary,
        input[type="reset"].primary,
        input[type="button"].primary,
        button.primary,
        .button.primary {
          background-color: #ffffff;
          color: #1b1f22 !important;
          font-weight: 600;
        }

        .icon:before {
          font-family: 'Font Awesome 6 Free';
          font-weight: 900;
          display: inline-block;
          font-style: normal;
          font-variant: normal;
          text-rendering: auto;
          line-height: 1;
        }

        .icon.fa-gem:before {
          content: "\\f3a5";
        }

        .icon.brands:before {
          font-family: 'Font Awesome 6 Brands';
        }

        .icon.fa-twitter:before {
          content: "\\f099";
        }

        .icon.fa-facebook-f:before {
          content: "\\f39e";
        }

        .icon.fa-instagram:before {
          content: "\\f16d";
        }

        .icon.fa-github:before {
          content: "\\f09b";
        }

        .image {
          border-radius: 4px;
          border: 0;
          display: inline-block;
          position: relative;
        }

        .image img {
          border-radius: 4px;
          display: block;
        }

        .image.main {
          display: block;
          margin: 2.5rem 0;
          width: 100%;
        }

        .image.main img {
          width: 100%;
        }

        form {
          margin: 0 0 2rem 0;
        }

        form > .fields {
          display: flex;
          flex-wrap: wrap;
          width: calc(100% + 3rem);
          margin: -1.5rem 0 2rem -1.5rem;
        }

        form > .fields > .field {
          flex-grow: 0;
          flex-shrink: 0;
          padding: 1.5rem 0 0 1.5rem;
          width: calc(100% - 1.5rem);
        }

        form > .fields > .field.half {
          width: calc(50% - 0.75rem);
        }

        @media screen and (max-width: 480px) {
          form > .fields > .field.half {
            width: calc(100% - 1.5rem);
          }
        }

        ul.actions {
          display: flex;
          cursor: default;
          list-style: none;
          margin-left: -1rem;
          padding-left: 0;
        }

        ul.actions li {
          padding: 0 0 0 1rem;
          vertical-align: middle;
        }

        ul.icons {
          cursor: default;
          list-style: none;
          padding-left: 0;
        }

        ul.icons li {
          display: inline-block;
          padding: 0 0.75em 0 0;
        }

        ul.icons li:last-child {
          padding-right: 0;
        }

        ul.icons li a {
          border-radius: 100%;
          box-shadow: inset 0 0 0 1px #ffffff;
          display: inline-block;
          height: 2.25rem;
          line-height: 2.25rem;
          text-align: center;
          width: 2.25rem;
          border-bottom: none;
        }

        ul.icons li a:hover {
          background-color: rgba(255, 255, 255, 0.075);
        }

        #bg {
          transform: scale(1.0);
          -webkit-backface-visibility: hidden;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          z-index: 1;
        }

        #bg:before, #bg:after {
          content: '';
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        #bg:before {
          transition: background-color 2.5s ease-in-out;
          transition-delay: 0.75s;
          background-image: linear-gradient(to top, rgba(19, 21, 25, 0.5), rgba(19, 21, 25, 0.5));
          background-size: auto, 256px 256px;
          background-position: center, center;
          background-repeat: no-repeat, repeat;
          z-index: 2;
        }

        #bg:after {
          transform: scale(1.125);
          transition: transform 0.325s ease-in-out, filter 0.325s ease-in-out;
          background-image: url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop");
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          z-index: 1;
        }

        body.is-article-visible #bg:after {
          transform: scale(1.0825);
          filter: blur(0.2rem);
        }

        body.is-preload #bg:before {
          background-color: #000000;
        }

        #wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          position: relative;
          min-height: 100vh;
          width: 100%;
          padding: 4rem 2rem;
          z-index: 3;
        }

        #wrapper:before {
          content: '';
          display: block;
        }

        @media screen and (max-width: 1680px) {
          #wrapper {
            padding: 3rem 2rem;
          }
        }

        @media screen and (max-width: 736px) {
          #wrapper {
            padding: 2rem 1rem;
          }
        }

        @media screen and (max-width: 480px) {
          #wrapper {
            padding: 1rem;
          }
        }

        #header {
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: transform 0.325s ease-in-out, filter 0.325s ease-in-out, opacity 0.325s ease-in-out;
          background-image: radial-gradient(rgba(0, 0, 0, 0.25) 25%, rgba(0, 0, 0, 0) 55%);
          max-width: 100%;
          text-align: center;
        }

        #header > * {
          transition: opacity 0.325s ease-in-out;
          position: relative;
          margin-top: 3.5rem;
        }

        #header > *:before {
          content: '';
          display: block;
          position: absolute;
          top: calc(-3.5rem - 1px);
          left: calc(50% - 1px);
          width: 1px;
          height: calc(3.5rem + 1px);
          background: #ffffff;
        }

        #header > :first-child {
          margin-top: 0;
        }

        #header > :first-child:before {
          display: none;
        }

        #header .logo {
          width: 5.5rem;
          height: 5.5rem;
          line-height: 5.5rem;
          border: solid 1px #ffffff;
          border-radius: 100%;
        }

        #header .logo .icon:before {
          font-size: 2rem;
        }

        #header .content {
          border-style: solid;
          border-color: #ffffff;
          border-top-width: 1px;
          border-bottom-width: 1px;
          max-width: 100%;
        }

        #header .content .inner {
          transition: max-height 0.75s ease, padding 0.75s ease, opacity 0.325s ease-in-out;
          transition-delay: 0.25s;
          padding: 3rem 2rem;
          max-height: 40rem;
          overflow: hidden;
        }

        #header .content .inner > :last-child {
          margin-bottom: 0;
        }

        #header .content p {
          text-transform: uppercase;
          letter-spacing: 0.2rem;
          font-size: 0.8rem;
          line-height: 2;
        }

        #header nav ul {
          display: flex;
          margin-bottom: 0;
          list-style: none;
          padding-left: 0;
          border: solid 1px #ffffff;
          border-radius: 4px;
        }

        #header nav ul li {
          padding-left: 0;
          border-left: solid 1px #ffffff;
        }

        #header nav ul li:first-child {
          border-left: 0;
        }

        #header nav ul li a {
          display: block;
          min-width: 7.5rem;
          height: 2.75rem;
          line-height: 2.75rem;
          padding: 0 1.25rem 0 1.45rem;
          text-transform: uppercase;
          letter-spacing: 0.2rem;
          font-size: 0.8rem;
          border-bottom: 0;
        }

        #header nav ul li a:hover {
          background-color: rgba(255, 255, 255, 0.075);
        }

        body.is-article-visible #header {
          transform: scale(0.95);
          filter: blur(0.1rem);
          opacity: 0;
        }

        body.is-preload #header {
          filter: blur(0.125rem);
        }

        body.is-preload #header > * {
          opacity: 0;
        }

        body.is-preload #header .content .inner {
          max-height: 0;
          padding-top: 0;
          padding-bottom: 0;
          opacity: 0;
        }

        @media screen and (max-width: 736px) {
          #header > * {
            margin-top: 2rem;
          }
          #header > *:before {
            top: calc(-2rem - 1px);
            height: calc(2rem + 1px);
          }
          #header .logo {
            width: 4.75rem;
            height: 4.75rem;
            line-height: 4.75rem;
          }
          #header .logo .icon:before {
            font-size: 1.75rem;
          }
          #header .content .inner {
            padding: 2.5rem 1rem;
          }
          #header .content p {
            line-height: 1.875;
          }
        }

        @media screen and (max-width: 480px) {
          #header {
            padding: 1.5rem 0;
          }
          #header .content .inner {
            padding: 2.5rem 0;
          }
          #header nav ul {
            flex-direction: column;
            min-width: 10rem;
            max-width: 100%;
          }
          #header nav ul li {
            border-left: 0;
            border-top: solid 1px #ffffff;
          }
          #header nav ul li:first-child {
            border-top: 0;
          }
          #header nav ul li a {
            height: 3rem;
            line-height: 3rem;
            min-width: 0;
            width: 100%;
          }
        }

        #main {
          flex-grow: 1;
          flex-shrink: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          position: relative;
          max-width: 100%;
          z-index: 3;
        }

        #main article {
          transform: translateY(0.25rem);
          transition: opacity 0.325s ease-in-out, transform 0.325s ease-in-out;
          padding: 4.5rem 2.5rem 1.5rem 2.5rem;
          position: relative;
          width: 40rem;
          max-width: 100%;
          background-color: rgba(27, 31, 34, 0.85);
          border-radius: 4px;
          opacity: 0;
        }

        #main article.active {
          transform: translateY(0);
          opacity: 1;
        }

        #main article .close {
          display: block;
          position: absolute;
          top: 0;
          right: 0;
          width: 4rem;
          height: 4rem;
          cursor: pointer;
          text-indent: 4rem;
          overflow: hidden;
          white-space: nowrap;
        }

        #main article .close:before {
          transition: background-color 0.2s ease-in-out;
          content: '';
          display: block;
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 100%;
          background-position: center;
          background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='20px' height='20px' viewBox='0 0 20 20' zoomAndPan='disable'%3E%3Cstyle%3Eline %7B stroke: %23ffffff%3B stroke-width: 1%3B %7D%3C/style%3E%3Cline x1='2' y1='2' x2='18' y2='18' /%3E%3Cline x1='18' y1='2' x2='2' y2='18' /%3E%3C/svg%3E");
          background-size: 20px 20px;
          background-repeat: no-repeat;
        }

        #main article .close:hover:before {
          background-color: rgba(255, 255, 255, 0.075);
        }

        @media screen and (max-width: 736px) {
          #main article {
            padding: 3.5rem 2rem 0.5rem 2rem;
          }
          #main article .close:before {
            top: 0.875rem;
            left: 0.875rem;
            width: 2.25rem;
            height: 2.25rem;
            background-size: 14px 14px;
          }
        }

        @media screen and (max-width: 480px) {
          #main article {
            padding: 3rem 1.5rem 0.5rem 1.5rem;
          }
        }

        #footer {
          transition: transform 0.325s ease-in-out, filter 0.325s ease-in-out, opacity 0.325s ease-in-out;
          width: 100%;
          max-width: 100%;
          margin-top: 2rem;
          text-align: center;
        }

        #footer .copyright {
          letter-spacing: 0.2rem;
          font-size: 0.6rem;
          opacity: 0.75;
          margin-bottom: 0;
          text-transform: uppercase;
        }

        body.is-article-visible #footer {
          transform: scale(0.95);
          filter: blur(0.1rem);
          opacity: 0;
        }

        body.is-preload #footer {
          opacity: 0;
        }
      `}} />

      <div id="wrapper">
        <header id="header">
          <div className="logo">
            <span className="text-4xl font-bold">DM</span>
          </div>
          <div className="content">
            <div className="inner">
              <h1>DebateMe</h1>
              <p>Engage in thoughtful discourse and real-time debates<br />
              with people from around the world.</p>
            </div>
          </div>
          <nav>
            <ul>
              <li><a href="#intro">Intro</a></li>
              <li><a href="#work">Work</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </nav>
        </header>

        <div id="main">
          <article id="intro">
            <h2 className="major">Intro</h2>
            <span className="image main"><img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop" alt="" /></span>
            <p>Aenean ornare velit lacus, ac varius enim ullamcorper eu. Proin aliquam facilisis ante interdum congue. Integer mollis, nisl amet convallis, porttitor magna ullamcorper, amet egestas mauris. Ut magna finibus nisi nec lacinia. Nam maximus erat id euismod egestas. By the way, check out my <a href="#work">awesome work</a>.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis dapibus rutrum facilisis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam tristique libero eu nibh porttitor fermentum. Nullam venenatis erat id vehicula viverra. Nunc ultrices eros ut ultricies condimentum. Mauris risus lacus, blandit sit amet venenatis non, bibendum vitae dolor. Nunc lorem mauris, fringilla in aliquam at, euismod in lectus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In non lorem sit amet elit placerat maximus. Pellentesque aliquam maximus risus, vel sed vehicula.</p>
          </article>

          <article id="work">
            <h2 className="major">Work</h2>
            <span className="image main"><img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop" alt="" /></span>
            <p>Adipiscing magna sed dolor elit. Praesent eleifend dignissim arcu, at eleifend sapien imperdiet ac. Aliquam erat volutpat. Praesent urna nisi, fringila lorem et vehicula lacinia quam. Integer sollicitudin mauris nec lorem luctus ultrices.</p>
            <p>Nullam et orci eu lorem consequat tincidunt vivamus et sagittis libero. Mauris aliquet magna magna sed nunc rhoncus pharetra. Pellentesque condimentum sem. In efficitur ligula tate urna. Maecenas laoreet massa vel lacinia pellentesque lorem ipsum dolor. Nullam et orci eu lorem consequat tincidunt. Vivamus et sagittis libero. Mauris aliquet magna magna sed nunc rhoncus amet feugiat tempus.</p>
          </article>

          <article id="about">
            <h2 className="major">About</h2>
            <span className="image main"><img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop" alt="" /></span>
            <p>Lorem ipsum dolor sit amet, consectetur et adipiscing elit. Praesent eleifend dignissim arcu, at eleifend sapien imperdiet ac. Aliquam erat volutpat. Praesent urna nisi, fringila lorem et vehicula lacinia quam. Integer sollicitudin mauris nec lorem luctus ultrices. Aliquam libero et malesuada fames ac ante ipsum primis in faucibus. Cras viverra ligula sit amet ex mollis mattis lorem ipsum dolor sit amet.</p>
          </article>

          <article id="contact">
            <h2 className="major">Contact</h2>
            <form method="post" action="#">
              <div className="fields">
                <div className="field half">
                  <label htmlFor="name">Name</label>
                  <input type="text" name="name" id="name" />
                </div>
                <div className="field half">
                  <label htmlFor="email">Email</label>
                  <input type="text" name="email" id="email" />
                </div>
                <div className="field">
                  <label htmlFor="message">Message</label>
                  <textarea name="message" id="message" rows="4"></textarea>
                </div>
              </div>
              <ul className="actions">
                <li><input type="submit" value="Send Message" className="primary" /></li>
                <li><input type="reset" value="Reset" /></li>
              </ul>
            </form>
            <ul className="icons">
              <li><a href="#" className="icon brands fa-twitter"><span className="label">Twitter</span></a></li>
              <li><a href="#" className="icon brands fa-facebook-f"><span className="label">Facebook</span></a></li>
              <li><a href="#" className="icon brands fa-instagram"><span className="label">Instagram</span></a></li>
              <li><a href="#" className="icon brands fa-github"><span className="label">GitHub</span></a></li>
            </ul>
          </article>
        </div>

        <footer id="footer">
          <p className="copyright">&copy; Untitled.</p>
        </footer>
      </div>

      <div id="bg"></div>
    </>
  );
}