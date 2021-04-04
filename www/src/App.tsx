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
import { About } from "./components/About";

type CategoryRouteProps = { report: any };

// for some reason react-router `:url*` didnt work, use `*` only
interface CategoryParamTypes {
  category: string;
}

const CategoryRoute: React.FC<CategoryRouteProps> = (props) => {
  const params = useParams<CategoryParamTypes>();
  const category = window.decodeURIComponent(params.category);
  const urls = props.report.filter((u: any) => u.category === category)
  return (
    <React.Fragment>
      <br />
      <h3>{category} : {urls.length} urls</h3>
      <Dashboard report={urls} />
    </React.Fragment>
  );
};

interface TagParamTypes {
  tag: string;
}
type TagRouteProps = { report: any };

const TagRoute: React.FC<TagRouteProps> = (props) => {
  const params = useParams<TagParamTypes>();
  const tag = window.decodeURIComponent(params.tag);
  const urls = props.report.filter((u: any) => u.tags && u.tags.includes(tag))
  return (
    <React.Fragment>
      <br />
      <h3>{tag} : {urls.length} urls</h3>
      <Dashboard report={urls} />
    </React.Fragment>
  );
};

interface UrlParamTypes {
  "0": string;
}

type UrlRouteProps = { report: any };

const UrlRoute: React.FC<UrlRouteProps> = (props) => {
  const params = useParams<UrlParamTypes>();
  const url = window.decodeURIComponent(params["0"]);
  const urlData = props.report.find((r: any) => r.url === url) as any;
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
                <Route path="/category/:category">
                  <CategoryRoute report={report} />
                </Route>
                <Route path="/tag/:tag">
                  <TagRoute report={report} />
                </Route>
                <Route path="/about">
                  <About />
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
