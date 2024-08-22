const fs = require("fs").promises;
const path = require("path");
const readline = require("readline");

const filePath = path.join(__dirname, "task.txt");

const getInput = (question) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);  
        });
    });
};

const viewFile = async () => {
    try {
        const fileContent = await fs.readFile(filePath, "utf8");
        return fileContent.split("\n");
    } catch (err) {
        return [""];  
    }
};

const addTask = async () => {
    try {
        const task = await getInput("Enter your task: ");

        try {
            await fs.access(filePath);

            const fileContent = await fs.readFile(filePath, "utf8");
            if (fileContent.trim() === "") {
                await fs.writeFile(filePath, task);
            } else {
                await fs.appendFile(filePath, "\n" + task);
            }
        } catch {
            await fs.writeFile(filePath, task);
        } finally {
            console.log("Task added successfully!");
        }
    } catch (err) {
        console.error(err);
    }
};

const markRead = async () => {
    try {
        const data = await viewFile();
        if (data.length === 1 && data[0].trim() === "") {
            console.log("\nNo tasks Added Yet\n");
            return;
        }
        console.log("\nYour Tasks are:");
        data.map((line, idx) => {
            console.log(`${idx + 1}. ${line}`);
        });
        const idx = Number(await getInput("Enter the task number you want to mark as read: "));
        if (isNaN(idx) || idx < 1 || idx > data.length) {
            console.log("Invalid task index. Please enter a valid number.");
            return;
        }
        data[idx - 1] = `[Completed] ${data[idx - 1]}`;
        await fs.writeFile(filePath, data.join("\n"));
        console.log("Task marked as completed.");
    } catch (err) {
        console.error(err);
    }
};

const removeTask = async () => {
    try {
        const data = await viewFile();
        if (data.length === 1 && data[0].trim() === "") {
            console.log("\nNo tasks Added Yet\n");
            return;
        }
        console.log("\nYour Tasks are:");
        data.map((line, idx) => {
            console.log(`${idx + 1}. ${line}`);
        });
        const idx = Number(await getInput("Enter the task number you want to remove: "));
        if (isNaN(idx) || idx < 1 || idx > data.length) {
            console.log("Invalid task index. Please enter a valid number.");
            return;
        }
        const newTask = data.filter((_, index) => index !== idx - 1);
        await fs.writeFile(filePath, newTask.join("\n"));
        console.log("Task removed successfully.");
    } catch (err) {
        console.error(err);
    }
};

async function main() {
    while (true) {
        console.log("\n1. Add a new task");
        console.log("2. View a list of tasks");
        console.log("3. Mark a task as complete");
        console.log("4. Remove a task");
        console.log("5. Exit");

        const choice = await getInput("Choose an option: ");

        switch (choice) {
            case "1":
                await addTask();
                break;
            case "2":
                const data = await viewFile();
                if (data.length === 1 && data[0].trim() === "") {
                    console.log("\nNo Tasks Added Yet\n");
                } else {
                    console.log("\nYour Tasks are:");
                    data.map((line, idx) => {
                        console.log(`${idx + 1}. ${line}`);
                    });
                }
                break;
            case "3":
                await markRead();
                break;
            case "4":
                await removeTask();
                break;
            case "5":
                process.exit();
            default:
                console.log("Invalid option, please choose a valid number.");
                break;
        }
    }
}

main();
