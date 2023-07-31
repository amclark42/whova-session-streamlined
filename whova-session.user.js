// ==UserScript==
// @name         Whova Session Streamlined
// @namespace    https://github.com/amclark42/whova-session-streamlined
// @version      0.1
// @description  Remove obtrusive elements of a Whova browser session
// @author       Ash Clark
// @match        https://whova.com/portal/webapp/*/Agenda/*
// ==/UserScript==

(function() {
  'use strict';

  console.log("Userscript loaded.");
  
  /* Create an internal CSS stylesheet for this page. */
  let addStyles = function () {
    var css, styles = '';
    css = document.createElement('style');
    styles += ".no-notify .small-red-dot, .no-notify .notification-circle,\n"
      + ".no-notify .red-tag.solid-tag { display: none; }\n";
    styles += ".btn-toggle { padding: 1em 0.5em; }\n";
    styles += ".btn-toggle:hover, .btn-toggle:focus { background-color: #cde }\n";
    styles += ".btn-toggle svg { margin: 0 0.5em; }\n";
    styles += ".whova-side-navigation-menu.collapsed { min-width:unset; width: auto; }\n"
    styles += ".collapsed.whova-side-navigation-menu #whova-side-navigation-base-section, "
      + ".collapsed.whova-side-navigation-menu #whova-side-nav-scroll { display:none; }\n"
    styles += ".main-content .page-content { flex: 1 1 90%; width: auto; }\n";
    styles += ".agendav3-session-details-page-container .agenda-v3-compact-boards-container" 
      + "{ min-width: fit-content; }\n";
    styles += ".tab-list-container { min-width: 350px; }\n";
    styles += ".collapsed.tab-list-container { min-width: unset; }\n";
    styles += ".collapsed.tab-list-container .tabs { flex-direction: column; }\n";
    styles += ".collapsed.tab-list-container .tab-panel-container { display: none; }\n";
    /* Add CSS styles to <head>. */
    css.appendChild(document.createTextNode(styles));
    document.getElementsByTagName('head')[0].appendChild(css);
  };
  // END addStyles()
  
  const buttonBase = document.createElement('button').classList.add('btn-toggle');
  
  /* Recreate a SVG icon from Bootstrap:
      https://icons.getbootstrap.com/icons/signpost-split/ */
  const expandIcon = function () {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
        title = document.createElementNS('http://www.w3.org/2000/svg', 'title'),
        path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    svg.setAttributeNS(null, 'width', 16);
    svg.setAttributeNS(null, 'height', 16);
    svg.setAttributeNS(null, 'viewBox', '0 0 16 16');
    svg.setAttributeNS(null, 'fill', 'currentColor');
    title.appendChild(document.createTextNode('Toggle site navigation'));
    path.setAttributeNS(null, 'd', 
      'M7 7V1.414a1 1 0 0 1 2 0V2h5a1 1 0 0 1 .8.4l.975 1.3a.5.5 0 0 1 0 .6L14.8 5.6a1 1 0 0 1-.8.4H9v10H7v-5H2a1 1 0 0 1-.8-.4L.225 9.3a.5.5 0 0 1 0-.6L1.2 7.4A1 1 0 0 1 2 7h5zm1 3V8H2l-.75 1L2 10h6zm0-5h6l.75-1L14 3H8v2z');
    svg.appendChild(title);
    svg.appendChild(path);
    return svg;
  };
  // END expandIcon()
  
  /* Tweak the DOM, set up styles, create event listeners. */
  let onLoad = function() {
    var sidebarNav, collapseBtnSide;
    /* Clone the base toggle button for other uses. */
    collapseBtnSide = buttonBase.cloneNode(true);
    /* Prepare the left-hand sidebar. */
    sidebarNav = document.getElementsByClassName('whova-side-navigation-menu')[0];
    sidebarNav.classList.add('collapsed');
    collapseBtnSide.setAttribute('id', 'toggle-sidenav');
    collapseBtnSide.addEventListener('click', toggleCollapse);
    collapseBtnSide.appendChild(expandIcon());
    /* Add custom CSS rules before placing the new elements in the DOM. */
    addStyles();
    sidebarNav.prepend(collapseBtnSide);
    updateSessionNav();
  };
  // END onLoad()
  
  /* When a button is clicked to toggle a sidebar, try to toggle the 'collapsed' 
    class on the button's parent. */
  let toggleCollapse = function(event) {
    var container = event.target;
    if ( container.nodeName === "BUTTON" ) {
      container = container.parentElement;
    } else if ( container.nodeName === 'svg' ) {
      container = container.parentElement.parentElement;
    } else if ( container.nodeName === 'path' ) {
      container = container.parentElement.parentElement.parentElement;
    } else {
      console.warn(container.nodeName);
      return;
    }
    //console.log(container);
    container.classList.toggle('collapsed');
  };
  // END toggleCollapse()
  
  /* When one of the visible tabs is clicked on the right, open the sidebar. */
  let toggleCollapseIncidentally = function() {
    document.getElementsByClassName('tab-list-container')[0]
      .classList.toggle('collapsed', false);
  };
  // END toggleCollapseIncidentally()
  
  /* Use a class to prevent notifications from showing up. */
  let toggleNotifications = function() {
    document.getElementsByTagName('body')[0].classList.toggle('no-notify');
  };
  // END toggleNotifications()
  
  /* Prepare the right-hand sidebar inside a Whova session. */
  let updateSessionNav = function() {
    var tabListNav, collapseBtnTab, notifyBtn;
    collapseBtnTab = buttonBase.cloneNode(true);
    notifyBtn = buttonBase.cloneNode(true);
    tabListNav = document.getElementsByClassName('tab-list-container')[0];
    tabListNav.classList.add('collapsed');
    collapseBtnTab.setAttribute('id', 'toggle-tablist');
    collapseBtnTab.addEventListener('click', toggleCollapse);
    collapseBtnTab.appendChild(document.createTextNode("Toggle sidebar"));
    notifyBtn.appendChild(document.createTextNode("Toggle notifications"));
    notifyBtn.addEventListener('click', toggleNotifications);
    /* Add new elements to the page. */
    tabListNav.prepend(notifyBtn);
    tabListNav.prepend(collapseBtnTab);
    /* Make sure that clicking a tab in the right-hand nav will toggle the sidebar 
      open. */
    document.querySelectorAll('.tabs .tab-btn').forEach( function(btn) {
      btn.addEventListener('click', toggleCollapseIncidentally);
    });
  };
  // END updateSessionNav()
  
  /* Whova keeps loading content after the page is "complete". As such, we wait a 
    bit before running this userscript. */
  if (document.readyState == 'complete') {
    setTimeout(function() { onLoad(); }, 2000);
  } else {
    // Wait until page has loaded, then wait a bit more.
    window.addEventListener('load',function() {
      setTimeout(function() { onLoad(); }, 2000);
    });
  }
  
})();