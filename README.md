# React-Leaflet Sidebar-v2

A [react-leaflet](https://github.com/PaulLeCam/react-leaflet) plugin
for
[leaflet-sidebar-v2](https://github.com/nickpeihl/leaflet-sidebar-v2)
(which is a leaflet-only fork
of [sidebar-v2](https://github.com/Turbo87/sidebar-v2))

The twist is the implementation of sidebar-v2 isn't very compatible
with React, so this plugin actually renders all markup via React,
including event handling, and just leverages the CSS from sidebar.

## Working notes

Rough thinking; markup can look something like:

```jsx
<Map>
  <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
             url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
             />

  <Sidebar id="sidebar" position="left" selected="foo">
    <Tab id="foo" anchor="top" renderIcon={() => <i.fa.fa-open />}>
      <div>... </div>
    </Tab>
  </Sidebar>
</Map>
```

The sidebar div is attached inside the map element, which we have
access to and will require some thought around event bubbling but
should otherwise render fine.  Then we can use regular react logic,
render the components into one big div, and let React and
leaflet-sidebar take care of the rest.

Sidebar props: `id` required; `position` defaults to "left"
(alternative "right"); `selected` defaults to null.  Also event
handlers `onOpening`, `onClosing`, `onContent`.

Tab props: `id` and `renderIcon` should be required, but `anchor` (values
"top"/"bottom") can default to "top".

Also want to somehow automatically manage the "home" tab; probably the
easiest approach is that the first tab is the home one.
