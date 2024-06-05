export const JIRA_ISSUE_CREATE_PROMPT = `
This tool is a wrapper around the Jira API, useful when you need to create only one Jira issue. When the ticket is created you'll recive something like : ""{"id":"10089","key":"KAN-69","self":"https://chatbottest.atlassian.net/rest/api/3/issue/10089"}"
as a object specifying the fields of the Jira issue, and will be passed into the Jira \`createIssue\` function. Once created return the json object and stop . 
For example, to create a low priority task called "test issue" with description "test description" in project PW, you would pass in the following json object: 
{{"summary": "test issue", "description": "test description", "project": "PW", "issuetype": "Task", "priority": "Low"}}
`;

export const JIRA_GET_ALL_PROJECTS_PROMPT = `
This tool is a wrapper around the Jira project API, 
useful when you need to fetch all the projects the user has access to, find out how many projects there are, or as an intermediary step that involves searching by projects. 
there is no input to this tool.
`;

export const JIRA_JQL_PROMPT = `
This is a tool of an assistant to is a wrapper around Jira jql API, useful when you need to search for Jira issues.
The input to this tool is a JQL query string, and will be passed into Jira \`jql\` function,
For example, to find all the issues in project "Test" assigned to the me, you would pass in the following string:
project = Test AND assignee = currentUser()
or to find issues with summaries that contain the word "test", you would pass in the following string:
summary ~ 'test'
`;

export const JIRA_CATCH_ALL_PROMPT = `
This tool of an assistant is a wrapper around Jira API.
There are other dedicated tools for fetching all projects, and creating and searching for issues, 
use this tool if you need to perform any other actions allowed by the Jira API.
The input to this tool is a dictionary specifying a function from the Jira API, 
as well as a list of arguments and dictionary of keyword arguments to pass into the function.
For example, to get the email of a user with accountId 'foo' you would pass in the following object:
{{"httpverb": "GET", "endpoint": "/rest/api/3/user", "queryParams": {{"accountId": "foo"}}, "bodyParams": {{}}}}
or to find out how many groups are in the Jira instance, you would pass in the following string:
{{"httpverb": "GET", "endpoint": "/rest/api/3/groups/picker", "queryParams": {{}}, "bodyParams": {{}}}}
For more information on the Jira API, refer to https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/
`

/*export const QUESTION_WITH_CONTEXT_PROMPT = `
This tool is a contextual question, use it for any ask about AI. If the tool can't find the answer from the contest then stop and return a message saying that you don't know. You would pass the user question and answer in the following string and respect the json format: 
{"answer": "the answer value", "question":"the question value"}`;*/
export const QUESTION_WITH_CONTEXT_PROMPT = `Use this tool only for question about AI.
This tool is contextual question-answering tool. If the tool can't find the answer from the context, then stop and return a message saying that you don't know. You should pass the user's question in the following string and respect the JSON format:
{"question":"the question value"} `;
