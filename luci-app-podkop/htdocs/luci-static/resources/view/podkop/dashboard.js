"use strict";
"require baseclass";
"require form";
"require ui";
"require uci";
"require fs";
"require rpc";

const callServiceStatus = rpc.declare({
  object: 'luci.podkop',
  method: 'get_status',
  expect: { "": {} }
});

const callSystemInfo = rpc.declare({
  object: 'luci.podkop',
  method: 'get_system_info',
  expect: { "": {} }
});

function createDashboardContent(section) {
  const o = section.option(form.DummyValue, "_dashboard_stats");
  o.rawhtml = true;

  let history = { rx: [], tx: [] };
  const maxHistory = 40;
  let lastRx = 0, lastTx = 0, lastTime = 0;

  o.render = function () {
    const container = E('div', { 'class': 'cbi-value' }, [
      E('label', { 'class': 'cbi-value-title' }, _('Real-time Traffic')),
      E('div', { 'class': 'cbi-value-field', 'style': 'width: 100%' }, [
        E('div', { 'id': 'podkop-graph', 'style': 'height: 150px; background: #111; border-radius: 8px; position: relative; overflow: hidden; margin-bottom: 10px; border: 1px solid #333;' }, [
          E('svg', { 'width': '100%', 'height': '100%', 'preserveAspectRatio': 'none', 'viewBox': '0 0 400 100' }, [
            E('path', { 'id': 'path-rx', 'fill': 'rgba(0, 255, 0, 0.1)', 'stroke': '#0f0', 'stroke-width': '1', 'd': 'M0,100 L400,100' }),
            E('path', { 'id': 'path-tx', 'fill': 'rgba(255, 0, 0, 0.1)', 'stroke': '#f00', 'stroke-width': '1', 'd': 'M0,100 L400,100' })
          ]),
          E('div', { 'style': 'position: absolute; top: 5px; right: 10px; color: #0f0; font-family: monospace; font-size: 10px;' }, [
            _('RX: '), E('span', { 'id': 'val-rx' }, '0 KB/s')
          ]),
          E('div', { 'style': 'position: absolute; top: 20px; right: 10px; color: #f00; font-family: monospace; font-size: 10px;' }, [
            _('TX: '), E('span', { 'id': 'val-tx' }, '0 KB/s')
          ])
        ])
      ])
    ]);

    L.poll.add(() => {
      return fs.read_file('/proc/net/dev').then(content => {
        const lines = content.split('\n');
        let curRx = 0, curTx = 0;
        lines.forEach(line => {
          const match = line.match(/^\s*(br-lan|eth\d|tun\d|wg\d):\s*(\d+)\s+\d+\s+\d+\s+\d+\s+\d+\s+\d+\s+\d+\s+\d+\s+(\d+)/);
          if (match) {
            curRx += parseInt(match[2]);
            curTx += parseInt(match[3]);
          }
        });

        const now = Date.now();
        if (lastTime > 0) {
          const dt = (now - lastTime) / 1000;
          const rxRate = (curRx - lastRx) / dt;
          const txRate = (curTx - lastTx) / dt;

          history.rx.push(rxRate);
          history.tx.push(txRate);
          if (history.rx.length > maxHistory) {
            history.rx.shift();
            history.tx.shift();
          }

          updateGraph(history);
          document.getElementById('val-rx').textContent = (rxRate / 1024).toFixed(1) + ' KB/s';
          document.getElementById('val-tx').textContent = (txRate / 1024).toFixed(1) + ' KB/s';
        }

        lastRx = curRx;
        lastTx = curTx;
        lastTime = now;
      });
    }, 2);

    function updateGraph(data) {
      const svgRx = document.getElementById('path-rx');
      const svgTx = document.getElementById('path-tx');
      if (!svgRx || !svgTx) return;

      const max = Math.max(...data.rx, ...data.tx, 1024 * 10); // Min 10KB scale
      const getPoints = (vals) => {
        let pts = vals.map((v, i) => `${(i / (maxHistory - 1)) * 400},${100 - (v / max) * 100}`).join(' ');
        return `M${pts} L400,100 L0,100 Z`;
      };

      svgRx.setAttribute('d', getPoints(data.rx));
      svgTx.setAttribute('d', getPoints(data.tx));
    }

    return container;
  };
}


const EntryPoint = {
  createDashboardContent,
};

return baseclass.extend(EntryPoint);
