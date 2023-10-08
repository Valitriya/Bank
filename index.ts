import { faker } from "@faker-js/faker";
import inquirer from "inquirer";
import chalk from "chalk";

class Customer {
	constructor(
		public name: string,
		public surname: string,
		public age: number,
		public gender: string,
		public email: string,
		public accNum: number
	) {}
}

interface BankAccount {
	accNum: number;
	balance: number;
}

class Bank {
	customer: Customer[] = [];
	account: BankAccount[] = [];

	addCustomer(obj: Customer) {
		this.customer.push(obj);
	}

	addAccountNumber(obj: BankAccount) {
		this.account.push(obj);
	}

	transaction(accObj: BankAccount) {
		let newAccounts = this.account.filter(
			(acc) => acc.accNum !== accObj.accNum
		);
		this.account = [...newAccounts, accObj];
	}
}

let myBank = new Bank();

for (let i: number = 1; i <= 3; i++) {
	let fName = faker.person.firstName("female");
	let sName = faker.person.lastName();
	let email = faker.internet.email();
	const cus = new Customer(fName, sName, 25 * i, "female", email, 999 + i);
	myBank.addCustomer(cus);
	myBank.addAccountNumber({ accNum: cus.accNum, balance: 1000 * i });
}

function findAccount(accountNum: number) {
	return myBank.account.find((acc) => acc.accNum == accountNum);
}

async function displayBalance(account: BankAccount | undefined) {
	if (!account) return;
	let name = myBank.customer.find((item) => item.accNum == account.accNum);
	console.log(
		`Dear ${chalk.green.italic(name?.name)} ${chalk.green.italic(
			name?.surname
		)} your account balance is ${chalk.bold.blueBright(`$${account.balance}`)}`
	);
}

async function handleTransaction(
	account: BankAccount | undefined,
	type: "withdraw" | "deposit"
) {
	if (!account) {
		console.log(chalk.red.bold("Invalid account number"));
		return;
	}

	let amountPrompt = await inquirer.prompt({
		type: "input",
		name: "usd",
		message: `Please enter your ${
			type === "withdraw" ? "withdrawal" : "deposit"
		} amount: `,
	});

	let amount = parseFloat(amountPrompt.usd);

	if (isNaN(amount) || amount <= 0) {
		console.log(chalk.red.bold("Invalid amount"));
		return;
	}

	let newBalance;
	if (type === "withdraw" && amount > account.balance) {
		console.log(chalk.red.bold("Not enough money on balance :("));
		return;
	} else {
		newBalance =
			type === "withdraw" ? account.balance - amount : account.balance + amount;
		myBank.transaction({
			accNum: account.accNum,
			balance: newBalance,
		});
	}

	console.log(
		chalk.green.bold(
			`${type === "withdraw" ? "Withdrawal" : "Deposit"} successful!`
		)
	);
}

async function bankService(bank: Bank) {
	do {
		let service = await inquirer.prompt({
			type: "list",
			name: "select",
			message: "Please select the service",
			choices: ["View balance", "Cash withdraw", "Cash deposit", "Exit"],
		});

		if (service.select == "Exit") {
			return;
		}

		let res = await inquirer.prompt({
			type: "input",
			name: "num",
			message: "Please enter your account number: ",
		});

		let account = findAccount(parseInt(res.num, 10));

		if (!account) {
			console.log(chalk.red.bold("Invalid account number"));
			continue;
		}

		switch (service.select) {
			case "View balance":
				await displayBalance(account);
				break;

			case "Cash withdraw":
			case "Cash deposit":
				await handleTransaction(
					account,
					service.select === "Cash withdraw" ? "withdraw" : "deposit"
				);
				break;

			default:
				break;
		}
	} while (true);
}

bankService(myBank);
