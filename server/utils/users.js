// [{
//     id: '/#123231231f',
//     name: 'andrew',
//     room: 'The office flans'
// }]

// addUser(id, name, room)
// removeUser(id)
// getUser(id)
// getUserList(room)

class Users{
    constructor(){
        this.users = [];
    }
    addUser(id, name, room){
        var user = {id, name, room};
        this.users.push(user);
        return user;
    }

    removeUser(id){
        //return user that was removed
        var selectedUser = this.users.filter((user) => user.id === id)[0];
        if (selectedUser) {
            this.users = this.users.filter((user) => user.id !== id)
        }
        return selectedUser;
    }
    getUser(id){
        var selectedUser = this.users.filter((user) => user.id === id)[0];
        return selectedUser;
    }
    getUserList(room){
        var users = this.users.filter((user) => user.room === room);
        var namesArray = users.map((user) => user.name);

        return namesArray;
    }
}

module.exports = {Users};
// class Person {
//     constructor(name, age){
//         this.name = name; // refers to instance not class
//         this.age = age;
//     }
//     getUserDescription(){
//         return `${this.name} is ${this.age} year(s) old.`;
//     }
// }

// var me = new Person('Andrew', 25);
// var description = me.getUserDescription();
// console.log(description);
// console.log('this.name', me.name);
// console.log('this.age', me.age);