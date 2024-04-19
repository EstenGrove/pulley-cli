import readline from "node:readline";
import enquirer from "enquirer";
import yosay from "yosay";
import chalk from "chalk";
import path from "node:path";
import { execSync } from "child_process";
import { chdir, cwd } from "node:process";
import { execGitCommand, commands } from "./utils/utils.js";

const { prompt, Separator, Select } = enquirer;

const log = console.log;

const config = {
	// directories for each repo
	repos: {
		EMAR: `C:\\Users\\Development\\WORK\\Dev\\Eldermark\\Repos\\eldermark-emar\\code`,
		UI: `C:\\Users\\Development\\WORK\\Dev\\Eldermark\\Repos\\eldermark-emar-ui\\code`,
		DB: `C:\\Users\\Development\\WORK\\Dev\\Eldermark\\Repos\\eldermark-emar-db\\code`,
	},
	// Supported branches to pull to
	branches: ["develop", "local", "steven_local"],
};

/**
 * "Pulley Config"
 *
 * ## ATTENTION ##
 * - Replace the following file paths with the paths to each repo on your machine
 * Please following the file path guidelines below!
 * - For Windows:
 * 		- "C:\\User\\Dir1\\Dir2" etc
 * - For MacOS:
 * 		- "~/User/Dir1/Dir2" etc
 * - For Linux:
 * 		- "/c/User/Dir1/Dir2" etc
 */
const repoDirs = {
	EMAR: `C:\\Users\\sgore\\MyStuff\\Dev\\Testing\\emar`,
	UI: `C:\\Users\\sgore\\MyStuff\\Dev\\Testing\\ui`,
	DB: `C:\\Users\\sgore\\MyStuff\\Dev\\Testing\\db`,
};
const allRepos = [repoDirs.EMAR, repoDirs.UI, repoDirs.DB];

const supportedBranches = ["develop", "local", "steven_local"];

const choices = [
	{
		name: "All (all repos would be updated)",
		value: "ALL",
		description: `This would update all repos: EMAR, UI and DB!`,
	},
	{ role: "separator", value: chalk.dim("---------") },
	{
		name: "EMAR (eldermark-emar)",
		value: "EMAR",
		description: `EMAR repo is found at ${repoDirs.EMAR}`,
	},
	{
		name: "UI (eldermark-emar-ui)",
		value: "UI",
		description: `UI repo is found at ${repoDirs.UI}`,
	},
	{
		name: "DB (eldermark-emar-db)",
		value: "DB",
		description: `DB repo is found at ${repoDirs.DB}`,
	},
	{ role: "separator", value: chalk.dim("---------") },
	{
		name: "Cancel & Exit Program",
		value: "CANCEL",
		description: `Cancels & closes the CLI`,
	},
];

const getLatestForRepo = (repoDir) => {
	// change directories
	const dirPath = path.dirname(repoDir);
	const wasChanged = chdir(repoDir);
	const currentDir = cwd();
	const currentRepo = Object.keys(repoDirs).filter(
		(key) => repoDirs[key] === repoDir
	)[0];

	// if current directory does NOT match repo directory
	if (!currentDir.includes(repoDir)) {
		log(chalk.bgRedBright("Whoops! Directory not recognized:", currentDir));
	} else {
		log(chalk.bold.magentaBright(`${currentRepo} Repo...`));
		log("Pulling latest for " + chalk.underline.greenBright(`${repoDir}`));
		// const status = execGitCommand(commands.getStatus);
		const branchName = execGitCommand(commands.getBranch);
		// log(chalk.bold.blueBright(status.toString()));

		if (!supportedBranches.includes(branchName)) {
			log(chalk.bold.redBright("❌ Branch name not supported!\n\n"));
		} else {
			const latest = execGitCommand(commands.getLatest);
			log("Latest changes:\n" + latest);
			log(
				chalk.bold.grey("Applying changes to branch: "),
				chalk.bold.bgGreenBright(`${branchName}`)
			);
			log(chalk.bold.greenBright(`Done!\n\n`));
		}
	}
};

// Introduce "Pulley"
log(
	yosay(
		`Hi Im ${chalk.blueBright(
			"Pulley"
		)}. Im a CLI tool to help you update your local repos all at once.`
	)
);

const reposPrompt = new Select({
	name: "repos",
	message:
		"Which repo(s) would you like to update?\n\n - Use up & down arrows to select\n\n",
	choices: choices,
});

const userSelections = [];

const runPrompt = () => {
	reposPrompt
		.run()
		.then((answer) => {
			const choice = choices.find((option) => option.name === answer);

			// cancel & kill child process(s)
			if (choice.value === "CANCEL") return process.exit(1);

			// logout selection(s)
			log("\nRepo(s):", chalk.underline.greenBright(answer) + "\n\n");

			// update all repos (3)
			if (choice.value === "ALL") {
				userSelections.push(...allRepos);
				allRepos.map((dir) => getLatestForRepo(dir));
				process.exit(1);
			} else {
				// update selected repo (1)
				const targetDir = repoDirs[choice.value];
				getLatestForRepo(targetDir);
				process.exit(1);
			}
		})
		.catch(console.error);
};

runPrompt();
