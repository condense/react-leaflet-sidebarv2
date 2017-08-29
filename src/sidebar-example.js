import React, { Component } from 'react';
import { Map, TileLayer } from 'react-leaflet';
import { Sidebar, Tab } from './Sidebar';

export default class SidebarExample extends Component {

  render() {
    return (
      <div>
        <Map center={[51.505, -0.09]} zoom={13} zoomControl={false}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          <Sidebar id="sidebar">
            <Tab id="home" header="Home" icon="fa fa-home">
              <p>Sidebar!</p>
            </Tab>
            <Tab id="settings" header="Settings" icon="fa fa-cog" anchor="bottom">
              <p>Settings!</p>
            </Tab>
          </Sidebar>
        </Map>
      </div>
    );
  }
}
