var tabinta = (function(undefined) {

    /* Initialization */
    
    var common = {};
    Components.utils.import("resource://tabinta/modules/common.jsm", common);

    const ROWS_IGNORE = 1;

    var prefb = undefined;   // preferences branch
    
    var keyCode = undefined;
    var charCode = undefined;
    var shiftKey = undefined;
    var ctrlKey = undefined;
    var altKey = undefined;
    var metaKey = undefined;

    function init() {
        prefb = common.getPrefBranch("tabinta.");
        prefb.addObserver("active", activeObserver, false);
        prefb.addObserver("key", keyObserver, false);
        syncActive();
        syncKey();
        // context menu setup:
        var menu = document.getElementById("contentAreaContextMenu");
        menu.addEventListener("popupshowing", contextShowing, false);
    }
    
    /* Context menu handling */

    function contextShowing() {
        var inta = gContextMenu.onTextInput
            && gContextMenu.target.localName.toUpperCase() == "TEXTAREA";
        gContextMenu.showItem("context-tabinta", inta);
        gContextMenu.showItem("context-sep-tabinta", inta);
    }
    
    function activeToggle() {
        setActive(!isActive());
    }
    
    /* Active/passive state handling */
    
    var activeObserver = {
        observe: function(subject, topic, data) {
            syncActive();
        }
    };
    
    function isActive() {
        return prefb.getBoolPref("active");
    }

    function setActive(active) {
        prefb.setBoolPref("active", active);
    }

    function syncActive() {
        var active = isActive();
        var appcontent = document.getElementById("appcontent");
        if (active) {
            appcontent.addEventListener("keypress", onKeyPress, true);
        } else {
            appcontent.removeEventListener("keypress", onKeyPress, true);
        }
        document.getElementById("context-tabinta")
            .setAttribute("checked", active);
    }

    /* Key definition */
    
    var keyObserver = {
        observe: function(subject, topic, data) {
            syncKey();
        }
    };

    function getKeyStr() {
        return prefb.getCharPref("key");
    }

    /* e.g. _extractProp("ab:c, de:f, gh:i", "de") -> "f" */
    function _extractProp(str, prop, dflt) {
        var re = new RegExp("\\b" + prop + "\\s*:\\s*(\\w+)\\s*(,|$)");
        var match = re.exec(str);
        return match ? match[1] : dflt;
    }
    
    function syncKey() {
        var keyStr = getKeyStr();
        keyCode = _extractProp(keyStr, "keyCode", 0);
        charCode = _extractProp(keyStr, "charCode", 0);
        shiftKey = _extractProp(keyStr, "shiftKey", "false") == "true";
        ctrlKey = _extractProp(keyStr, "ctrlKey", "false") == "true";
        altKey = _extractProp(keyStr, "altKey", "false") == "true";
        metaKey = _extractProp(keyStr, "metaKey", "false") == "true";
    }
    
    /* Tabinta functionality */
    
    function onKeyPress(event) {
        if (event.keyCode==keyCode
                && event.charCode==charCode
                && event.originalTarget.nodeName.toUpperCase()=="TEXTAREA"
                && event.shiftKey==shiftKey
                && event.ctrlKey==ctrlKey
                && event.altKey==altKey
                && event.metaKey==metaKey
                && rowLimit(event)
                && filter(event)) {
            insertTab(event.originalTarget);
            event.preventDefault();
            event.stopPropagation();    // aggressive; needed for vbulletin; see http://www.linuxquestions.org/questions/lq-suggestions-and-feedback-7/how-does-one-enter-a-tab-character-into-a-post-834210/
        }
    }

    function insertTab(element) {
        var text;
        if (isHard()) {
            text = "\t";
	} else {
            var tabWidth = getTabWidth();
            var tabPos = getPosOffset(element);
            text = spaces(tabWidth - (tabPos % tabWidth));
	}
        common.insertText(element, text);
    }
    
    /* Spaces-as-tab */

    function isHard() {
        return prefb.getBoolPref("hard");
    }

    function getTabWidth() {
        return prefb.getIntPref("tab_width");
    }

    // return offset relative to the start of the line or the last tab character
    function getPosOffset(element) {
        var value = element.value;
        var pos = element.selectionStart;
        for (var i=pos-1; i>=0; --i) {
            if ("\n\r\t".indexOf(value.charAt(i)) >= 0) break;
        }
        return pos-1-i;
    }

    function spaces(n) {
        var SP8 = "        ";
        var sp = "";
        while (n > 8) {
            sp += SP8;
            n -= 8;
        }
        return sp + SP8.substring(0, n);
    }

    /* Exclude unwanted fields */

    function filter(event) {
        for (var i=0; hasExclude(i); ++i) {
            if (isExcluded(event, i)) return false;
        }
        return true;
    }

    function hasExclude(idx) {
        try {
            prefb.getCharPref("filter."+idx+".href");
        } catch(e) { // we assume that the pref does not exist
            return false;
        }
        return true;
    }

    function isExcluded(event, idx) {
        if (new RegExp(prefb.getCharPref("filter."+idx+".href")).test(content.location.href)
                && prefb.getCharPref("filter."+idx+".ctlname") == event.originalTarget.name) {
            return true;
        } else {
            return false;
        }
    }

    function rowLimit(event) {
        var ctl = event.originalTarget;
        if (ctl.rows>0 && ctl.rows<=ROWS_IGNORE) return false;
        return true;
    }

    return {
        init: init,
        activeToggle: activeToggle
    };

})();
