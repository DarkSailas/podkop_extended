"use strict";
"require view";
"require form";
"require baseclass";
"require network";
"require view.podkop.main as main";

// Settings content
"require view.podkop.settings as settings";

// Sections content
"require view.podkop.section as section";

// Dashboard content
"require view.podkop.dashboard as dashboard";

// Backup content
"require view.podkop.backup as backup";

// Diagnostic content
"require view.podkop.diagnostic as diagnostic";

// Styles
"require view.podkop.styles as styles";

const EntryPoint = {
  async render() {
    styles.inject();
    main.injectGlobalStyles();

    const podkopMap = new form.Map(
      "podkop",
      _("Podkop Settings"),
      _("Configuration for Podkop Extended service on OpenWRT"),
    );
    // Enable tab views
    podkopMap.tabbed = true;

    // Sections tab
    const sectionsSection = podkopMap.section(
      form.TypedSection,
      "section",
      _("Sections"),
    );
    sectionsSection.anonymous = false;
    sectionsSection.addremove = true;
    sectionsSection.template = "cbi/simpleform";

    // Render section content
    section.createSectionContent(sectionsSection);

    // Settings tab
    const settingsSection = podkopMap.section(
      form.TypedSection,
      "settings",
      _("Settings"),
    );
    settingsSection.anonymous = true;
    settingsSection.addremove = false;
    // Make it named [ config settings 'settings' ]
    settingsSection.cfgsections = function () {
      return ["settings"];
    };

    // Render settings content
    settings.createSettingsContent(settingsSection);

    // Diagnostic tab
    const diagnosticSection = podkopMap.section(
      form.TypedSection,
      "diagnostic",
      _("Diagnostics"),
    );
    diagnosticSection.anonymous = true;
    diagnosticSection.addremove = false;
    diagnosticSection.cfgsections = function () {
      return ["diagnostic"];
    };

    // Render diagnostic content
    diagnostic.createDiagnosticContent(diagnosticSection);

    // Dashboard tab
    const dashboardSection = podkopMap.section(
      form.TypedSection,
      "dashboard",
      _("Dashboard"),
    );
    dashboardSection.anonymous = true;
    dashboardSection.addremove = false;
    dashboardSection.cfgsections = function () {
      return ["dashboard"];
    };

    // Render dashboard content
    dashboard.createDashboardContent(dashboardSection);

    // Backup tab
    const backupSection = podkopMap.section(
      form.TypedSection,
      "backup",
      _("Backup"),
    );
    backupSection.anonymous = true;
    backupSection.addremove = false;
    backupSection.cfgsections = function () {
      return ["backup"];
    };

    // Render backup content
    backup.createBackupContent(backupSection);

    // Inject core service
    main.coreService();

    return podkopMap.render();
  },
};

return view.extend(EntryPoint);
