"use strict";

function button1Action() {
    alert('Button 1 clicked!');
  }

  function button2Action() {
    alert('Button 2 clicked!');
  }

  function button3Action() {
    document.getElementById('popup').style.display = 'block';
  }

  function closePopup() {
    document.getElementById('popup').style.display = 'none';
  }
  
  function feedbackButtonAction() {
    alert('Feedback button clicked!');
  }