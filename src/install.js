var XpiInstaller =
{
extFullName: 'Tab in Textarea', // The name displayed to the user (don't include the version)
extShortName: 'tabinta', // The leafname of the JAR file (without the .jar part)
extVersion: '0.5',
extAuthor: 'Balint Endrey',
extLocaleNames: ['en-US'],
extSkinNames: ['classic'],
extPostInstallMessage: 'Success! Please restart your browser to finish the installation.', // Set to null for no post-install message
profileInstall: true,
silentInstall: false,
install: function()
{
	var jarName = this.extShortName + '.jar';
	var profileDir = Install.getFolder('Profile', 'chrome');

	this.parseArguments();

	if (File.exists(Install.getFolder(profileDir, jarName)))
	{
		if (!this.silentInstall) Install.alert('Updating existing Profile install of ' + this.extFullName + ' to version ' + this.extVersion + '.');
		this.profileInstall = true;
	}
	else if (!this.silentInstall) this.profileInstall = Install.confirm('Install ' + this.extFullName + ' ' + this.extVersion + ' to your Profile directory (OK) or your Browser directory (Cancel)?');

	var dispName = this.extFullName + ' ' + this.extVersion;
	var regName = '/' + this.extAuthor + '/' + this.extShortName;
	Install.initInstall(dispName, regName, this.extVersion);

	var installPath;
	if (this.profileInstall) installPath = profileDir;
	else installPath = Install.getFolder('chrome');

	Install.addFile(null, 'chrome/' + jarName, installPath, null);

	var jarPath = Install.getFolder(installPath, jarName);
	var installType = this.profileInstall ? Install.PROFILE_CHROME : Install.DELAYED_CHROME;

	Install.registerChrome(Install.CONTENT | installType, jarPath, 'content/' + this.extShortName + '/');

	for (var locale in this.extLocaleNames)
	{
		var regPath = 'locale/' + this.extLocaleNames[locale] + '/' + this.extShortName + '/';
		Install.registerChrome(Install.LOCALE | installType, jarPath, regPath);
	}

	for (var skin in this.extSkinNames)
	{
		var regPath = 'skin/' + this.extSkinNames[skin] + '/' + this.extShortName + '/';
		Install.registerChrome(Install.SKIN | installType, jarPath, regPath);
	}

	var err = Install.performInstall();
	if (err == Install.SUCCESS || err == Install.REBOOT_NEEDED)
	{
		if (!this.silentInstall && this.extPostInstallMessage) Install.alert(this.extPostInstallMessage);
	}
	else return this.handleError(err);
},
parseArguments: function()
{
	var args = Install.arguments;
	if (args == 'p=0')
	{
		this.profileInstall = false;
		this.silentInstall = true;
	}
	else if (args == 'p=1') this.silentInstall = true;
},
handleError: function(err)
{
	if (!this.silentInstall) Install.alert('Error: Could not install ' + this.extFullName + ' ' + this.extVersion + ' (Error code: ' + err + ')');
	Install.cancelInstall(err);
}
};
XpiInstaller.install();
