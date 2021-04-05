import * as React from "react";

import { Badge } from "react-bootstrap";

type GradeProps = { grade: string; label?: string; small?: boolean };

export const Grade: React.FC<GradeProps> = ({ grade, label, small }) => {
  const newGrade = grade.substring(0, 1).toUpperCase();
  const variant =
    newGrade === "F"
      ? "danger"
      : newGrade === "E"
        ? "danger"
        : newGrade === "D"
          ? "warning"
          : newGrade === "C"
            ? "info"
            : newGrade === "B"
              ? "info"
              : newGrade === "A"
                ? "success"
                : "danger";
  return (
    <Badge variant={variant} style={{ minWidth: 60, fontSize: small ? "1.1em" : "2em" }}>
      {label !== undefined ? label : grade}
    </Badge>
  );
};
