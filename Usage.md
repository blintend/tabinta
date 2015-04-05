After installation and browser restart, there is nothing more to set up. Whenever you go to a textarea and press the tab key, you will insert tab characters instead of moving focus.

The special tab behavior can be turned on and off. Right-click on a textarea; in the context menu you can toggle tabinta activity. If there is a checkmark in front of the "Tabinta" menu item, then tab key inserts the character. If no checkmark, then tab moves focus. Note: this option is also available as a hidden preference: `tabinta.active` (available in `about:config`).

Soft tab option is available too. By turning hidden preference `tabinta.hard` off, the appropriate number of spaces get inserted instead of the hard tab character. Soft tab width is controlled by the `tabinta.tab_width` preference, 8 by default.

Advanced users can disable Tabinta on a field-by-field basis. This is controlled by hidden preferences that specify which website and field is to be turned off. The preferences are named `tabinta.filter.N.href` for the website address and `tabinta.filter.N.ctlname` for the name attribute of the textarea field. N goes as 0, 1, ... for the individual entries. Example: for Google Mail, when composing a message, the "To" field is a textarea where typing tab characters does not make sense. To disable Tabinta on that field:

```
  tabinta.filter.0.ctlname  to
  tabinta.filter.0.href     http://mail.google.com/mail
```