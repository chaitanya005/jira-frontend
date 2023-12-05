import axios from "axios";
import React, { useEffect, useState } from "react";
import "./styles.css";

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [issuesCount, setTotalIssuesCount] = useState(0);
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:4000/issues")
      .then((response) => {
        let assignedData = {};
        let unAssignedData = {
          assigneeName: "Unassigned",
          issueCount: 0,
          percentage: 0,
        };
        setProjectName(response.data?.projectName);
        response.data?.issuesData?.map((issue) => {
          if (issue.assignee) {
            if (!assignedData[issue.assignee]) {
              assignedData[issue.assignee] = {
                assigneeName: issue.assignee,
                issueCount: 1,
                percentage: issue.percentage,
              };
            } else {
              assignedData[issue.assignee].issueCount++;
              assignedData[issue.assignee].percentage += issue.percentage;
            }
          } else {
            unAssignedData.issueCount += 1;
            unAssignedData.percentage += issue.percentage;
          }
        });
        const mergedIssues = Object.values(assignedData).concat(unAssignedData);
        let totalIssuesCount = mergedIssues.reduce(
          (acc, curr) => acc + curr.issueCount,
          0
        );
        setTotalIssuesCount(totalIssuesCount);
        setIssues(mergedIssues);
      })
      .catch((error) => {
        console.error("Error fetching data from backend:", error);
      });
  }, []);

  return (
    <div className="container">
      <div
        style={{
          border: "1px solid #ddd",
          padding: "5px",
          borderRadius: "5px",
        }}
      >
        <h4>Issues Statictics: {projectName?.toUpperCase()}</h4>
        <table className="data-table">
          <thead>
            <tr>
              <th>Assignee</th>
              <th>Count</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(issues).map((assignee) => (
              <tr key={assignee.assigneeName}>
                <td>{assignee.assigneeName}</td>
                <td>{assignee.issueCount}</td>
                <td>{assignee.percentage / assignee.issueCount}%</td>
              </tr>
            ))}
            <tr>
              <td>Total</td>
              <td>{issuesCount}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Issues;
