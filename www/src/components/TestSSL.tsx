import * as React from "react";

import { Row, Col, Alert } from "react-bootstrap";
import { Info } from "react-feather";

import { Panel } from "./Panel";
import { Grade } from "./Grade";


const sortByKey = (key: string) => (a: any, b: any) => {
  if (a[key] > b[key]) {
    return 1;
  } else if (a[key] < b[key]) {
    return -1;
  }
  return 0;
};

//const grades = ["A+", "A", "B", "C", "D", "E", "F"]

const severities = ["INFO", "OK", "LOW", "MEDIUM", "HIGH", "CRITICAL"];
const getSeverityValue = (severity: string) => severities.indexOf(severity);

type SSLProps = { data: any; url: string };

export const TestSSL: React.FC<SSLProps> = ({ data, url }) => {
  const grade =
    data && data.find((entry: any) => entry.id === "overall_grade") && data.find((entry: any) => entry.id === "overall_grade").finding;
  const results = data.map((row: any) => ({
    ...row,
    severity_value: getSeverityValue(row.severity),
  }));
  results.sort(sortByKey("severity_value")).reverse();
  const capReasons = data.filter((entry: any) => entry.id.indexOf('grade_cap_reason_') === 0).reverse();
  return grade && (
    <Panel title="SSL" info="Informations collectées via testssl.sh" url={url}>
      <Row>
        <Col>
          <h3>
            Scan Summary : <Grade small grade={grade} />
          </h3>
          <br />
          {capReasons.map((reason: any) => {
            return <Alert key={reason.id} variant="info"><Info style={{ marginRight: 5 }} />{reason.finding}</Alert>
          })}
        </Col>
      </Row>
    </Panel>
  ) || null
};
