import React                       from 'react'
import { Control, Map }            from 'leaflet'
import { MapComponent, PropTypes } from 'react-leaflet'

import 'leaflet-sidebar-v2/css/leaflet-sidebar.css'

type LeafletElement = Control.Sidebar;
type Props = {
  id: string,
  position?: string,            // left or right
  selected?: string,
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
  // anchor
  render() {
    return (
      <div id="home" className="sidebar-pane active">
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

  // Override render() so the <Map> element contains a div we can render to
  render() {
    return (
      // FIXME: sidebar-left/right from props
      // FIXME: add/remove collapsed class (state)
      // FIXME: from child props (including first as "home", and maintaining "active" state)
      <div id="sidebar" className="sidebar sidebar-left leaflet-touch">
        <div className="sidebar-tabs">
          <ul role="tablist">   {/* Top-aligned */}
            <li className="active"><a href="#home" role="tab"><i className="fa fa-bars"></i></a></li>
          </ul>
          <ul role="tablist">   {/* Bottom-aligned */}
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
