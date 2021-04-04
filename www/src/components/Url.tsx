import * as React from "react";
import { formatDistanceToNow } from 'date-fns'
import frLocale from "date-fns/locale/fr";
import { Link } from "react-router-dom";
import { Clock } from "react-feather";
import { Jumbotron, Badge } from "react-bootstrap";

import { HTTP } from "./HTTP";
import { LightHouse } from "./LightHouse";
import { Nuclei } from "./Nuclei";
import { Owasp } from "./Owasp";
import { TestSSL } from "./TestSSL";
import { Trackers } from "./Trackers";
import { Wappalyser } from "./Wappalyser";

type UrlDetailProps = { url: string; report: any };

export const Url: React.FC<UrlDetailProps> = ({ url, report, ...props }) => {
  const updateDate = report.lhr && report.lhr.fetchTime;
  return (
    <div>
      <Jumbotron
        style={{ height: 100, marginTop: 10, paddingTop: 20, marginBottom: 10 }}
      >
        <h4>
          <a href={url} rel="noreferrer noopener" target="_blank">
            {url}
          </a>
        </h4>
        <p>
          <Link to={`/category/${report.category}`}>
            <Badge style={{ marginRight: 5 }} variant="success">
              {report.category}
            </Badge>
          </Link>
          {report.tags.map((tag: string) => (
            <Link to={`/tag/${tag}`}><Badge key={tag} style={{ marginRight: 5 }} variant="info">
              {tag}
            </Badge>
            </Link>
          ))}
          {updateDate && (
            <span title={updateDate}>
              <Clock size={12} style={{ marginRight: 5 }} />
              Mise à jour il y a :{" "}
              {formatDistanceToNow(new Date(updateDate), { locale: frLocale })}
            </span>
          )}
        </p>
      </Jumbotron>
      {(report.lhr && (
        <React.Fragment>
          <LightHouse
            data={report.lhr}
            url={`${process.env.PUBLIC_URL}/report/${window.btoa(
              url
            )}/lhr.html`}
          />
          <br />
        </React.Fragment>
      )) ||
        null}
      {(report.testssl && (
        <React.Fragment>
          <TestSSL
            data={report.testssl}
            url={`${process.env.PUBLIC_URL}/report/${window.btoa(
              url
            )}/testssl.html`}
          />
          <br />
        </React.Fragment>
      )) ||
        null}
      {(report.http && (
        <React.Fragment>
          <HTTP data={report.http} />
          <br />
        </React.Fragment>
      )) ||
        null}
      {(report.nuclei && (
        <React.Fragment>
          <Nuclei data={report.nuclei} />
          <br />
        </React.Fragment>
      )) ||
        null}
      {(report.thirdparties && (
        <React.Fragment>
          <Trackers data={report.thirdparties} />
          <br />
        </React.Fragment>
      )) ||
        null}
      {(report.zap && (
        <React.Fragment>
          <Owasp
            data={report.zap}
            url={`${process.env.PUBLIC_URL}/report/${window.btoa(
              url
            )}/zap.html`}
          />
          <br />
        </React.Fragment>
      )) ||
        null}
      {(report.wappalyser && (
        <React.Fragment>
          <Wappalyser data={report.wappalyser} />
          <br />
        </React.Fragment>
      )) ||
        null}
    </div>
  );
};
