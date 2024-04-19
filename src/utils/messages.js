const MESSAGES = {
	errors: {
		wrongDir: "Whoops! Directory not recognized:", // + currentDir
		wrongBranch: "❌ Branch name not supported!\n\n",
	},
	info: {
		inProgress: "Pulling latest for ", // + repoDir
		latest: "Latest changes:\n", // + latest
		applying: "Applying changes to branch: ", // + branchName
		selection: "\nRepo(s):", // + answer + \n\n
	},
	success: {
		done: "Done!\n\n",
	},
};

export { MESSAGES as logMessages };
