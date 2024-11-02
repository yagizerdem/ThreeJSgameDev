import GUI from "lil-gui";
class DebugPanel {
  constructor() {
    this.panel = new GUI();
  }
  addItem(key, value, name) {
    this.panel.add(key, value).name(name);
  }
}

// enforece singleton
function closure() {
  const panel = new DebugPanel();
  return () => {
    return panel;
  };
}
const getDebugPanel = closure();

export default getDebugPanel;
