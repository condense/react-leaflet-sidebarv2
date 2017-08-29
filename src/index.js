import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Sidebar, Tab } from './Sidebar';
import registerServiceWorker from './registerServiceWorker';
import SidebarExample from './sidebar-example'

ReactDOM.render(<SidebarExample />, document.getElementById('root'));
registerServiceWorker();
