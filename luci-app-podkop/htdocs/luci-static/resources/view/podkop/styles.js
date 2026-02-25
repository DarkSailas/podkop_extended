"require baseclass";

return baseclass.extend({
  inject: function () {
    const css = `
        #podkop-graph {
          box-shadow: inset 0 0 20px rgba(0, 255, 0, 0.05);
        }
        .cbi-map-descr {
          color: #aaa !important;
          font-style: italic;
        }
        .label.success {
          background-color: #008000 !important;
          box-shadow: 0 0 10px rgba(0, 128, 0, 0.5);
        }
        .label.warning {
          background-color: #804000 !important;
        }
        /* Simple Dark Overrides if not in dark mode */
        [data-theme="dark"] .cbi-section {
           border-color: #444 !important;
        }
        .cbi-button-action {
          background-image: linear-gradient(#444, #222) !important;
          border: 1px solid #555 !important;
          color: #eee !important;
          text-shadow: none !important;
        }
        .cbi-button-action:hover {
          background-image: linear-gradient(#555, #333) !important;
          border-color: #777 !important;
        }
      `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }
});
