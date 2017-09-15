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
[via a CDN](https://unpkg.com/leaflet-sidebar-v2@1.0.0/css/leaflet-sidebar.min.css). The
close icons default to fontawesome, so this will also need to be
included.

You will typically include `Sidebar` as a _sibling_ component of
react-leaflet `Map`, contained in a wrapper div so the sidebar is
positioned relative to the map, with whatever `Tab` children are
required for your layout.  This is because of event handling: if the
sidebar is a child of the map element, events will bubble up and be
handled by leaflet first (this is because React events are actually
handled by a single handler at the document root, so they will always
bubble up through leaflet first).  _A previous commit
([a9156e8bb7](https://github.com/condense/react-leaflet-sidebarv2/commit/a9156e8bb71501639be1c06552fb11521f111c86))
attempted to solve this by disabling native events at the sidebar
root, but I found too many complications.  If anyone solves this I
would love a PR!_

The `Sidebar` component is stateless; all state information should be
passed as props, and desired state changes communicated upwards via
the `onOpen` and `onClose` callback.  A minimal example might look
like the following (also note that to work with the default css, the
`Map` needs a `sidebar-map` class, and the `Sidebar` needs to be
_before_ the `Map`):

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
        <Sidebar id="sidebar" collapsed={this.state.collapsed} selected={this.state.selected}
                 onOpen={this.onOpen.bind(this)} onClose={this.onClose.bind(this)}>
          <Tab id="home" header="Home" icon="fa fa-home">
            <p>No place like home!</p>
          </Tab>
          <Tab id="settings" header="Settings" icon="fa fa-cog" anchor="bottom">
            <p>Settings dialogue.</p>
          </Tab>
        </Sidebar>
        <Map className="sidebar-map" center={[51.505, -0.09]} zoom={13} zoomControl={false}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
        </Map>
      </div>
    );
  }
}
```
