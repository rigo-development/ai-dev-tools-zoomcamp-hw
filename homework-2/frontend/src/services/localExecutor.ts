import { loadPyodide } from 'pyodide';

let pyodideInstance: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

/**
 * Initialize Pyodide (lazy loading)
 */
async function initPyodide() {
    if (pyodideInstance) {
        return pyodideInstance;
    }

    if (isLoading && loadPromise) {
        return loadPromise;
    }

    isLoading = true;
    loadPromise = loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.29.0/full/',
    });

    pyodideInstance = await loadPromise;
    isLoading = false;
    return pyodideInstance;
}

/**
 * Execute JavaScript code in browser
 */
function executeJavaScript(code: string): string {
    try {
        // Capture console output
        const logs: string[] = [];
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;

        console.log = (...args: any[]) => {
            logs.push(args.map(arg => String(arg)).join(' '));
            originalLog.apply(console, args);
        };
        console.error = (...args: any[]) => {
            logs.push('Error: ' + args.map(arg => String(arg)).join(' '));
            originalError.apply(console, args);
        };
        console.warn = (...args: any[]) => {
            logs.push('Warning: ' + args.map(arg => String(arg)).join(' '));
            originalWarn.apply(console, args);
        };

        // Execute code in isolated scope
        const func = new Function(code);
        const result = func();

        // Restore console
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;

        // Return captured output or result
        if (logs.length > 0) {
            return logs.join('\n');
        }
        return result !== undefined ? String(result) : '';
    } catch (error: any) {
        return `Error: ${error.message}\n${error.stack || ''}`;
    }
}

/**
 * Execute Python code using Pyodide
 */
async function executePython(code: string): Promise<string> {
    try {
        const pyodide = await initPyodide();

        // Redirect Python stdout/stderr
        pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
    `);

        // Execute user code
        pyodide.runPython(code);

        // Get output
        const stdout = pyodide.runPython('sys.stdout.getvalue()');
        const stderr = pyodide.runPython('sys.stderr.getvalue()');

        let output = '';
        if (stdout) output += stdout;
        if (stderr) output += (output ? '\n' : '') + 'Error: ' + stderr;

        return output || 'Code executed successfully (no output)';
    } catch (error: any) {
        return `Error: ${error.message}`;
    }
}

/**
 * Execute code locally in the browser
 * @param language - 'javascript' or 'python'
 * @param code - Code to execute
 * @returns Execution output
 */
export async function executeLocally(language: string, code: string): Promise<string> {
    if (language === 'javascript') {
        return executeJavaScript(code);
    } else if (language === 'python') {
        return await executePython(code);
    } else {
        return `Error: Local execution only supports JavaScript and Python. Selected: ${language}`;
    }
}

/**
 * Check if Pyodide is loaded
 */
export function isPyodideLoaded(): boolean {
    return pyodideInstance !== null;
}

/**
 * Preload Pyodide for faster first execution
 */
export async function preloadPyodide(): Promise<void> {
    await initPyodide();
}
