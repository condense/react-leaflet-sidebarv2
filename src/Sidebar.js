import React            from 'react'
import { MapComponent } from 'react-leaflet'
import { PropTypes }    from 'prop-types'

import 'leaflet-sidebar-v2/css/leaflet-sidebar.css'

class Tab extends React.Component {
  static contextTypes = {
    sidebar: PropTypes.object   // Hack due to forward-references
  }

  static propTypes = {
    id: PropTypes.string.isRequired,
    header: PropTypes.string.isRequired,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    closeIcon: PropTypes.string,
    anchor: PropTypes.oneOf(['top', 'bottom']),
  }

  render() {
    const sidebar = this.context.sidebar;
    const active = this.props.id === sidebar.state.selected ? ' active' : '';
    const closeIcon = sidebar.props.closeIcon ? sidebar.props.closeIcon
          : sidebar.props.position === 'right' ? "fa fa-caret-right"
          : "fa fa-caret-left";
    return (
      <div id="home" className={"sidebar-pane" + active}>
        <h1 className="sidebar-header">
          {this.props.header}
          <div className="sidebar-close"><i className={closeIcon} onClick={this.props.onClose}></i></div>
        </h1>
        {this.props.children}
      </div>
    );
  }
}

// https://github.com/facebook/react/issues/2979#issuecomment-222379916
const TabType = PropTypes.shape({
  type: PropTypes.oneOf([Tab])
});

class Sidebar extends MapComponent<LeafletElement, Props> {
  static childContextTypes = {
    sidebar: PropTypes.instanceOf(Sidebar),
  }

  static propTypes = {
    id: PropTypes.string.isRequired,
    collapsed: PropTypes.bool,
    position: PropTypes.oneOf(['left', 'right']),
    selected: PropTypes.string,
    onClose: PropTypes.func,
    onOpen: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(TabType),
      TabType
    ]).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      collapsed: !!props.collapsed,
      selected: props.selected || React.Children.toArray(props.children)[0].props.id,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      collapsed: !! nextProps.collapsed,
      selected: nextProps.selected || React.Children.toArray(nextProps.children)[0].props.id,
    })
  }

  getChildContext() {
    return { sidebar: this };
  }

  onClose(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ collapsed: true });
    this.props.onClose && this.props.onClose();
  }

  onOpen(e, tabid) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      collapsed: false,
      selected: tabid,
    });
    this.props.onOpen && this.props.onOpen(tabid);
  }

  renderTab(tab) {
    var icon;
    if (typeof(tab.props.icon) === 'function')
      icon = tab.props.icon();
    else if (typeof(tab.props.icon) === 'string')
      icon = <i className={tab.props.icon} />;
    const active = tab.props.id === this.state.selected ? ' active' : '';
    return (
      <li className={active} key={tab.props.id}>
        <a href={'#' + tab.props.id} role="tab" onClick={e => this.onOpen(e, tab.props.id)}>
          {icon}
        </a>
      </li>
    );
  }

  renderPanes(children) {
    return React.Children.map(children,
                              p => React.cloneElement(p, {onClose: this.onClose.bind(this)}))
  }

  // Override render() so the <Map> element contains a div we can render to
  render() {
    const position = ' sidebar-' + (this.props.position || 'left');
    const collapsed = this.state.collapsed ? ' collapsed' : '';

    const tabs = React.Children.toArray(this.props.children);
    const bottomtabs = tabs.filter(t => t.props.anchor === 'bottom');
    const toptabs = tabs.filter(t => t.props.anchor !== 'bottom');
    return (
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
          {this.renderPanes(this.props.children)}
        </div>
      </div>
    );
  }
}

export { Sidebar, Tab }
