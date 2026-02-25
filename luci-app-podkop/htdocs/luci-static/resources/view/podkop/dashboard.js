"use strict";
"require baseclass";
"require form";
"require ui";
"require uci";
"require fs";
"require ui";
"require rpc";

const callServiceStatus = rpc.declare({
  object: 'luci.podkop',
  method: 'get_status',
  expect: { "": {} }
});

function createDashboardContent(section) {
  const o = section.option(form.DummyValue, "_mount_node");
  o.rawhtml = true;
  o.cfgvalue = function () {
    return E('div', { 'class': 'spinning' }, _('Fetching status...'));
  };

  o.render = function () {
    return L.resolveDefault(callServiceStatus(), {}).then(status => {
      return E('div', { 'class': 'cbi-value' }, [
        E('label', { 'class': 'cbi-value-title' }, _('Service Status')),
        E('div', { 'class': 'cbi-value-field' }, [
          E('span', {
            'class': status.running ? 'label success' : 'label warning',
            'style': 'margin-right: 10px'
          }, status.running ? _('Running') : _('Stopped')),
          E('button', {
            'class': 'cbi-button cbi-button-action',
            'click': ui.createHandlerFn(this, () => {
              return fs.exec('/etc/init.d/podkop', ['restart']).then(() => location.reload());
            })
          }, _('Restart Podkop'))
        ])
      ]);
    });
  };
}

const EntryPoint = {
  createDashboardContent,
};

return baseclass.extend(EntryPoint);
