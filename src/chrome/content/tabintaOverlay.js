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
    
    init: function() {
        tabinta.prefb = tabinta.getPrefBranch("tabinta.");
        tabinta.prefb.addObserver("active", tabinta.activeObserver, false);
        tabinta.syncActive();
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
            .setAttribute("checked", active); // simply .checked = active did not work
    },

    /* Tabinta functionality */
    
    onKeyPress: function(event) {
        if (event.keyCode==9 && !event.shiftKey && !event.ctrlKey
                && !event.altKey && event.originalTarget.nodeName=="TEXTAREA") {
            tabinta.insertTab(event.originalTarget);
            event.preventDefault();
        }
    },

    insertTab: function(element) {
        tabinta.insertText(element, "\t");
    }
      
}
