import React            from 'react'
import { Control, Map } from 'leaflet'
import { MapComponent } from 'react-leaflet'
import { PropTypes }    from 'prop-types'

import 'leaflet-sidebar-v2/css/leaflet-sidebar.css'

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
  static contextTypes = {
    sidebar: PropTypes.object   // Hack due to forward-references
  }

  // Props:
  // id
  // renderIcon
  // header
  // anchor?
  render() {
    const active = this.props.active ? ' active' : '';
    const sidebar = this.context.sidebar.props;
    const closeIcon = sidebar.closeIcon ? sidebar.closeIcon
          : sidebar.position === 'right' ? "fa fa-caret-right"
          : "fa fa-caret-left";
    return (
      <div id="home" className={"sidebar-pane" + active}>
        <h1 className="sidebar-header">
          {this.props.header}
          <div className="sidebar-close"><i className={closeIcon}></i></div>
        </h1>
        {this.props.children}
      </div>
    );
  }
}

class Sidebar extends MapComponent<LeafletElement, Props> {
  static childContextTypes = {
    sidebar: PropTypes.instanceOf(Sidebar),
  }

  constructor(props) {
    super(props);
    this.state = {
      collapsed: !!props.collapsed,
    };
  }

  getChildContext() {
    return { sidebar: this };
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
