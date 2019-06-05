import React from 'react';
import ReactDOM from 'react-dom';
import { Page } from 'react-onsenui';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import '../scss/HomePage.scss';

const calendarEvents = [{ title: 'event 1', date: '2019-06-01' }, { title: 'event 2', date: '2019-06-02' }];

const HomePage = () => (
  <Page>
    <div className="container">
      <header>
        <img className="logo" src={require('../images/logo.png')} alt="logo" />
      </header>
      <FullCalendar
        defaultView="dayGridMonth"
        plugins={[dayGridPlugin]}
        events={calendarEvents}
        header={{
          left: 'prev',
          center: 'title',
          right: 'next'
        }}
      />
    </div>
  </Page>
);

export default HomePage;
