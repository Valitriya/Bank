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
    let newAccounts = this.account.filter((acc) => acc.accNum !== accObj.accNum);
    this.account = [...newAccounts, accObj];
  }
}

const myBank = new Bank();

function generateCustomerAndAccount() {
  for (let i = 1; i <= 3; i++) {
    const fName = faker.person.firstName("female");
    const sName = faker.person.lastName();
    const email = faker.internet.email();
    const cus = new Customer(fName, sName, 25 * i, "female", email, 999 + i);
    myBank.addCustomer(cus);
    myBank.addAccountNumber({ accNum: cus.accNum, balance: 1000 * i });
  }
}

function viewBalance(accountNum: number) {
  const account = myBank.account.find((acc) => acc.accNum === accountNum);

  if (!account) {
    console.log(chalk.red.bold("Invalid account number"));
  } else {
    const name = myBank.customer.find((item) => item.accNum === account.accNum);
    console.log(
      `Dear ${chalk.green.italic(name?.name)} ${chalk.green.italic(
        name?.surname
      )} your account balance is ${chalk.bold.blueBright(`$${account.balance}`)}`
    );
  }
}

async function getAccountAndDisplayInfo(bank: Bank, action: string) {
  let res = await inquirer.prompt({
    type: "input",
    name: "num",
    message: "Please enter your account number: ",
  });

  let account = bank.account.find((acc) => acc.accNum === Number(res.num));

  if (!account) {
    console.log(chalk.red.bold("Invalid account number"));
    return;
  }

  let name = bank.customer.find((item) => item.accNum === account?.accNum);
  console.log(
    `Dear ${chalk.green.italic(name?.name)} ${chalk.green.italic(
      name?.surname
    )} your account balance is ${chalk.bold.blueBright(`$${account.balance}`)}`
  );

  if (action === "Cash withdraw") {
    let ans = await inquirer.prompt({
      type: "input",
      name: "usd",
      message: "Please enter your amount: ",
    });
    let newBalance = account.balance - Number(ans.usd);
    bank.transaction({ accNum: account.accNum, balance: newBalance });
	console.log(newBalance);
  }
}

async function bankService(bank: Bank) {
  let service = await inquirer.prompt({
    type: "list",
    name: "select",
    message: "Please select the service",
    choices: ["View balance", "Cash withdraw", "Cash deposit", "Cash transfer"],
  });

  if (service.select === "View balance") {
    await getAccountAndDisplayInfo(bank, "View balance");
  } else if (service.select === "Cash withdraw") {
    await getAccountAndDisplayInfo(bank, "Cash withdraw");
  }
}

generateCustomerAndAccount();
bankService(myBank);
