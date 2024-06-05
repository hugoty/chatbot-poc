import {
  JIRA_CATCH_ALL_PROMPT,
  JIRA_GET_ALL_PROJECTS_PROMPT,
  JIRA_ISSUE_CREATE_PROMPT,
  JIRA_JQL_PROMPT,
  QUESTION_WITH_CONTEXT_PROMPT
} from "./prompt";

import { Toolkit } from "./base";
import { JiraAction, JiraAPIWrapper } from "../jiraAPIwrapper";

export {
  JIRA_CATCH_ALL_PROMPT,
  JIRA_GET_ALL_PROJECTS_PROMPT,
  JIRA_ISSUE_CREATE_PROMPT,
  JIRA_JQL_PROMPT,
};

/**
 * Class that represents a toolkit for working with the Jira API. It
 * extends the BaseToolkit class and has a tools property that contains
 * an array of JiraAction instances.
 */
export class JiraToolkit extends Toolkit {
  tools: JiraAction[];  // Explicitly declaring the type of the tools array

  constructor(readonly apiWrapper: JiraAPIWrapper) {
    super();
    this.tools = [
      new JiraAction({
        name: "JQLQuery",
        description: JIRA_JQL_PROMPT,
        mode: "jql",
        apiWrapper: this.apiWrapper,
      }),
      new JiraAction({
        name: "GetProjects",
        description: JIRA_GET_ALL_PROJECTS_PROMPT,
        mode: "get_projects",
        apiWrapper: this.apiWrapper,
      }),
      new JiraAction({
        name: "CreateIssue",
        description: JIRA_ISSUE_CREATE_PROMPT,
        mode: "create_issue",
        apiWrapper: this.apiWrapper,
      })
    ];
  }
}
