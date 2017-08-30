import React, { Component } from 'react';
import { Map, TileLayer } from 'react-leaflet';
import { Sidebar, Tab } from './Sidebar';

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
