import { AnthropicClient } from "../clients/AnthropicClient";
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

    async createJiraIssue(projectKey: string, taskType: string, description: string): Promise<any> {
            const issueData = {
                fields: {
                    project: {
                        key: projectKey
                    },
                    summary: "Issue created via API",
                    description: description,
                    issuetype: {
                        name: taskType
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
                return response.data;  // Return the response data
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error('Error creating Jira issue:');
                } else {
                    console.error('Error creating Jira issue:');
                }
                throw error;
            }
        }
    }