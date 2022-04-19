import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import "./main.scss";
import Home from './components/Home';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ForgotPasswordStepTwo from './components/auth/ForgotPasswordStepTwo';
import Login from './components/auth/Login';
import AdminLogin from './components/auth/AdminLogin';
import ForgotPasswordMain from './components/auth/ForgotPasswordMain';
import Navbar from './components/Navbar';
import Store from './store';
import Dashboard from './components/Dashboard';
import PrivateRoute from './private/PrivateRoute';
import RouteLinks from './private/RouteLinks';
import NotFound from './components/NotFound';
import CreatePost from './components/CreatePost';
import Edit from './components/Edit';
import EditImage from './components/EditImage';
import UpdateName from './components/UpdateName';
import ChangePassword from './components/ChangePassword';
import Details from './components/Details';

function App() {
  return (
    <Provider store={Store}>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/home/:page" component={Home} />
          <Route exact path="/details/:id" component={Details} />

          <RouteLinks exact path="/login" component={Login} />
          <RouteLinks exact path="/adminLogin" component={AdminLogin} />
          <RouteLinks exact path="/register" component={Register} />
          <RouteLinks exact path="/forgotPassword" component={ForgotPassword} />
          <RouteLinks exact path="/enterOtp" component={ForgotPasswordStepTwo} />
          {/* <Route exact path="/forgotPassword" component={ForgotPasswordMain}/> */}

          <PrivateRoute exact path="/dashboard/:page?" component={Dashboard} />
          <PrivateRoute exact path="/create" component={CreatePost} />
          <PrivateRoute exact path="/edit/:id" component={Edit} />
          <PrivateRoute exact path="/updateImage/:id" component={EditImage} />
          <PrivateRoute exact path="/updateName" component={UpdateName} />
          <PrivateRoute exact path="/updatePassword" component={ChangePassword} />

          <Route component={NotFound} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;