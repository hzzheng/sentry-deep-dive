
import * as Sentry from '@sentry/browser';
import React, { Component } from 'react';

Sentry.init({
 dsn: "https://fdefeaabf2a243f695629d8b4e1a05b2@sentry.io/1448458",
 environment: 'staging',
 debug: true,
 release: "my-project-name@2.3.12",
 beforeSend(event, hint) {
   console.log(event, hint)
   return event
 }
});
Sentry.configureScope((scope) => {
  scope.setUser({"email": "john.doe@example.com"});
  scope.setTag("page_locale", "de-at");
});
// should have been called before using it here
// ideally before even rendering your react app

export default class ExampleBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null, eventId: null };
        Sentry.addBreadcrumb({
          category: 'auth',
          message: 'Authenticated user zhengchao',
          level: 'error'
        });
        // Sentry.captureMessage("Something went wrong");
    }

    componentDidCatch(error, errorInfo) {
      this.setState({ error });
      Sentry.withScope(scope => {
          scope.setExtras(errorInfo);
          const eventId = Sentry.captureException(error);
          this.setState({eventId})
          Sentry.showReportDialog({ eventId })
      });
    }

    render() {
        if (this.state.error) {
            //render fallback UI
            return (
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <a 
                onClick={() => Sentry.showReportDialog({ eventId: 'f2e93175c63b4d7895bf4882e48c7970' })
              }>Report feedback</a>
            );
        } else {
          return (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a 
              onClick={() => Sentry.showReportDialog({ eventId: 'f2e93175c63b4d7895bf4882e48c7970' })
            }>{this.props.children}</a>
          );
        }
    }
}