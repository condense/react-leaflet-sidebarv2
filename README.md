# React-Leaflet Sidebar-v2

A [react-leaflet](https://github.com/PaulLeCam/react-leaflet) plugin
for
[leaflet-sidebar-v2](https://github.com/nickpeihl/leaflet-sidebar-v2)
(which is a leaflet-only fork
of [sidebar-v2](https://github.com/Turbo87/sidebar-v2))

The twist is the implementation of sidebar-v2 isn't very compatible
with React, so this plugin actually renders all markup via React,
including event handling, and just leverages the CSS from sidebar-v2.

## Getting Started

You will need to include the sidebar-v2 css in your page somehow, for
example
[via a CDN](https://unpkg.com/leaflet-sidebar-v2@1.0.0/css/leaflet-sidebar.min.css),
or if your build pipeline supports it it should be included
automatically.

Include `Sidebar` as a child component of react-leaflet `Map`, with
whatever `Tab` children as required for your layout.  The `Sidebar`
component is stateless; all state information should be passed as
props, and desired state changes communicated upwards via the `onOpen`
and `onClose` callback.  A minimal example might look like the
following:

```jsx
import React, { Component } from 'react';
import { Map, TileLayer } from 'react-leaflet';
import { Sidebar, Tab } from 'react-leaflet-sidebarv2';

export default class SidebarExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      selected: 'home',
    };
  }

  onClose() {
    this.setState({collapsed: true});
  }
  onOpen(id) {
    this.setState({
      collapsed: false,
      selected: id,
    })
  }

  render() {
    return (
      <div>
        <Map center={[51.505, -0.09]} zoom={13} zoomControl={false}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          <Sidebar id="sidebar" collapsed={this.state.collapsed} selected={this.state.selected}
                   onOpen={this.onOpen.bind(this)} onClose={this.onClose.bind(this)}>
            <Tab id="home" header="Home" icon="fa fa-home">
              <p>No place like home!</p>
            </Tab>
            <Tab id="settings" header="Settings" icon="fa fa-cog" anchor="bottom">
              <p>Settings dialogue.</p>
            </Tab>
          </Sidebar>
        </Map>
      </div>
    );
  }
}
```
