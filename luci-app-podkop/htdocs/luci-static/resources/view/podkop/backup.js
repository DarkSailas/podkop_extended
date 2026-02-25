"require baseclass";

return baseclass.extend({
    createBackupContent: function (section) {
        const o = section.option(form.DummyValue, "_backup");
        o.rawhtml = true;
        o.cfgvalue = () => {
            return E('div', { 'class': 'cbi-value' }, [
                E('label', { 'class': 'cbi-value-title' }, _('Backup Configuration')),
                E('div', { 'class': 'cbi-value-field' }, [
                    E('button', {
                        'class': 'cbi-button cbi-button-action',
                        'click': ui.createHandlerFn(this, function () {
                            ui.showModal(null, [
                                E('p', { 'class': 'spinning' }, _('Generating backup, please wait...'))
                            ]);

                            return fs.exec('/usr/bin/podkop', ['backup_b64']).then(res => {
                                ui.hideModal();
                                if (res.code === 0 && res.stdout) {
                                    const blob = new Blob([Uint8Array.from(atob(res.stdout.trim()), c => c.charCodeAt(0))], { type: 'application/gzip' });
                                    const url = window.URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.style.display = 'none';
                                    a.href = url;
                                    a.download = 'podkop_backup_' + new Date().toISOString().slice(0, 10) + '.tar.gz';
                                    document.body.appendChild(a);
                                    a.click();
                                    window.URL.revokeObjectURL(url);
                                    ui.addNotification(null, E('p', _('Backup downloaded successfully')), 'info');
                                } else {
                                    ui.addNotification(null, E('p', _('Failed to generate backup: %s').format(res.stderr || 'Unknown error')), 'error');
                                }
                            }).catch(err => {
                                ui.hideModal();
                                ui.addNotification(null, E('p', _('Failed to generate backup: %s').format(err.message)), 'error');
                            });
                        })
                    }, _('Download Backup (.tar.gz)'))
                ])
            ]);
        };
    }
});
