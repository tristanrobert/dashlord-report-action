import * as React from "react";

import { Container, Row } from "react-bootstrap";

import {
  useParams,
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import report from "./report.json";

import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { Dashboard } from "./components/Dashboard";
import { Url } from "./components/Url";
import { Intro } from "./components/Intro";
import { ScrollToTop } from "./components/ScrollToTop";

type CategoryRouteProps = { report: any };

// for some reason react-router `:url*` didnt work, use `*` only
interface ParamTypes {
  "0": string;
}

const CategoryRoute: React.FC<CategoryRouteProps> = (props) => {
  const params = useParams<ParamTypes>();
  const category = window.decodeURIComponent(params["0"]);
  const urls = props.report.filter((u: any) => u.category === category)
  return (
    <React.Fragment>
      <br />
      <h3>{category} : {urls.length} urls</h3>
      <Dashboard report={urls} />
    </React.Fragment>
  );
};

type UrlRouteProps = { report: any };

const UrlRoute: React.FC<UrlRouteProps> = (props) => {
  const params = useParams<ParamTypes>();
  const url = window.decodeURIComponent(params["0"]);
  const urlData = props.report.find((r: any) => r.url === url) as any;
  console.log('urlData', urlData)
  return <Url url={url} report={urlData} />
}

const App = () => {
  return (
    <Router>
      <div>
        <ScrollToTop />
        <Topbar />
        <Container fluid>
          <Row>
            <Sidebar report={report} />
            <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
              <Switch>
                <Route path="/url/*">
                  <UrlRoute report={report} />
                </Route>
                <Route path="/dashboard">
                  <Dashboard report={report} />
                </Route>
                <Route path="/category/*">
                  <CategoryRoute report={report} />
                </Route>
                <Route path="/">
                  <Intro />
                </Route>
              </Switch>
            </main>
          </Row>
        </Container>
      </div>
    </Router>
  );
};

export default App;
