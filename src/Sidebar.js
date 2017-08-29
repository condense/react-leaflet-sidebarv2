import React                       from 'react'
import { Control, Map }            from 'leaflet'
import { MapComponent, PropTypes } from 'react-leaflet'

import 'leaflet-sidebar-v2/css/leaflet-sidebar.css'

type LeafletElement = Control.Sidebar;
type Props = {
  id: string,
  position?: string,            // left or right
  selected?: string,
  disabled?: boolean,
  // renderClose?
  // onOpening
  // onClosing
  // onContent
}

class Tab extends React.Component {
  // Props:
  // id
  // renderIcon
  // header
  // anchor?
  render() {
    // TODO: handle caret-left/right appropriately, and different fonts
    const active = this.props.active ? ' active' : '';
    return (
      <div id="home" className={"sidebar-pane" + active}>
        <h1 className="sidebar-header">
          {this.props.header}
          <div className="sidebar-close"><i className="fa fa-caret-left"></i></div>
        </h1>
        {this.props.children}
      </div>
    );
  }
}

class Sidebar extends MapComponent<LeafletElement, Props> {
  static contextTypes = {
    map: PropTypes.map,
  }

  constructor(props) {
    super(props);
    this.state = {
      collapsed: !!props.collapsed,
    };
  }

  renderTab(tab) {
    var icon;
    if (typeof(tab.props.icon) === 'function')
      icon = tab.props.icon();
    else if (typeof(tab.props.icon) === 'string')
      icon = <i className={tab.props.icon} />;
    const active = tab.props.active ? ' active' : '';
    return (
      <li className={active} key={tab.props.id}>
        <a href={'#' + tab.props.id} role="tab">
          {icon}
        </a>
      </li>
    );
  }

  // Override render() so the <Map> element contains a div we can render to
  render() {
    const position = ' sidebar-' + (this.props.position || 'left');
    const collapsed = this.state.collapsed ? ' collapsed' : '';

    const tabs = React.Children.toArray(this.props.children);
    const bottomtabs = tabs.filter(t => t.props.anchor === 'bottom');
    const toptabs = tabs.filter(t => t.props.anchor !== 'bottom');
    return (
      // FIXME: from child props (including first as "home", and maintaining "active" state)
      <div id="sidebar" className={"sidebar leaflet-touch" + position + collapsed}>
        <div className="sidebar-tabs">
          <ul role="tablist">   {/* Top-aligned */}
            {toptabs.map(t => this.renderTab(t))}
          </ul>
          <ul role="tablist">   {/* Bottom-aligned */}
            {bottomtabs.map(t => this.renderTab(t))}
          </ul>
        </div>
        <div className="sidebar-content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export { Sidebar, Tab }
