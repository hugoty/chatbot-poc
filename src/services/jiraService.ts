import { AnthropicClient } from "../clients/anthropicClient";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { searchInDB } from "./dbService";  // Méthode renommée
import { StringOutputParser } from "@langchain/core/output_parsers";

import axios from 'axios';

export class JiraService {
    private email: string;
    private apiToken: string;
    private jiraUrl: string;
    private auth: string;

    constructor(email: string, apiToken: string, jiraUrl: string) {
        this.email = email;
        this.apiToken = apiToken;
        this.jiraUrl = jiraUrl;
        this.auth = Buffer.from(`${email}:${apiToken}`).toString('base64');
        console.log('connected successfully:',this.email);
    }
    

    async createJiraIssue(projectKey: string, taskType: string, description: string, name: string, epicId: string): Promise<any> {
       if(epicId === "0") {
            

       }
        const formattedDescription = {
            version: 1,
            type: "doc",
            content: [
                {
                    type: "paragraph",
                    content: [
                        {
                            type: "text",
                            text: description
                        }
                    ]
                }
            ]
        };

        const issueData = {
            fields: {
                project: {
                    key: projectKey
                },
                summary: name,
                description: formattedDescription,
                issuetype: {
                    id: taskType
                }
            }
        };

        try {
            console.log('Issue Data:', JSON.stringify(issueData, null, 2));
            const response = await axios.post(
                `${this.jiraUrl}/rest/api/3/issue`,
                issueData,
                {
                    headers: {
                        'Authorization': `Basic ${this.auth}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('Issue created successfully:', response.data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error creating Jira issue:', error.response?.data || error.message);
            } else {
                console.error('Unexpected error creating Jira issue:', error);
            }
            throw error;
        }
    }

     public static async getJiraEpics(jiraUrl : string, auth : string): Promise<any>{
        const response = await axios.get(
            `${jiraUrl}/rest/api/3/search`,
            {
                params: {
                    jql: `issuetype="Epic"`
                },
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const epics = response.data.issues;
        const epicIdsAndKeys = epics.map((epic: { id: any; key: any; fields: any }) => ({
            id: epic.id,
            key: epic.key,
            summary: epic.fields.summary
        }));
    }

    
    }
