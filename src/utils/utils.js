import chalk from "chalk";
import yosay from "yosay";
import path from "node:path";
import { execSync } from "child_process";

const log = console.log;

// Git Utils
const commands = {
	getBranch: "git rev-parse --abbrev-ref HEAD", // gets branch name
	getCommit: "git rev-parse HEAD", // gets last commit to HEAD
	getLatest: "git pull origin develop",
	getStatus: "git status",
};
// executes a given 'git' command & returns the output of the command as a string
const execGitCommand = (command) => {
	return execSync(command)
		.toString("utf8")
		.replace(/[\n\r\s]+$/, "");
};

// Choices Utils
const generateChoices = (pulleyConfig = {}) => {
	const entries = Object.entries(pulleyConfig);
	const separator = { role: "separator", value: chalk.dim("---------") };
	const allChoice = {
		name: "All (all repos would be updated)",
		value: "ALL",
		description: `This would update all repos: ${Object.keys(pulleyConfig).join(
			", "
		)}`,
	};
	const cancel = {
		name: "Cancel & Exit Program",
		value: "CANCEL",
		description: `Cancels & closes the CLI`,
	};
	const choices = entries.map(([key, val]) => {
		const lastPath = val.split("\\").at(-1);
		const newChoice = {
			name: `${key} (${lastPath})`,
			value: key,
			description: `${key} repo is found at ${val}`,
		};
		return newChoice;
	});

	const withAll = [allChoice, separator, ...choices, separator, cancel];
	return withAll;
};

// Directory Utils
const isCorrectDirectory = (currentDir, targetDir) => {
	return currentDir.includes(targetDir);
};

const isSupportedBranch = (currentBranch, supportedBranches = []) => {
	return supportedBranches.includes(currentBranch);
};

// Logging/Chalk Utils

const logFailure = (msg) => {
	log(chalk.bold.redBright(msg));
};
const logSuccess = (msg) => {
	log(chalk.bold.greenBright(msg));
};

// Pulley Utils

// Introduce "Pulley"
const introducePulley = () => {
	log(
		yosay(
			`Hi Im ${chalk.blueBright(
				"Pulley"
			)}. Im a CLI tool to help you update your local repos all at once.`
		)
	);
};

export {
	// Pulley Utils
	introducePulley,
	// Git Utils
	execGitCommand,
	commands,
	// Choice Utils
	generateChoices,
	// Directory Utils
	isCorrectDirectory,
	isSupportedBranch,
	// Logging utils
	logFailure,
	logSuccess,
};
