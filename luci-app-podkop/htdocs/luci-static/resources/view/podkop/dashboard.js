"use strict";
"require baseclass";
"require form";
"require ui";
"require uci";
"require fs";

function createDashboardContent(section) {
  const o = section.option(form.DummyValue, "_mount_node");
  o.rawhtml = true;
  o.cfgvalue = () => {
    return _("Dashboard logic is being modernized. Please wait for the next update.");
  };
}

const EntryPoint = {
  createDashboardContent,
};

return baseclass.extend(EntryPoint);
