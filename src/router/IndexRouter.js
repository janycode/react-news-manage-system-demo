import React from 'react'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import Login from '../views/login/Login'
import NewsSandBox from '../views/sandbox/NewsSandBox'

// 基于 react-router-dom@5 版本
export default function IndexRouter() {
    return (
        <div>
            <HashRouter>
                <Switch>
                    <Route path="/login" component={Login} />
                    {/* <Route path="/" component={NewsSandBox} /> */}
                    <Route path="/" render={() =>
                        localStorage.getItem("token") ? <NewsSandBox></NewsSandBox> : <Redirect to="/login" />
                    } />
                </Switch>
            </HashRouter>
        </div>
    )
}
