import { faker } from "@faker-js/faker";

class Customer {
	name: string;
	surname: string;
	age: number;
	gender: string;
	email: string;
	accNum: number;

	constructor(
		fName: string,
		sName: string,
		age: number,
		gender: string,
		email: string,
		acc: number
	) {
		this.name = fName;
		this.surname = sName;
		this.age = age;
		this.gender = gender;
		this.email = email;
		this.accNum = acc;
	}
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
}

let myBank = new Bank();

for (let i: number = 1; i <= 3; i++) {
	let fName = faker.person.firstName("female");
	let sName = faker.person.lastName();
	let email = faker.internet.email();
	const cus = new Customer(fName, sName, 25 * i, "female", email, 999 + i);
	myBank.addCustomer(cus);
}
console.log(myBank);
