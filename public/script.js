var $divParents = $(".jsCenterOnPhrase"); // all instances
var sMarker = "##"; // marker for phrase position

// for each instance
$divParents.each(function () {
  // closures
  var $parent = $(this);
  var $phrase = $parent.find("div.jsCenteredPhrase");

  // if there is only one phrase
  if ($phrase.size() == 1) {
    // more closures
    var iParentWidth = $parent.innerWidth();
    var sPhrase = $phrase.text();
    var iPhraseWidth = $phrase.outerWidth();
    $phrase.replaceWith(sMarker);
    var sFullText = $parent.text().replace(/\s+/g, " ");
    // add html structure to container
    $parent.html(
      '<span class="jsLeftWrap"></span>' +
        '<span class="jsCenterWrap">' +
        '<span class="jsCenterPrefix"></span>' +
        '<span class="jsCenterPhrase"></span>' +
        '<span class="jsCenterSuffix"></span>' +
        "</span>" +
        '<span class="jsRightWrap"></span>'
    );
    // more closures
    var $LeftWrap = $parent.find(".jsLeftWrap");
    var $CenterWrap = $parent.find(".jsCenterWrap");
    var $CenterPrefix = $parent.find(".jsCenterPrefix");
    var $CenterPhrase = $parent.find(".jsCenterPhrase");
    var $CenterSuffix = $parent.find(".jsCenterSuffix");
    var $RightWrap = $parent.find(".jsRightWrap");

    // get all the words left and right into arrays
    var iLeftStart = 0;
    var iLeftEnd = sFullText.indexOf(sMarker);
    var iRightStart = iLeftEnd + sMarker.length;
    var iRightEnd = sFullText.length - 1;
    var sFullLeft = sFullText.substring(iLeftStart, iLeftEnd);
    var sFullRight = sFullText.substring(iRightStart, iRightEnd);
    var aFullLeft = sFullLeft.split(" ");
    var aFullRight = sFullRight.split(" ");

    // build out each word as a node
    for (var i = 0; i < aFullLeft.length; i++) {
      var sVal = aFullLeft[i];
      if (sVal != "") {
        $("<span> " + sVal + " </span>").appendTo($LeftWrap);
      }
    }
    for (var i = 0; i < aFullRight.length; i++) {
      var sVal = aFullRight[i];
      if (sVal != "") {
        $("<span> " + sVal + " </span>").appendTo($RightWrap);
      }
    }

    // reset text as full html words
    sFullLeft = $LeftWrap.html();
    sFullRight = $RightWrap.html();

    var fResize = function () {
      // reset closures for dynamic sizing
      $LeftWrap.html(sFullLeft);
      $CenterPrefix.html("").css("padding-left", 0);
      $CenterPhrase.html("&nbsp;" + sPhrase + "&nbsp;");
      $CenterSuffix.html("").css("padding-right", 0);
      $RightWrap.html(sFullRight);
      iParentWidth = $parent.innerWidth();

      // private variables
      var $leftWords = $LeftWrap.find("span");
      var $rightWords = $RightWrap.find("span");
      var iMaxWidthRemaining = iParentWidth - $CenterPhrase.outerWidth();
      var iMaxSideWidth = Math.floor(iMaxWidthRemaining / 2);
      var iLeftRemaining = iMaxSideWidth;
      var iRightRemaining = iMaxSideWidth;
      var iCurrentWidth = iPhraseWidth;
      var iLeftIndex = $leftWords.size() - 1; // work backwards
      var iRightIndex = 0; // work forwards
      var iKerningTollerance = 2; // wraps too much sometimes

      // loop trackers
      var bKeepGoing = true;
      var bKeepGoingRight = true;
      var bKeepGoingLeft = true;

      // loop while there is still room for the next word
      while (bKeepGoing) {
        // check the left side
        if (bKeepGoingLeft) {
          // get the next left word
          var $nextLeft = $leftWords.eq(iLeftIndex);
          var iLeftWordWidth = $nextLeft.outerWidth();
          if (iLeftWordWidth < iLeftRemaining) {
            // there's enough room.  add it.
            $nextLeft.prependTo($CenterPrefix);
            iLeftRemaining = iMaxSideWidth - $CenterPrefix.outerWidth();
            iLeftIndex--;
          } else {
            // not enough room.  add remaining room as padding
            bKeepGoingLeft = false;
            $CenterPrefix.css(
              "padding-left",
              iLeftRemaining - iKerningTollerance
            );
            iLeftRemaining = 0;
          }
        }

        // check the right side
        if (bKeepGoingRight) {
          // get the next right word
          var $nextRight = $rightWords.eq(iRightIndex);
          var iRightWordWidth = $nextRight.outerWidth();
          if (iRightWordWidth < iRightRemaining) {
            // there's enough room.  add it.
            $nextRight.appendTo($CenterSuffix);
            iRightRemaining = iMaxSideWidth - $CenterSuffix.outerWidth();
            iRightIndex++;
          } else {
            // not enough room.  add remaining room as padding
            bKeepGoingRight = false;
            $CenterSuffix.css(
              "padding-right",
              iRightRemaining - iKerningTollerance
            );
            iRightRemaining = 0;
          }
        }

        // is there room left on either side?
        bKeepGoing = bKeepGoingLeft || bKeepGoingRight;
      }

      // calculate where to put the breaks.
      var iTempWidth = iParentWidth;
      while (iLeftIndex > 0) {
        var $word = $leftWords.eq(iLeftIndex);
        iTempWidth = iTempWidth - $word.outerWidth();
        // account for kerning inconsistencies
        if (iTempWidth <= 2 * iKerningTollerance) {
          $("<br />").insertAfter($word);
          iTempWidth = iParentWidth;
        } else {
          iLeftIndex--;
        }
      }
    };

    // initial state
    fResize();

    $(window).resize(fResize);
  }
});
