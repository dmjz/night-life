/*global $*/
/*global appUrl*/
/*global ajaxFunctions*/
/*global navigator*/
'use strict';

(function () {
   
   var yelpApiUrl = appUrl + '/api/yelp';
   var shopApiUrl = appUrl + '/api/shop';
   var userApiUrl = appUrl + '/api/userino';
   
   var searchOnPage = false;
   
   function getCookie (name) {
      var cookies = document.cookie.split(';');
      var nameWithEq = name + '=';
      for (var i = 0; i < cookies.length; i++) {
         var currentCookie = cookies[i];
         while (currentCookie.charAt(0) === ' ') {
            currentCookie = currentCookie.slice(1);
         }
         if (currentCookie.indexOf(nameWithEq) === 0) {
            return currentCookie.slice(nameWithEq.length);
         }
      }
      return null;
   }
   
   function updateCounterAndButtons (counter, operation, addButton, removeButton) {
      var num = parseInt(counter.html());
      switch (operation) {
         case 'inc':
            counter.html((num + 1).toString());
            addButton.addClass('hidden');
            removeButton.removeClass('hidden');
            break;
         case 'dec':
            counter.html((num - 1).toString());
            removeButton.addClass('hidden');
            addButton.removeClass('hidden');
            break;
         default:
            break;
      }
   }
   
   function addClickHandler (event) {
      var counter = $(this).siblings('p').find('.result-counter');
      var addButton = $(this);
      var removeButton = $(this).siblings('.result-remove-button');
      var customApiUrl = userApiUrl + '/signup';
      var resultId = $(this).siblings('.result-id').attr('id');
      customApiUrl += '?id=' + resultId;
      customApiUrl += '&action=add';
      ajaxFunctions.ajaxRequest('GET', customApiUrl, function (data) {
         var dataObject = JSON.parse(data);
         if (dataObject.location) {
            document.cookie = "do_search=true";
            window.location = dataObject.location;
         } else if (dataObject.hasOwnProperty('error')) {
            console.log(data);
         } else if (dataObject.hasOwnProperty('operation')) {
            updateCounterAndButtons(counter, dataObject.operation, addButton, removeButton);
         } else {
            console.log('Bad addClick return:');
            console.log(data);
         }
      });
   }
   
   function removeClickHandler (event) {
      var counter = $(this).siblings('p').find('.result-counter');
      var removeButton = $(this);
      var addButton = $(this).siblings('.result-add-button');
      var customApiUrl = userApiUrl + '/signup';
      var resultId = $(this).siblings('.result-id').attr('id');
      customApiUrl += '?id=' + resultId;
      customApiUrl += '&action=remove';
      ajaxFunctions.ajaxRequest('GET', customApiUrl, function (data) {
         var dataObject = JSON.parse(data);
         if (dataObject.location) {
            document.cookie = "do_search=true";
            window.location = dataObject.location;
         } else if (dataObject.hasOwnProperty('error')) {
            console.log(data);
         } else if (dataObject.hasOwnProperty('operation')) {
            updateCounterAndButtons(counter, dataObject.operation, addButton, removeButton);
         } else {
            console.log('Bad removeClick return:');
            console.log(data);
         }
      });
   }
   
   function getCategoryStrings (dataObject, categoryStrings) {
      for (var i = 0; i < dataObject.businesses.length; i++) {
         var business = dataObject.businesses[i];
         var categoryStr = '';
         for (var j = 0; j < business.categories.length; j++) {
            categoryStr += business.categories[j].title;
            if (j < business.categories.length - 1) {
               categoryStr += ', ';
            }
         }
         categoryStrings.push(categoryStr);
      }
   }
   
   function callApiAndSetDOM (user, customYelpApiUrl) {
      var userObject = JSON.parse(user);
      ajaxFunctions.ajaxRequest('GET', customYelpApiUrl, function (data) {
         var dataObject = JSON.parse(data);
         var categoryStrings = [];
         getCategoryStrings(dataObject, categoryStrings);
         var newResultRows = [];
         var counter = 0;
         for (var i = 0; i < dataObject.businesses.length; i++) {
            newResultRows.push($('.sample-result-row').clone());
            newResultRows[i]
               .removeClass('sample-result-row')
               .removeClass('hidden')
               .addClass('result-row');
            newResultRows[i]
               .find('.result-anchor')
               .attr('href', dataObject.businesses[i].url);
            newResultRows[i]
               .find('.result-name-text')
               .html(dataObject.businesses[i].name);
            newResultRows[i]
               .find('.result-image')
               .attr('src', dataObject.businesses[i].image_url)
               .attr('alt', dataObject.businesses[i].name + ' picture');
            newResultRows[i]
               .find('.result-snippet')
               .html('<em>'+categoryStrings[i]+'</em>');
            newResultRows[i]
               .find('.result-id')
               .attr('id', dataObject.businesses[i].id);
            newResultRows[i].find('.result-add-button').on('click', addClickHandler);
            newResultRows[i].find('.result-remove-button').on('click', removeClickHandler);
            if (userObject.hasOwnProperty('twitter')) {
               if (userObject.shopList.indexOf(dataObject.businesses[i].id) > -1) {
                  newResultRows[i].find('.result-remove-button').removeClass('hidden');
                  newResultRows[i].find('.result-add-button').addClass('hidden');
               }
            }
            // Note: IIFE is used here to give each call its own instance of the
            // index 'i'. Also, 'counter' is used to append rows after all calls
            // have finished, so that sort order can be preserved.
            (function (i, total) {
               ajaxFunctions.ajaxRequest('GET', shopApiUrl + '?id=' + dataObject.businesses[i].id, function (data) {
                  dataObject = JSON.parse(data);
                  newResultRows[i]
                     .find('.result-counter')
                     .html(dataObject.userCounter.toString());
                  counter++;
                  if (counter === total) {
                     for (var j = 0; j < newResultRows.length; j++) {
                        newResultRows[j].appendTo('#result-list');
                     }
                  }
               });
            })(i, dataObject.businesses.length);
         }
      });
   }
   
   function doSearch (term) {
      searchOnPage = true;
      document.cookie = 'term=' + term;
      var customYelpApiUrl = yelpApiUrl + '?term=' + term;
      ajaxFunctions.ajaxRequest('GET', userApiUrl, function (user) {
         navigator.geolocation.getCurrentPosition(
            function (position) {
               customYelpApiUrl += '&lat=' + position.coords.latitude.toString();
               customYelpApiUrl += '&lng=' + position.coords.longitude.toString();
               callApiAndSetDOM(user, customYelpApiUrl);
            }, function (error) {
               console.log('Geolocation failed.');
               customYelpApiUrl += '&lat=48.856614&lng=2.3522219';
               callApiAndSetDOM(user, customYelpApiUrl);
            }, {
               enableHighAccuracy: 'false',
               timeout: 15000
            }
         );
      });
   }
   
   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', userApiUrl, function (user) {
      var userObject = JSON.parse(user);
      if (!userObject.hasOwnProperty('twitter')) {
         $('.login-col').removeClass('hidden');
      }
      
      $('#search-button').on('click', function () {
         $('.result-row').remove();
         var term = $('#search-text').val();
         doSearch(term);
      });
      
      $('#search-text').on('keyup', function (e) {
         if (e.which == '13') {
            $('.result-row').remove();
            var term = $('#search-text').val();
            doSearch(term);
         }
      });
      
      $('#login-box').on('click', function () {
         if (searchOnPage) {
            document.cookie = 'do_search=true';
         }
         window.location = '/auth/twitter';
      });
      
      var do_search = getCookie('do_search');
      if (do_search) {
         if (do_search === 'true') {
            var term = getCookie('term');
            if (term !== null) {;
               doSearch(term);
               document.cookie = 'do_search=false';
            }
         }
      }
   }));
})();
