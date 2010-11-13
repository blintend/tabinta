const jsLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
        .getService(Components.interfaces.mozIJSSubScriptLoader);
jsLoader.loadSubScript("chrome://tabinta/content/common.js");

var tabinta = {

    /* Initialization */
    
    prefb: undefined,   // preferences branch
    
    keyCode: undefined,
    charCode: undefined,
    shiftKey: undefined,
    ctrlKey: undefined,
    altKey: undefined,
    metaKey: undefined,

    ROWS_IGNORE: 1,

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
            appcontent.addEventListener("keypress", tabinta.onKeyPress, true);
        } else {
            appcontent.removeEventListener("keypress", tabinta.onKeyPress, true);
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

    getKeyStr: function() {
        return tabinta.prefb.getCharPref("key");
    },

    /* e.g. _extractProp("ab:c, de:f, gh:i", "de") -> "f" */
    _extractProp: function(str, prop, dflt) {
        var re = new RegExp("\\b" + prop + "\\s*:\\s*(\\w+)\\s*(,|$)");
        var match = re.exec(str);
        return match ? match[1] : dflt;
    },
    
    syncKey: function() {
        var keyStr = tabinta.getKeyStr();
        tabinta.keyCode = tabinta._extractProp(keyStr, "keyCode", 0);
        tabinta.charCode = tabinta._extractProp(keyStr, "charCode", 0);
        tabinta.shiftKey = tabinta._extractProp(keyStr, "shiftKey", "false") == "true";
        tabinta.ctrlKey = tabinta._extractProp(keyStr, "ctrlKey", "false") == "true";
        tabinta.altKey = tabinta._extractProp(keyStr, "altKey", "false") == "true";
        tabinta.metaKey = tabinta._extractProp(keyStr, "metaKey", "false") == "true";
    },
    
    /* Tabinta functionality */
    
    onKeyPress: function(event) {
        if (event.keyCode==tabinta.keyCode
                && event.charCode==tabinta.charCode
                && event.originalTarget.nodeName.toUpperCase()=="TEXTAREA"
                && event.shiftKey==tabinta.shiftKey
                && event.ctrlKey==tabinta.ctrlKey
                && event.altKey==tabinta.altKey
                && event.metaKey==tabinta.metaKey
                && tabinta.rowLimit(event)
                && tabinta.filter(event)) {
            tabinta.insertTab(event.originalTarget);
            event.preventDefault();
            event.stopPropagation();    // aggressive; needed for vbulletin; see http://www.linuxquestions.org/questions/lq-suggestions-and-feedback-7/how-does-one-enter-a-tab-character-into-a-post-834210/
        }
    },

    insertTab: function(element) {
        var text;
        if (tabinta.isHard()) {
            text = "\t";
	} else {
            var tabWidth = tabinta.getTabWidth();
            var tabPos = tabinta.getPosOffset(element);
            text = tabinta.spaces(tabWidth - (tabPos % tabWidth));
	}
        tabinta_insertText(element, text);
    },
    
    /* Spaces-as-tab */

    isHard: function() {
        return tabinta.prefb.getBoolPref("hard");
    },

    getTabWidth: function() {
        return tabinta.prefb.getIntPref("tab_width");
    },

    // return offset relative to the start of the line or the last tab character
    getPosOffset: function(element) {
        var value = element.value;
        var pos = element.selectionStart;
        for (var i=pos-1; i>=0; --i) {
            if ("\n\r\t".indexOf(value.charAt(i)) >= 0) break;
        }
        return pos-1-i;
    },

    spaces: function(n) {
        var SP8 = "        ";
        var sp = "";
        while (n > 8) {
            sp += SP8;
            n -= 8;
        }
        return sp + SP8.substring(0, n);
    },

    /* Exclude unwanted fields */

    filter: function(event) {
        for (var i=0; tabinta.hasExclude(i); ++i) {
            if (tabinta.isExcluded(event, i)) return false;
        }
        return true;
    },

    hasExclude: function(idx) {
        try {
            tabinta.prefb.getCharPref("filter."+idx+".href");
        } catch(e) { // we assume that the pref does not exist
            return false;
        }
        return true;
    },

    isExcluded: function(event, idx) {
        if (new RegExp(tabinta.prefb.getCharPref("filter."+idx+".href")).test(content.location.href)
                && tabinta.prefb.getCharPref("filter."+idx+".ctlname") == event.originalTarget.name) {
            return true;
        } else {
            return false;
        }
    },

    rowLimit: function(event) {
        var ctl = event.originalTarget;
        if (ctl.rows>0 && ctl.rows<=tabinta.ROWS_IGNORE) return false;
        return true;
    }

}
