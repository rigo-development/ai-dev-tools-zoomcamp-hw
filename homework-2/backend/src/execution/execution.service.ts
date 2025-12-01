import { Injectable } from '@nestjs/common';

@Injectable()
export class ExecutionService {
    async executeCode(language: string, code: string): Promise<string> {
        console.log(`Executing ${language} code...`);
        try {
            // Map common language names to Piston versions if needed, or rely on Piston's detection/defaults
            // Piston expects 'language' and 'version'. '*' usually works for version.

            const response = await fetch('https://emkc.org/api/v2/piston/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: language,
                    version: '*',
                    files: [{ content: code }]
                })
            });

            if (!response.ok) {
                return `Error: Piston API returned ${response.status} ${response.statusText}`;
            }

            const result = await response.json();
            if (result.run) {
                return result.run.output;
            }
            return 'Error executing code: No output returned';
        } catch (e) {
            return `Execution failed: ${e.message}`;
        }
    }
}
