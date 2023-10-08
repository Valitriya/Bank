import { faker } from "@faker-js/faker";
import inquirer from "inquirer";
import chalk from "chalk";
class Customer {
    constructor(name, surname, age, gender, email, accNum) {
        this.name = name;
        this.surname = surname;
        this.age = age;
        this.gender = gender;
        this.email = email;
        this.accNum = accNum;
    }
}
class Bank {
    constructor() {
        this.customer = [];
        this.account = [];
    }
    addCustomer(obj) {
        this.customer.push(obj);
    }
    addAccountNumber(obj) {
        this.account.push(obj);
    }
    transaction(accObj) {
        let newAccounts = this.account.filter((acc) => acc.accNum !== accObj.accNum);
        this.account = [...newAccounts, accObj];
    }
}
let myBank = new Bank();
for (let i = 1; i <= 3; i++) {
    let fName = faker.person.firstName("female");
    let sName = faker.person.lastName();
    let email = faker.internet.email();
    const cus = new Customer(fName, sName, 25 * i, "female", email, 999 + i);
    myBank.addCustomer(cus);
    myBank.addAccountNumber({ accNum: cus.accNum, balance: 1000 * i });
}
function findAccount(accountNum) {
    return myBank.account.find((acc) => acc.accNum == accountNum);
}
async function displayBalance(account) {
    if (!account)
        return;
    let name = myBank.customer.find((item) => item.accNum == account.accNum);
    console.log(`Dear ${chalk.green.italic(name?.name)} ${chalk.green.italic(name?.surname)} your account balance is ${chalk.bold.blueBright(`$${account.balance}`)}`);
}
async function handleTransaction(account, type) {
    if (!account) {
        console.log(chalk.red.bold("Invalid account number"));
        return;
    }
    let amountPrompt = await inquirer.prompt({
        type: "input",
        name: "usd",
        message: `Please enter your ${type === "withdraw" ? "withdrawal" : "deposit"} amount: `,
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
    }
    else {
        newBalance =
            type === "withdraw" ? account.balance - amount : account.balance + amount;
        myBank.transaction({
            accNum: account.accNum,
            balance: newBalance,
        });
    }
    console.log(chalk.green.bold(`${type === "withdraw" ? "Withdrawal" : "Deposit"} successful!`));
}
async function bankService(bank) {
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
                await handleTransaction(account, service.select === "Cash withdraw" ? "withdraw" : "deposit");
                break;
            default:
                break;
        }
    } while (true);
}
bankService(myBank);
