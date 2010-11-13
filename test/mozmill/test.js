/* TODO
  - prefs api; negative tests with tabinta turned off
*/
var setupModule = function(module) {
  module.controller = mozmill.getBrowserController();
  module.TEST_BASE_URL = collector.addHttpResource('.');
};

var getDocForNewTestPage = function(htmlName) {
  controller.click(new elementslib.Elem(controller.menus.File['menu_newNavigatorTab']));
  controller.open(TEST_BASE_URL + htmlName);
  controller.waitForPageLoad();
  return controller.tabs.activeTab;
}

var assertTabInsertedInTextarea = function(htmlName) {
  var doc = getDocForNewTestPage(htmlName);
  var eTa = new elementslib.ID(doc, 'ta');
  var eNext = new elementslib.ID(doc, 'next');
  controller.click(eTa);
  controller.keypress(null, 'a', {});
  controller.keypress(null, 'VK_TAB', {});
  controller.keypress(null, 'c', {});

  controller.assertValue(eTa, "a\tc"); // tab has been inserted properly
  controller.assertValue(eNext, "");
  controller.assert(function() {
    return doc.activeElement == doc.getElementById('ta');
  });
  
};

var testTabInsertedInSimpleTextarea = function() {
  assertTabInsertedInTextarea("simple.html");
}

var testTabInsertedDespiteAggressiveKeyHandler = function() {
  assertTabInsertedInTextarea("aggressive.html");
}

var testTabNotInsertedInOneRowTextarea = function() {
  var doc = getDocForNewTestPage("onerow.html");
  var eTa = new elementslib.ID(doc, 'ta');
  var eNext = new elementslib.ID(doc, 'next');
  controller.click(eTa);
  controller.keypress(null, 'a', {});
  controller.keypress(null, 'VK_TAB', {});
  controller.keypress(null, 'c', {});

  // tab caused move instead of insertion
  controller.assertValue(eTa, "a");
  controller.assertValue(eNext, "c");
  controller.assert(function() {
    return doc.activeElement == doc.getElementById('next');
  });
  
};

