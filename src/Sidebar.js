import React            from 'react'
import { MapComponent } from 'react-leaflet'
import { PropTypes }    from 'prop-types'

class Tab extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    header: PropTypes.string.isRequired,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    anchor: PropTypes.oneOf(['top', 'bottom']),
    disabled: PropTypes.bool,
    // Provided by the Sidebar; don't mark as required (user doesn't need to include them):
    onClose: PropTypes.func,
    closeIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    position: PropTypes.oneOf(['left', 'right']),
    active: PropTypes.bool,
  }

  render() {
    const active = this.props.active ? ' active' : '';
    var closeIcon;
    if (typeof(this.props.closeIcon) === 'string')
      closeIcon = <i className={this.props.closeIcon} />;
    else if (typeof(this.props.closeIcon) === 'object')
      closeIcon = this.props.closeIcon;
    else {
      const closecls = this.props.position === 'right' ? "fa fa-caret-right" : "fa fa-caret-left";
      closeIcon = <i className={closecls} />
    }
    return (
      <div id={this.props.id} className={"sidebar-pane" + active}>
        <h1 className="sidebar-header">
          {this.props.header}
          <div className="sidebar-close" onClick={this.props.onClose}>
            {closeIcon}
          </div>
        </h1>
        {this.props.children}
      </div>
    );
  }
}

// We need to prevent *native* events bubbling up to leaflet.  React
// attaches a global event handler to the document, so using
// stopPropagation on a React synthetic event has no effect because it
// has already been caught by leaflet.  Note the ref on our root
// element.
// We don't ignore 'click', because then our onOpen/Close handlers wouldn't work!
const ignoreEvents = ['dblclick',
                      'mouseover', 'mouseout', 'mousedown', 'mouseup', 'mousemove', 'wheel',
                      'pointerdown', 'pointermove', 'pointerup',
                      'MSPointerDown', 'MSPointerMove', 'MSPointerUp',
                      'touchdown', 'touchmove', 'touchup',
                      'dragstart', 'drag', 'dragend'];

// https://github.com/facebook/react/issues/2979#issuecomment-222379916
const TabType = PropTypes.shape({
  type: PropTypes.oneOf([Tab])
});

class Sidebar extends MapComponent<LeafletElement, Props> {
  static propTypes = {
    id: PropTypes.string.isRequired,
    collapsed: PropTypes.bool,
    position: PropTypes.oneOf(['left', 'right']),
    selected: PropTypes.string,
    closeIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    onClose: PropTypes.func,
    onOpen: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(TabType),
      TabType
    ]).isRequired,
  }

  constructor(props) {
    super(props);
    this.ignoreEvent = this.ignoreEvent.bind(this);
  }

  onClose(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onClose && this.props.onClose();
  }

  onOpen(e, tabid) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onOpen && this.props.onOpen(tabid);
  }

  ignoreEvent(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  componentDidMount() {
    ignoreEvents.forEach(e => this.rootElement.addEventListener(e, this.ignoreEvent));
  }

  componentWillUnmount() {
    ignoreEvents.forEach(e => this.rootElement.removeEventListener(e, this.ignoreEvent));
  }

  renderTab(tab) {
    var icon;
    if (typeof(tab.props.icon) === 'string')
      icon = <i className={tab.props.icon} />;
    else if (typeof(tab.props.icon) === 'object')
      icon = tab.props.icon;
    const active = tab.props.id === this.props.selected ? ' active' : '';
    const disabled = tab.props.disabled ? ' disabled' : '';
    return (
      <li className={active + disabled} key={tab.props.id}>
        <a href={'#' + tab.props.id} role="tab" onClick={e => tab.props.disabled || this.onOpen(e, tab.props.id)}>
          {icon}
        </a>
      </li>
    );
  }

  renderPanes(children) {
    return React.Children.map(children,
        p => React.cloneElement(p, {onClose: this.onClose.bind(this),
                                    closeIcon: this.props.closeIcon,
                                    active: p.props.id === this.props.selected,
                                    position: this.props.position || 'left'}));
  }

  // Override render() so the <Map> element contains a div we can render to
  render() {
    const position = ' sidebar-' + (this.props.position || 'left');
    const collapsed = this.props.collapsed ? ' collapsed' : '';

    const tabs = React.Children.toArray(this.props.children);
    const bottomtabs = tabs.filter(t => t.props.anchor === 'bottom');
    const toptabs = tabs.filter(t => t.props.anchor !== 'bottom');
    return (
      <div id={this.props.id} className={"sidebar leaflet-touch" + position + collapsed}
        ref={el => this.rootElement = el}>
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
