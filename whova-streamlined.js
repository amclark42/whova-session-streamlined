// ==UserScript==
// @name         Whova Streamlined
// @namespace    https://github.com/amclark42
// @version      0.1
// @description  Remove obtrusive elements of a Whova browser session
// @author       Ash Clark
// @match        https://whova.com/portal/webapp/*/Agenda/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  console.log("Userscript loaded.");
  
  /* Create an internal CSS stylesheet for this page. */
  let addStyles = function () {
    var css, styles = '';
    css = document.createElement('style');
    //styles +=  ".small-red-dot, .notification-circle { display: none; }\n";
    styles += ".collapsed-toggle { padding: 1em 0.5em; }\n";
    styles += ".collapsed-toggle:hover, .collapsed-toggle:focus { background-color: #cde }\n";
    styles += ".collapsed-toggle svg { margin: 0 0.5em; }\n";
    styles += ".whova-side-navigation-menu.collapsed { min-width:unset; width: auto; }\n"
    styles += ".collapsed.whova-side-navigation-menu #whova-side-navigation-base-section, "
      + ".collapsed.whova-side-navigation-menu #whova-side-nav-scroll { display:none; }\n"
    styles += ".main-content .page-content { flex: 1 1 90%; width: auto; }\n";
    styles += ".agendav3-session-details-page-container .agenda-v3-compact-boards-container" 
      + "{ min-width: unset; }\n";
    styles += ".tab-list-container { min-width: 350px; }\n";
    styles += ".collapsed.tab-list-container { min-width: unset; }\n";
    styles += ".collapsed.tab-list-container .tabs { flex-direction: column; }\n";
    styles += ".collapsed.tab-list-container .tab-panel-container { display: none; }\n";
    
    /* Add CSS styles to <head>. */
    css.appendChild(document.createTextNode(styles));
    document.getElementsByTagName('head')[0].appendChild(css);
  };
  // END addStyles()
  
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
    var sidebarNav, collapseBtnSide,
        tabListNav, collapseBtnTab;
    /* Set up a base collapse button. */
    collapseBtnSide = document.createElement('button');
    collapseBtnSide.classList.add('collapsed-toggle');
    /* Clone the button for the right-hand sidebar. */
    collapseBtnTab = collapseBtnSide.cloneNode(true);
    /* Prepare the left-hand sidebar. */
    sidebarNav = document.getElementsByClassName('whova-side-navigation-menu')[0];
    sidebarNav.classList.add('collapsed');
    collapseBtnSide.setAttribute('id', 'toggle-sidenav');
    collapseBtnSide.addEventListener('click', toggleCollapse);
    collapseBtnSide.appendChild(expandIcon());
    /* Prepare the right-hand sidebar too. */
    tabListNav = document.getElementsByClassName('tab-list-container')[0];
    tabListNav.classList.add('collapsed');
    collapseBtnTab.setAttribute('id', 'toggle-tablist');
    collapseBtnTab.addEventListener('click', toggleCollapse);
    collapseBtnTab.appendChild(document.createTextNode("Toggle sidebar"));
    
    /* Add custom CSS rules. */
    addStyles();
    sidebarNav.prepend(collapseBtnSide);
    tabListNav.prepend(collapseBtnTab);
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
  
  //let toggleNotifications = function() {
    
  //};
  // END toggleNotifications()
  
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