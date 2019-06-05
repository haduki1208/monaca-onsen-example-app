import React from 'react';
import ReactDOM from 'react-dom';
import { Page, Tabbar, Tab } from 'react-onsenui';
import HomePage from './components/HomePage';
import MyPage from './components/MyPage';

interface IState {
  index: number;
}

export default class App extends React.Component<{}, IState> {
  state = {
    index: 0
  };

  onPreChangeTabbar = ({ index }: { index: number }): void => {
    this.setState({ index });
  };

  onPostChangeTabbar = (): void => {
    console.log(this.state.index);
  };

  renderTab = () => [
    {
      content: <HomePage key="Home" />,
      tab: <Tab key="Home" icon="md-home" />
    },
    {
      content: <MyPage key="Maps" />,
      tab: <Tab key="Maps" icon="md-pin" />
    },
    {
      content: <MyPage key="Settings" />,
      tab: <Tab key="Settings" icon="md-settings" />
    }
  ];

  render() {
    return (
      <Page>
        <Tabbar
          onPreChange={this.onPreChangeTabbar}
          onPostChange={this.onPostChangeTabbar}
          position="bottom"
          index={this.state.index}
          renderTabs={this.renderTab}
        />
      </Page>
    );
  }
}
