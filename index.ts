class Customer {
    name: string
    surname: string
    age: number
    gender: string
    mobileNum: number
    accNum: number

    constructor(fName:string, SName:string,age:number, gender:string, mob:number, acc:number){
        this.name = fName
        this.surname = SName
        this.age = age
        this.gender = gender
        this.mobileNum = mob
        this.accNum = acc
    }
}