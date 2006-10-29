// Insert text into the given element
function tabinta_insertText(element, aText) {
    var command = "cmd_insertText";
    var controller = element.controllers.getControllerForCommand(command);
    if (controller && controller.isCommandEnabled(command)) {
        controller = controller.QueryInterface(Components.interfaces.nsICommandController);
        var params = Components.classes["@mozilla.org/embedcomp/command-params;1"];
        params = params.createInstance(Components.interfaces.nsICommandParams);
        params.setStringValue("state_data", aText);
        controller.doCommandWithParams(command, params);
    }
}

// Return the given preference branch object.
// It is prepared for both nsIPrefBranch and nsIPrefBranchInternal usage.
function tabinta_getPrefBranch(root) {
    var prefb = Components.classes["@mozilla.org/preferences-service;1"]
            .getService(Components.interfaces.nsIPrefService)
            .getBranch(root);
    prefb.QueryInterface(Components.interfaces.nsIPrefBranchInternal);
    return prefb;
}
