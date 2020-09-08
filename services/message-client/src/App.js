import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { Provider } from 'react-redux'
import TableRoute from './TableRoute'
import RecordRoute from './RecordRoute'
import Layout from './Layout'
import store from './store'
import getSession from '@sublayer/passport-components/lib/getSession'
import Passport from '@sublayer/passport-components/lib/Passport'
import FetchSchema from './FetchSchema'

class App extends React.Component {

  render() {

    const session = getSession()

    return (
      <Provider store={store}>
        <Passport>
          {session ? (
            <FetchSchema>
              <Router>
                <Layout>
                  <Switch>
                    <Route exact path="/explorer/:modelId" component={TableRoute} />
                    <Route
                      exact
                      path="/explorer/:modelId/:recordId"
                      component={RecordRoute}
                    />
                    <Route exact path="/">
                      <Redirect to="/explorer/Message" />
                    </Route>
                  </Switch>
                </Layout>
              </Router>
            </FetchSchema>
          ) : null}
        </Passport>
      </Provider>
    )
  }
}

export default App