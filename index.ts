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
async function bankService(bank: Bank) {
  const service = await inquirer.prompt({
    type: "list",
    name: "select",
    message: "Please select the service",
    choices: ["View balance", "Cash withdraw", "Cash deposit", "Cash transfer"],
  });

  if (service.select === "View balance") {
    const res = await inquirer.prompt({
      type: "input",
      name: "num",
      message: "Please enter your account number: ",
    });

    const accountNum = Number(res.num);

    if (!isNaN(accountNum)) {
      viewBalance(accountNum);
    } else {
      console.log(chalk.red.bold("Invalid input. Please enter a valid number."));
    }
  }
}

generateCustomerAndAccount();
bankService(myBank);
