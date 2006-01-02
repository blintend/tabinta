const jsLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
        .getService(Components.interfaces.mozIJSSubScriptLoader);
jsLoader.loadSubScript("chrome://tabinta/content/common.js");

var tabinta = {

    /**
     * Reusable (not tabinta-specific) utility functions
     **/

    // Insert text into the given element
    insertText: function(element, aText) {
        var command = "cmd_insertText";
        var controller = element.controllers.getControllerForCommand(command);
        if (controller && controller.isCommandEnabled(command)) {
            controller = controller.QueryInterface(Components.interfaces.nsICommandController);
            var params = Components.classes["@mozilla.org/embedcomp/command-params;1"];
            params = params.createInstance(Components.interfaces.nsICommandParams);
            params.setStringValue("state_data", aText);
            controller.doCommandWithParams(command, params);
        }
    },

    // Return the given preference branch object.
    // It is prepared for both nsIPrefBranch and nsIPrefBranchInternal usage.
    getPrefBranch: function(root) {
        var prefb = Components.classes["@mozilla.org/preferences-service;1"]
                .getService(Components.interfaces.nsIPrefService)
                .getBranch(root);
        prefb.QueryInterface(Components.interfaces.nsIPrefBranchInternal);
        return prefb;
    },
    
    /**
     * Tabinta logic
     **/
    
    /* Initialization */
    
    prefb: undefined,   // preferences branch
    
    keyCode: undefined,
    charCode: undefined,
    shiftKey: undefined,
    ctrlKey: undefined,
    altKey: undefined,
    
    init: function() {
        tabinta.prefb = tabinta_getPrefBranch("tabinta.");
        tabinta.prefb.addObserver("active", tabinta.activeObserver, false);
        tabinta.prefb.addObserver("key", tabinta.keyObserver, false);
        tabinta.syncActive();
        tabinta.syncKey();
        // context menu setup:
        var menu = document.getElementById("contentAreaContextMenu");
        menu.addEventListener("popupshowing", tabinta.contextShowing, false);
    },
    
    /* Context menu handling */

    contextShowing: function() {
      var inta = gContextMenu.onTextInput
          && gContextMenu.target.localName.toUpperCase() == "TEXTAREA";
      gContextMenu.showItem("context-tabinta", inta);
      gContextMenu.showItem("context-sep-tabinta", inta);
    },
    
    activeToggle: function() {
      tabinta.setActive(!tabinta.isActive());
    },
    
    /* Active/passive state handling */
    
    activeObserver: {
        observe: function(subject, topic, data) {
            tabinta.syncActive();
        }
    },
    
    isActive: function() {
        return tabinta.prefb.getBoolPref("active");
    },

    setActive: function(active) {
        tabinta.prefb.setBoolPref("active", active);
    },

    syncActive: function() {
        var active = tabinta.isActive();
        var appcontent = document.getElementById("appcontent");
        if (active) {
            appcontent.addEventListener("keypress", tabinta.onKeyPress, false);
        } else {
            appcontent.removeEventListener("keypress", tabinta.onKeyPress, false);
        }
        document.getElementById("context-tabinta")
            .setAttribute("checked", active);
    },

    /* Key definition */
    
    keyObserver: {
        observe: function(subject, topic, data) {
            tabinta.syncKey();
        }
    },

    /* e.g. _extractProp("ab:c, de:f, gh:i", "de") -> "f" */
    _extractProp: function(str, prop, dflt) {
        var re = new RegExp("\\b" + prop + "\\s*:\\s*(\\w+)\\s*(,|$)");
        var match = re.exec(str);
        return match ? match[1] : dflt;
    },
    
    syncKey: function() {
        var keyStr = tabinta.prefb.getCharPref("key");
        tabinta.keyCode = tabinta._extractProp(keyStr, "keyCode", 0);
        tabinta.charCode = tabinta._extractProp(keyStr, "charCode", 0);
        tabinta.shiftKey = tabinta._extractProp(keyStr, "shiftKey", "false") == "true";
        tabinta.ctrlKey = tabinta._extractProp(keyStr, "ctrlKey", "false") == "true";
        tabinta.altKey = tabinta._extractProp(keyStr, "altKey", "false") == "true";
    },
    
    /* Tabinta functionality */
    
    onKeyPress: function(event) {
        if (event.keyCode==tabinta.keyCode
                && event.charCode==tabinta.charCode
//                && event.originalTarget.nodeName=="TEXTAREA"
                && event.shiftKey==tabinta.shiftKey
                && event.ctrlKey==tabinta.ctrlKey
                && event.altKey==tabinta.altKey) {
            tabinta.insertTab(event.originalTarget);
            event.preventDefault();
        }
    },

    insertTab: function(element) {
        tabinta_insertText(element, "\t");
    }
      
}
