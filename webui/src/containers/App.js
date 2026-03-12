import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import * as sidebarActions from 'modules/sidebar';
import withWidth, { SMALL } from 'helpers/with-width';

import { Layout } from 'components';
import Notification from 'containers/Notification';
import * as Subscriber from 'containers/Subscriber';
import * as Profile from 'containers/Profile';
import * as Account from 'containers/Account';

class App extends Component {
  static propTypes = {
    session: PropTypes.object.isRequired,
    view: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired
  }

  state = {
    isNaked: false
  }

  componentWillMount() {
    const {
      width,
      SidebarActions
    } = this.props;

    if (width !== SMALL) {
      SidebarActions.setVisibility(true);
    }
  }

  componentDidMount() {
    if (window.self !== window.top || window.location.search.includes('naked')) {
      this.setState({ isNaked: true });
      const urlParams = new URLSearchParams(window.location.search);
      const targetView = urlParams.get('view');
      if (targetView && targetView !== this.props.view) {
        this.props.SidebarActions.selectView(targetView);
      }
    }
  }

  render() {
    const {
      view,
      session
    } = this.props;
    const { isNaked } = this.state;

    // Provide the OTA shell as the main view
    if (!isNaked && typeof window !== 'undefined') {
      return (
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
          <iframe
            src="/static/multi-imsi-portal.html"
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="OTA Platform Shell"
          />
          <Notification />
        </div>
      );
    }

    if (view === "subscriber") {
      document.body.style.backgroundColor = "#e9ecef";
    } else {
      document.body.style.backgroundColor = "white";
    }

    if (isNaked) {
      return (
        <div style={{ width: '100%', height: '100%', overflowY: 'auto', padding: '1rem' }}>
          {view === "subscriber" && <Subscriber.Collection />}
          {view === "profile" && <Profile.Collection />}
          {view === "account" && <Account.Collection session={session} />}
          <Notification />
        </div>
      );
    }

    return (
      <Layout>
        <Layout.Container visible={view === "subscriber"}>
          <Subscriber.Collection />
        </Layout.Container>
        <Layout.Container visible={view === "profile"}>
          <Profile.Collection />
        </Layout.Container>
        <Layout.Container visible={view === "account"}>
          <Account.Collection session={session} />
        </Layout.Container>
        <Notification />
      </Layout>
    )
  }
}

const enhance = compose(
  withWidth(),
  connect(
    (state) => ({
      view: state.sidebar.view
    }),
    (dispatch) => ({
      SidebarActions: bindActionCreators(sidebarActions, dispatch)
    })
  )
);

export default enhance(App);
