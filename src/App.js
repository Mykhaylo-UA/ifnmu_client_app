import React from "react"
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

import LayoutPage from "./Components/LayoutPage/LayoutPage"
import Schedule from "./Components/Schedule/Schedule"
import Home from "./Components/Home/Home"
import Directories from "./Components/Directories/Directories";
import Directory from "./Components/Directory/Directory";
import Files from "./Components/Files/Files";
import Instruction from "./Components/Instruction/Instruction";
import Admin from "./Components/Admin/Admin";
import AdminWeek from "./Components/AdminWeek/AdminWeek";
import AdminFolder from "./Components/AdminFolder/AdminFolder";
import AdminFile from "./Components/AdminFile/AdminFile";
import SubDirectory from "./Components/SubDirectory/SubDirectory";

import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom"


function App() {
    return (
        <Router>
            <LayoutPage>
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route exact path="/schedule">
                        <Schedule />
                    </Route>
                    <Route exact path="/directories">
                        <Directories />
                    </Route>
                    <Route exact path="/directory/:id">
                        <Directory />
                    </Route>
                    <Route exact path="/subdirectory/:id">
                        <SubDirectory />
                    </Route>
                    <Route exact path="/files/:course/:name/:faculty">
                        <Files />
                    </Route>
                    <Route exact path="/instruction">
                        <Instruction />
                    </Route>
                    <Route exact path="/admin">
                        <Admin />
                    </Route>
                    <Route exact path="/admin/weeks">
                        <AdminWeek />
                    </Route>
                    <Route exact path="/admin/folders">
                        <AdminFolder />
                    </Route>
                    <Route exact path="/admin/files/:id">
                        <AdminFile />
                    </Route>
                </Switch>
            </LayoutPage>
        </Router>
    );
}

export default App;
