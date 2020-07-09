import React, { useEffect, useState } from 'react';
import Amplify, { Auth, Hub } from 'aws-amplify';

import logo from './logo.svg';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          getUser().then(userData => setUser(userData));
          break;
        case 'signOut':
          setUser(null);
          break;
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.log('Sign in failure', data);
          break;
      }
    });

    getUser().then(userData => setUser(userData));
  }, []);

  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then(userData => userData)
      .catch(() => console.log('Not signed in'));
  }

  return (
    <div>
      <p>User: {user ? JSON.stringify(user.attributes) : 'None'}</p>
      {user ? (
        <button onClick={() => Auth.signOut()}>Sign Out</button>
      ) : (
        <React.Fragment>
        <button onClick={() => Auth.federatedSignIn()}>Sign In Hosted UI</button>
        <button onClick={() => Auth.federatedSignIn({provider: 'Facebook'})}>Signin with Facebook</button>
        </React.Fragment>
      )}
    </div>
  );
}

export default App;
